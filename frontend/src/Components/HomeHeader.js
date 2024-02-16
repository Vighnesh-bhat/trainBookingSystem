import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

function HomeHeader(props) {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="home-header">
      <div className="app-name">
        <h1>TrainEase</h1>
      </div>
      <div className="profile">
        <p>{props.username}</p>
        <button ref={profileButtonRef} onClick={handleToggleOptions}>
          <i className="material-icons">account_circle</i>
        </button>
        {showOptions && (
          <div className="profile-options">
            <div className="option">
              <button onClick={() => navigate("/")}>Home</button>
            </div>
            <hr className="profile-option-separator"/>
            <div className="option">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeHeader;
