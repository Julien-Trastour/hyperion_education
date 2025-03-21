import { useAtom } from "jotai";
import {
  usersAtom,
  roleFilterAtom,
  statusFilterAtom,
  classFilterAtom,
  toggleRoleFilterAtom,
  toggleStatusFilterAtom,
  toggleClassFilterAtom,
  classLevelsAtom,
} from "../../store/usersStore";
import UserRow from "./UserRow";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  activeTab: "EMPLOYES" | "ELEVES";
  searchQuery: string;
}

export default function UserTable({ activeTab, searchQuery }: Props) {
  const [users] = useAtom(usersAtom);
  const [roleFilter] = useAtom(roleFilterAtom);
  const [statusFilter] = useAtom(statusFilterAtom);
  const [classFilter] = useAtom(classFilterAtom);
  const [, toggleRoleFilter] = useAtom(toggleRoleFilterAtom);
  const [, toggleStatusFilter] = useAtom(toggleStatusFilterAtom);
  const [, toggleClassFilter] = useAtom(toggleClassFilterAtom);
  const [classLevels] = useAtom(classLevelsAtom);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // ✅ Filtrage optimisé avec Jotai
  const filteredUsers = users.filter((user) => {
    const isCorrectTab = activeTab === "EMPLOYES" ? user.role !== "ELEVE" : user.role === "ELEVE";
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole =
      activeTab === "EMPLOYES"
        ? roleFilter.length === 0 || roleFilter.includes(user.role)
        : classFilter.length === 0 || classFilter.includes(user.classLevel || "");
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(user.status || "");
  
    return isCorrectTab && matchesSearch && matchesRole && matchesStatus;
  });  

  return (
    <div className="overflow-visible relative">
      <table className="w-full border-collapse border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">Nom</th>
            <th className="border p-3 text-left">Prénom</th>
            <th className="border p-3 text-left">Email</th>

            {/* 🔹 Colonne Rôle (Employés seulement) */}
            {activeTab === "EMPLOYES" && (
              <th className="border p-3 text-left relative">
                <button
                  className="flex items-center gap-2"
                  onClick={() => setOpenMenu(openMenu === "role" ? null : "role")}
                >
                  Rôle
                  <ChevronDown size={18} />
                </button>
                {openMenu === "role" && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-[100] p-2">
                    {["RESPONSABLE_PEDAGOGIQUE", "ADMIN", "SUPER_ADMIN"].map((role) => (
                      <label key={role} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" checked={roleFilter.includes(role)} onChange={() => toggleRoleFilter(role)} />
                        {role.replace("_", " ")}
                      </label>
                    ))}
                  </div>
                )}
              </th>
            )}

            {/* 🔹 Colonne Classe (Élèves seulement) */}
            {activeTab === "ELEVES" && (
              <th className="border p-3 text-left relative">
                <button
                  className="flex items-center gap-2"
                  onClick={() => setOpenMenu(openMenu === "class" ? null : "class")}
                >
                  Classe
                  <ChevronDown size={18} />
                </button>
                {openMenu === "class" && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-[100] p-2">
                    {/* ✅ Récupération dynamique des classes */}
                    {classLevels.map((classLevel) => (
                      <label key={classLevel} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" checked={classFilter.includes(classLevel)} onChange={() => toggleClassFilter(classLevel)} />
                        {classLevel}
                      </label>
                    ))}
                  </div>
                )}
              </th>
            )}

            {/* 🔹 Colonne Statut */}
            <th className="border p-3 text-left relative">
              <button
                className="flex items-center gap-2"
                onClick={() => setOpenMenu(openMenu === "status" ? null : "status")}
              >
                Statut
                <ChevronDown size={18} />
              </button>
              {openMenu === "status" && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-[100] p-2">
                  {["ACTIF", "SUSPENDU", "DESACTIVE"].map((status) => (
                    <label key={status} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={statusFilter.includes(status)} onChange={() => toggleStatusFilter(status)} />
                      {status}
                    </label>
                  ))}
                </div>
              )}
            </th>

            <th className="border p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <UserRow key={user.id} user={user} activeTab={activeTab} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
