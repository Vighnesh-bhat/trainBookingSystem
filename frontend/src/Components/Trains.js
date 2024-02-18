import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import HomeHeader from "./HomeHeader";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../Styles/Trains.css"
import MyToast from "./Toast";
import {ToastContainer} from "react-toastify";

const Trains = () => {
  const [username, setUsername] = useState("");
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [fromStation, setFromStation] = useState(null);
  const [toStation, setToStation] = useState(null);
  const [statFromStation, setStatFromStation] = useState(null);
  const [statToStation, setStatToStation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [divStatus, setDivStatus] = useState([]);
  const [status, setStatus] = useState([]);
  const [prices, setPrices] = useState([]);
  const navigate = useNavigate();

  let bookingDetails = {};

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
        axiosPromise = axios.get("http://localhost:3001/user/trains", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      else if(type === "search-post") {
        axiosPromise = axios.post("http://localhost:3001/user/trains", {
          type: "search",
          start_st: fromStation,
          end_st: toStation,
          departure_date: selectedDate,
          sql_date: selectedDate.toISOString().split('T')[0]
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      else {
        axiosPromise = axios.post("http://localhost:3001/user/trains", {
          type: "book", booking_details: {...bookingDetails}
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
        setStatFromStation(res.data.message.start_st.label);
        setStatToStation(res.data.message.end_st.label);
        setUsername(res.data.message.username);
        setStations(res.data.message.stations);
        setFromStation(res.data.message.start_st);
        setToStation(res.data.message.end_st);
        setSelectedDate(new Date(res.data.message.departure_date));
        setTrains(res.data.message.trains);
        setStatus(new Array(res.data.message.trains.length).fill(true));
        setPrices(new Array(res.data.message.trains.length).fill(null));
        setDivStatus(new Array(res.data.message.trains.length).fill(new Array(3).fill(false)));
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }, []);

  const searchBar = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    return (
      <>
        <div className="t-search-card">
          <div className="t-container">
            <p>From</p>
            <div className="t-select">
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
          <div className="t-container">
            <p>To</p>
            <div className="t-select">
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
          <div className="t-container">
            <p>Date</p>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              maxDate={maxDate}
              className="t-datepicker"
              calendarClassName="t-calendar"
            />
          </div>
          <button className="t-search-button" onClick={handleSearch}>
            Modify Search
          </button>
        </div>
      </>
    );
  }

  const handleSearch = async () => {
    if(fromStation.value === toStation.value) {
      MyToast(fromStation.value, "Departure and Destination stations cannot be the same",
        "#1da0e0", 80);
    }
    else {
      try {
        const res = await fetch("search-post");
        setStatFromStation(res.data.message.start_st.label);
        setStatToStation(res.data.message.end_st.label);
        setTrains(res.data.message.trains);
        setStatus(new Array(res.data.message.trains.length).fill(true));
        setPrices(new Array(res.data.message.trains.length).fill(null));
        setDivStatus(new Array(res.data.message.trains.length).fill(new Array(3).fill(false)));
      }
      catch(error) {
        console.error('Error fetching data', error);
      }
    }
  };

  const trainsInfo = () => {
    return (
      <div className="trains-container">
        {trains.map((train, index) => (
          <div key={index} className="train-card">
            <div className="train-name">{train.name}</div>
            <div className="train-header">
              <div>{train.start_time} | {statFromStation}</div>
              <div>-- {duration(train.start_time, train.end_time)} --</div>
              <div>{train.end_time} | {statToStation}</div>
            </div>
            <div className="train-body">
              <div className="left">
                <div className={"capacity" + ((divStatus[index][0])? " selected": "")}
                     onClick={() => handleClassClick(index, "fc_price")}>
                  <div>1C</div>
                  <div className={(train.fc_capacity)? "avail-data": "not-avail"}>
                    {(train.fc_capacity)? "Available " + train.fc_capacity: "Not Available"}
                  </div>
                </div>
                <div className={"capacity" + ((divStatus[index][1])? " selected": "")}
                     onClick={() => handleClassClick(index, "sc_price")}>
                  <div>2C</div>
                  <div className={(train.sc_capacity)? "avail-data": "not-avail"}>
                    {(train.sc_capacity)? "Available " + train.sc_capacity: "Not Available"}
                  </div>
                </div>
                <div className={"capacity" + ((divStatus[index][2])? " selected": "")}
                     onClick={() => handleClassClick(index, "tc_price")}>
                  <div>3C</div>
                  <div className={(train.tc_capacity)? "avail-data": "not-avail"}>
                    {(train.tc_capacity)? "Available " + train.tc_capacity: "Not Available"}
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="price">{(prices[index]?.price)? "₹" + prices[index].price: null}</div>
                <button className="t-book-button" onClick={() => handleBook(index)}
                        disabled={status[index]}>
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function duration(time1, time2) {
    const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
    const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

    const date1 = new Date();
    date1.setHours(hours1, minutes1, seconds1, 0);
    const date2 = new Date();
    date2.setHours(hours2, minutes2, seconds2, 0);

    const timeDifferenceMs = Math.abs(date2 - date1);

    const hoursDiff = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursDiff}:${String(minutesDiff).padStart(2, "0")}`;
  }

  const handleClassClick = (i, classType) => {
    let flag;
    if(classType === "fc_price") flag = trains[i].fc_capacity;
    else if(classType === "sc_price") flag = trains[i].sc_capacity;
    else flag = trains[i].tc_capacity;
    if(flag) {
      if(status[i]) {
        setStatus(prevStatus => {
          const newStatus = [...prevStatus];
          newStatus[i] = false;
          return newStatus;
        });
      }
    }
    else {
      if(!status[i]) {
        setStatus(prevStatus => {
          const newStatus = [...prevStatus];
          newStatus[i] = true;
          return newStatus;
        });
      }
    }
    let colI;
    if(classType === "fc_price") colI = 0;
    else if(classType === "sc_price") colI = 1;
    else colI = 2;
    setDivStatus(prevState => {
      const newDivStatus = [...prevState];
      newDivStatus[i] = new Array(3).fill(false);
      newDivStatus[i][colI] = true;
      return newDivStatus;
    });
    setPrices(prevState => {
      const newPrices = [...prevState];
      newPrices[i] = { classType: classType, price: trains[i][classType] };
      return newPrices;
    });
  };

  const handleBook = async (i) => {
    bookingDetails.train_id = trains[i].id;
    bookingDetails.route_id = trains[i].route_id;
    bookingDetails.train_name = trains[i].name;
    bookingDetails.departure_date = selectedDate.toISOString().split('T')[0];
    bookingDetails.start_time = trains[i].start_time;
    bookingDetails.end_time = trains[i].end_time;
    if(prices[i].classType === "fc_price") {
      bookingDetails.class_type = "1C";
      bookingDetails.avail = trains[i].fc_capacity;
    }
    else if(prices[i].classType === "sc_price") {
      bookingDetails.class_type = "2C";
      bookingDetails.avail = trains[i].sc_capacity;
    }
    else {
      bookingDetails.class_type = "3C";
      bookingDetails.avail = trains[i].tc_capacity;
    }
    bookingDetails.price = prices[i].price;
    await fetch("book-post");
    navigate("/user/book");
  }

  return (
    <>
      <ToastContainer/>
      <HomeHeader username={username}/>
      {searchBar()}
      {trainsInfo()}
    </>
  );
};

export default Trains;
