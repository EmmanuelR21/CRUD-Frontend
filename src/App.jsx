import React, { useState, useEffect } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router";

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  async function getAuth() {
    // Fetch authentication status from API
    try {
      const response = await axios.get("http://localhost:8080/auth/me", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAuthenticated(true);
      }
    } catch (error) {
      if (error.response.data.error)
        console.error({ error: error.response.data.error });
      else console.error(error.message);
    }
  }

  useEffect(() => {
    getAuth();
  }, [location.pathname]);

  return (
    <div>
      <NavBar isAuthenticated={isAuthenticated} setAuth={setAuthenticated} />
      <div className="app">
        <Routes>
          <Route path="/" element={<h1>Welcome to CRUD Frontend!</h1>} />
          <Route
            path="/login"
            element={<Login setAuthenticated={setAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<SignUp setAuthenticated={setAuthenticated} />}
          />
        </Routes>
      </div>
    </div>
  );
};

// We're using React Router to handle the navigation between pages.
// It's important that the Router is at the top level of our app,
// and that we wrap our entire app in it. With this in place, we can
// declare Routes, Links, and use useful hooks like useNavigate.
const root = createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
