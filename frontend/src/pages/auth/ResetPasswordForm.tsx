import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { resetPassword } from "../../services/authService";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Le lien de réinitialisation est invalide ou expiré.");
    }
  }, [token]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (!token) {
      setError("Le lien de réinitialisation est invalide.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsLoading(false);
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      const responseMessage = await resetPassword(token, newPassword);
      setMessage(responseMessage);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800">🔒 Réinitialisation du mot de passe</h1>
        <p className="mt-2 text-center text-gray-600">Saisis ton nouveau mot de passe.</p>

        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-green-600">{message}</p>}

        <form onSubmit={handlePasswordReset} className="mt-6 space-y-6">
          {/* Champ Nouveau Mot de Passe */}
          <div>
            <label className="pb-4 pt-4 block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 pr-10 text-gray-800"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Champ Confirmation Mot de Passe */}
          <div className="pb-6">
            <label className="pb-4 pt-4 block text-sm font-medium text-gray-700">Confirme le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 pr-10 text-gray-800"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              "Réinitialisation..."
            ) : (
              <>
                <RefreshCw size={20} />
                <span>Réinitialiser</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
