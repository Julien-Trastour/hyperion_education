import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordForm from "./pages/auth/ResetPasswordForm";
import AdminRoutes from "./routes/AdminRoutes";
import StudentRoutes from "./routes/StudentRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordForm />} />

        {/* Admin Dashboard */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Student Dashboard */}
        <Route path="/student/*" element={<StudentRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
