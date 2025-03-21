import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import {
  cyclesAtom, selectedCycleAtom, fetchCyclesAtom,
  classesAtom, selectedClassAtom, fetchClassesAtom,
  subjectsAtom, selectedSubjectAtom, fetchSubjectsAtom,
  selectedThemeAtom
} from "../../store/coursesStore";
import {
  allPathwaysAtom,
  fetchAllPathwaysAtom
} from "../../store/pathwaysStore";

export default function AdminManagePathways() {
  const navigate = useNavigate();

  const [, fetchCycles] = useAtom(fetchCyclesAtom);
  const [, fetchClasses] = useAtom(fetchClassesAtom);
  const [, fetchSubjects] = useAtom(fetchSubjectsAtom);
  const [, fetchAllPathways] = useAtom(fetchAllPathwaysAtom);

  const [cycles] = useAtom(cyclesAtom);
  const [selectedCycle, setSelectedCycle] = useAtom(selectedCycleAtom);
  const [classes] = useAtom(classesAtom);
  const [selectedClass, setSelectedClass] = useAtom(selectedClassAtom);
  const [subjects] = useAtom(subjectsAtom);
  const [selectedSubject, setSelectedSubject] = useAtom(selectedSubjectAtom);
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);
  const [pathways] = useAtom(allPathwaysAtom);

  // 🔁 Initialisation
  useEffect(() => {
    fetchCycles();
    fetchAllPathways();
  }, [fetchCycles, fetchAllPathways]);

  useEffect(() => {
    if (selectedCycle) fetchClasses();
  }, [selectedCycle, fetchClasses]);

  useEffect(() => {
    if (selectedClass) fetchSubjects();
  }, [selectedClass, fetchSubjects]);

  useEffect(() => {
    if (pathways.length > 0) {
    }
  }, [pathways]);  

  // ✅ Extraire les thèmes uniques en fonction du subject sélectionné
  const uniqueThemes = useMemo(() => {
    return Array.from(
      new Map(
        pathways
          .filter(
            (p) =>
              p.theme &&
              p.theme.category?.subjectId === selectedSubject
          )
          .map((p) => [p.theme!.id, p.theme!])
      ).values()
    );
  }, [pathways, selectedSubject]);  

  // ✅ Filtrer les parcours par thème sélectionné
  const filteredPathways = selectedTheme
    ? pathways.filter((p) => p.themeId === selectedTheme)
    : [];

  return (
    <div className="p-8 w-full mx-auto bg-white shadow-md rounded-lg flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Gestion des parcours</h1>

      {/* Filtres hiérarchiques */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCycle || ""}
          onChange={(e) => setSelectedCycle(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">Cycle</option>
          {cycles.map((cycle) => (
            <option key={cycle.id} value={cycle.id}>{cycle.cycleName}</option>
          ))}
        </select>

        {selectedCycle && (
          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Classe</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.className}</option>
            ))}
          </select>
        )}

        {selectedClass && (
          <select
            value={selectedSubject || ""}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Matière</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.subjectName}</option>
            ))}
          </select>
        )}

        {selectedSubject && (
          <select
            value={selectedTheme || ""}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Thème</option>
            {uniqueThemes.map((t) => (
              <option key={t.id} value={t.id}>{t.themeName}</option>
            ))}
          </select>
        )}
      </div>

      {/* Affichage des parcours filtrés */}
      <div className="space-y-4">
        {filteredPathways.length === 0 ? (
          <p className="text-center text-gray-500">Aucun parcours trouvé pour ce thème.</p>
        ) : (
          filteredPathways.map((pathway) => (
            <div
              key={pathway.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{pathway.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{pathway.description || "Pas de description"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Thème : {pathway.theme?.themeName || "Inconnu"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/admin/edit-pathway/${pathway.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ✏️ Modifier le contenu
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
