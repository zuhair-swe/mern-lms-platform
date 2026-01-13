import { useNavigate } from "react-router";
import "../style.css";
import StudentList from "./studentList";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2>Teacher Dashboard</h2>

        <div className="dashboard-actions">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/add-student")}
          >
            + Add Student
          </button>

          <button
            className="dashboard-btn logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <StudentList />
      </div>
    </div>
  );
}

export default Dashboard;
