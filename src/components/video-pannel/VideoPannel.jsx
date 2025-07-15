// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";
// import InputEmoji from "react-input-emoji";
// import ReportIcon from "@mui/icons-material/Report";
// import BlockIcon from "@mui/icons-material/Block";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";
// import AxiosInstance from "../axios/AxiosInstance";

// import "./css/VideoPannel.css";

// import Innerheader from "./Innerheader";

// const socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
//   transports: ["websocket"],
// });
// console.log(`chectkkk web socke ${import.meta.env.VITE_SOCKET_URL}`);
// const VideoPannel = () => {
//   const location = useLocation();
//   const [currentUser, setCurrentUser] = useState(
//     location.state?.currentUser ||
//       JSON.parse(localStorage.getItem("currentUser") || "null")
//   );
//   const [text, setText] = useState("");

//   const [stream, setStream] = useState(null);

//   const { setIsAuthenticated, userId } = useAuth();

//   const myVideo = useRef();
//   const userVideo = useRef(null);

//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [peer, setPeer] = useState();
//   const [calledUserEmail, setCalledUserEmail] = useState(null);
//   const [hasCalled, setHasCalled] = useState(false); // prevent double calling
//   const [callAccepted, setCallAccepted] = useState(false);

//   const [videoOn, setVideoOn] = useState(true);
//   const [micOn, setMicOn] = useState(true);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [searching, setSearching] = useState(false);
//   const [partner, setPartner] = useState(null);
//   const chatEndRef = useRef(null);
//   const [partnerEmail, setPartnerEmail] = useState(null);
//   const [newUserSearching, setNewUserSearching] = useState(false);
//   const [skipDisabled, setSkipDisabled] = useState(false);
//   const [cooldownTime, setCooldownTime] = useState(0);

//   const peerConnection = useRef(null);

//   const [isSearching, setIsSearching] = useState(false);
//   const [userGender, setUserGender] = useState(() => {
//     const storedUser = JSON.parse(localStorage.getItem("currentUser"));
//     return storedUser?.gender || null;
//   });
//   const [genderChoose, setGenderChoose] = useState("any");
//   const [showModal, setShowModal] = useState(false);

//   const handleGenderClick = () => setShowModal(true);

//   const toggleVideo = () => {
//     if (!stream) return;
//     const videoTrack = stream.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setVideoOn(videoTrack.enabled);
//     }
//   };

//   const toggleMic = () => {
//     if (!stream) return;
//     const audioTrack = stream.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = !audioTrack.enabled;
//       setMicOn(audioTrack.enabled);
//     }
//   };

//   const toggleChat = () => setChatOpen(!chatOpen);

//   const connectToPartner = async () => {
//     try {
//       const user =
//         currentUser || JSON.parse(localStorage.getItem("currentUser") || "{}");
//       console.log("userr", user.email);

//       console.log(
//         "kkkkkkkkkkkkkkkkkkkkkkk{ email: user.email, gender: userGender , preference: genderChoose}",
//         { email: user.email, gender: userGender, preference: genderChoose }
//       );

//       if (!user?.email) return;

//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       socket.on("connect", () => {
//         console.log("🔌 Socket reconnected:", socket.id);
//         if (user?.email) {
//           socket.emit("user:online", { email: user.email });

//           socket.emit("user:ready", {
//             email: user.email,
//             gender: userGender,
//             preference: genderChoose,
//           });
//         }
//       });
//       setStream(localStream);
//       setConnected(true);
//       console.log("✅ Media stream obtained");
//       socket.emit("user:online", { email: user.email });
//       setIsSearching(false);
//       socket.emit("get:onlineUsers");
//     } catch (err) {
//       console.error("🚫 Error accessing camera:", err);
//       if (
//         err.name === "NotAllowedError" ||
//         err.name === "PermissionDeniedError"
//       ) {
//         setShowPermissionOverlay(true);
//       }
//     }
//   };

//   const cleanupPeerConnection = (preserveLocalVideo = false) => {
//     console.log("peer cleanupPeerConnection", peer);
//     if (peer && !peer.destroyed) {
//       peer.destroy();
//       setPeer(null);
//     }

//     if (peerConnection.current) {
//       peerConnection.current.destroy();
//       peerConnection.current = null;
//     }

//     if (!preserveLocalVideo && stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }

//     if (userVideo.current) userVideo.current.srcObject = null;

//     setCallAccepted(false);
//     setHasCalled(false);
//     setChatOpen(false);
//     setPartnerEmail(null);
//     setPartner(null);
//     setMessages([]);
//   };

//   const handleUserDisconnected = ({ from }) => {
//     console.log("⚠️ Partner disconnected:", from);

//     // Clear partner's video
//     if (userVideo.current) userVideo.current.srcObject = null;

