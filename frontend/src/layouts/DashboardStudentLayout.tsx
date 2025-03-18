import { Link, Outlet, useNavigate } from "react-router";
import { LogOut, LayoutDashboard, Book, GraduationCap } from "lucide-react";
import { clearAuthData } from "../utils/auth";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function DashboardStudentLayout() {
  const navigate = useNavigate();
  useAuthGuard("eleve");

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar fixée */}
      <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Hypérion Éducation</h1>
        </div>
        <nav className="mt-6 space-y-2">
          <Link to="/eleve" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <LayoutDashboard size={20} />
            Accueil
          </Link>
          <Link to="/eleve/cours" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <Book size={20} />
            Mes cours
          </Link>
          <Link to="/eleve/progression" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-200">
            <GraduationCap size={20} />
            Progression
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
