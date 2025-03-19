import { useState } from "react";
import { useAtom } from "jotai";
import { User } from "../../types/users";
import { Pencil, Trash, Check, X, Mail } from "lucide-react";
import { editUserAtom, updateUserRoleAtom, updateUserStatusAtom, deleteUserAtom, resetPasswordAtom } from "../../store/usersStore";

interface UserRowProps {
  user: User;
}

export default function UserRow({ user }: UserRowProps) {
  const [, editUser] = useAtom(editUserAtom);
  const [, updateUserRole] = useAtom(updateUserRoleAtom);
  const [, updateUserStatus] = useAtom(updateUserStatusAtom);
  const [, deleteUser] = useAtom(deleteUserAtom);
  const [, resetPassword] = useAtom(resetPasswordAtom); // ✅ Jotai direct

  const [isEditing, setIsEditing] = useState(false);
  const [editedRole, setEditedRole] = useState(user.role);
  const [editedStatus, setEditedStatus] = useState(user.status);

  const handleSave = async () => {
    try {
      await updateUserRole({ id: user.id, newRole: editedRole });
      await updateUserStatus({ id: user.id, newStatus: editedStatus });

      await editUser({ id: user.id, role: editedRole, status: editedStatus });

      setIsEditing(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <tr className="border">
      <td className="border p-3">{user.firstName} {user.lastName}</td>
      <td className="border p-3">{user.email}</td>

      {/* Rôle */}
      <td className="border p-3">
        {isEditing ? (
          <select
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value as User["role"])}
            className="border rounded px-2 py-1"
          >
            <option value="ELEVE">Élève</option>
            <option value="RESPONSABLE_PEDAGOGIQUE">Responsable pédagogique</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN" disabled>Super Admin</option>
          </select>
        ) : (
          <span>{user.role}</span>
        )}
      </td>

      {/* Statut */}
      <td className="border p-3">
        {isEditing ? (
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value as User["status"])}
            className="border rounded px-2 py-1"
          >
            <option value="ACTIF">Actif</option>
            <option value="SUSPENDU">Suspendu</option>
            <option value="DESACTIVE">Désactivé</option>
          </select>
        ) : (
          <span>{user.status}</span>
        )}
      </td>

      {/* Actions */}
      <td className="p-3 text-center flex items-center justify-center gap-3">
        {isEditing ? (
          <>
            <button key="validate" onClick={handleSave} className="text-green-600 hover:text-green-800 transition">
              <Check size={20} />
            </button>

            <button
              key="cancel"
              onClick={() => {
                setEditedRole(user.role);
                setEditedStatus(user.status);
                setIsEditing(false);
              }}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <>
            <button key="edit" onClick={() => setIsEditing(true)} className="text-yellow-600 hover:text-yellow-800 transition">
              <Pencil size={20} />
            </button>

            <button
              key="reset"
              onClick={() => resetPassword(user.email)} // ✅ Jotai direct
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <Mail size={20} />
            </button>

            <button key="delete" onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800 transition">
              <Trash size={20} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
