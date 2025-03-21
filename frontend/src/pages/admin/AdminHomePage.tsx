import { useAtom } from "jotai";
import { authAtom } from "../../store/authAtom";
import { studentCountAtom } from "../../store/usersStore";

export default function AdminHomePage() {
  const [auth] = useAtom(authAtom);
  const [studentCount] = useAtom(studentCountAtom);
  const userName = auth.user?.firstName || "Administrateur";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Bienvenue {userName}</h1>
      <p className="text-gray-600 mt-2">
        Gérez les utilisateurs, les cours et surveillez les activités du système.
      </p>

      {/* 🔹 Statistiques Admin */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Bloc Nombre d'étudiants */}
        <div className="p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-lg font-semibold text-gray-700">Nombre d'étudiants</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{studentCount}</p>
        </div>

        {/* Bloc Nombre de cours (à mettre à jour plus tard) */}
        <div className="p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-lg font-semibold text-gray-700">Nombre de cours</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">42</p>
        </div>
      </div>
    </div>
  );
}
