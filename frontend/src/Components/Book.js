import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import HomeHeader from "./HomeHeader";
import axios from "axios";
import "../Styles/Book.css";
import image from './DBMS-tick-mark.jpg';
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketPDF from "./TicketPDF";

function Book() {
  const [booked, setBooked] = useState(false);
  const [username, setUsername] = useState("");
  const [bookingDetails, setBookingDetails] = useState({});
  const [seats, setSeats] = useState(1);
  const navigate = useNavigate();

  const fetch = (type) => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if(!token) {
        navigate('/signin');
        reject(new Error('No token available'));
        return;
      }

      let axiosPromise;
      if(type === "get") {
        axiosPromise = axios.get("http://localhost:3001/user/book", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      else {
        axiosPromise = axios.post("http://localhost:3001/user/book", {
          bookingDetails: {...bookingDetails, seats: seats, username: username}
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      axiosPromise
        .then(res => {
          if(res.data.message === 'invalid-token') {
            localStorage.removeItem('token');
            navigate('/signin');
            reject(new Error('Invalid token'));
          }
          else {
            resolve(res);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  useEffect(() => {
    fetch("get")
      .then(res => {
        setUsername(res.data.message.username);
        setBookingDetails(res.data.message.booking_details);
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }, []);

  const getBooking = () => {
    return (
      <>
        <div className="main-container">
          <h3>Confirm Booking</h3>
          <div className="booking-details">
            <div className="details">
              <p>Train</p>
              <p>{bookingDetails.train_name}</p>
            </div>
            <hr/>
            <div className="details">
              <p>Departure Station & Time</p>
              <p>{bookingDetails.start_st} - {bookingDetails.start_time}</p>
            </div>
            <hr/>
            <div className="details">
              <p>Destination Station & Time</p>
              <p>{bookingDetails.end_st}- {bookingDetails.end_time}</p>
            </div>
            <hr/>
            <div className="details">
              <p>Departure Date</p>
              <p>{bookingDetails.departure_date}</p>
            </div>
            <hr/>
            <div className="details">
              <p>Class Type</p>
              <p>{bookingDetails.class_type}</p>
            </div>
            <hr/>
            <div className="details">
              <p>Number of seats</p>
              <input type="number" min={1} max={bookingDetails.avail}
                     value={seats}
                     onChange={handleSeatChange}/>
            </div>
            <hr/>
            <div className="details">
              <p>Total Price</p>
              <p>{isNaN(bookingDetails.price) ? 'N/A' : (seats * bookingDetails.price)}</p>
            </div>
            <hr/>
            <div className="footer">
              {getButton("Confirm" )}
              {getButton("Cancel", "/user/trains")}
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleSeatChange = (event) => {
    const value = event.target.value;
    const parsedValue = parseInt(value);
    const maxSeats = bookingDetails.avail;
    if(!isNaN(parsedValue)) {
      const newValue = Math.min(parsedValue, maxSeats);
      setSeats(newValue);
    } else setSeats(1);
  }

  const ticket = () => {
    return (
      <>
        <div className="success-message">
          <h4>Train Booked Successfully!!</h4>
          <img src={String(image)} alt="Green Tick" width="70px" style={{marginTop: "10px"}}/>
        </div>
        <div className="booked-footer">
          {getButton("View Bookings", "/user/bookings")}
            <PDFDownloadLink document={<TicketPDF bookingDetails={{...bookingDetails, seats, username}} />}
                             fileName="ticket.pdf"
                             className="book-btns"
                             style={{textDecoration: "none"}}>
              {({ loading }) => (loading ? 'Loading document...' : 'Download Ticket')}
            </PDFDownloadLink>
        </div>
      </>
    );
  }

  const getButton = (name, path="") => {
    return (
      <button className="book-btns"
              onClick={(name === "Confirm")? handleConfirmClick: () => navigate(path)}>
        {name}
      </button>
    )
  }

  const handleConfirmClick = async () => {
    try {
      await fetch("post");
      setBooked(true);
    }
    catch(error) {
      console.error("Error while booking: ", error);
    }
  }

  return (
    <>
      <HomeHeader username={username}/>
      {!booked? getBooking(): ticket()}
    </>
  );
}

export default Book;
