import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, BookOpen, Settings, Map } from "lucide-react";
import { useAtom } from "jotai";
import { authAtom } from "../store/authAtom";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { logout } from "../services/authService";

export default function DashboardAdminLayout() {
  const [, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();

  // ✅ Autoriser SUPER_ADMIN, ADMIN et RESPONSABLE_PEDAGOGIQUE
  useAuthGuard(["SUPER_ADMIN", "ADMIN", "RESPONSABLE_PEDAGOGIQUE"]);

  // 🔹 Récupérer le rôle de l'utilisateur depuis `authAtom`
  const [auth] = useAtom(authAtom);
  const userRole = auth.role;
  const isAdminOrSuperAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";

  const handleLogout = () => {
    logout();
    setAuth({ token: null, role: null, user: null });
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

          {/* 🔹 Gestion des utilisateurs (réservé à SUPER_ADMIN & ADMIN) */}
          {isAdminOrSuperAdmin && (
            <Link to="/admin/manage-users" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
              <Users size={20} />
              Gestion des utilisateurs
            </Link>
          )}

          {/* 🔹 Gestion des cours (réservé à SUPER_ADMIN & ADMIN) */}
          {isAdminOrSuperAdmin && (
            <Link to="/admin/manage-courses" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
              <BookOpen size={20} />
              Gestion des cours
            </Link>
          )}

          {/* 🔹 Gestion des parcours (réservé à SUPER_ADMIN & ADMIN) */}
          {isAdminOrSuperAdmin && (
            <Link to="/admin/manage-pathways" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
              <Map size={20} />
              Gestion des parcours
            </Link>
          )}

          {/* 🔹 Paramètres (accessible à tous les admins) */}
          <Link to="/admin/account-settings" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <Settings size={20} />
            Paramètres
          </Link>

          {/* 🔹 Déconnexion */}
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
