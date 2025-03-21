import { Routes, Route } from "react-router-dom";
import DashboardAdminLayout from "../layouts/DashboardAdminLayout";
import ResetPasswordForm from "../pages/auth/ResetPasswordForm";
import AdminAccountSettingsPage from "../pages/admin/AdminAccountSettingsPage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminManageUsersPage from "../pages/admin/AdminManageUsersPage";
import ManageCoursesPage from "../pages/admin/AdminManageCoursesPage";
import AdminEditPathwayContent from "../pages/admin/AdminEditPathwayContent";
import AdminManagePathways from "../pages/admin/AdminManagePathways";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Layout admin qui englobe toutes les routes */}
      <Route path="/" element={<DashboardAdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="reset-password/confirm" element={<ResetPasswordForm />} />
        <Route path="account-settings" element={<AdminAccountSettingsPage />} />
        <Route path="manage-users" element={<AdminManageUsersPage />} />
        <Route path="manage-courses" element={<ManageCoursesPage />} />
        <Route path="manage-pathways" element={<AdminManagePathways />} />
        <Route path="edit-pathway/:pathwayId" element={<AdminEditPathwayContent />} />
      </Route>
    </Routes>
  );
}
