import { Link, Outlet, useNavigate } from "react-router";
import { LogOut, LayoutDashboard, Users, BookOpen } from "lucide-react";
import { clearAuthData } from "../utils/auth";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function DashboardAdminLayout() {
  const navigate = useNavigate();
  useAuthGuard("admin");

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar fixée */}
      <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Hypérion Admin</h1>
        </div>
        <nav className="mt-6 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/admin/utilisateurs" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <Users size={20} />
            Utilisateurs
          </Link>
          <Link to="/admin/cours" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <BookOpen size={20} />
            Gérer les cours
          </Link>
          <button className="flex w-full items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-100" onClick={handleLogout}>
            <LogOut size={20} />
            Déconnexion
          </button>
        </nav>
      </aside>

      {/* Contenu principal bien décalé à droite */}
      <div className="flex-1 pl-64">
        <main className="p-6 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
