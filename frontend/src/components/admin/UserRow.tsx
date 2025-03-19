import { useState } from "react";
import { useAtom } from "jotai";
import { User } from "../../types/users";
import { Pencil, Trash, Check, X, Mail } from "lucide-react";
import { editUserAtom, deleteUserAtom, resetPasswordAtom } from "../../store/usersStore";

interface UserRowProps {
  user: User;
  activeTab: "EMPLOYES" | "ELEVES";
}

export default function UserRow({ user, activeTab }: UserRowProps) {
  const [, editUser] = useAtom(editUserAtom);
  const [, deleteUser] = useAtom(deleteUserAtom);
  const [, resetPassword] = useAtom(resetPasswordAtom);

  // ✅ État pour activer/désactiver l'édition sur toute la ligne
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Stockage des valeurs éditées
  const [editedUser, setEditedUser] = useState({
    role: user.role,
    status: user.status,
    classLevel: user.classLevel || "",
  });

  // ✅ Annuler l'édition (remet les valeurs initiales)
  const handleCancel = () => {
    setEditedUser({
      role: user.role,
      status: user.status,
      classLevel: user.classLevel || "",
    });
    setIsEditing(false);
  };

  // ✅ Sauvegarder les modifications
  const handleSave = async () => {
    try {
      await editUser({
        id: user.id,
        role: activeTab === "EMPLOYES" ? editedUser.role : undefined,
        status: editedUser.status,
        classLevel: activeTab === "ELEVES" ? editedUser.classLevel : undefined,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <tr className="border">
      <td className="border p-3">{user.firstName}</td>
      <td className="border p-3">{user.lastName}</td>
      <td className="border p-3">{user.email}</td>

      {/* 🔹 Colonne "Rôle" (Employés uniquement) */}
      {activeTab === "EMPLOYES" && (
        <td className="border p-3">
          {isEditing ? (
            <select
              value={editedUser.role}
              onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value as User["role"] })}
              className="border rounded px-2 py-1"
            >
              <option value="RESPONSABLE_PEDAGOGIQUE">Responsable pédagogique</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN" disabled>Super Admin</option>
            </select>
          ) : (
            <span>{user.role.replace("_", " ")}</span>
          )}
        </td>
      )}

      {/* 🔹 Colonne "Classe" (Élèves uniquement) */}
      {activeTab === "ELEVES" && (
        <td className="border p-3">
          {isEditing ? (
            <input
              type="text"
              value={editedUser.classLevel}
              onChange={(e) => setEditedUser({ ...editedUser, classLevel: e.target.value })}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <span>{user.classLevel || "—"}</span>
          )}
        </td>
      )}

      {/* 🔹 Colonne "Statut" */}
      <td className="border p-3">
        {isEditing ? (
          <select
            value={editedUser.status}
            onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value as User["status"] })}
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

      {/* 🔹 Colonne "Actions" */}
      <td className="p-3 text-center flex items-center justify-center gap-3">
        {isEditing ? (
          <>
            {/* ✅ Bouton de validation */}
            <button onClick={handleSave} className="text-green-600 hover:text-green-800 transition">
              <Check size={20} />
            </button>

            {/* ❌ Bouton d'annulation */}
            <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800 transition">
              <X size={20} />
            </button>
          </>
        ) : (
          <>
            {/* ✏️ Bouton "Modifier" */}
            <button onClick={() => setIsEditing(true)} className="text-yellow-600 hover:text-yellow-800 transition">
              <Pencil size={20} />
            </button>

            {/* 📧 Bouton "Réinitialiser le mot de passe" */}
            <button onClick={() => resetPassword(user.email)} className="text-blue-600 hover:text-blue-800 transition">
              <Mail size={20} />
            </button>

            {/* 🗑️ Bouton "Supprimer" */}
            <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800 transition">
              <Trash size={20} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
