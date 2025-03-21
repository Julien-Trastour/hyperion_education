import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, BookOpen, Map, Settings } from "lucide-react";
import { useAtom } from "jotai";
import { authAtom } from "../store/authAtom";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { logout } from "../services/authService";

export default function DashboardStudentLayout() {
  const [, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();

  // ✅ Autoriser uniquement les élèves
  useAuthGuard(["ELEVE"]);

  const handleLogout = () => {
    logout();
    setAuth({ token: null, role: null, user: null });
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar élève */}
      <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Hypérion Élève</h1>
        </div>
        <nav className="mt-6 space-y-2">
          <Link to="/student" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>

          <Link to="/student/courses" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <BookOpen size={20} />
            Mes cours
          </Link>

          <Link to="/student/pathways" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <Map size={20} />
            Mes parcours
          </Link>

          <Link to="/student/account-settings" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <Settings size={20} />
            Paramètres
          </Link>

          <button className="flex w-full items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-100" onClick={handleLogout}>
            <LogOut size={20} />
            Déconnexion
          </button>
        </nav>
      </aside>

      {/* Contenu principal décalé */}
      <div className="flex-1 pl-64">
        <main className="p-6 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
