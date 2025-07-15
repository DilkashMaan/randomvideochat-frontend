import React, { useState } from "react";
import "./FilterBar.css";

const genderOptions = [
  { label: "Both", icon: "/icons/both.png" },
  { label: "Female", icon: "/icons/female.png" },
  { label: "Male", icon: "/icons/male.png" },
];

const interestOptions = [
  "Music", "Gaming", "Sports", "Movies", "Travel",
  "Art", "Technology", "Fitness", "Cooking",
  "Reading", "Dancing", "Photography",
];

const FilterBar = () => {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Both");
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else if (selectedInterests.length < 4) {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-btn" onClick={() => setShowGenderModal(true)}>
        <img src="/icons/gender-icon.png" alt="Gender" className="icon" />
        <span>{selectedGender}</span>
        <span className="arrow">⌄</span>
      </div>

      <div className="filter-btn" onClick={() => setShowInterestModal(true)}>
        <img src="/icons/globe-icon.png" alt="Interests" className="icon" />
        <span>Interests</span>
        <span className="arrow">⌄</span>
      </div>

      <button className="start-chat-btn">
        <div className="avatars">
          {["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"].map((img, i) => (
            <img key={i} src={`/avatars/${img}`} alt="user" className="avatar" />
          ))}
        </div>
        <span>Start Video Chat</span>
      </button>

      {/* Gender Modal */}
      {showGenderModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Match with</h2>
            <p>Select preferred gender</p>
            <div className="gender-options">
              {genderOptions.map((option) => (
                <div
                  key={option.label}
                  className={`gender-card ${selectedGender === option.label ? "selected" : ""}`}
                  onClick={() => setSelectedGender(option.label)}
                >
                  <img src={option.icon} alt={option.label} />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowGenderModal(false)} className="green-btn">Start Video Chat</button>
            <button className="gray-btn">Save</button>
          </div>
        </div>
      )}

      {/* Interests Modal */}
      {showInterestModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Select Interests</h2>
            <p>You can choose up to 4</p>
            <div className="interest-list">
              {interestOptions.map((interest) => (
                <label key={interest} className={`interest-radio ${selectedInterests.includes(interest) ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
            <button onClick={() => setShowInterestModal(false)} className="green-btn">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
