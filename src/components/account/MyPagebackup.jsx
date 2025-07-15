import React, { useState, useRef, useEffect } from "react";
import "./style/MyPage.css";
import InputEmoji from "react-input-emoji";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import EditableProfile from "./EditableProfile";

const MyPage = () => {
  const [text, setText] = useState("");
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

const checkPermissions = async () => {
  try {
    const camPerm = await navigator.permissions.query({ name: "camera" });
    const micPerm = await navigator.permissions.query({ name: "microphone" });

    // If already granted, start chat
    if (camPerm.state === "granted" && micPerm.state === "granted") {
      startVideoChat();
    } else {
      // Force browser to request permissions
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (userVideo.current) {
          userVideo.current.srcObject = mediaStream;
        }
        startVideoChat();
      } catch (error) {
        console.error("User denied permission or error:", error);
        setShowPermissionOverlay(true); // Show your overlay
      }
    }
  } catch (error) {
    console.warn("Permissions API not supported, trying direct media request.");
    // fallback for older browsers
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (userVideo.current) {
        userVideo.current.srcObject = mediaStream;
      }
      startVideoChat();
    } catch (error) {
      console.error("Media access failed:", error);
      setShowPermissionOverlay(true);
    }
  }
};





  const startVideoChat = async () => {
    alert("yesy");
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(localStream);
      if (userVideo.current) {
        userVideo.current.srcObject = localStream;
      }

      
      setShowChat(true);
    } catch (err) {
      console.error("Error setting up WebRTC:", err);
    }
  };

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const message = event.data;
      setMessages((prev) => [...prev, { type: "incoming", text: message }]);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

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

  // Open EditableProfile on avatar click
  const handleAccountClick = () => {
    setShowEditableProfile(true);
  };

  // Close EditableProfile
  const closeProfile = () => {
    setShowEditableProfile(false);
  };

  return (
    <div className="account-page" id="account-page">
      <div className="container">
        {/* Top Navbar */}
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

        {/* Conditional content below navbar */}
        {showEditableProfile ? (
          <EditableProfile onClose={closeProfile} onImageUpdate={setProfileImage} />

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
                <video
                  ref={userVideo}
                  autoPlay
                  muted
                  playsInline
                  className="video-element"
                />
                <video
                  ref={partnerVideo}
                  autoPlay
                  playsInline
                  className="video-element"
                />
              </div>

              <div className="messege-column">
                <div className="message-list">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="message-input-bar">
                  <InputEmoji
                    value={text}
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
                    <img src="../home-images/send-message.png" alt="Send" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navbar */}
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
                  <p>Please allow access to your camera and microphone to start video chat.</p>
                  <button onClick={() => setShowPermissionOverlay(false)}>OK</button>
                </div>
              </div>
            )}
      </div>
    </div>
  );
};

export default MyPage;




