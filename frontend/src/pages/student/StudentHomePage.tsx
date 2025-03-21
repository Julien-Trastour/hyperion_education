import { useAtom } from "jotai";
import { authAtom } from "../../store/authAtom";

export default function StudentHomePage() {
  const [auth] = useAtom(authAtom);

  const firstName = auth?.user?.firstName ?? "Inconnu";
  const classLevel = auth?.user?.classLevel ?? "Non renseignée";

  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">
        👋 Bonjour {firstName}
      </h1>
      <div className="text-right text-gray-600">
        <p className="text-sm font-medium">Classe actuelle :</p>
        <p className="text-lg font-semibold text-blue-600">{classLevel}</p>
      </div>
    </div>
  );
}

