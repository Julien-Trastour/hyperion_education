import { Routes, Route } from "react-router-dom";
import DashboardStudentLayout from "../layouts/DashboardStudentLayout";
import ResetPasswordForm from "../pages/auth/ResetPasswordForm";
import StudentHomePage from "../pages/student/StudentHomePage";
import StudentAccountSettingsPage from "../pages/student/StudentAccountSettingsPage";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Layout élève englobant toutes les routes */}
      <Route path="/" element={<DashboardStudentLayout />}>
        <Route index element={<StudentHomePage />} />
        <Route path="account-settings" element={<StudentAccountSettingsPage />} />
        <Route path="reset-password/confirm" element={<ResetPasswordForm />} />
      </Route>
    </Routes>
  );
}
