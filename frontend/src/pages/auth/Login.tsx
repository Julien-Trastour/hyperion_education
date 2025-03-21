import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAtom } from "jotai";
import { login } from "../../services/authService";
import { authAtom } from "../../store/authAtom";

export default function Login() {
  const [, setAuth] = useAtom(authAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(email, password);

      setAuth({ token: data.token, role: data.user.role, user: data.user });

      navigate(
        ["SUPER_ADMIN", "ADMIN", "RESPONSABLE_PEDAGOGIQUE"].includes(data.user.role)
          ? "/admin"
          : "/student"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-gray-800">Bienvenue 👋</h1>
        <p className="mt-2 text-center text-gray-600">Connecte-toi pour continuer.</p>

        {error && <p className="mt-2 text-center text-red-600">{error}</p>}

        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          {/* Email */}
          <div>
            <label className="pb-4 pt-4 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="exemple@mail.com"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-gray-800"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="pb-4 pt-4 block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 pr-10 text-gray-800"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-2 text-right text-sm">
              <a href="/reset-password" className="text-blue-500 hover:underline">Mot de passe oublié ?</a>
            </p>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              "Connexion..."
            ) : (
              <>
                <LogIn size={20} />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* Liens supplémentaires */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-blue-500 hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}
