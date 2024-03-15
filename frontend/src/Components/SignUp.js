import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import '../Styles/SignUp.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyToast from "./Toast";

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async(e) => {
    e.preventDefault();
    if(username.length < 7)
      MyToast(username, "Username too short, should have at least 7 characters", "#4caf50");
    else if(password.length < 7)
      MyToast(username, "Password should have at least 7 characters", "#4caf50");
    else if(password !== rePassword)
      MyToast(username, "Password mismatch", "#4caf50");
    else {
      const res = await axios.post("http://localhost:3001/signup", {
        username: username, password: password
      })

      if (res.data.message === "insert-error")
        MyToast(username, `Username ${username} already exists`, "#4caf50");
      else {
        props.changeState();
        navigate('/signin');
      }
    }
  }

  return (
    <div className="signup-container">
      <ToastContainer/>
      <div className="form-container-signup">
        <h2>SignUp</h2>
        <form onSubmit={handleSignup} autoComplete="off">
          <div className="form-element">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" value={username}
                   onChange={e => setUsername(e.target.value)} placeholder="Create user name" required/>
          </div>
          <div className="form-element">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={password}
                   onChange={e => setPassword(e.target.value)} placeholder="Enter password" required/>
          </div>
          <div className="form-element">
            <label htmlFor="re-password">Confirm Password</label>
            <input type="password" name="re-password" id="re-password" value={rePassword}
                   onChange={e => setRePassword(e.target.value)} placeholder="Re-enter password" required/>
          </div>
          <button type="submit">SignUp</button>
          <p>Already have an account, <Link to="/signin">signin</Link></p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
