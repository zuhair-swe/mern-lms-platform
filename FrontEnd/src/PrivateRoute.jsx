import { Navigate, Outlet } from "react-router";

function PrivateRoute() {
  const teacherToken = localStorage.getItem("token");
  const studentToken = localStorage.getItem("studentToken");
  const adminToken = localStorage.getItem("adminToken")

  // If teacher token exists, allow access
  if (teacherToken) {
    return <Outlet />;
  }

  // If student token exists, allow access
  if (studentToken) {
    return <Outlet />;
  }
if (adminToken) {
    return <Outlet />;
  }
  // If no token, redirect to the appropriate login
  // Here we can default to home or login page
  return <Navigate to="/" />;
}

export default PrivateRoute;
