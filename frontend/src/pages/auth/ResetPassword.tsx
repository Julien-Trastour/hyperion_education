import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la réinitialisation");
      }

      setMessage("Un email de réinitialisation a été envoyé !");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800">🔑 Mot de passe oublié ?</h1>
        <p className="mt-2 text-center text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>

        {/* Affichage des erreurs / messages */}
        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-green-600">{message}</p>}

        <form onSubmit={handleResetPassword} className="mt-6 pb-4 space-y-6">
          {/* Champ Email */}
          <div className="pb-6">
            <label className="pb-4 pt-4 block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="exemple@mail.com"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 pr-10"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Bouton Envoyer */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : <><Send size={20} /> <span>Envoyer un lien</span></>}
          </button>
        </form>

        {/* Retour à la connexion */}
        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="text-blue-500 hover:underline">Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
}
