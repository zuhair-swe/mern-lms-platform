import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

// normal imports (small / critical pages)
import Home from "./home";
import Signup from "./signup";
import Login from "./login";

// lazy imports (heavy / protected pages)
const Dashboard = lazy(() => import("./dashboard"));
const AddStudent = lazy(() => import("./addStudent"));
const StudentList = lazy(() => import("./studentList"));
const StudentDashboard = lazy(() => import("./studentDashboard"));
const AdminDashboard = lazy(() => import("./adminDasboard"));

import PrivateRoute from "../PrivateRoute";
import PublicRoute from "../PublicRoute";

const MyRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Suspense>
  );
};

export default MyRoutes;
