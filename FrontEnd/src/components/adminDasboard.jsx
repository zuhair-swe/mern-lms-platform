import "../style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [notification, setNotification] = useState({
           message: "",
           type: "", 
           });


  const studentsPerPage = 5;
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/login");
  };

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          `http://localhost:5000/api/admin/students?page=${currentPage}&limit=${studentsPerPage}&search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch students");
          return;
        }

        setStudents(data.students);
        setTotalPages(data.totalPages);
        setTotalStudents(data.totalStudents);
      } catch {
        setError("Server error");
      }
    };

    fetchStudents();
  }, [currentPage, search]);

  // Toggle checkbox
  const toggleSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  // Schedule delete
  const handleDelete = async () => {
  if (selectedStudents.length === 0) {
    setNotification({ message: "Select at least one student ", type: "error" });
    return;
  }
  // Validation
if (hours < 0 || minutes < 0 || seconds < 0) {
  setNotification({
    message: "Time values cannot be negative",
    type: "error",
  });
  return;
}

if (minutes > 59 || seconds > 59) {
  setNotification({
    message: "Minutes and seconds must be between 0 and 59 ",
    type: "error",
  });
  return;
}

if (hours > 720) {
  setNotification({
    message: "Hours must be between 0 and 720 ",
    type: "error",
  });
  return;
}


  const delayMs = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

  if (delayMs <= 0) {
    setNotification({ message: "Please set a valid delay time ", type: "error" });
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete selected students after ${hours}h ${minutes}m ${seconds}s?`
  );
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      "http://localhost:5000/api/admin/students/schedule-delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentIds: selectedStudents,
          delayMs,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setNotification({ message: data.message || "Failed to schedule delete ", type: "error" });
      return;
    }

    setNotification({ message: "Delete scheduled successfully", type: "success" });

    setSelectedStudents([]);
    setHours(0);
    setMinutes(0);
    setSeconds(0);

    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  } catch (err) {
    setNotification({ message: "Server error", type: "error" });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  }
};


  return (
    <div className="admin-dashboard">
      {/* Header */}
        {notification.message && (
           <div className={`notification ${notification.type}`}>
                {notification.message}
          </div>
        )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>

        <button className="dashboard-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h4 className="total-count">Total Students: {totalStudents}</h4>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="student-search"
      />

{/* Time */}
{/* Delete Controls */}
<div className="admin-delete-controls">
  {/* Time Inputs */}
    <h4>Time Inputs:</h4>
  <div className="time-inputs">
  <div className="time-box">
    <label>Hours</label>
    <input
      type="number"
      min="0"
      max="720"
      value={hours}
      onChange={(e) => setHours(Number(e.target.value))}
    />
  </div>

  <div className="time-box">
    <label>Minutes</label>
    <input
      type="number"
      min="0"
      max="59"
      value={minutes}
      onChange={(e) => setMinutes(Number(e.target.value))}
    />
  </div>

  <div className="time-box">
    <label>Seconds</label>
    <input
      type="number"
      min="0"
      max="59"
      value={seconds}
      onChange={(e) => setSeconds(Number(e.target.value))}
    />
  </div>
</div>


  {/* Delete Button */}
  <button
    className="dashboard-btn admin-delete-btn"
    disabled={selectedStudents.length === 0}
    onClick={handleDelete}
  >
    Delete Selected
  </button>
</div>


      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Teacher</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s._id)}
                  onChange={() => toggleSelect(s._id)}
                />
              </td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.teacher?.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