//     // Destroy the peer connection
//     if (peer && !peer.destroyed) {
//       peer.destroy();
//       setPeer(null);
//     }

//     // Reset all chat/video-related states
//     setCallAccepted(false);
//     setHasCalled(false);
//     setPartnerEmail(null);
//     setMessages([]);
//     setChatOpen(false);
//   };

//   useEffect(() => {
//     if (!socket) return;

//     // ✅ Register disconnect listener
//     socket.on("user:disconnected", handleUserDisconnected);

//     // ✅ Clean up on unmount or dependency change
//     return () => {
//       socket.off("user:disconnected", handleUserDisconnected);
//     };
//   }, [socket, peer]); // add `peer` if needed

//   const handleSubmit = (e) => {
//     console.log("text", text);
//     // Safe check to prevent default only if it's a form event
//     if (e && typeof e.preventDefault === "function") {
//       e.preventDefault();
//     }

//     if (text.trim()) {
//       sendMessage(text);
//     }
//   };

//   const skipPartner = () => {
//     console.log("⏭ Skipping partner:", partnerEmail);

//     if (partnerEmail) {
//       socket.emit("call:skipped", {
//         from: currentUser.email,
//         to: partnerEmail,
//       });
//       socket.emit("user:disconnected", { to: partnerEmail });
//     }

//     cleanupPeerConnection(true); // If you want to preserve local stream, keep this true

//     setIsSearching(true);

//     setTimeout(() => {
//       socket.emit("user:ready", {
//         email: currentUser.email,
//         gender: userGender,
//         preference: genderChoose,
//       });
//       console.log("🔁 Ready to find new user...");
//     }, 1000);
//   };

//   const handleDisconnect = () => {
//     setPartnerEmail(null);
//     // socket.emit('user:leave', {
//     // 	email: currentUser.email,
//     // 	secondUser: partnerEmail,
//     // });

//     if (peer && !peer.destroyed) {
//       peer.destroy();
//       setPeer(null);
//     }

//     if (userVideo.current) {
//       userVideo.current.srcObject = null;
//     }

//     if (myVideo.current) {
//       myVideo.current.srcObject = null;
//     }

//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }

//     setConnected(false);
//     setCallAccepted(false);
//     setHasCalled(false);
//     setChatOpen(false);
//     setPartner(null);
//     setMessages([]);
//     setSearching(false);
//   };

//   const sendMessage = (msg) => {
//     if (!msg.trim() || !partnerEmail) return;

//     const newMessage = {
//       id: messages.length + 1,
//       sender: "me",
//       text: msg,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//     console.log("partner Emaillllllllllllllll", partnerEmail);
//     socket.emit("send-message", {
//       text: msg,
//       to: partnerEmail,
//     });

//     setMessages((prev) => [...prev, newMessage]);
//     setText("");
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     console.log(`streaam`, stream);
//     if (myVideo.current && stream) {
//       myVideo.current.srcObject = stream;
//     }
//   }, [stream]);

//   useEffect(() => {
//     socket.on("skip:disabled", ({ cooldown }) => {
//       setSkipDisabled(true);
//       setCooldownTime(cooldown);

//       const interval = setInterval(() => {
//         setCooldownTime((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             setSkipDisabled(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     });

//     return () => socket.off("skip:disabled");
//   }, []);

//   useEffect(() => {
//     socket.on("receive-message", (data) => {
//       console.log("Received message:", data.text);
//       setMessages((prev) => [
//         ...prev,

//         {
//           id: prev.length + 1,
//           sender: "partner",
//           text: data.text,
//           time: new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         },
//       ]);
//       console.log("Received message:", data.text);
//     });

//     return () => socket.off("receive-message");
//   }, []);

//   const callTimeoutRef = useRef(null);

//   useEffect(() => {
//     if (!socket) return;

//     socket.emit("join", { email: currentUser.email });

//     const handleOnlineUsers = (users) => {
//       console.log("📡 Online users received:", users);
//       setOnlineUsers(users);
//     };

//     const handleIncomingCall = ({ from, offer }) => {
//       if (callAccepted || hasCalled) {
//         console.log("❌ Already handled a call");
//         return;
//       }

//       console.log(`📞 Incoming call from ${from}`);
//       setPartnerEmail(from);
//       setCallAccepted(true);

//       const newPeer = new Peer({ initiator: false, trickle: false, stream });

//       newPeer.on("signal", (data) => {
//         socket.emit("call:accepted", { to: from, ans: data });
//         setChatOpen(true);
//       });

//       newPeer.on("stream", (incomingStream) => {
//         if (userVideo.current) {
//           userVideo.current.srcObject = incomingStream;
//         }
//       });

//       newPeer.signal(offer);
//       setPeer(newPeer);
//       peerConnection.current = newPeer; // ✅ Track peer
//     };

