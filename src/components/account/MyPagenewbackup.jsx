import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./style/MyPage.css";
import InputEmoji from "react-input-emoji";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import EditableProfile from "./EditableProfile";

import { io } from "socket.io-client";
 
const URL = "http://localhost:3000";


const MyPage = () => {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showEditableProfile, setShowEditableProfile] = useState(false);
  const [showPermissionOverlay, setShowPermissionOverlay] = useState(false);

  const socketRef = useRef(null);
  const { setIsAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  const userVideo = useRef(null);
  const partnerVideo = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [profileImage, setProfileImage] = useState(null);



   const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const videoRef = useRef(null);
  const [joined, setJoined] = useState(false);

  const getCam = async () => {
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera or microphone:", err);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      getCam();
    }
  }, []);




// 

    const [searchParams, setSearchParams] = useSearchParams();
    const [lobby, setLobby] = useState(true);
    const [socket, setSocket] = useState(null);
    const [sendingPc, setSendingPc] = useState(null);
    const [receivingPc, setReceivingPc] = useState(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    // const userVideo = useRef(null);


        useEffect(() => {
            const socket = io(URL);
     
            socket.on('send-offer', async ({ roomId }) => {
                console.log("sending offer");
                setLobby(false);
                const pc = new RTCPeerConnection();
                setSendingPc(pc);
     
                if (localVideoTrack) {
                    console.error("added track");
                    console.log(localVideoTrack);
                    pc.addTrack(localVideoTrack);
                }
     
                if (localAudioTrack) {
                    console.error("added track");
                    console.log(localAudioTrack);
                    pc.addTrack(localAudioTrack);
                }
     
                pc.onicecandidate = async (e) => {
                    console.log("receiving ice candidate locally");
                    if (e.candidate) {
                        socket.emit("add-ice-candidate", {
                            candidate: e.candidate,
                            type: "sender",
                            roomId
                        });
                    }
                };
     
                pc.onnegotiationneeded = async () => {
                    console.log("on negotiation needed, sending offer");
                    const sdp = await pc.createOffer();
                    pc.setLocalDescription(sdp);
                    socket.emit("offer", {
                        sdp,
                        roomId
                    });
                };
            });
     
            socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
                console.log("received offer");
                setLobby(false);
                const pc = new RTCPeerConnection();
                pc.setRemoteDescription(remoteSdp);
                const sdp = await pc.createAnswer();
                pc.setLocalDescription(sdp);
     
                const stream = new MediaStream();
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                }
     
                setRemoteMediaStream(stream);
                setReceivingPc(pc);
     
                pc.ontrack = (e) => {
                    alert("ontrack");
                };
     
                pc.onicecandidate = async (e) => {
                    if (!e.candidate) return;
                    console.log("on ice candidate on receiving side");
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "receiver",
                        roomId
                    });
                };
     
                socket.emit("answer", {
                    roomId,
                    sdp: sdp
                });
     
                setTimeout(() => {
                    const track1 = pc.getTransceivers()[0].receiver.track;
                    const track2 = pc.getTransceivers()[1].receiver.track;
     
                    if (track1.kind === "video") {
                        setRemoteAudioTrack(track2);
                        setRemoteVideoTrack(track1);
                    } else {
                        setRemoteAudioTrack(track1);
                        setRemoteVideoTrack(track2);
                    }
     
                    if (remoteVideoRef.current?.srcObject instanceof MediaStream) {
                        remoteVideoRef.current.srcObject.addTrack(track1);
                        remoteVideoRef.current.srcObject.addTrack(track2);
                        remoteVideoRef.current.play();
                    }
                }, 5000);
            });
     
            socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
                setLobby(false);
                setSendingPc(pc => {
                    pc?.setRemoteDescription(remoteSdp);
                    return pc;
                });
                console.log("loop closed");
            });
     
            socket.on("lobby", () => {
                setLobby(true);
            });
     
            socket.on("add-ice-candidate", ({ candidate, type }) => {
                console.log("add ice candidate from remote");
                console.log({ candidate, type });
     
                if (type === "sender") {
                    setReceivingPc(pc => {
                        pc?.addIceCandidate(candidate);
                        return pc;
                    });
                } else {
                    setSendingPc(pc => {
                        pc?.addIceCandidate(candidate);
                        return pc;
                    });
                }
            });
     
            setSocket(socket);
        }, [localAudioTrack, localVideoTrack]);
     
        useEffect(() => {
            if (userVideo.current && localVideoTrack) {
                userVideo.current.srcObject = new MediaStream([localVideoTrack]);
                userVideo.current.play();
            }
        }, [localVideoTrack]);

