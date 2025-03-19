import { useAtom } from "jotai";
import { currentUserAtom, updateUserProfileAtom, changePasswordAtom } from "../../store/usersStore";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [currentUser] = useAtom(currentUserAtom);
  const [, updateUserProfile] = useAtom(updateUserProfileAtom);
  const [, changePassword] = useAtom(changePasswordAtom);

  // 🔹 Pré-remplissage des champs avec les valeurs actuelles
  const [editedUser, setEditedUser] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Remplir les valeurs des champs au chargement du composant
  useEffect(() => {
    if (currentUser) {
      setEditedUser({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  // 🔹 Mise à jour du profil utilisateur
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(editedUser);
      alert("✅ Profil mis à jour !");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil :", error);
      alert("❌ Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Changement de mot de passe
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      if (!passwords.oldPassword || !passwords.newPassword) {
        alert("❌ Veuillez remplir tous les champs.");
        return;
      }

      await changePassword(passwords);
      alert("✅ Mot de passe mis à jour !");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error("❌ Erreur lors du changement de mot de passe :", error);
      alert("❌ Impossible de changer le mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full flex flex-col gap-4 mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">⚙️ Paramètres Admin</h1>

      {/* 🔹 Section Profil */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">📝 Modifier votre profil</h2>
        
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-gray-700 font-medium">Prénom</span>
            <input
              type="text"
              value={editedUser.firstName}
              onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium">Nom</span>
            <input
              type="text"
              value={editedUser.lastName}
              onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition text-white font-medium ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sauvegarde..." : "💾 Sauvegarder"}
          </button>
        </div>
      </div>

      {/* 🔹 Section Mot de Passe */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">🔑 Modifier votre mot de passe</h2>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-gray-700 font-medium">Ancien mot de passe</span>
            <input
              type="password"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 font-medium">Nouveau mot de passe</span>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </label>

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition text-white font-medium ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Modification..." : "🔒 Modifier le mot de passe"}
          </button>
        </div>
      </div>
    </div>
  );
}
