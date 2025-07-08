import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ".//StudentStyles.css";

const API_URL = "https://crud-backend-black-kappa.vercel.app";

const SingleStudent = ({ fetchAllStudents }) => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(location.state?.isEditing || false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/students/${studentId}`);
        setStudent(response.data.student || response.data); // Handles both structured or flat responses
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    const fetchCampuses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/campuses`);
        setCampuses(response.data);
      } catch (err) {
        console.error("Error fetching campuses:", err);
      }
    };

    fetchStudent();
    fetchCampuses();
  }, [studentId]);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        gpa: student.gpa?.toString() || "",
        imageUrl: student.imageUrl || "",
        campusId: student.campusId || student.campus?.id || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("First name, last name, and email are required.");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/students/${studentId}`, formData);

      const refreshed = await axios.get(`${API_URL}/api/students/${studentId}`);
      setStudent(refreshed.data.student || refreshed.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Error updating student:", err);
      setError("Failed to update student.");
    }
  };


  const handleDelete = async () => {
    const confirm = window.confirm(`Delete student "${student.firstName} ${student.lastName}"?`);
  if (!confirm) return;

  try {
    await axios.delete(`${API_URL}/api/students/${studentId}`);
    if (fetchAllStudents) fetchAllStudents();
    navigate("/students");
  } catch (err) {
    console.error("Error deleting student:", err);
  }
};

  if (!student) return <p>Student not found</p>;

  return (
    <div className="single-student-card">
      <div className="single-student-card-header">
        <h2>{student.firstName} {student.lastName}</h2>
      </div>

      <img
        className="student-card-image"
        src={student.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
        alt="Student Avatar"
      />
      <p><strong>Email:</strong> {student.email || "N/A"}</p>
      <p><strong>GPA:</strong> {student.gpa ?? "N/A"}</p>
      <p>
        <strong>Campus:</strong>{" "}
        {student.campus ? (
          <Link to={`/campuses/${student.campus.id}`}>{student.campus.name}</Link>
        ) : (
          <em>This student is not registered to a campus.</em>
        )}
      </p>

      {error && <p className="error-message">{error}</p>}

      {isEditing ? (
        <div className="student-edit-form">
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} />

          <label>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} />

          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />

          <label>GPA</label>
          <input name="gpa" type="number" step="0.1" min="0" max="4" value={formData.gpa} onChange={handleChange} />

          <label>Image URL</label>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />

          <label>Campus</label>
          <select name="campusId" value={formData.campusId} onChange={handleChange}>
            <option value="">-- None --</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>

          <button onClick={handleSave} className="btn-edit">💾 Save</button>
          <button onClick={() => setIsEditing(false)} className="btn">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="btn-edit">✏️ Edit</button>
      )}

      <button onClick={handleDelete} className="btn-delete">🗑️ Delete</button>
    </div>
  );
};

export default SingleStudent;
