import { useNavigate } from "react-router";
import "../style.css";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- password toggle state

  // HANDLE INPUT CHANGE
  function handleChange(e) {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleClick = () => {
    navigate("/login");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // ===== VALIDATIONS =====
    if (!teacher.name || !teacher.email || !teacher.password) {
      setError("All fields are required");
      return;
    }

    const nameRegex = /^[A-Za-z .-]{3,50}$/;
    if (!nameRegex.test(teacher.name)) {
      setError("Name must contain only letters");
      return;
    }

    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/;
    if (!emailRegex.test(teacher.email)) {
      setError("Email must be a valid Gmail address");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(teacher.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setError("");

    // ===== API CALL =====
    try {
      const response = await fetch(
        "http://localhost:5000/api/teacher/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(teacher)
        }
      );

      const result = await response.json();

      if (response.ok) {
        setTeacher({ name: "", email: "", password: "" });
        navigate("/login");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Teacher Signup</h2>

      <form className="form-box" onSubmit={handleSignup}>
        {error && <p className="error-text">{error}</p>}

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={teacher.name}
          placeholder="Enter your name"
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={teacher.email}
          placeholder="example@gmail.com"
          onChange={handleChange}
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"} // toggle type
            name="password"
            value={teacher.password}
            placeholder="Enter password"
            onChange={handleChange}
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="btn-submit">
          Signup
        </button>

        <p className="auth-link" onClick={handleClick}>
          Already have an account
        </p>
      </form>
    </div>
  );
}

export default Signup;
