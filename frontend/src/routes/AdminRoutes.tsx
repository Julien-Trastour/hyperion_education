import { Routes, Route } from "react-router";
import DashboardAdminLayout from "../layouts/DashboardAdminLayout";
import AdminHomePage from "../pages/admin/AdminHomePage";
import ManageCoursesPage from "../pages/admin/ManageCoursesPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardAdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="manage-courses" element={<ManageCoursesPage />} />
        <Route path="manage-users" element={<ManageUsersPage />} />
      </Route>
    </Routes>
  );
}
