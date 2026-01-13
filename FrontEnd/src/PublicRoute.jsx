import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  const teacherToken = localStorage.getItem("token");
  const studentToken = localStorage.getItem("studentToken");
  const adminToken = localStorage.getItem("adminToken")

  // If already logged in, block login/signup pages
  if (teacherToken) {
    return <Navigate to="/dashboard" replace />;
  }

  if (studentToken) {
    return <Navigate to="/student-dashboard" replace />;
  }
    if (adminToken) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
