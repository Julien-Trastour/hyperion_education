import { Routes, Route } from "react-router";
import DashboardAdminLayout from "../layouts/DashboardAdminLayout";
import AdminHomePage from "../pages/admin/AdminHomePage";
import ManageCoursesPage from "../pages/admin/ManageCoursesPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardAdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="manage-courses" element={<ManageCoursesPage />} />
      </Route>
    </Routes>
  );
}
