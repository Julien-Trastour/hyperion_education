import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  cyclesAtom, fetchCyclesAtom,
  classesAtom, fetchClassesAtom, selectedCycleAtom, selectedClassAtom,
  subjectsAtom, fetchSubjectsAtom, selectedSubjectAtom,
  categoriesAtom, fetchCategoriesAtom, selectedCategoryAtom,
  themesAtom, fetchThemesAtom, selectedThemeAtom
} from "../../store/coursesStore";
import { addPathwayAtom } from "../../store/pathwaysStore";
import { Theme, Subject, Category } from "../../types/courses";

export default function AddPathwayForm({ setIsAddingPathway }: { setIsAddingPathway: (val: boolean) => void }) {
  const [, fetchCycles] = useAtom(fetchCyclesAtom);
  const [, fetchClasses] = useAtom(fetchClassesAtom);
  const [, fetchSubjects] = useAtom(fetchSubjectsAtom);
  const [, fetchCategories] = useAtom(fetchCategoriesAtom);
  const [, fetchThemes] = useAtom(fetchThemesAtom);

  const [cycles] = useAtom(cyclesAtom);
  const [classes] = useAtom(classesAtom);
  const [subjects] = useAtom(subjectsAtom);
  const [categories] = useAtom(categoriesAtom);
  const [themes] = useAtom(themesAtom);

  const [selectedCycle, setSelectedCycle] = useAtom(selectedCycleAtom);
  const [selectedClass, setSelectedClass] = useAtom(selectedClassAtom);
  const [selectedSubject, setSelectedSubject] = useAtom(selectedSubjectAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);

  const [, addPathway] = useAtom(addPathwayAtom);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    themeId: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Charger les cycles au montage
  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  // 🔹 Charger les classes quand un cycle est sélectionné
  useEffect(() => {
    if (selectedCycle) fetchClasses();
  }, [selectedCycle, fetchClasses]);

  // 🔹 Charger les matières quand une classe est sélectionnée
  useEffect(() => {
    if (selectedClass) fetchSubjects();
  }, [selectedClass, fetchSubjects]);

  // 🔹 Charger les catégories quand une matière est sélectionnée
  useEffect(() => {
    if (selectedSubject) fetchCategories();
  }, [selectedSubject, fetchCategories]);

  // 🔹 Charger les thèmes quand une catégorie est sélectionnée
  useEffect(() => {
    if (selectedCategory) fetchThemes();
  }, [selectedCategory, fetchThemes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedPathway = {
        title: formData.name,
        description: formData.description,
        themeId: selectedTheme || formData.themeId,
        order: 1,
      };

      await addPathway(formattedPathway);
      alert("✅ Parcours ajouté avec succès !");
      setIsAddingPathway(false);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du parcours :", error);
      alert("❌ Impossible d'ajouter le parcours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">➕ Ajouter un parcours</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 🔹 Nom du parcours */}
        <label>
          <span className="text-gray-700 font-medium">Nom du parcours</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* 🔹 Description du parcours */}
        <label>
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* 🔹 Sélection du cycle */}
        <label>
          <span className="text-gray-700 font-medium">Cycle</span>
          <select
            value={selectedCycle || ""}
            onChange={(e) => setSelectedCycle(e.target.value || null)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un cycle</option>
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.cycleName}
              </option>
            ))}
          </select>
        </label>

        {/* 🔹 Sélection de la classe */}
        <label>
          <span className="text-gray-700 font-medium">Classe</span>
          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>
        </label>

        {/* 🔹 Sélection de la matière */}
        <label>
          <span className="text-gray-700 font-medium">Matière</span>
          <select
            value={selectedSubject || ""}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une matière</option>
            {subjects.map((subject: Subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </label>

        {/* 🔹 Sélection de la catégorie */}
        <label>
          <span className="text-gray-700 font-medium">Catégorie</span>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories[selectedSubject!]?.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </label>

        {/* 🔹 Sélection du thème */}
        <label>
          <span className="text-gray-700 font-medium">Thème</span>
          <select
            name="themeId"
            value={selectedTheme || formData.themeId}
            onChange={(e) => setSelectedTheme(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner un thème</option>
            {themes[selectedCategory!]?.map((theme: Theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.themeName}
              </option>
            ))}
          </select>
        </label>

        {/* 🔹 Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => setIsAddingPathway(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
            Annuler
          </button>

          <button type="submit" disabled={loading} className={`px-4 py-2 rounded-lg transition text-white font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
