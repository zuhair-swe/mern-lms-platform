import { useNavigate } from "react-router";
import "../style.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <div className="form-box home-box">
        
        {/* Logo / Icon Area */}
        <div className="brand-logo">
          🎓
        </div>

        <h1 className="form-title">LMS Portal</h1>
        
        <p className="home-subtitle">
          Streamline your education management. <br />
          Access your student and teacher dashboards.
        </p>

        <div className="button-group">
          <button
            className="btn-submit"
            onClick={() => navigate("/login")}
          >
            Login to Portal
          </button>

          <button
            className="btn-outline" 
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;