//     const handleCallAccepted = ({ ans }) => {
//       console.log("✅ Call accepted by peer");
//       if (peer) peer.signal(ans);
//       setChatOpen(true);
//       setIsSearching(false);
//     };

//     socket.on("online:users", handleOnlineUsers);
//     socket.on("incoming:call", handleIncomingCall);
//     socket.on("call:accepted", handleCallAccepted);

//     return () => {
//       socket.off("online:users", handleOnlineUsers);
//       socket.off("incoming:call", handleIncomingCall);
//       socket.off("call:accepted", handleCallAccepted);
//     };
//   }, [socket, peer, stream, currentUser.email, hasCalled, callAccepted]);

//   // ✅ Auto initiate call (and fallback)
//   useEffect(() => {
//     console.log("onlineUsers", onlineUsers);
//     if (!hasCalled && stream && onlineUsers.length > 1) {
//       const sorted = [...onlineUsers].sort((a, b) =>
//         a.email.localeCompare(b.email)
//       );
//       const myIndex = sorted.findIndex((u) => u.email === currentUser.email);

//       if (myIndex === 0) {
//         const partner = sorted.find((u) => u.email !== currentUser.email);
//         if (partner?.email) {
//           callUser(partner.email);
//         }
//       } else {
//         console.log("🛑 Waiting for call...");
//         if (!callTimeoutRef.current) {
//           callTimeoutRef.current = setTimeout(() => {
//             if (!hasCalled && !callAccepted) {
//               const fallback = sorted.find(
//                 (u) => u.email !== currentUser.email
//               );
//               if (fallback?.email) {
//                 console.log("⏰ Fallback calling", fallback.email);
//                 callUser(fallback.email);
//               }
//             }
//           }, 6000);
//         }
//       }
//     }

//     return () => {
//       if (callTimeoutRef.current) {
//         clearTimeout(callTimeoutRef.current);
//         callTimeoutRef.current = null;
//       }
//     };
//   }, [onlineUsers, stream, hasCalled, callAccepted]);

//   // ✅ Call user function
//   const callUser = (email) => {
//     if (!stream || peer) return;
//     console.log(`📤 Sending offer to ${email}`);
//     setPartnerEmail(email);
//     setHasCalled(true);

//     const newPeer = new Peer({ initiator: true, trickle: false, stream });

//     newPeer.on("signal", (offer) => {
//       console.log("📤 call user signal:", offer, email);
//       socket.emit("user:call", { to: email, offer });
//     });

//     newPeer.on("stream", (incomingStream) => {
//       console.log(`🎥 Received partner stream`);
//       if (userVideo.current) {
//         userVideo.current.srcObject = incomingStream;
//       }
//     });

//     setPeer(newPeer);
//     peerConnection.current = newPeer; // ✅ Track this connection
//     setCalledUserEmail(email);
//   };

//   const handleOnEnter = (message) => {
//     if (message.trim() === "" || !partnerEmail) return;

//     socket.emit("send-message", {
//       text: message,
//       to: partnerEmail,
//     });

//     setMessages((prev) => [
//       ...prev,
//       {
//         sender: "me",
//         text: message,
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       },
//     ]);
//     setText("");
//   };

//   const [showReportModal, setShowReportModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState("");
//   const [comments, setComments] = useState("");
//   const modalRef = useRef(null);

//   const reportUser = () => {
//     setShowReportModal(true);
//   };

//   const handleReport = (e) => {
//     e.preventDefault();
//     reportUser(selectedReason, comments); // your function
//     setShowReportModal(true);
//   };

