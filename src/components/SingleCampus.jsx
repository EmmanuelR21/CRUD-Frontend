import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router";

const SingleCampus = ({ API_URL, fetchAllCampuses }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [campus, setCampus] = useState(null);
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(
    location.state?.isEditing || false
  );
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCampus() {
      try {
        const res = await axios.get(`${API_URL}/api/campuses/${id}`);
        setCampus(res.data.campus);
        setStudents(res.data.students);
      } catch (e) {
        console.error("Failed to fetch campus", e);
      }
    }

    fetchCampus();
  }, [API_URL, id]);

  useEffect(() => {
    if (campus) {
      setFormData(campus);
    }
  }, [campus]);

  const handleSave = async () => {
    if (
      !formData.name &&
      !formData.address &&
      !formData.description &&
      !formData.imageURL
    ) {
      setError("At least one field is required.");
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/api/campuses/${id}`, formData);
      console.log(res.data);
      setCampus(formData);
      setIsEditing(false);
      setError("");
      fetchAllCampuses();
    } catch (e) {
      console.error("Failed to update campus", e);
      setError("Update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`Delete campus "${campus.name}"?`);
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/api/campuses/${id}`);
      fetchAllCampuses();
      navigate("/campuses");
    } catch (e) {
      console.error("Failed to delete campus", e);
    }
  };

  if (!campus) return <p>Campus not found</p>;

  return (
    <div className="single-campus-card">
      <div className="single-campus-card-header">
        <h2>{campus.name}</h2>
      </div>

      <img
        className="campus-card-image"
        src={
          campus.imageURL ||
          "https://cdn-icons-png.flaticon.com/512/4696/4696591.png"
        }
        alt={`${campus.name} campus`}
      />
      <p>
        <strong>Description:</strong> {campus.description}
      </p>
      <p>
        <strong>Address:</strong> {campus.address}
      </p>

      <div className="student-list">
        <h3>Students Enrolled:</h3>
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id}>
              {student.firstName} {student.lastName}
            </div>
          ))
        ) : (
          <p>No students are currently enrolled.</p>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {isEditing ? (
        <div className="campus-edit-form">
          <label>Name</label>
          <input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label>Address</label>
          <input
            value={formData.address || ""}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <label>Description</label>
          <input
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <label>Image URL</label>
          <input
            value={formData.imageURL || ""}
            onChange={(e) =>
              setFormData({ ...formData, imageURL: e.target.value })
            }
          />

          <button onClick={handleSave} className="btn-edit">
            💾 Save
          </button>
          <button onClick={() => setIsEditing(false)} className="btn">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          ✏️ Edit
        </button>
      )}

      <button onClick={handleDelete} className="btn-delete">
        🗑️ Delete
      </button>
    </div>
  );
};

export default SingleCampus;
