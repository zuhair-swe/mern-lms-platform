import { useState } from "react";
import { useNavigate } from "react-router";
import "../style.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Teacher", // default role
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- for password toggle

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password, role } = formData;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/${role.toLowerCase()}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const result = await response.json();

      if (response.ok) {
        if (role === "Teacher") {
          localStorage.setItem("token", result.token);
          navigate("/dashboard");
        } 
        else if(role === "Admin"){
          localStorage.setItem("adminToken", result.token);
          localStorage.setItem("adminRole", "Admin");
          navigate("/admin-dashboard");
        }
        else if(role === "Student") {
          localStorage.setItem("studentToken", result.token);
          localStorage.setItem("studentData", JSON.stringify(result.user));
          navigate("/student-dashboard");
        }
        else{ 
          setError("Invalid Role")
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="form-incontainer">
      <h2 className="form-title">Login</h2>

      <form className="form-box" onSubmit={handleLogin}>
        {error && <p className="error-text">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="example@gmail.com"
          onChange={handleChange}
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
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

        <label>Login As</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
