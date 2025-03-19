import { User } from "../../types/users";
import UserRow from "./UserRow";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Fragment, useState, useRef, useEffect } from "react";

interface Props {
  users: User[];
  roleFilter: User["role"][];
  statusFilter: User["status"][];
  toggleRoleFilter: (role: User["role"]) => void;
  toggleStatusFilter: (status: User["status"]) => void;
}

export default function UserTable({
  users,
  roleFilter,
  statusFilter,
  toggleRoleFilter,
  toggleStatusFilter,
}: Props) {
  // 📌 États pour stocker les positions des menus
  const [roleMenuPosition, setRoleMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [statusMenuPosition, setStatusMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // 📌 Références aux boutons pour calculer la position
  const roleButtonRef = useRef<HTMLButtonElement | null>(null);
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (roleButtonRef.current) {
      const rect = roleButtonRef.current.getBoundingClientRect();
      setRoleMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    if (statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect();
      setStatusMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">Nom</th>
            <th className="border p-3 text-left">Email</th>

            {/* 🔹 Dropdown de filtre Rôle */}
            <th className="border p-3 text-left relative">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton ref={roleButtonRef} className="flex items-center gap-2">
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
                  <MenuItems
                    className="absolute w-40 bg-white shadow-lg rounded-lg border overflow-y-auto"
                    style={{
                      position: "fixed",
                      top: roleMenuPosition.top,
                      left: roleMenuPosition.left,
                      zIndex: 9999,
                      maxHeight: "200px",
                    }}
                  >
                    {["ELEVE", "RESPONSABLE_PEDAGOGIQUE", "ADMIN", "SUPER_ADMIN"].map((role) => (
                      <MenuItem key={role} as="div">
                        <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={roleFilter.includes(role as User["role"])}
                            onChange={() => toggleRoleFilter(role as User["role"])}
                          />
                          {role.replace("_", " ")}
                        </label>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </Menu>
            </th>

            {/* 🔹 Dropdown de filtre Statut (Maintenant indépendant) */}
            <th className="border p-3 text-left relative">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton ref={statusButtonRef} className="flex items-center gap-2">
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
                  <MenuItems
                    className="absolute w-40 bg-white shadow-lg rounded-lg border overflow-y-auto"
                    style={{
                      position: "fixed",
                      top: statusMenuPosition.top, // 📌 Placement indépendant
                      left: statusMenuPosition.left,
                      zIndex: 9999,
                      maxHeight: "200px",
                    }}
                  >
                    {["ACTIF", "SUSPENDU", "DESACTIVE"].map((status) => (
                      <MenuItem key={status} as="div">
                        <label className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(status as User["status"])}
                            onChange={() => toggleStatusFilter(status as User["status"])}
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
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
