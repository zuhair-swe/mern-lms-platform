import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import "../style.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null); // REF for hidden file input

  // fetch student info
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/profile",
          {
            headers: {
              Authorization: localStorage.getItem("studentToken"),
            },
          }
        );
        const result = await response.json();

        if (response.ok) {
          setStudent(result);
        } else {
          setError(result.message || "Failed to fetch student info");
        }
      } catch {
        setError("Server error");
      }
    };

    fetchStudent();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    navigate("/");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(
        "http://localhost:5000/api/student/upload-image",
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("studentToken"),
          },
          body: formData,
        }
      );

      const data = await res.json();
      setStudent((prev) => ({ ...prev, image: data.image }));
      handleCancel();
    } catch {
      alert("Upload failed");
    }
  };

  const handleCancel = () => {
    setShowUpload(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Student Dashboard</h2>
        <button className="dashboard-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {error && <p className="error-text">{error}</p>}

        {student && (
          <div className="list-card student-profile">
            {/* PROFILE IMAGE */}
            <div className="profile-image-wrapper">
              <img
                src={
                  previewUrl
                    ? previewUrl
                    : student.image
                    ? `http://localhost:5000/uploads/${student.image}`
                    : "/avatar.png"
                }
                alt={student.name}
                className="student-image"
                onClick={() => {
                  setShowUpload(true);
                  fileInputRef.current.click(); // open file picker
                }}
              />
              <span className="change-photo">Click image to change</span>

              {/* HIDDEN FILE INPUT */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </div>

            {/* STUDENT INFO */}
            <div className="student-info">
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Class:</strong> {student.class}</p>
              <p><strong>Age:</strong> {student.age}</p>
              <p><strong>Teacher:</strong> {student.teacher?.name}</p>
            </div>

            {/* UPLOAD / CANCEL BUTTONS */}
            {showUpload && (
              <div className="upload-area">
                <div className="upload-actions">
                  <button
                    className="dashboard-btn small-btn"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                  <button
                    className="back-btn small-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
