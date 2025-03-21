import { Class } from "../../types/courses";

interface Props {
  classes: Class[];
  selectedClass: string | null;
  setSelectedClass: (classId: string) => void;
}

export default function ClassSelector({ classes, selectedClass, setSelectedClass }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Choisir une classe</h2>
      <div className="flex flex-wrap gap-3">
        {classes.map((classe) => (
          <button
            key={classe.id}
            onClick={() => setSelectedClass(classe.id)}
            className={`px-4 py-2 rounded ${
              selectedClass === classe.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {classe.className}
          </button>
        ))}
      </div>
    </div>
  );
}
