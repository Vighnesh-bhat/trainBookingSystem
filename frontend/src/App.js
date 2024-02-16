import './App.css';
import {useState} from "react";
import {Route, Routes} from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Trains from "./Components/Trains";
import Book from "./Components/Book";
import Bookings from "./Components/Bookings";

function App() {
  const [signupToast, setSignupToast] = useState(false);

  return (
    <Routes>
      <Route path="/" element={ <Home/> }/>
      <Route path="/signup" element={ <SignUp changeState={() => setSignupToast(true)}/> }/>
      <Route path="/signin" element={ <SignIn signupToast={signupToast} changeState={() => setSignupToast(false)}/> }/>
      <Route path="/user" element={ <Home/> }/>
      <Route path="/user/search" element={ <Search/> }/>
      <Route path="/user/trains" element={ <Trains/> }/>
      <Route path="/user/book" element={ <Book/> }/>
      <Route path="/user/bookings" element={ <Bookings/> }/>
    </Routes>
  );
}

export default App;
