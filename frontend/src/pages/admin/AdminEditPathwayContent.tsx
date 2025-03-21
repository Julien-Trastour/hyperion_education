import { useEffect } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import {
  currentLessonsAtom,
  currentExercisesAtom,
  currentPathwayTitleAtom,
  fetchPathwayContentAtom,
  updatePathwayContentAtom,
} from "../../store/pathwayContentStore";
import { PlusCircle, Trash2 } from "lucide-react";
import { Lesson } from "../../types/pathway";

export default function AdminEditPathwayContent() {
  const { pathwayId } = useParams<{ pathwayId: string }>();

  const [, fetchPathwayContent] = useAtom(fetchPathwayContentAtom);
  const [, updatePathwayContent] = useAtom(updatePathwayContentAtom);

  const [lessons, setLessons] = useAtom(currentLessonsAtom);
  const [exercises] = useAtom(currentExercisesAtom);
  const [title] = useAtom(currentPathwayTitleAtom);

  useEffect(() => {
    if (pathwayId) fetchPathwayContent(pathwayId);
  }, [fetchPathwayContent, pathwayId]);

  const handleLessonChange = (index: number, key: keyof Lesson, value: string) => {
    setLessons((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "Nouvelle leçon",
        content: "",
        order: prev.length,
        pathwayId: pathwayId!,
      },
    ]);
  };

  const deleteLesson = (id: string) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
  };

  const handleSave = async () => {
    if (!pathwayId) return;
    await updatePathwayContent(pathwayId);
    alert("✅ Contenu mis à jour !");
  };

  return (
    <div className="p-8 w-full mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">📖 Modifier le parcours</h1>
      <h2 className="text-2xl font-semibold text-gray-700 text-center">{title}</h2>

      {/* 🔹 Leçons */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">📚 Leçons</h3>
          <button onClick={addLesson} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <PlusCircle size={20} />
            <span className="ml-2">Ajouter une leçon</span>
          </button>
        </div>

        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <div key={lesson.id} className="bg-gray-100 p-4 rounded-md shadow flex justify-between items-center">
                <input
                  type="text"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                  className="border px-3 py-2 w-full rounded-lg text-gray-700"
                />
                <button onClick={() => deleteLesson(lesson.id)} className="ml-3 text-red-600 hover:text-red-800">
                  <Trash2 size={24} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucune leçon disponible.</p>
          )}
        </div>
      </div>

      {/* 🔹 Exercices */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">📝 Exercices</h3>
        <div className="space-y-4">
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-100 p-4 rounded-md shadow">
                <span className="text-lg text-gray-700">📝 {exercise.exercise.title}</span>
                <p className="text-sm text-gray-500">Ordre : {exercise.order}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucun exercice disponible.</p>
          )}
        </div>
      </div>

      {/* 🔹 Enregistrement */}
      <div className="text-center mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
