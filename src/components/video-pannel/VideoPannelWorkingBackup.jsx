import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import InputEmoji from "react-input-emoji";
import ReportIcon from "@mui/icons-material/Report";
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AxiosInstance from "../axios/AxiosInstance";

import "./css/VideoPannel.css";
import Sidebar from "../sidebar/SideBar";

const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
    transports: ["websocket"],
});
console.log(`chectkkk web socke ${import.meta.env.VITE_SOCKET_URL}`);
const VideoPannel = () => {
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(
        location.state?.currentUser ||
        JSON.parse(localStorage.getItem("currentUser") || "null")
    );
    const [text, setText] = useState("");

    const [stream, setStream] = useState(null);

      const { setIsAuthenticated, userId } = useAuth();


    const myVideo = useRef();
    const userVideo = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [peer, setPeer] = useState();
    const [calledUserEmail, setCalledUserEmail] = useState(null);
    const [hasCalled, setHasCalled] = useState(false); // prevent double calling
    const [callAccepted, setCallAccepted] = useState(false);

    const [videoOn, setVideoOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [connected, setConnected] = useState(false);
    const [searching, setSearching] = useState(false);
    const [partner, setPartner] = useState(null);
    const chatEndRef = useRef(null);
    const [partnerEmail, setPartnerEmail] = useState(null);
    const [newUserSearching, setNewUserSearching] = useState(false);
    const [skipDisabled, setSkipDisabled] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

    const [isSearching, setIsSearching] = useState(false);

    const toggleVideo = () => {
        if (!stream) return;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideoOn(videoTrack.enabled);
        }
    };

    const toggleMic = () => {
        if (!stream) return;
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };

    const toggleChat = () => setChatOpen(!chatOpen);

    const connectToPartner = async () => {
        try {
            const user =
                currentUser || JSON.parse(localStorage.getItem("currentUser") || "{}");
            console.log("userr", user.email);
            if (!user?.email) return;

            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            socket.on("connect", () => {
                console.log("🔌 Socket reconnected:", socket.id);
                if (user?.email) {
                    socket.emit("user:online", { email: user.email });
                    socket.emit("user:ready", { email: user.email });
                }
            });
            setStream(localStream);
            setConnected(true);
            console.log("✅ Media stream obtained");
            socket.emit("user:online", { email: user.email });

            socket.emit("get:onlineUsers");
        } catch (err) {
            console.error("🚫 Error accessing camera:", err);
            if (
                err.name === "NotAllowedError" ||
                err.name === "PermissionDeniedError"
            ) {
                setShowPermissionOverlay(true);
            }
        }
    };

    const cleanupPeerConnection = (preserveLocalVideo = false) => {
        if (peer) {
            peer.destroy();
            setPeer(null);
        }

        if (userVideo.current) {
            userVideo.current.srcObject = null;
        }

        // if (!preserveLocalVideo && myVideo.current) {
        // 	myVideo.current.srcObject = null;
        // }

        // if (stream) {
        // 	stream.getTracks().forEach(track => track.stop());
        // 	setStream(null);
        // }

        // setConnected(false);
        setCallAccepted(false);
        setHasCalled(false);
        setChatOpen(false);
    };
    const handleSubmit = (e) => {
        console.log("text", text);
        // Safe check to prevent default only if it's a form event
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }

        if (text.trim()) {
            sendMessage(text);
        }
    };

    const skipPartner = () => {
        if (partnerEmail) {
            socket.emit("user:leave", {
                email: currentUser.email,
                secondUser: partnerEmail,
            });
        }

        cleanupPeerConnection(true); // Preserve local video stream

        setMessages([]);
        setPartnerEmail(null);
        setIsSearching(true);
        setChatOpen(false);

        setTimeout(() => {
            connectToPartner();
            setIsSearching(false);
        }, 1000);
        setPartnerEmail(null);
    };

    const handleDisconnect = () => {
        setPartnerEmail(null);
        // socket.emit('user:leave', {
        // 	email: currentUser.email,
        // 	secondUser: partnerEmail,
        // });

        if (peer) {
            peer.destroy();
            setPeer(null);
        }

        if (userVideo.current) {
            userVideo.current.srcObject = null;
        }

        if (myVideo.current) {
            myVideo.current.srcObject = null;
        }

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }

        setConnected(false);
        setCallAccepted(false);
        setHasCalled(false);
        setChatOpen(false);
        setPartner(null);
        setMessages([]);
        setSearching(false);
    };

    //   const sendMessage = (e) => {
    //     if (e) e.preventDefault(); // Only prevent default if called via form submit

    //     if (text.trim()) {
    //       const newMessage = {
    //         id: messages.length + 1,
    //         sender: "me",
    //         text: text,
    //         time: new Date().toLocaleTimeString([], {
    //           hour: "2-digit",
    //           minute: "2-digit",
    //         }),
    //       };

    //       setMessages((prevMessages) => [...prevMessages, newMessage]);
    //       setText(""); // Clear InputEmoji

    //       // Simulate partner reply after 1 second
    //       setTimeout(() => {
    //         const reply = {
    //           id: messages.length + 2,
    //           sender: "partner",
    //           text: "Thanks for your message!",
    //           time: new Date().toLocaleTimeString([], {
    //             hour: "2-digit",
    //             minute: "2-digit",
    //           }),
    //         };
    //         setMessages((prev) => [...prev, reply]);
    //       }, 1000);
    //     }
    //   };

    const sendMessage = (msg) => {
        if (!msg.trim() || !partnerEmail) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "me",
            text: msg,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        console.log("partner Emaillllllllllllllll", partnerEmail);
        socket.emit("send-message", {
            text: msg,
            to: partnerEmail,
        });

        setMessages((prev) => [...prev, newMessage]);
        setText("");
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        console.log(`streaam ${stream}`);
        if (myVideo.current && stream) {
            myVideo.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        socket.on("skip:disabled", ({ cooldown }) => {
            setSkipDisabled(true);
            setCooldownTime(cooldown);

            const interval = setInterval(() => {
                setCooldownTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setSkipDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        });

        return () => socket.off("skip:disabled");
    }, []);

    useEffect(() => {
        socket.on("receive-message", (data) => {
            console.log("Received message:", data.text);
            setMessages((prev) => [
                ...prev,

                {
                    id: prev.length + 1,
                    sender: "partner",
                    text: data.text,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
            console.log("Received message:", data.text);
        });

        return () => socket.off("receive-message");
    }, []);

    useEffect(() => {
        if (!hasCalled && onlineUsers.length > 1 && stream) {
            const sortedUsers = [...onlineUsers].sort((a, b) =>
                a.email.localeCompare(b.email)
            );
            const myIndex = sortedUsers.findIndex(
                (user) => user.email === currentUser.email
            );
            if (myIndex === 0) {
                const targetUser = sortedUsers.find(
                    (user) => user.email !== currentUser.email
                );
                if (targetUser && targetUser.email) {
                    console.log("📞 Calling user:", targetUser.email);
                    setPartnerEmail(targetUser.email);
                    callUser(targetUser.email);
                    setHasCalled(true);
                }
            } else {
                console.log("🛑 Waiting for incoming call...");
            }
        }
    }, [onlineUsers, stream]);

    useEffect(() => {
        if (!socket) return;

        const handleOnlineUsers = (users) => {
            console.log(
                "📡 Online users received:",
                users,
                "| Current user:",
                currentUser?.email
            );
            setOnlineUsers(users);
        };

        const handleIncomingCall = ({ from, offer }) => {
            console.log(`📞 ${currentUser.email} received a call from: ${from}`);

            if (callAccepted) {
                console.log("❌ Already in a call, ignoring incoming.");
                return;
            }

            // Decide who handles the call: the user with smaller email
            if (hasCalled) {
                console.log(
                    `❌ Already called someone, ignoring incoming from ${from}`
                );
                return;
            }
            console.log("frommmmmm", from);
            setPartnerEmail(from); // ✅ Add this

            setCallAccepted(true);
            const newPeer = new Peer({ initiator: false, trickle: false, stream });

            newPeer.on("signal", (data) => {
                console.log(
                    `📤 ${currentUser.email} is sending answer back to ${from}`
                );
                socket.emit("call:accepted", { to: from, ans: data });
                console.log("frommmmmm signal", from);
                console.log("call:accepted now show the chat");
                setChatOpen(true);
            });

            newPeer.on("stream", (currentStream) => {
                console.log("user video aaaaa", userVideo);

                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }
            });

            newPeer.signal(offer);
            setPeer(newPeer);
        };

        const handleCallAccepted = ({ ans }) => {
            console.log(
                `✅ ${currentUser.email} received answer from peer added anssss, ${ans}`
            );
            peer && peer.signal(ans);
            setChatOpen(true);
        };

        const handlePeerNegoNeeded = ({ offer }) => {
            peer && peer.signal(offer);
        };

        const handlePeerNegoFinal = ({ ans }) => {
            peer && peer.signal(ans);
        };

        socket.on("online:users", handleOnlineUsers);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handlePeerNegoNeeded);
        socket.on("peer:nego:final", handlePeerNegoFinal);

        return () => {
            socket.off("online:users", handleOnlineUsers);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handlePeerNegoNeeded);
            socket.off("peer:nego:final", handlePeerNegoFinal);
        };
    }, [currentUser, peer, stream]);

    const callUser = (email) => {
        if (!stream || peer) return;
        setPartnerEmail(email); // ✅ Set partner email immediately
        console.log(`📤 ${currentUser.email} is sending offer to ${email}`);

        const newPeer = new Peer({ initiator: true, trickle: false, stream });

        newPeer.on("signal", (offer) => {
            socket.emit("user:call", { to: email, offer });
        });

        newPeer.on("stream", (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        setPeer(newPeer);
        setCalledUserEmail(email);
        setHasCalled(true);
    };

    const handleOnEnter = (message) => {
        if (message.trim() === "" || !partnerEmail) return;

        socket.emit("send-message", {
            text: message,
            to: partnerEmail,
        });

        setMessages((prev) => [
            ...prev,
            {
                sender: "me",
                text: message,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);
        setText("");
    };

    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [comments, setComments] = useState("");
    const modalRef = useRef(null);



    const reportUser = () => {
        setShowReportModal(true)
    }

    const handleReport = (e) => {
        e.preventDefault();
        reportUser(selectedReason, comments); // your function
        setShowReportModal(true);
    }


    //   useEffect(() => {
    //   const handleOutsideClick = (event) => {
    //     if (modalRef.current && !modalRef.current.contains(event.target)) {
    //       setShowReportModal(false);
    //     }
    //   };

    //   if (showReportModal) {
    //     document.addEventListener("mousedown", handleOutsideClick);
    //   } else {
    //     document.removeEventListener("mousedown", handleOutsideClick);
    //   }

    //   return () => document.removeEventListener("mousedown", handleOutsideClick);
    // }, [showReportModal]);

     const handleLogout = async () => {
        try {
          await AxiosInstance.post("users/logout/");
          setIsAuthenticated(false);
          navigate("/");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };


    return (

        <>
        <div className="video-chat-container">
            <header className="app-header">
                <h1>VideoConnect</h1>
                <div className="call-status">
                    {connected ? (
                        <span className="connected">Connected</span>
                    ) : searching ? (
                        <span className="searching">Searching...</span>
                    ) : (
                        <span className="disconnected">Disconnected</span>
                    )}
                </div>
                <div>
                <img
                  src="../home-images/logout.png"
                  onClick={handleLogout}
                  alt="Logout"
                  style={{ cursor: "pointer", width:"30px" }}
                />
                <Sidebar />
              </div>
            </header>

            <main className="video-main">
                <div className={`video-container ${chatOpen ? "chat-open" : ""}`}>
                    {!connected && !searching ? (
                        <div className="pre-call-screen">
                            <div className="welcome-message">
                                <h2>Welcome to VideoConnect</h2>
                                <p>
                                    Start a video call with random people from around the world
                                </p>
                                <button className="connect-button" onClick={connectToPartner}>
                                    Start Call
                                </button>
                            </div>
                        </div>
                    ) : searching ? (
                        <div className="searching-screen">
                            <div className="search-spinner"></div>
                            <p>Looking for someone to connect with...</p>
                        </div>
                    ) : (
                        <>
                            <div className="video-grid">
                                <div className="local-video">
                                    <h1>{videoOn}</h1>

                                    <div
                                        className={`video-placeholder ${!videoOn ? "video-off" : "video-on"
                                            }`}
                                    >
                                        <video
                                            ref={myVideo}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="video-element"
                                        />
                                    </div>
                                </div>

                                <div className="remote-video">
                                    {isSearching ? (
                                        <div className="searching-screen">
                                            <div className="search-spinner"></div>
                                            <p>Looking for someone to connect with...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <video
                                                ref={userVideo}
                                                autoPlay
                                                playsInline
                                                className="video-element"
                                            />
                                            <div className="video-placeholder">
                                                {partner && (
                                                    <div className="partner-info">
                                                        <h3>{partner.name}</h3>
                                                        <p>From: {partner.country}</p>
                                                        <p>Interests: {partner.interests}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {chatOpen && (
                    <div className={`chat-panel ${chatOpen ? "open" : ""}`}>
                        <div className="chat-header">
                            <h3>Chat</h3>
                            <div className="header-button">
                                <button className="report-button" title="Block User"> <BlockIcon /></button>
                                <button className="report-button" title="Report" onClick={reportUser}> <ReportIcon /></button>




                            </div>
                        </div>
                        <div className="messages-container">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender === "me" ? "sent" : "received"
                                        }`}
                                >
                                    <div className="message-content">
                                        <p>{message.text}</p>
                                        <span className="message-time">{message.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <form className="message-input-form" onSubmit={handleSubmit}>
                            <InputEmoji
                                value={text}
                                onChange={setText}
                                cleanOnEnter
                                keepOpened={false}
                                onEnter={handleSubmit}
                                placeholder="Type a message..."
                            />

                            <button type="submit">
                                <img className="send-message-image"
                                    src="../home-images/send-message.png"
                                    alt="Send"
                                />
                            </button>
                        </form>
                    </div>
                )}
            </main>

            {connected && (
                <footer className="controls-footer">
                    <div className="control-buttons">
                        <button
                            className={`control-btn ${micOn ? "active" : ""}`}
                            onClick={toggleMic}
                            title={micOn ? "Mute" : "Unmute"}
                        >
                            <img
                                src={
                                    micOn
                                        ? "../home-images/voice.png"
                                        : "../home-images/microphone.png"
                                }
                                alt="Mic"
                                style={{ cursor: "pointer", width: "20px", color: "white" }}
                            />
                        </button>

                        <button
                            className={`control-btn ${videoOn ? "active" : ""}`}
                            onClick={toggleVideo}
                            title={videoOn ? "Turn off camera" : "Turn on camera"}
                        >
                            <img
                                src={
                                    videoOn
                                        ? "../home-images/video-cm.png"
                                        : "../home-images/off.png"
                                }
                                alt="Camera"
                                style={{ cursor: "pointer", width: "20px", color: "white" }}
                            />
                        </button>
                        {skipDisabled && (
                            <div className="cooldown-notice">
                                You’ve reached the skip limit. Please wait{" "}
                                {Math.floor(cooldownTime / 60)}:
                                {(cooldownTime % 60).toString().padStart(2, "0")} to skip again.
                            </div>
                        )}
                        <button
                            className="control-btn skip-btn"
                            onClick={() => skipPartner()}
                            title={
                                skipDisabled
                                    ? `You’ve skipped too many times. Try again in ${Math.floor(
                                        cooldownTime / 60
                                    )}:${(cooldownTime % 60).toString().padStart(2, "0")}`
                                    : "Skip to next partner"
                            }
                            disabled={skipDisabled}
                        >
                            ⏭️
                        </button>

                        <button
                            className="control-btn end-call"
                            onClick={handleDisconnect}
                            title="End call"
                        >
                            X
                        </button>
                    </div>
                </footer>
            )}







            {/* report Modal */}

            {showReportModal && (
                <div className="modal-overlay">
                    <div className="report-modal">
                        {/* <div className="report-modal" ref={modalRef}> */}
                        <div className="report-header">
                            <h3>Report User</h3>
                            <button className="close-btn" onClick={() => { setShowReportModal(false), setSelectedReason("") }}>✖</button>
                        </div>
                        <form
                            onSubmit={handleReport}
                        >
                            <label>
                                <input
                                    type="radio"
                                    name="reason"
                                    value="Inappropriate behavior"
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                Inappropriate behavior
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="reason"
                                    value="Offensive language"
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                Offensive language
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="reason"
                                    value="Spam or bot"
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                Spam or bot
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="reason"
                                    value="Inappropriate video content"
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                Inappropriate video content
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="reason"
                                    value="Other"
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                />
                                Other:

                            </label>
                            <label>
                                <textarea
                                    placeholder="Explain more (optional)"
                                    onChange={(e) => setComments(e.target.value)}
                                />
                            </label>

                            <button type="submit" className="submit-report" disabled={!selectedReason}>
                                Submit Report
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>

        <div className="">
            <div className="text-center mt-5">
                <h1>Random Video Chat App</h1>
                <p>Make new friends face-to-face</p>
                <button variant="outline-light" size="lg" className="rounded-pill mt-4">
                    <i className="bi bi-google-play"></i> Get it on Google Play
                </button>
            </div>

             <div className="right-panel d-flex flex-column justify-content-center align-items-center">
                

                <p className="text-light">
                👦👧 <strong>73550 users online</strong>
                </p>

                <div className="gender-select py-2 px-4 rounded-pill bg-dark text-light my-3">
                👩‍❤️‍👨 Both
                </div>

                <button variant="warning" size="lg" className="rounded-pill px-5">
                <i className="bi bi-camera-video"></i> Start Video Chat
                </button>
        </div>
        </div>
        </>


    );
};

export default VideoPannel;
