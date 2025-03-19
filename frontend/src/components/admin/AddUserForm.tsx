import { useState } from "react";
import { User } from "../../types/users";

interface Props {
  addUser: (newUser: Omit<User, "id" | "createdAt"> & { password: string }) => void;
  setIsAddingUser: (value: boolean) => void;
}

export default function AddUserForm({ addUser, setIsAddingUser }: Props) {
  const [newUser, setNewUser] = useState<Omit<User, "id" | "createdAt"> & { password: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    role: "ELEVE",
    status: "ACTIF",
    profilePicture: "",
  });

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || !newUser.birthDate) {
      alert("❌ Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      await addUser(newUser);
      setIsAddingUser(false);
    } catch (error) {
      alert("❌ Erreur lors de l'ajout de l'utilisateur.");
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">Nouvel utilisateur</h2>
      
      {/* 🔹 Formulaire d'ajout */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Prénom"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        {/* 🔹 Date de naissance */}
        <input
          type="date"
          value={newUser.birthDate}
          onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="ELEVE">Élève</option>
          <option value="RESPONSABLE_PEDAGOGIQUE">Responsable pédagogique</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN" disabled>Super Admin</option>
        </select>
      </div>

      {/* 🔹 Boutons */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ✅ Ajouter
        </button>
        <button
          onClick={() => setIsAddingUser(false)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          ❌ Annuler
        </button>
      </div>
    </div>
  );
}
