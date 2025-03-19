import { useAtom } from "jotai";
import { 
  usersAtom, 
  roleFilterAtom, 
  statusFilterAtom, 
  classFilterAtom, 
  toggleRoleFilterAtom, 
  toggleStatusFilterAtom, 
  toggleClassFilterAtom 
} from "../../store/usersStore";
import { User } from "../../types/users";
import UserRow from "./UserRow";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Fragment } from "react";

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

  // ✅ Filtrage optimisé avec Jotai
  const filteredUsers = users.filter((user) => {
    const isCorrectTab = activeTab === "EMPLOYES" ? user.role !== "ELEVE" : user.role === "ELEVE";
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = activeTab === "EMPLOYES"
      ? roleFilter.length === 0 || roleFilter.includes(user.role)
      : classFilter.length === 0 || classFilter.includes(user.classLevel || "");
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(user.status);

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
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="flex items-center gap-2">
                    Rôle
                    <ChevronDown size={18} />
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    {/* ✅ Utilisation de `portal` pour éviter les problèmes de clipping */}
                    <MenuItems className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-[100]">
                      {["RESPONSABLE_PEDAGOGIQUE", "ADMIN", "SUPER_ADMIN"].map((role) => (
                        <MenuItem key={role} as="div">
                          <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={roleFilter.includes(role as User["role"])}
                              onChange={() => toggleRoleFilter(role)}
                            />
                            {role.replace("_", " ")}
                          </label>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </th>
            )}

            {/* 🔹 Colonne Classe (Élèves seulement) */}
            {activeTab === "ELEVES" && (
              <th className="border p-3 text-left relative">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="flex items-center gap-2">
                    Classe
                    <ChevronDown size={18} />
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-[100]">
                      {["CP", "CE1", "CE2", "CM1", "CM2", "6ème", "5ème", "4ème", "3ème"].map((classLevel) => (
                        <MenuItem key={classLevel} as="div">
                          <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={classFilter.includes(classLevel)}
                              onChange={() => toggleClassFilter(classLevel)}
                            />
                            {classLevel}
                          </label>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </th>
            )}

            {/* 🔹 Colonne Statut */}
            <th className="border p-3 text-left relative">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="flex items-center gap-2">
                  Statut
                  <ChevronDown size={18} />
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-[100]">
                    {["ACTIF", "SUSPENDU", "DESACTIVE"].map((status) => (
                      <MenuItem key={status} as="div">
                        <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(status as User["status"])}
                            onChange={() => toggleStatusFilter(status)}
                          />
                          {status}
                        </label>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </Menu>
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
