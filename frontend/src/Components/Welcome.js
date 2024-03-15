import React from 'react';
import '../Styles/Welcome.css';
import {useNavigate} from "react-router-dom";
import WelcomeBG from "./Vande-Bharat-Express.jpg";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h4>Welcome to</h4>
        <h1>TrainEase</h1>
        <p className="introductory-text">
          Your one-stop destination for effortless train bookings.
        </p>
        <p className="info-text1">
          Discover seamless travel experiences with TrainEase today!
        </p>
        <p className="info-text2">To continue, sign up</p>
        <button className="welcome-btns" onClick={() => navigate("/signup")}>Sign Up</button>
        <p className="info-text2">Or, already have an account?</p>
        <button className="welcome-btns" onClick={() => navigate("/signin")}>Sign In</button>
      </div>
      <img src={String(WelcomeBG)} alt="VandeBharat" className="welcome-image"/> {/* Image */}
    </div>
  );
}

export default Welcome;
