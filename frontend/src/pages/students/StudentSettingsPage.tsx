import { useAtom } from "jotai";
import { currentUserAtom, updateUserAtom } from "../../store/usersStore";
import { useState } from "react";

export default function StudentSettingsPage() {
  const [currentUser] = useAtom(currentUserAtom);
  const [, updateUser] = useAtom(updateUserAtom);

  const [editedUser, setEditedUser] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    classLevel: currentUser.classLevel || "",
  });

  const handleSave = async () => {
    await updateUser(editedUser);
    alert("✅ Profil mis à jour !");
  };

  return (
    <div className="p-6 w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Paramètres Étudiant</h1>

      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="text-gray-700">Prénom</span>
          <input
            type="text"
            value={editedUser.firstName}
            onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Nom</span>
          <input
            type="text"
            value={editedUser.lastName}
            onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Classe</span>
          <input
            type="text"
            value={editedUser.classLevel}
            onChange={(e) => setEditedUser({ ...editedUser, classLevel: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
