import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../Styles/SignIn.css';
import MyToast from "./Toast";
import {ToastContainer} from "react-toastify";

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(props.signupToast) {
      MyToast(7, "Signup Successful. Signin to continue", "#4caf50", 0, "success");
      props.changeState();
    }
  });

  const handleSignin = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3001/signin", {
      username: username, password: password
    });

    switch(res.data.message) {
      case "try-again":
        MyToast("try-again", "Try again", "#2196f3"); break;
      case "invalid-username":
        MyToast(username, `Username ${username} not found`, "#ffcc00", 0, "warning"); break;
      case "invalid-password":
        MyToast(username, `Wrong password for ${username}`, "red", 0, "error"); break;
      default:
        localStorage.setItem("token", res.data.token);
        navigate("/user");
        break;
    }
  }

  return (
    <div className="signin-container">
      <ToastContainer/>
      <div className="form-container-signin">
        <h2>SignIn</h2>
        <form onSubmit={handleSignin} autoComplete="off">
          <div className="form-element">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" value={username}
                   onChange={e => setUsername(e.target.value)} placeholder="Enter username" required/>
          </div>
          <div className="form-element">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={password}
                   onChange={e => setPassword(e.target.value)} placeholder="Enter password" required/>
          </div>
          <button type="submit">SignIn</button>
          <p>Don't have an account, <Link to="/signup">signup</Link></p>
        </form>
      </div>
    </div>
  )
}

export default SignIn;
