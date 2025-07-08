import React, { useState, useEffect } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AllCampuses from "./components/allCampuses";
import AllStudents from "./components/allStudents";
import AddCampus from "./components/AddCampus";
import SingleCampus from "./components/SingleCampus";
import AddStudent from "./components/addStudent";
import SingleStudent from "./components/singleStudent";

import { BrowserRouter as Router, Routes, Route } from "react-router";

const API_URL = "http://localhost:8080";

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchAllCampuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/campuses`);
      setCampuses(response.data);
    } catch (e) {
      console.error("Error fetching campuses:", e);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/students`);
      setStudents(response.data);
    } catch (e) {
      console.error("Error fetching students:", e);
    }
  };

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

  useEffect(() => {
    fetchAllCampuses();
    fetchAllStudents();
  }, []);

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
          <Route
            path="/campuses"
            element={
              <AllCampuses
                campuses={campuses}
                API_URL={API_URL}
                fetchAllCampuses={fetchAllCampuses}
              />
            }
          />
          <Route
            path="/campuses/:id"
            element={
              <SingleCampus
                API_URL={API_URL}
                fetchAllCampuses={fetchAllCampuses}
              />
            }
          />
          <Route
            path="/add-campus"
            element={
              <AddCampus
                API_URL={API_URL}
                fetchAllCampuses={fetchAllCampuses}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/add-student"
            element={
              <AddStudent
                students={students}
                setStudents={setStudents}
                fetchAllStudents={fetchAllStudents}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/students"
            element={<AllStudents students={students} />}
          />
          <Route
            path="/students/:studentId"
            element={<SingleStudent fetchAllStudents={fetchAllStudents} />}
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
