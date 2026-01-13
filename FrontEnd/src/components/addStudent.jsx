import { useState } from "react";
import { useNavigate } from "react-router";
import "../style.css";

function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    age: "",
    className: ""
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleAddStudent = async (e) => {
    e.preventDefault();

    /* =========================
       FRONTEND VALIDATION
    ========================= */
    if (!student.name || !student.email || !student.age || !student.className) {
      setError("All fields are required");
      return;
    }

    const nameRegex = /^[A-Za-z .-]{3,50}$/;
    if (!nameRegex.test(student.name)) {
      setError("Name must contain only letters (3–50 characters)");
      return;
    }

    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/;
    if (!emailRegex.test(student.email)) {
      setError("Email must be a valid Gmail address");
      return;
    }

    const age = Number(student.age);
    if (age < 18 || age > 45) {
      setError("Age must be between 18 and 45");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/student/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
          },
          body: JSON.stringify(student)
        }
      );

      const result = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Failed to add student");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Student</h2>

      <form className="form-box" onSubmit={handleAddStudent}>
        {error && <p className="error-text">{error}</p>}

        <label htmlFor="name">Name</label>
        <input
          name="name"
          placeholder="Enter student name"
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          name="email"
          placeholder="example@gmail.com"
          onChange={handleChange}
        />

        <label htmlFor="age">Age</label>
        <input
          name="age"
          type="number"
          placeholder="18 - 45"
          onChange={handleChange}
        />

        <label htmlFor="className">Class</label>
        <select
          name="className"
          onChange={handleChange}
          required
        >
          <option value="">Select Class</option>
          <option value="BSSE">BSSE</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
          <option value="BSITE">BSITE</option>
          <option value="BSAI">BSAI</option>
        </select>

        <button type="submit" className="btn-submit">
          Add Student
        </button>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddStudent;
