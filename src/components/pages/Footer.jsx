import React from "react";
import "./style/Footer.css";
const Footer = () => {
  return (
    <>
      <div className="footer-section" id="footer">
        <div className="container">
          <div className="logo">
            <a href="/">Video-Chat</a>
          </div>

          <div className="social-icons">
            <img src="home-images/facebook2.png"></img>
            <img src="home-images/social-media.png"></img>
            <img src="home-images/video.png"></img>

          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Vedio-chat</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