//   const handleLogout = async () => {
//     try {
//       await AxiosInstance.post("users/logout/");
//       setIsAuthenticated(false);
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const handleGenderSelect = (selected) => {
//     console.log("gender selection", selected);
//     setGenderChoose(selected);
//     // setShowModal(false);
//   };

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("user:disconnected", handleUserDisconnected);

//     return () => {
//       socket.off("user:disconnected", handleUserDisconnected);
//     };
//   }, [socket, peer]);

//   return (
//     <>
//       <div className="video-chat-container">
//         <Innerheader />
//         {/* <header className="app-header">

//                 <div className="call-status">
//                     {connected ? (
//                         <span className="connected">Connected</span>
//                     ) : searching ? (
//                         <span className="searching">Searching...</span>
//                     ) : (
//                         <span className="disconnected">Disconnected</span>
//                     )}
//                 </div>
//                 <div>
//                 <img
//                   src="../home-images/logout.png"
//                   onClick={handleLogout}
//                   alt="Logout"
//                   style={{ cursor: "pointer", width:"30px" }}
//                 />
//               </div>
//             </header> */}

//         <main className="video-main">
//           <div className={`video-container ${chatOpen ? "chat-open" : ""}`}>
//             {!connected && !searching ? (
//               <div className="pre-call-screen">
//                 <div className="welcome-message">
//                   <h2>Welcome to VideoConnect</h2>
//                   <p>
//                     Start a video call with random people from around the world
//                   </p>

//                   <div className="showing-details">
//                     <p className="user-count">🧑‍🤝‍🧑👩‍🤝‍👨 80617 users online</p>

//                     <div className="gender-select" onClick={handleGenderClick}>
//                       {genderChoose === "female" && "👩 Girls Only"}
//                       {genderChoose === "male" && "👨 Boys Only"}
//                       {genderChoose === "any" && "👫 Both"}
//                     </div>

//                     <button
//                       className="start-chat-btn"
//                       onClick={connectToPartner}
//                     >
//                       📹 Start Video Chat
//                     </button>
//                   </div>

//                   {/* <div className="button-start">
//                                         <button className="gender-button">
//                                          <img src="gender.png" alt="gender" /> Both
//                                         </button>

//                                          <button className="connect-button" onClick={connectToPartner}>
//                                         Start Call
//                                     </button>

//                                     </div> */}
//                 </div>
//               </div>
//             ) : searching ? (
//               <div className="searching-screen">
//                 <div className="search-spinner"></div>
//                 <p>Looking for someone to connect with...</p>
//               </div>
//             ) : (
//               <>
//                 <div className="video-grid">
//                   <div className="local-video">
//                     <div
//                       className={`video-placeholder ${
//                         !videoOn ? "video-off" : "video-on"
//                       }`}
//                     >
//                       <video
//                         ref={myVideo}
//                         autoPlay
//                         playsInline
//                         muted
//                         className="video-element"
//                       />
//                     </div>
//                   </div>

//                   <div className="remote-video">
//                     {isSearching ? (
//                       <div className="searching-screen">
//                         <div className="search-spinner"></div>
//                         <p>Looking for someone to connect with...</p>
//                       </div>
//                     ) : (
//                       <>
//                         <video
//                           ref={userVideo}
//                           autoPlay
//                           playsInline
//                           className="video-element"
//                         />
//                         <div className="video-placeholder">
//                           {partner && (
//                             <div className="partner-info">
//                               <h3>{partner.name}</h3>
//                               <p>From: {partner.country}</p>
//                               <p>Interests: {partner.interests}</p>
//                             </div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {chatOpen && (
//             <div className={`chat-panel ${chatOpen ? "open" : ""}`}>
//               <div className="chat-header">
//                 <h3>Chat</h3>
//                 <div className="header-button">
//                   <button className="report-button" title="Block User">
//                     {" "}
//                     <BlockIcon />
//                   </button>
//                   <button
//                     className="report-button"
//                     title="Report"
//                     onClick={reportUser}
//                   >
//                     {" "}
//                     <ReportIcon />
//                   </button>
//                 </div>
//               </div>
//               <div className="messages-container">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`message ${
//                       message.sender === "me" ? "sent" : "received"
//                     }`}
//                   >
//                     <div className="message-content">
//                       <p>{message.text}</p>
//                       <span className="message-time">{message.time}</span>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={chatEndRef} />
//               </div>
//               <form className="message-input-form" onSubmit={handleSubmit}>
//                 <InputEmoji
//                   value={text}
//                   onChange={setText}
//                   cleanOnEnter
//                   keepOpened={false}
//                   onEnter={handleSubmit}
//                   placeholder="Type a message..."
//                 />

//                 <button type="submit">
//                   <img
//                     className="send-message-image"
//                     src="../home-images/send-message.png"
//                     alt="Send"
//                   />
//                 </button>
//               </form>
//             </div>
//           )}
//         </main>

//         {connected && (
//           <footer className="controls-footer">
//             <div className="control-buttons">
//               <button
//                 className={`control-btn ${micOn ? "active" : ""}`}
//                 onClick={toggleMic}
//                 title={micOn ? "Mute" : "Unmute"}
//               >
//                 <img
//                   src={
//                     micOn
//                       ? "../home-images/voice.png"
//                       : "../home-images/microphone.png"
//                   }
//                   alt="Mic"
//                   style={{ cursor: "pointer", width: "20px", color: "white" }}
//                 />
//               </button>

//               <button
//                 className={`control-btn ${videoOn ? "active" : ""}`}
//                 onClick={toggleVideo}
//                 title={videoOn ? "Turn off camera" : "Turn on camera"}
//               >
//                 <img
//                   src={
//                     videoOn
//                       ? "../home-images/video-cm.png"
//                       : "../home-images/off.png"
//                   }
//                   alt="Camera"
//                   style={{ cursor: "pointer", width: "20px", color: "white" }}
//                 />
//               </button>
//               {skipDisabled && (
//                 <div className="cooldown-notice">
//                   You’ve reached the skip limit. Please wait{" "}
//                   {Math.floor(cooldownTime / 60)}:
//                   {(cooldownTime % 60).toString().padStart(2, "0")} to skip
//                   again.
//                 </div>
//               )}
//               <button
//                 className="control-btn skip-btn"
//                 onClick={() => skipPartner()}
//                 title={
//                   skipDisabled
//                     ? `You’ve skipped too many times. Try again in ${Math.floor(
//                         cooldownTime / 60
//                       )}:${(cooldownTime % 60).toString().padStart(2, "0")}`
//                     : "Skip to next partner"
//                 }
//                 disabled={skipDisabled}
//               >
//                 ⏭️
//               </button>

//               <button
//                 className="control-btn end-call"
//                 onClick={handleDisconnect}
//                 title="End call"
//               >
//                 X
//               </button>
//             </div>
//           </footer>
//         )}

//         {/* report Modal */}

//         {showReportModal && (
//           <div className="modal-overlay">
//             <div className="report-modal">
//               {/* <div className="report-modal" ref={modalRef}> */}
//               <div className="report-header">
//                 <h3>Report User</h3>
//                 <button
//                   className="close-btn"
//                   onClick={() => {
//                     setShowReportModal(false), setSelectedReason("");
//                   }}
//                 >
//                   ✖
//                 </button>
//               </div>
//               <form onSubmit={handleReport}>
//                 <label>
//                   <input
//                     type="radio"
//                     name="reason"
//                     value="Inappropriate behavior"
//                     onChange={(e) => setSelectedReason(e.target.value)}
//                   />
//                   Inappropriate behavior
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="reason"
//                     value="Offensive language"
//                     onChange={(e) => setSelectedReason(e.target.value)}
//                   />
//                   Offensive language
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="reason"
//                     value="Spam or bot"
//                     onChange={(e) => setSelectedReason(e.target.value)}
//                   />
//                   Spam or bot
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="reason"
//                     value="Inappropriate video content"
//                     onChange={(e) => setSelectedReason(e.target.value)}
//                   />
//                   Inappropriate video content
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="reason"
//                     value="Other"
//                     onChange={(e) => setSelectedReason(e.target.value)}
//                   />
//                   Other:
//                 </label>
//                 <label>
//                   <textarea
//                     placeholder="Explain more (optional)"
//                     onChange={(e) => setComments(e.target.value)}
//                   />
//                 </label>

//                 <button
//                   type="submit"
//                   className="submit-report"
//                   disabled={!selectedReason}
//                 >
//                   Submit Report
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {showModal && (
//           <div className="modal-overlay">
//             <div className="gender-modal" id="gendar-modal">
//               {/* <div className="modal-header">
//                             </div> */}
//               <div className="modal-header">
//                 <p className="modal-label">Select Gender</p>
//                 <button
//                   className="close-btn"
//                   onClick={() => {
//                     setShowModal(false);
//                   }}
//                 >
//                   ✖
//                 </button>
//               </div>

//               <div className="gender-options">
//                 <div
//                   className={`gender-option ${
//                     genderChoose === "female" ? "selected" : ""
//                   }`}
//                   onClick={() => handleGenderSelect("female")}
//                 >
//                   👩 Girls Only
//                 </div>
//                 <div
//                   className={`gender-option ${
//                     genderChoose === "male" ? "selected" : ""
//                   }`}
//                   onClick={() => handleGenderSelect("male")}
//                 >
//                   👨 Boys Only
//                 </div>
//                 <div
//                   className={`gender-option ${
//                     genderChoose === "any" ? "selected" : ""
//                   }`}
//                   onClick={() => handleGenderSelect("any")}
//                 >
//                   👫 Both
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   className="save-btn"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Save
//                 </button>
//                 <div className="filter-icon">🧪</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default VideoPannel;

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import InputEmoji from "react-input-emoji";
import ReportIcon from "@mui/icons-material/Report";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AxiosInstance from "../axios/AxiosInstance";
import SimplePeer from "simple-peer/simplepeer.min.js";
import "./css/VideoPannel.css";

import Innerheader from "./Innerheader";

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
  const streamRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [peer, setPeer] = useState();
  const [calledUserEmail, setCalledUserEmail] = useState(null);
  const [hasCalled, setHasCalled] = useState(false); // prevent double calling
  const [callAccepted, setCallAccepted] = useState(false);
  const peerRef = useRef(null);
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
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);

  const [isSearching, setIsSearching] = useState(false);
  const [userGender, setUserGender] = useState(() => {
	const storedUser = JSON.parse(localStorage.getItem("currentUser"));
	return storedUser?.gender || null;
  });
  const [genderChoose, setGenderChoose] = useState("any");
  const [showModal, setShowModal] = useState(false);

  const handleGenderClick = () => setShowModal(true);

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

	  if (!user?.email) return;

	  const localStream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	  });

	  setStream(localStream);
	  setConnected(true);
	  setIsSearching(false);

	  console.log("✅ Media stream obtained");

	  // ⏳ Emit user:online and wait for ack before user:ready
	  socket.emit("user:online", { email: currentUser.email });
	  console.log("📤 Emitted user:online with", currentUser.email);

	  socket.once("online:ack", () => {
		console.log("✅ Received online:ack, now emitting user:ready");

		socket.emit("user:ready", {
		  email: currentUser.email,
		  gender: userGender,
		  preference: genderChoose,
		});

		console.log("📤 Emitted user:ready", {
		  email: currentUser.email,
		  gender: userGender,
		  preference: genderChoose,
		});
	  });
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
	console.log("peer cleanupPeerConnection", peer);
	if (peer && !peer.destroyed) {
	  peer.destroy();
	  setPeer(null);
	}

	if (peerConnection.current) {
	  peerConnection.current.destroy();
	  peerConnection.current = null;
	}

	if (!preserveLocalVideo && stream) {
	  stream.getTracks().forEach((track) => track.stop());
	  setStream(null);
	}

	if (userVideo.current) userVideo.current.srcObject = null;

	setCallAccepted(false);
	setHasCalled(false);
	setChatOpen(false);
	setPartnerEmail(null);
	setPartner(null);
	setRemoteStream(null);
	setMessages([]);
  };

  const handleUserDisconnected = ({ from }) => {
	console.log("⚠️ Partner disconnected:", from);

	// Clear partner's video
	if (userVideo.current) userVideo.current.srcObject = null;

	// Destroy the peer connection
	if (peer && !peer.destroyed) {
	  peer.destroy();
	  setPeer(null);
	}

	// Reset all chat/video-related states
	setCallAccepted(false);
	setHasCalled(false);
	setPartnerEmail(null);
	setMessages([]);
	setChatOpen(false);
  };

  useEffect(() => {
	if (!socket) return;

	// ✅ Register disconnect listener
	socket.on("user:disconnected", handleUserDisconnected);

	// ✅ Clean up on unmount or dependency change
	return () => {
	  socket.off("user:disconnected", handleUserDisconnected);
	};
  }, [socket, peer]); // add `peer` if needed

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
	console.log("⏭ Skipping partner:", partnerEmail);

	if (partnerEmail) {
	  socket.emit("call:skipped", {
		from: currentUser.email,
		to: partnerEmail,
	  });
	  socket.emit("user:disconnected", { to: partnerEmail });
	}

	cleanupPeerConnection(true); // If you want to preserve local stream, keep this true

	setIsSearching(true);

	setTimeout(() => {
	  socket.emit("user:ready", {
		email: currentUser.email,
		gender: userGender,
		preference: genderChoose,
	  });
	  console.log("🔁 Ready to find new user...");
	}, 1000);
  };

  const handleDisconnect = () => {


	console.log("handleDisconnect partnerEmail", partnerEmail);

	if (partnerEmail) {
	  socket.emit("call:skipped", {
		from: currentUser.email,
		to: partnerEmail,
	  });
	  socket.emit("user:disconnected", { from: currentUser.email, to: partnerEmail });
		setPartnerEmail(null);
	}

	if (peer && !peer.destroyed) {
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
	console.log(`streaam`, stream);
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
	if (!socket) return;

	// 🔚 Handle call ended (both users)
	socket.on("call:ended", ({ reason, peer }) => {
	  console.log("🔚 Call ended due to:", reason, "by:", peer);

	  cleanupPeerConnection(true); // Preserves local stream (so user can requeue without re-requesting cam)

	  setIsSearching(true);

	  // Auto-reconnect user to next available
	  setTimeout(() => {
		socket.emit("user:ready", {
		  email: currentUser.email,
		  gender: userGender,
		  preference: genderChoose,
		});
	  }, 1000);
	});

	// ⚠️ Optional: Handle when YOU are skipped
	socket.on("partner:skipped", ({ from }) => {
	  console.log("⚠️ Your partner skipped the call:", from);

	  cleanupPeerConnection(true);
	  setIsSearching(true);

	  // Auto-reconnect
	  setTimeout(() => {
		socket.emit("user:ready", {
		  email: currentUser.email,
		  gender: userGender,
		  preference: genderChoose,
		});
	  }, 1000);
	});

	// 🧼 Cleanup
	return () => {
	  socket.off("call:ended");
	  socket.off("partner:skipped");
	};
  }, [socket, currentUser.email]);

  useEffect(() => {
	if (!socket || !currentUser?.email) return;

	socket.on("connect", () => {
	  console.log("🔌 Socket connected:", socket.id);
	  socket.emit("user:online", { email: currentUser?.email });
	  console.log("📤 Emitted user:online with", currentUser?.email);
	});

	return () => {
	  socket.off("connect");
	};
  }, [socket, currentUser?.email]);

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

  const callTimeoutRef = useRef(null);

  useEffect(() => {
	if (!socket) return;

	socket.emit("join", { email: currentUser.email });

	const handleOnlineUsers = (users) => {
	  console.log("📡 Online users received:", users);
	  setOnlineUsers(users);
	};

	const handleIncomingCall = ({ from, offer }) => {
	  if (callAccepted || hasCalled) {
		console.log("❌ Already handled a call");
		return;
	  }

	  console.log(`📞 Incoming call from ${from}`);
	  setPartnerEmail(from);
	  setCallAccepted(true);

	  const newPeer = new Peer({ initiator: false, trickle: false, stream });

	  newPeer.on("signal", (data) => {
		socket.emit("call:accepted", { to: from, ans: data });
		setChatOpen(true);
	  });

	  newPeer.on("stream", (incomingStream) => {
		console.log("📥 Received remote stream", incomingStream);
		console.log("📦 Tracks:", incomingStream.getTracks());
		setRemoteStream(incomingStream);
	  });

	  newPeer.signal(offer);
	  setPeer(newPeer);
	  peerConnection.current = newPeer; // ✅ Track peer
	};

	const handleCallAccepted = ({ ans }) => {
	  console.log("✅ Call accepted by peer");

	  const currentPeer = peerRef.current || peer;

	  if (currentPeer && !currentPeer.destroyed) {
		currentPeer.signal(ans);
	  } else {
		console.warn("⚠️ Tried to signal destroyed peer");
	  }

	  setChatOpen(true);
	  setIsSearching(false);
	};

	socket.on("online:users", handleOnlineUsers);
	socket.on("incoming:call", handleIncomingCall);
	socket.on("call:accepted", handleCallAccepted);

	return () => {
	  socket.off("online:users", handleOnlineUsers);
	  socket.off("incoming:call", handleIncomingCall);
	  socket.off("call:accepted", handleCallAccepted);
	};
  }, [socket, peer, stream, currentUser.email, hasCalled, callAccepted]);

  // ✅ Auto initiate call (and fallback)
  useEffect(() => {
	return () => {
	  if (peerRef.current && !peerRef.current.destroyed) {
		peerRef.current.destroy();
	  }
	};
  }, []);
  useEffect(() => {
	const handleMatchedPair = ({
	  peer: peerEmail,
	  peerSocketId,
	  initiator,
	}) => {
	  console.log("👥 Matched with:", peerEmail, "Initiator:", initiator);
	  setPartnerEmail(peerEmail);

	  setCallAccepted(false);
	  setHasCalled(initiator);

	  if (initiator) {
		// ✅ Clean up existing peer if needed
		if (peerRef.current && !peerRef.current.destroyed) {
		  peerRef.current.destroy();
		}

		const newPeer = new Peer({
		  initiator: true,
		  trickle: false,
		  stream,
		});

		newPeer.on("signal", (data) => {
		  console.log("📤 [Initiator] Sending offer to:", peerEmail);
		  socket.emit("user:call", {
			from: currentUser.email,
			to: peerEmail,
			offer: data,
		  });
		});

		newPeer.on("stream", (incomingStream) => {
		  console.log("📥 Received remote stream", incomingStream);
		  console.log("📦 Tracks:", incomingStream.getTracks());
		  setRemoteStream(incomingStream);
		});

		peerRef.current = newPeer;
		setPeer(newPeer);
		peerConnection.current = newPeer;
	  }

	  setChatOpen(true);
	  setIsSearching(false);
	};

	socket.on("matched:pair", handleMatchedPair);

	return () => {
	  socket.off("matched:pair", handleMatchedPair);
	};
  }, [socket, stream]);

  // ✅ Call user function

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
	setShowReportModal(true);
  };

  const handleReport = (e) => {
	e.preventDefault();
	reportUser(selectedReason, comments); // your function
	setShowReportModal(true);
  };

  const handleLogout = async () => {
	try {
	  await AxiosInstance.post("users/logout/");
	  setIsAuthenticated(false);
	  navigate("/");
	} catch (error) {
	  console.error("Logout failed:", error);
	}
  };

  const handleGenderSelect = (selected) => {
	console.log("gender selection", selected);
	setGenderChoose(selected);
	// setShowModal(false);
  };

  useEffect(() => {
	if (!socket) return;
	socket.on("user:disconnected", handleUserDisconnected);

	return () => {
	  socket.off("user:disconnected", handleUserDisconnected);
	};
  }, [socket, peer]);
  useEffect(() => {
	if (userVideo.current && remoteStream) {
	  userVideo.current.srcObject = remoteStream;

	  // ⏳ Give the browser a moment before trying to play
	  setTimeout(() => {
		userVideo.current
		  .play()
		  .then(() => console.log("🎥 Remote video playing"))
		  .catch((e) => console.error("🚫 Remote video play failed", e));
	  }, 100); // 100ms delay
	}
  }, [remoteStream]);
  useEffect(() => {
	if (userVideo.current && remoteStream && callAccepted) {
	  console.log("🔄 Setting remote stream to user video");

	  userVideo.current.srcObject = remoteStream;

	  const tryPlay = () => {
		const playPromise = userVideo.current.play();
		if (playPromise !== undefined) {
		  playPromise.catch((error) => {
			console.warn(
			  "🚫 Remote video play failed (retrying in 100ms)",
			  error
			);
			setTimeout(tryPlay, 100); // Retry after delay
		  });
		}
	  };
	  // Wait until metadata is loaded before calling play
	  userVideo.current.onloadedmetadata = () => {
		tryPlay();
	  };
	}
  }, [remoteStream, callAccepted]);

   useEffect(() => {
	console.log("onlineUsers",onlineUsers.length);
  }, [ onlineUsers]);


  return (
	<>
	  <div className="video-chat-container">
		<Innerheader />
		{/* <header className="app-header">
			   
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
			  </div>
			</header> */}

		<main className="video-main">
		  <div className={`video-container ${chatOpen ? "chat-open" : ""}`}>
			{!connected && !searching ? (
			  <div className="pre-call-screen">
				<div className="welcome-message">
				  <h2>Welcome to VideoConnect</h2>
				  <p>
					Start a video call with random people from around the world
				  </p>

				  <div className="showing-details">
					<p className="user-count">🧑‍🤝‍🧑👩‍🤝‍👨 {`${onlineUsers.length}`} users online</p>

					<div className="gender-select" onClick={handleGenderClick}>
					  {genderChoose === "female" && "👩 Girls Only"}
					  {genderChoose === "male" && "👨 Boys Only"}
					  {genderChoose === "any" && "👫 Both"}
					</div>

					<button
					  className="start-chat-btn"
					  onClick={connectToPartner}
					>
					  📹 Start Video Chat
					</button>
				  </div>

				  {/* <div className="button-start">
										<button className="gender-button">
										 <img src="gender.png" alt="gender" /> Both
										</button>

										 <button className="connect-button" onClick={connectToPartner}>
										Start Call
									</button>

									</div> */}
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
					<div
					  className={`video-placeholder ${
						!videoOn ? "video-off" : "video-on"
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
				  <button className="report-button" title="Block User">
					{" "}
					<BlockIcon />
				  </button>
				  <button
					className="report-button"
					title="Report"
					onClick={reportUser}
				  >
					{" "}
					<ReportIcon />
				  </button>
				</div>
			  </div>
			  <div className="messages-container">
				{messages.map((message) => (
				  <div
					key={message.id}
					className={`message ${
					  message.sender === "me" ? "sent" : "received"
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
				  <img
					className="send-message-image"
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
				  {(cooldownTime % 60).toString().padStart(2, "0")} to skip
				  again.
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
				<button
				  className="close-btn"
				  onClick={() => {
					setShowReportModal(false), setSelectedReason("");
				  }}
				>
				  ✖
				</button>
			  </div>
			  <form onSubmit={handleReport}>
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

				<button
				  type="submit"
				  className="submit-report"
				  disabled={!selectedReason}
				>
				  Submit Report
				</button>
			  </form>
			</div>
		  </div>
		)}

		{showModal && (
		  <div className="modal-overlay">
			<div className="gender-modal" id="gendar-modal">
			  {/* <div className="modal-header">
							</div> */}
			  <div className="modal-header">
				<p className="modal-label">Select Gender</p>
				<button
				  className="close-btn"
				  onClick={() => {
					setShowModal(false);
				  }}
				>
				  ✖
				</button>
			  </div>

			  <div className="gender-options">
				<div
				  className={`gender-option ${
					genderChoose === "female" ? "selected" : ""
				  }`}
				  onClick={() => handleGenderSelect("female")}
				>
				  👩 Girls Only
				</div>
				<div
				  className={`gender-option ${
					genderChoose === "male" ? "selected" : ""
				  }`}
				  onClick={() => handleGenderSelect("male")}
				>
				  👨 Boys Only
				</div>
				<div
				  className={`gender-option ${
					genderChoose === "any" ? "selected" : ""
				  }`}
				  onClick={() => handleGenderSelect("any")}
				>
				  👫 Both
				</div>
			  </div>

			  <div className="modal-footer">
				<button
				  className="save-btn"
				  onClick={() => setShowModal(false)}
				>
				  Save
				</button>
				<div className="filter-icon">🧪</div>
			  </div>
			</div>
		  </div>
		)}
	  </div>
	</>
  );
};

export default VideoPannel;
