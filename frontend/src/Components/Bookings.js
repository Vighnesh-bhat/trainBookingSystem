import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeHeader from "./HomeHeader";
import "../Styles/Bookings.css";

function Bookings() {
  const [username, setUsername] = useState("");
  const [bookingsData, setBookingsData] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    axios.get("http://localhost:3001/user/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.message === 'invalid-token') {
          localStorage.removeItem('token');
          navigate('/signin');
        } else {
          setUsername(res.data.message.username);
          setBookingsData(res.data.message.bookings);
        }
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <HomeHeader username={username} />
      <div className="wrapper">
        <h3>Bookings</h3>
        <table className="bookings-table">
          <thead className="bookings-table-head">
          <tr>
            <th>Train</th>
            <th>Departure Station</th>
            <th>Destination Station</th>
            <th>Departure Date</th>
            <th>Booked On</th>
          </tr>
          </thead>
          <tbody>
          {bookingsData.map((row, index) => (
            <tr key={index} className={new Date(row.departure_date) < new Date() ? 'departure-past' : ''}>
              <td>{row.name}</td>
              <td>{row.start_station}</td>
              <td>{row.end_station}</td>
              <td>{row.departure_date.split("T")[0]}</td>
              <td>{row.booked_on.split("T")[0]}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Bookings;