// 


  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await AxiosInstance.get(`user/${userId}/`);
        const imgUrl = response.data.profile_photo
          ? `http://localhost:8000${response.data.profile_photo}`
          : "../home-images/account.png";
        setProfileImage(imgUrl);
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        setProfileImage("../home-images/account.png");
      }
    };

    if (userId) {
      fetchProfileImage();
    }
  }, [userId]);

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(stream); // Save it in state

      setShowChat(true); // Show the video column first

      // Wait for the DOM to render before setting video source
      setTimeout(() => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      }, 100); // Give it a short delay
    } catch (error) {
      console.error("Permission error:", error);
      setShowPermissionOverlay(true);
    }
  };


  const handleOnEnter = (message) => {
    if (message.trim() === "") return;
    socketRef.current.send(message);
    setMessages((prev) => [...prev, { type: "outgoing", text: message }]);
    setText("");
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

  const toggleCamera = () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const handleAccountClick = () => {
    setShowEditableProfile(true);
  };

  const closeProfile = () => {
    setShowEditableProfile(false);
  };




  const messagesEndRef = useRef(null);
const bottomRef = useRef(null);

useEffect(() => {
  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]); // messages = chat list array



// useEffect(() => {
//   socket.on("receive-message", (msg) => {
//     setMessages((prev) => [...prev, msg]);
//   });

//   return () => socket.off("receive-message");
// }, []);

const handleSendMessage = (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const newMsg = { text: input };
  // socket.emit("send-message", newMsg);
  setMessages((prev) => [...prev, newMsg]);
  setInput("");
};


  return (
    <div className="account-page" id="account-page">
      <div className="container">
        <div className="account-nav top-nav">
          <div className="logo">
            <Link to="/dashboard">
              <h6>VideoChat</h6>
            </Link>
          </div>
          <div className="user-account">
            <img
              src="../home-images/logout-btnn.png"
              onClick={handleLogout}
              alt="Logout"
              style={{ cursor: "pointer" }}
            />
            <img
              src={profileImage}
              alt="User Avatar"
              className="topbar-user-image"
              onClick={handleAccountClick}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {showEditableProfile ? (
          <EditableProfile
            onClose={closeProfile}
            onImageUpdate={setProfileImage}
          />
        ) : !showChat ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h2>Welcome to VideoChat</h2>
              <p>Connect with random people instantly!</p>
              <button onClick={checkPermissions} className="start-btn">
                Start Video Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="vedio-messege-div">
              <div className="video-column">

                {/* <video
                  ref={userVideo}
                  autoPlay
                  muted
                  playsInline
                  className="video-element"
                />
                <video
                  ref={partnerVideo}
                  autoPlay
                  muted
                  playsInline
                  className="video-element"
                /> */}


                <video autoPlay width={400} height={400} ref={userVideo} />
            {lobby ? "Waiting to connect you to someone" : null}
            <video autoPlay width={400} height={400} ref={remoteVideoRef} />
                

               
              </div>

              <div className="messege-column">

                <div class="chat-header">
                  <div class="user-avatar">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                  </div>
                  <div class="user-info">
                    <h3>Test</h3>
                    <p>India</p>
                  </div>
                </div>



                <div className="message-list" ref={messagesEndRef} >
                  {messages.map((msg, i) => (
                    <div key={i} className="message">
                      <div className="user-icon">👤</div>
                      <div className="text">{msg.text}</div>
                    </div>
                  ))}
          <div ref={bottomRef} />
                </div>
                <div className="message-input-bar">
                  <InputEmoji
                    value={text}
                    // onChange={(e) => setText}
                    onChange={setText}
                    cleanOnEnter
                    keepOpened
                    onEnter={handleOnEnter}
                    placeholder="Type a message"
                  />
                  <div
                    className="send-button"
                    onClick={() => handleOnEnter(text)}
                  >
                    <img
                      src="../home-images/send-message.png"
                      alt="Send"
                    />
                  </div>
                </div>

                {/* <div className="chat-container">
  <div className="chat-header"> <div class="user-avatar">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                  </div>
                  <div class="user-info">
                    <h3>Test</h3>
                    <p>India</p>
                  </div> </div>

        <div className="chat-messages" ref={messagesEndRef}>
          {messages.map((msg, i) => (
            <div key={i} className="message">
              <div className="user-icon">👤</div>
              <div className="text">{msg.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

  <form onSubmit={handleSendMessage} className="chat-input">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message..."
    />
    <button type="submit">Send</button>
  </form>
</div> */}





              </div>
            </div>

            <div className="account-nav bottom-nav">
              <div>
                <img
                  src={
                    isMicOn
                      ? "../home-images/voice.png"
                      : "../home-images/settings.png"
                  }
                  alt="Mic"
                  onClick={toggleMic}
                  style={{ cursor: "pointer" }}
                />
                <img
                  src={
                    isCameraOn
                      ? "../home-images/video-cm.png"
                      : "../home-images/settings.png"
                  }
                  alt="Camera"
                  onClick={toggleCamera}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div>
                <img src="../home-images/telephone.png" alt="Telephone" />
              </div>
              <div>
                <img src="../home-images/settings.png" alt="Settings" />
                <img
                  src="../home-images/logout.png"
                  onClick={handleLogout}
                  alt="Logout"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </>
        )}

        {showPermissionOverlay && (
          <div className="permission-overlay">
            <div className="overlay-content">
              <h3>Permission Needed</h3>
              <p>
                Please allow access to your camera and microphone to start
                video chat.
              </p>
              <button onClick={() => setShowPermissionOverlay(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
