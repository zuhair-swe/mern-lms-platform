import "../style.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

const UpdateStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    className: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/teacher/students/${studentId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();

        setFormData({
          name: data.name || "",
          email: data.email || "",
          age: data.age || "",
          className: data.class || "",
        });

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch student");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.age || !formData.className) {
      setError("All fields are required");
      return;
    }

    const nameRegex = /^[A-Za-z .-]{3,50}$/;
    if (!nameRegex.test(formData.name)) {
      setError("Name must contain only letters (3–50 characters)");
      return;
    }

    const age = Number(formData.age);
    if (age < 18 || age > 45) {
      setError("Age must be between 18 and 45");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/teacher/students/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            name: formData.name,
            age: formData.age,
            class: formData.className, 
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Failed to update student");
      }
    } catch (error) {
      setError("Update failed");
    }
  };

  if (loading) return <p>Loading student...</p>;

  return (
    <>
    <div className="form-container">
      <h2 className="form-title">Update Student</h2>
      <form className="update-form" onSubmit={handleUpdate}>
        {error && <p style={{ color: "red" }}>{error}</p>}

          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            disabled
          />

          <label>Age</label>
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <label htmlFor="className">Class</label>
        <select
          name="className"
          onChange={handleChange}
          value={formData.className}
          required
        >
          <option value="">Select Class</option>
          <option value="BSSE">BSSE</option>
          <option value="BSCS">BSCS</option>
          <option value="BSIT">BSIT</option>
          <option value="BSITE">BSITE</option>
          <option value="BSAI">BSAI</option>
        </select>

       <div className="form-actions">
  <button type="submit" className="dashboard-btn">
    Update
  </button>
  <button type="button" className="back-btn" onClick={() => navigate("/dashboard")}>
    Cancel
  </button>
</div>


      </form>
      </div>
    </>
  );
};

export default UpdateStudent;
