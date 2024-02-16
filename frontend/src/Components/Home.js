import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import HomeHeader from "./HomeHeader";
import HomeBody from "./HomeBody";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authorize = async () => {
      const token = localStorage.getItem("token");
      if(!token) return navigate("/signin");

      const res = await axios.get("http://localhost:3001/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(res.data.message === "invalid-token") {
        localStorage.removeItem("token");
        navigate("/signin");
      }
      else setUsername(res.data.message.username);
    };
    authorize().then();
  }, [navigate]);

  return (
    <>
      <HomeHeader username={username}/>
      <HomeBody/>
    </>
  );
};

export default Home;
