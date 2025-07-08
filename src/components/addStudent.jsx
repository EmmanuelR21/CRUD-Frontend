import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ".//StudentStyles.css";


const API_URL = "https://crud-backend-black-kappa.vercel.app";

const AddStudent = ({ fetchAllStudents }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gpa: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const { firstName, lastName, email, gpa } = formData;

  if (!firstName.trim() || !lastName.trim() || !email.trim()) {
    setError("First name, last name, and email are required.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  const parsedGpa = parseFloat(gpa);
  if (isNaN(parsedGpa) || parsedGpa < 0.0 || parsedGpa > 4.0) {
    setError("GPA must be between 0.0 and 4.0.");
    return;
  }

  const newStudent = {
    ...formData,
    gpa: parsedGpa,
    imageUrl:
      formData.imageUrl ||
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
  };

  try {
    await axios.post(`${API_URL}/api/students`, newStudent);
    if (fetchAllStudents) fetchAllStudents(); // Optional refresh
    navigate("/students");
  } catch (err) {
    console.error("Error adding student:", err);
    setError("Failed to add student.");
  }
};


  return (
    <div className="add-student-form">
      <h2>Add New Student</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />

        <label>Last Name:</label>
        <input
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />

        <label>Email:</label>
        <input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <label>GPA:</label>
        <input
            type="number"
            name="gpa"
            id="gpa"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
            min="0"
            max="4"
            step="0.1"
            className={error.includes("GPA") ? "error" : ""}
         />

        <label>Image URL:</label>
        <input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />

        {formData.imageUrl && (
          <div style={{ margin: "1rem 0" }}>
            <img src={formData.imageUrl} alt="Student Preview" width="150" />
          </div>
        )}

        <button type="submit">➕ Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
