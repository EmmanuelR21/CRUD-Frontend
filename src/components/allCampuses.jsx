import React from "react";
import { Link } from "react-router-dom";
import CampusCard from "./CampusCard";

const AllCampuses = ({ campuses, API_URL, fetchAllCampuses }) => {
  return (
    <div className="all-campuses">
      <div className="campuses-header">
        <h2>All Campuses</h2>
        <Link to="/add-campus" className="btn">
          ➕ Add Campus
        </Link>
      </div>

      <div className="campus-card-container">
        {campuses && campuses.length > 0 ? (
          campuses.map((campus) => (
            <CampusCard
              key={campus.id}
              campus={campus}
              API_URL={API_URL}
              fetchAllCampuses={fetchAllCampuses}
            />
          ))
        ) : (
          <p>No campuses found in the database.</p>
        )}
      </div>
    </div>
  );
};

export default AllCampuses;