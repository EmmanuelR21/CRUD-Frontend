import React from "react";
import "./NavBarStyles.css";
import axios from "axios";
import { Link } from "react-router";

const NavBar = ({ isAuthenticated, setAuth }) => {
  async function handleClick() {
    console.log(document.cookie);
    try {
      await axios.post(
        "http://localhost:8080/auth/logout",
        {},
        { withCredentials: true }
      );
      setAuth(false);
    } catch (error) {
      if (error.response.data.error)
        console.error({ error: error.response.data.error });
      else console.error(error.message);
    }
  }
  return (
    <nav className="navbar">
      {isAuthenticated ? (
        <button onClick={handleClick}>Logout</button>
      ) : (
        <div>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
