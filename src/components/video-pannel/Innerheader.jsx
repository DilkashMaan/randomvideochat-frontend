import React, { useEffect, useState, useRef, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import "./css/Innerheader.css";
import { FaGem, FaClock, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../auth/AuthContext"; // path to your AuthContext
import EditableProfile from "../account/EditableProfile";


const Innerheader = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef();

  const { isAuthenticated, setIsAuthenticated, setUserId, userId } = useContext(AuthContext);

    const [profileImage, setProfileImage] = useState(null);

    const [profileInfo, setProfileInfoe] = useState(false);





  const handleLogout = async () => {
    try {
      await AxiosInstance.post("users/logout/");
      // Assume setIsAuthenticated is coming from props/context
      localStorage.removeItem("token");
      localStorage.removeItem('email_verified');
    setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



    useEffect(() => {

      console.log("userId innnnnnnn",userId);
      
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

  const closeProfile = () => {
    setProfileInfoe(false);
  };


  const showProfile = () => {
    setProfileInfoe(true);
  }






  return (
    <>
    
        <header className="app-header">
      <div className="left-section">
        <h1>VideoConnect</h1>
      </div>

      <div className="right-section">
        <button className="pill-btn">
          <FaGem className="icon" />
          Shop
        </button>
        <button className="pill-btn">
          <FaClock className="icon" />
          History
        </button>

        <div className="profile-wrapper" ref={dropdownRef}>
          <div
            className="profile-badge"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FaUserCircle className="user-icon" onClick={()=>showProfile()} />
            <span className="status-dot" />
          </div>

          
        </div>
        <img
                  src="../home-images/logout.png"
                  onClick={handleLogout}
                  alt="Logout"
                  style={{ cursor: "pointer", width:"30px" }}
                />
      </div>
    </header>



      { profileInfo && (
           <EditableProfile
              onClose={closeProfile}
              onImageUpdate={setProfileImage}
          />
      )}


    </>
  );
};

export default Innerheader;
