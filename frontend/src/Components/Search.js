import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import { ToastContainer } from "react-toastify";
import MyToast from "./Toast";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import "../Styles/Search.css"

function Search() {
  const [username, setUsername] = useState('');
  const [stations, setStations] = useState([]);
  const [fromStation, setFromStation] = useState(null);
  const [toStation, setToStation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
        axiosPromise = axios.get('http://localhost:3001/user/search', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      }
      else {
        axiosPromise = axios.post('http://localhost:3001/user/search', {
          start_st: fromStation,
          end_st: toStation,
          departure_date: selectedDate,
          sql_date: selectedDate.toISOString().split('T')[0]
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
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
        setStations(res.data.message.stations);
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }, []);

  const handleSearch = async () => {
    if(fromStation === null || toStation === null)
      MyToast(-1, "Stations are required",
        "#1da0e0", 90);
    else if(fromStation.value === toStation.value) {
      MyToast(fromStation.value, "Departure and Destination stations cannot be the same",
        "#1da0e0", 90);
    }
    else {
      try {
        const res = await fetch("post");
        if(res.data.message.trains.length === 0)
          MyToast(0, "No trains available for the selected stations",
            "#1da0e0", 90);
        else navigate("/user/trains")
      }
      catch(error) {
        console.error('Error fetching data', error);
      }
    }
  };

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return (
    <>
      <ToastContainer />
      <HomeHeader username={username} />
      <div className="search-container">
        <div className="search-card">
          <h2>Search trains</h2>
          <div className="container">
            <p>From</p>
            <div className="select">
              <Select
                id="fromSelect"
                options={stations.map((station) => ({
                  label: station.station_name,
                  value: station.id,
                }))}
                value={fromStation}
                onChange={(selectedOption) => setFromStation(selectedOption)}
                placeholder="Select departure station"
              />
            </div>
          </div>
          <div className="container">
            <p>To</p>
            <div className="select">
              <Select
                id="toSelect"
                options={stations.map((station) => ({
                  label: station.station_name,
                  value: station.id,
                }))}
                value={toStation}
                onChange={(selectedOption) => setToStation(selectedOption)}
                placeholder="Select destination station"
              />
            </div>
          </div>
          <div className="container">
            <p>Date</p>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              maxDate={maxDate}
              className="datepicker"
              calendarClassName="calendar"
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </>
  );
}

export default Search;
