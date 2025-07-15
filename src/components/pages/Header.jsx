import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./style/Header.css";
import { Link } from "react-router-dom";
const Header = ({ onSignupClick, onLoginClick }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
 
  return (
    <div className="header-section" id="header">
      <div className="container">
        <div className="logo">
          <Link to="/">Video-Chat</Link>
        </div>
 
        <div className="header-buttons">
          {!isAuthenticated ? (
              <>
                <button onClick={onLoginClick}>Login</button>
                <button onClick={onSignupClick}>Signup</button>
              </>
            ) : (
              <div className="user-account">
                <img
                  src="home-images/account.png"
                  alt="User Avatar"
                  onClick={() => navigate(`/dashboard`)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
 
export default Header;
 