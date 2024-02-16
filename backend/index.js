require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB
});

db.connect((error) => {
  if(error)
    console.error("MySQL connection error: ", error);
  else
    console.log("Connected to MySQL database");
});

let stations, trains, start_st, end_st, departure_date, sql_date;
let booking_details = {};

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (error) => {
    if(error) {
      return res.json({ message: "insert-error" });
    }
    db.query("CALL createView(?)", [username], (error) => {
      if(error) {
        console.error("Error while creating view: ", error);
      }
    });
    res.json({ message: "success" });
  });
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (error, results) => {
    if(error) {
      res.json({message: "try-again"});
      return;
    }

    if(results.length === 0) {
      return res.json({message: "invalid-username"})
    }

    const isPasswordValid = await bcrypt.compare(password, results[0].password);
    if(!isPasswordValid) {
      return res.json({ message: "invalid-password" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (error, decoded) => {
    if(error) return res.json({message: "invalid-token"});
    req.username = decoded.username;
    next();
  });
}

app.get("/user", verifyToken, (req, res) => {
  res.json({message: {username: req.username}});
});

const getStations = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM stations", (error, results) => {
      if(error) reject(error);
      else resolve(results);
    });
  });
};

app.get("/user/search", verifyToken, async (req, res) => {
  try {
    stations = await getStations();
    res.json({ message: { username: req.username, stations } });
  }
  catch(error) {
    console.error("Error fetching stations:", error);
  }
});

const trainsQuery = `
    SELECT T.id, V.route_id, T.name, V.start_time, V.end_time,
           T.fc_capacity - coalesce(f(T.id, ?, "1C"), 0) as fc_capacity,
           T.sc_capacity - coalesce(f(T.id, ?, "2C"), 0) as sc_capacity,
           T.tc_capacity - coalesce(f(T.id, ?, "3C"), 0) as tc_capacity,
           V.fc_price, V.sc_price, V.tc_price
    FROM trains T
    JOIN (
      SELECT * FROM trains_and_routes
      WHERE route_id IN (
        SELECT id FROM routes
        WHERE start_st_id = ? AND end_st_id = ?
      )
    ) V ON T.id = V.train_id;
  `;

app.post("/user/search", verifyToken, async (req, res) => {
  ({ start_st, end_st, departure_date, sql_date } = req.body);

  db.query(trainsQuery, [sql_date, sql_date, sql_date, start_st.value, end_st.value], (error, results) => {
    if(error) {
      console.error("Error executing SQL query:", error);
    }
    else {
      trains = results;
      res.json({ message: { trains: trains } });
    }
  });
});

app.get("/user/trains", verifyToken, (req, res) => {
  console.log(trains); //
  res.json({ message: { username: req.username,
      stations: stations,
      trains: trains,
      start_st: start_st, end_st: end_st,
      departure_date: departure_date } });
});

app.post("/user/trains", verifyToken, (req, res) => {
  if(req.body.type === "search") {
    ({start_st, end_st, departure_date, sql_date} = req.body);

    db.query(trainsQuery, [sql_date, sql_date, sql_date, start_st.value, end_st.value], (error, results) => {
      if(error) {
        console.error("Error executing SQL query:", error);
      }
      else {
        trains = results;
        res.json({message: {trains: results, start_st: start_st, end_st: end_st}});
      }
    });
  }
  else {
    booking_details = {...req.body.booking_details, start_st: start_st.label, end_st: end_st.label};
    console.log(booking_details); //
    res.json();
  }
});

app.get("/user/book", verifyToken, (req, res) => {
  res.json({message: {username: req.username, booking_details}});
});

app.post("/user/book", verifyToken, (req, res) => {
  const {username, train_id, route_id, departure_date, class_type, seats} = req.body.bookingDetails;
  console.log(username, train_id, route_id, departure_date, class_type, seats);
  console.log(req.body); //
  const query = `
    INSERT INTO bookings (
        username, train_id, route_id, departure_date, class_type, seats
    ) values (?, ?, ?, ?, ?, ?);
  `;

  db.query(query, [username, train_id, route_id, departure_date, class_type, seats], (error) => {
    if(error) {
      console.error("Error while inserting: ", error);
    }
    else res.json();
  });
});

app.get("/user/bookings", verifyToken, (req, res) => {
  const username = req.username;
  db.query(`SELECT * FROM ${username.toLowerCase() + "_view"} ORDER BY departure_date`, (error, result) => {
    if(error) {
      console.error("Error while fetching view: ", error);
    }
    else {
      const bookings = result;
      console.log(bookings); //
      res.json({ message: { username: username, bookings: bookings }});
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
