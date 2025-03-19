import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { usersAtom, fetchUsersAtom, addUserAtom } from "../../store/usersStore";
import { User } from "../../types/users";
import UserTable from "../../components/admin/UserTable";
import AddUserForm from "../../components/admin/AddUserForm";
import { Search } from "lucide-react";

export default function ManageUsersPage() {
  const [users] = useAtom(usersAtom);
  const [, fetchUsers] = useAtom(fetchUsersAtom);
  const [, addUser] = useAtom(addUserAtom);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"EMPLOYES" | "ELEVES">("EMPLOYES");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Filtres pour le rôle et le statut
  const [roleFilter, setRoleFilter] = useState<User["role"][]>([]);
  const [statusFilter, setStatusFilter] = useState<User["status"][]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [fetchUsers]);

  // ✅ Filtrage des utilisateurs
  const filteredUsers = users
    .filter(user => (activeTab === "EMPLOYES" ? user.role !== "ELEVE" : user.role === "ELEVE"))
    .filter(user =>
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter(user => roleFilter.length === 0 || roleFilter.includes(user.role))
    .filter(user => statusFilter.length === 0 || statusFilter.includes(user.status));

  // ✅ Fonction pour gérer le filtrage dynamique des rôles
  const toggleRoleFilter = (role: User["role"]) => {
    setRoleFilter(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  // ✅ Fonction pour gérer le filtrage dynamique du statut
  const toggleStatusFilter = (status: User["status"]) => {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="p-8 w-full mx-auto bg-white shadow-md rounded-lg flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des utilisateurs</h1>

      {/* 🔹 Tabs Employés / Élèves */}
      <div className="flex justify-center border-b mb-4">
        <button
          className={`px-6 py-2 font-medium ${
            activeTab === "EMPLOYES" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("EMPLOYES")}
        >
          👔 Employés
        </button>
        <button
          className={`px-6 py-2 font-medium ${
            activeTab === "ELEVES" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("ELEVES")}
        >
          🎓 Élèves
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Chargement des utilisateurs...</p>
      ) : (
        <>
          {/* 🔹 Bouton Ajouter */}
          {!isAddingUser ? (
            <button
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-fit"
              onClick={() => setIsAddingUser(true)}
            >
              + Ajouter un utilisateur
            </button>
          ) : (
            <AddUserForm addUser={addUser} setIsAddingUser={setIsAddingUser} />
          )}

          {/* 🔹 Barre de recherche */}
          <div className="relative mb-4 flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* 🔹 Tableau des utilisateurs avec filtres */}
          <UserTable
            users={filteredUsers}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            toggleRoleFilter={toggleRoleFilter}
            toggleStatusFilter={toggleStatusFilter}
          />
        </>
      )}
    </div>
  );
}
