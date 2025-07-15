import React from "react";
import "./MonkeyHome.css";

const MonkeyHome = () => {
  return (
    <div className="monkey-container">
      {/* Left Side */}
      <div className="left-side">
        <div className="top-bar">
          <button className="store-btn">🟡 M Store</button>
          <div className="nav-icons">
            <span>🏠</span>
            <span>🕒</span>
            <span>💬</span>
            <span>👤</span>
          </div>
          <span className="crown">👑</span>
        </div>
        <div className="center-text">
          <h1>Monkey</h1>
          <p>Make new friends<br />face-to-face</p>
          
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        <div className="mode-toggle">
          <button className="active">SOLO</button>
          <button>DUO</button>
        </div>
        <div className="users-online">🙋‍♂️🙋‍♀️ 79383 users online</div>
        <div className="select-gender">
          <button>🧑‍🤝‍🧑 Both</button>
        </div>
        <button className="start-btn">🎥 Start Video Chat</button>
        <div className="menu-btn">☰</div>
      </div>
    </div>
  );
};

export default MonkeyHome;
