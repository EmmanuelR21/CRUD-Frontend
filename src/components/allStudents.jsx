import React from "react";
import { Link } from "react-router-dom";
import ".//StudentStyles.css";


const AllStudents = ({ students }) => {
  return (
    <div className="all-students">
      <div className="students-header">
        <h2>All Students</h2>
        <Link to="/add-student" className="btn">
          ➕ Add Student
        </Link>
      </div>

      <div className="grid">
        {students?.length === 0 ? (
          <p>No students available.</p>
        ) : (
          students.map((student) => (
            <div key={student.id} className="card">
              <img
                src={
                  student.imageUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt={`${student.firstName} ${student.lastName}`}
                width="100"
              />
              <div className="student-details">
                <Link to={`/students/${student.id}`}>
                  {student.firstName} {student.lastName}
                </Link>
                <p>Email: {student.email}</p>
                <p>GPA: {isNaN(student.gpa) ? "N/A" : Number(student.gpa).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllStudents;
