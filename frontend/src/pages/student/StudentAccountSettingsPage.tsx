import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { authAtom } from "../../store/authAtom";
import { classLevelsAtom, fetchClassesAtom } from "../../store/usersStore";
import { updateStudentProfile } from "../../services/userService";
import { setAuthData } from "../../utils/auth";

export default function StudentAccountSettingsPage() {
  const [auth, setAuth] = useAtom(authAtom);
  const user = auth.user;

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    classLevel: user?.classLevel || "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classLevels] = useAtom(classLevelsAtom);
  const [, fetchClasses] = useAtom(fetchClassesAtom);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    if (formData.password && !window.confirm("Voulez-vous vraiment changer votre mot de passe ?")) {
      setIsLoading(false);
      return;
    }

    try {
      const updatedUser = await updateStudentProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        classLevel: formData.classLevel,
        password: formData.password,
      });

      setMessage("Profil mis à jour avec succès !");

      setAuth((prev) => {
        const newAuth = {
          ...prev,
          user: { ...prev.user, ...updatedUser },
        };

        if (newAuth.token && newAuth.role && newAuth.user) {
          setAuthData(newAuth.token, newAuth.role, newAuth.user);
        }

        return newAuth;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Paramètres du compte</h1>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg text-gray-700"
            />
          </div>

          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Classe</label>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg text-gray-700"
            >
              <option value="">Sélectionner une classe</option>
              {classLevels.map((classLevel) => (
                <option key={classLevel} value={classLevel}>
                  {classLevel}
                </option>
              ))}
            </select>
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
              className="w-full border px-4 py-2 rounded-lg text-gray-700"
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
              className="w-full border px-4 py-2 rounded-lg text-gray-700"
            />
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </form>

        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-green-600">{message}</p>}
      </div>
    </div>
  );
}
