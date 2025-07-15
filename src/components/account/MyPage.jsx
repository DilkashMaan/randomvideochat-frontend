import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import "./style/MyPage.css";
import InputEmoji from "react-input-emoji";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import EditableProfile from "./EditableProfile";
import { disconnect } from 'process';


const socket = io('https://autobackend-f2f1.onrender.com', {
  transports: ['websocket'],
});
const MyPage = () => {


  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const isAuthenticated = () => !!localStorage.getItem('token');
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [videosection, setVideoSection] = useState(false);
  const [showEditableProfile, setShowEditableProfile] = useState(false);
  const [showPermissionOverlay, setShowPermissionOverlay] = useState(false);

  const socketRef = useRef(null);
  const { setIsAuthenticated, userId } = useAuth();
  const navigate = useNavigate();


  const myVideo = useRef();
  const userVideo = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState();
  const [callStarted, setCallStarted] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [calledUserEmail, setCalledUserEmail] = useState(null);
  const [hasCalled, setHasCalled] = useState(false); // prevent double calling
  const [callAccepted, setCallAccepted] = useState(false);
  const [CallEnded, setCallEnded] = useState(false);

  const [showChat, setShowChat] = useState(false);


  useEffect(() => {

    if (!currentUser) {
      localStorage.getItem('currentUser');
      console.log("currentUser", currentUser);
    }
  }, [currentUser]);


  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await AxiosInstance.get(`user/${userId}/`);
        const imgUrl = response.data.profile_photo
          ? `http://localhost:8000${response.data.profile_photo}`
          : "/home-images/account.png";
        setProfileImage(imgUrl);
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        setProfileImage("/home-images/account.png");
      }
    };

    if (userId) {
      fetchProfileImage();
    }
  }, [userId]);

  const startVideoCall = async () => {
    console.log("currentUser?.email", currentUser?.email);
    try {

      if (!currentUser?.email) return;

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(localStream);
      setCallStarted(true);
      setVideoSection(true);
      socket.emit('user:online', { email: currentUser.email });
    } catch (err) {
      console.error("🚫 Error accessing camera:", err);
      // Show overlay if permission was denied
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setShowPermissionOverlay(true);
      }
    }
  }


  const handleOnEnter = (message) => {
    if (message.trim() === "") return;
    socket.emit('send-message', { text: message }); // updated from socketRef
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
  }, [messages]);



  // useEffect(() => {
  //   socket.on("receive-message", (msg) => {
  //     setMessages((prev) => [...prev, msg]);
  //   });

  //   return () => socket.off("receive-message");
  // }, []);

  useEffect(() => {
    socket.on('receive-message', msg => {
      setMessages(prev => [...prev, { ...msg, self: false }]);
    });
    return () => socket.off('receive-message');
  }, []);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // const newMsg = { sender: currentUser.email, text: input };
    const newMsg = { text: input };
    // socket.emit("send-message", newMsg);
    //  setMessages(prev => [...prev, { ...newMsg, self: true }]);
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };


  // 🔄 Auto-call another user if available
  useEffect(() => {
    if (!hasCalled && onlineUsers.length > 0 && stream) {
      const targetUser = onlineUsers.find(user => user.email !== currentUser.email);
      if (targetUser) {
        callUser(targetUser.email);
        setHasCalled(true);
      }
    }
  }, [onlineUsers, stream]);
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      console.log("📡 Online users received:", users, "| Current user:", currentUser?.email);
      setOnlineUsers(users);
    };

    const handleIncomingCall = ({ from, offer }) => {
      console.log(`📞 ${currentUser.email} received a call from: ${from}`);

      // Decide who handles the call: the user with smaller email
      const shouldAnswer = currentUser.email.localeCompare(from) < 0;

      if (!shouldAnswer) {
        console.log(`❌ Skipping incoming call from ${from} since we initiated.`);
        return;
      }

      setCallAccepted(true);
      const newPeer = new Peer({ initiator: false, trickle: false, stream });

      newPeer.on('signal', (data) => {
        console.log(`📤 ${currentUser.email} is sending answer back to ${from}`);
        socket.emit('call:accepted', { to: from, ans: data });
      });

      newPeer.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });
      setShowChat(true);

      newPeer.signal(offer);
      setPeer(newPeer);
    };


    const handleCallAccepted = ({ ans }) => {
      console.log(`✅ ${currentUser.email} received answer from peer`);
       setShowChat(true);
      peer && peer.signal(ans);
    };

    const handlePeerNegoNeeded = ({ offer }) => {
      peer && peer.signal(offer);
    };

    const handlePeerNegoFinal = ({ ans }) => {
      peer && peer.signal(ans);
    };



    socket.on('online:users', handleOnlineUsers);
    socket.on('incoming:call', handleIncomingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('peer:nego:needed', handlePeerNegoNeeded);
    socket.on('peer:nego:final', handlePeerNegoFinal);

    return () => {
      socket.off('online:users', handleOnlineUsers);
      socket.off('incoming:call', handleIncomingCall);
      socket.off('call:accepted', handleCallAccepted);
      socket.off('peer:nego:needed', handlePeerNegoNeeded);
      socket.off('peer:nego:final', handlePeerNegoFinal);

    };
  }, [currentUser, peer, stream]);

  const callUser = (email) => {
    if (!stream || peer) return;

    console.log(`📤 ${currentUser.email} is sending offer to ${email}`);
    const newPeer = new Peer({ initiator: true, trickle: false, stream });

    newPeer.on('signal', (offer) => {
      socket.emit('user:call', { to: email, offer });
    });

    newPeer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    setPeer(newPeer);
    setCalledUserEmail(email);
    setHasCalled(true);
  };




  const disconnectCall = () => {
    // peer is stored in state, not ref, so:
    if (peer) {
      peer.destroy();
      setPeer(null);
    }

    setCallAccepted(false);
    setCallEnded(true);
    setShowChat(false);

    if (userVideo.current) userVideo.current.srcObject = null;

    if (calledUserEmail) {
      socket.emit("endCall", { to: calledUserEmail });
    }
  };




  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);


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
        ) : !videosection ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h2>Welcome to VideoChat</h2>
              <p>Connect with random people instantly!</p>
              <button onClick={startVideoCall} className="start-btn">
                Start Video Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="vedio-messege-div">
              <div className="video-column">

                <video
                  ref={myVideo}
                  autoPlay
                  playsInline
                  className="video-element"
                />
                <video
                  ref={userVideo}
                  autoPlay
                  playsInline
                  className="video-element"
                />



              </div>

              {showChat ? <>
                <div className="messege-column">
                  <div className='message-header'>
                    <div class="chat-header">
                    <div class="user-avatar">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                    </div>
                    <div class="user-info">
                      <h3>Test</h3>
                      <p>India</p>
                    </div>
                  </div>



                  <div className='message-container'>
                    {messages.map((msg, i) => (
                      <div key={i} className="message">
                        <div className="user-icon">👤</div>
                        <div className="text">{msg.text}</div>
                      </div>
                    ))}
                    {/* This empty div marks the bottom */}
                    <div ref={bottomRef} />
                  </div>
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
                </div>

                
              </>
                : ""}

            </div>

            <div className="account-nav bottom-nav">
              <div>
                <img
                  src={
                    isMicOn
                      ? "../home-images/voice.png"
                      : "../home-images/microphone.png"
                  }
                  alt="Mic"
                  onClick={toggleMic}
                  style={{ cursor: "pointer" }}
                />
                <img
                  src={
                    isCameraOn
                      ? "../home-images/video-cm.png"
                      : "../home-images/off.png"
                  }
                  alt="Camera"
                  onClick={toggleCamera}
                  style={{ cursor: "pointer" }}
                />
              </div>


              {callAccepted && !CallEnded && (
                <img src="../home-images/telephone.png" alt="Telephone" className="end-call-button" onClick={disconnectCall} />
              )}
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
