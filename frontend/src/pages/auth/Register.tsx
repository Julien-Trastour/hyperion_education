import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Gestion des changements dans les champs (sauf date)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion spécifique de la date de naissance pour éviter "Invalid Date"
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = new Date(e.target.value).toISOString().split("T")[0];
    setFormData({ ...formData, birthDate: formattedDate });
  };

  // Envoi du formulaire
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const formattedDate = new Date(formData.birthDate).toISOString().split("T")[0];

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, birthDate: formattedDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Inscription échouée.");
      }

      setMessage("Compte créé avec succès ! Redirection...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-gray-800">Inscription ✨</h1>
        <p className="mt-2 text-center text-gray-600">Rejoins-nous dès maintenant !</p>

        {/* Affichage des erreurs et messages */}
        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-green-600">{message}</p>}

        <form onSubmit={handleRegister} className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              placeholder="Jean"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="lastName"
              placeholder="Dupont"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              name="birthDate"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
              onChange={handleBirthDateChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="exemple@mail.com"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
              onChange={handleChange}
            />
          </div>

          <div className="pb-6">
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 pr-10 text-gray-800"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 p-3 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              "Inscription..."
            ) : (
              <>
                <UserPlus size={20} />
                <span>S'inscrire</span>
              </>
            )}
          </button>
        </form>

        {/* Lien vers la connexion */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Connecte-toi ici
          </a>
        </p>
      </div>
    </div>
  );
}
