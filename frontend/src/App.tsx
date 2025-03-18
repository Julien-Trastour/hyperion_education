import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordForm from "./pages/auth/ResetPasswordForm";
import DashboardAdminLayout from "./layouts/DashboardAdminLayout";
import DashboardStudentLayout from "./layouts/DashboardStudentLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordForm />} />

        {/* Dashboard Admin */}
        <Route path="/admin/*" element={<DashboardAdminLayout />} />

        {/* Dashboard Élève */}
        <Route path="/eleve/*" element={<DashboardStudentLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
