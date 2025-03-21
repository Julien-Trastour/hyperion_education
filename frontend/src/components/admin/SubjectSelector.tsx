import React from "react";
import type { Subject } from "../../types/courses";

interface Props {
  subjects: Subject[];
  selectedSubject: string | null;
  setSelectedSubject: (subjectId: string) => void;
  isAddingSubject: boolean;
  setIsAddingSubject: (value: boolean) => void;
  newSubjectName: string;
  setNewSubjectName: (name: string) => void;
  addSubject: () => void;
  editSubject: (subjectId: string, newName: string) => void;
  deleteSubject: (subjectId: string) => void;
}

const SubjectSelector: React.FC<Props> = ({
  subjects,
  selectedSubject,
  setSelectedSubject,
  isAddingSubject,
  setIsAddingSubject,
  newSubjectName,
  setNewSubjectName,
  addSubject,
  editSubject,
  deleteSubject,
}) => {
  return (
    <div className="mb-6 bg-gray-50 border border-gray-300 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700 border-l-4 border-purple-500 pl-3">
          Matières
        </h2>

        {isAddingSubject ? (
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-lg shadow-md transition w-1/2">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="border rounded-lg px-3 py-1 flex-1"
              placeholder="Nom de la matière"
            />
            <button
              onClick={addSubject}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              ✅
            </button>
            <button
              onClick={() => setIsAddingSubject(false)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ❌
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingSubject(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Ajouter
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow"
          >
            <button
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium ${
                selectedSubject === subject.id
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedSubject(subject.id)}
            >
              {subject.subjectName}
            </button>
            <button
              onClick={() => {
                const newName = prompt("Nouveau nom de la matière :", subject.subjectName);
                if (newName) editSubject(subject.id, newName);
              }}
              className="text-yellow-600 hover:text-yellow-800 transition text-lg"
            >
              ✏️
            </button>
            <button
              onClick={() => {
                if (confirm("Voulez-vous vraiment supprimer cette matière ?")) {
                  deleteSubject(subject.id);
                }
              }}
              className="text-red-600 hover:text-red-800 transition text-lg"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
