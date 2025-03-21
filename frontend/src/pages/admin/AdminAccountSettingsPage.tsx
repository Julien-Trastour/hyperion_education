import { useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "../../store/authAtom";
import { updateAdminProfile } from "../../services/userService";

export default function AdminAccountSettingsPage() {
  const [auth, setAuth] = useAtom(authAtom);

  // ✅ Vérification que `auth.user` n'est pas `null`
  const initialUser = auth.user
    ? { firstName: auth.user.firstName, lastName: auth.user.lastName, email: auth.user.email }
    : { firstName: "", lastName: "", email: "" };

  const [formData, setFormData] = useState({
    firstName: initialUser.firstName,
    lastName: initialUser.lastName,
    email: initialUser.email,
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Gérer les changements dans les inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }
  
    // ✅ Ajout d'une confirmation avant modification du mot de passe
    if (formData.password && !window.confirm("Voulez-vous vraiment changer votre mot de passe ?")) {
      setIsLoading(false);
      return;
    }
  
    try {
      const updatedUser = await updateAdminProfile(formData);
      setMessage("Profil mis à jour avec succès !");
      
      // ✅ Mise à jour de `authAtom` avec les nouvelles informations
      setAuth((prev) => ({
        ...prev,
        user: { ...prev.user, ...updatedUser },
      }));
  
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };    

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800">⚙️ Paramètres du compte</h1>
        <p className="mt-2 text-center text-gray-600">Modifiez vos informations administratives</p>

        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 flex flex-col gap-4">
          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
            />
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Laissez vide pour ne pas changer"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
            />
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmez votre nouveau mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
            />
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
