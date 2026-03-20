import { useEffect, useState } from "react";
import "../style.css";
import { useNavigate } from "react-router-dom";
// import "./addStudent"
function StudentList() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const studentsPerPage = 5;

  const navigate = useNavigate()
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/student/my?page=${currentPage}&limit=${studentsPerPage}&search=${search}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();
        setStudents(data.students);
        setTotalPages(data.totalPages);
        setTotalStudents(data.totalStudents);
      } catch (err) {
        setError("Failed to load students");
      }
    };

    fetchStudents();
  }, [currentPage, search]);

  return (
    <div className="list-container">
      <div className="list-card">
        <p className="total-count">Total Students: {totalStudents}</p>
        <h3 className="section-title">My Students</h3>

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

        {error && <p className="error-text">{error}</p>}
        {students.length === 0 && !error && <p>No students found</p>}

        {students.map((s) => (
          <div key={s._id} className="student-card">
            <p>
              <strong>Name:</strong> {s.name}
            </p>
            <p>
              <strong>Email:</strong> {s.email}
            </p>
            <p>
              <strong>Class:</strong> {s.class}
            </p>
            <button className="dashboard-btn update-btn" onClick={() => navigate(`/update/${s._id}`)}>
              Update
              </button>
          </div>
        ))}

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
    </div>
  );
}

export default StudentList;
