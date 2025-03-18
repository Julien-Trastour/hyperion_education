import { atom } from "jotai";
import { Cycle, Class, Subject, Category, Theme } from "../types/courses";
import { 
  fetchCycles, fetchClassesByCycle, fetchSubjectsByClass, createSubject, updateSubject, deleteSubject,
  fetchCategoriesBySubject, createCategory, updateCategory, deleteCategory,
  fetchThemesByCategory, createTheme, updateTheme, deleteTheme
} from "../api/courses";

// 🔹 Atoms pour les cycles et classes
export const cyclesAtom = atom<Cycle[]>([]);
export const selectedCycleAtom = atom<string | null>(null);
export const classesAtom = atom<Class[]>([]);
export const selectedClassAtom = atom<string | null>(null);

// 🔹 Atoms pour les matières et catégories
export const subjectsAtom = atom<Subject[]>([]);
export const selectedSubjectAtom = atom<string | null>(null);
export const categoriesAtom = atom<{ [subjectId: string]: Category[] }>({});
export const selectedCategoryAtom = atom<string | null>(null);

// 🔹 Atoms pour la gestion des ajouts
export const isAddingSubjectAtom = atom(false);
export const newSubjectNameAtom = atom("");
export const isAddingCategoryAtom = atom<{ [subjectId: string]: boolean }>({});
export const newCategoryNameAtom = atom<{ [subjectId: string]: string }>({});

// 🔹 Atoms pour les thèmes
export const themesAtom = atom<{ [categoryId: string]: Theme[] }>({});
export const selectedThemeAtom = atom<string | null>(null);
export const isAddingThemeAtom = atom<{ [categoryId: string]: boolean }>({});
export const newThemeNameAtom = atom<{ [categoryId: string]: string }>({});

// 🔹 Fonctions pour charger les données
export const fetchCyclesAtom = atom(null, async (_, set) => {
    const data = await fetchCycles();
    set(cyclesAtom, data);
  });
  
  export const fetchClassesAtom = atom(null, async (get, set) => {
    const selectedCycle = get(selectedCycleAtom);
    if (selectedCycle) {
      const data = await fetchClassesByCycle(selectedCycle);
      set(classesAtom, data);
    } else {
      set(classesAtom, []);
    }
  });
  
  export const fetchSubjectsAtom = atom(null, async (get, set) => {
    const selectedClass = get(selectedClassAtom);
    if (selectedClass) {
      const data = await fetchSubjectsByClass(selectedClass);
      set(subjectsAtom, data);
    } else {
      set(subjectsAtom, []);
    }
  });
  
  export const fetchCategoriesAtom = atom(null, async (get, set) => {
    const selectedSubject = get(selectedSubjectAtom);
    if (selectedSubject) {
      const data = await fetchCategoriesBySubject(selectedSubject);
      set(categoriesAtom, (prev) => ({ ...prev, [selectedSubject]: data }));
    }
  });
  
  export const fetchThemesAtom = atom(null, async (get, set) => {
    const selectedCategory = get(selectedCategoryAtom);
    if (selectedCategory) {
      const data = await fetchThemesByCategory(selectedCategory);
      set(themesAtom, (prev) => ({ ...prev, [selectedCategory]: data }));
    }
  });

  // Fonctions de création de données
  export const addSubjectAtom = atom(null, async (get, set) => {
    const selectedClass = get(selectedClassAtom);
    const newSubjectName = get(newSubjectNameAtom).trim();
    if (selectedClass && newSubjectName) {
      const newSubject = await createSubject(selectedClass, newSubjectName);
      set(subjectsAtom, (prev) => [...prev, newSubject]);
      set(newSubjectNameAtom, "");
      set(isAddingSubjectAtom, false);
    }
  });
  
  export const addCategoryAtom = atom(null, async (get, set, subjectId: string) => {
    const newCategoryName = get(newCategoryNameAtom)[subjectId]?.trim();
    if (newCategoryName) {
      const newCategory = await createCategory(subjectId, newCategoryName);
      set(categoriesAtom, (prev) => ({
        ...prev,
        [subjectId]: [...(prev[subjectId] || []), newCategory],
      }));
      set(newCategoryNameAtom, (prev) => ({ ...prev, [subjectId]: "" }));
      set(isAddingCategoryAtom, (prev) => ({ ...prev, [subjectId]: false }));
    }
  });
  
  export const addThemeAtom = atom(null, async (get, set, categoryId: string) => {
    const newThemeName = get(newThemeNameAtom)[categoryId]?.trim();
    if (newThemeName) {
      const newTheme = await createTheme(categoryId, newThemeName);
      set(themesAtom, (prev) => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), newTheme],
      }));
      set(newThemeNameAtom, (prev) => ({ ...prev, [categoryId]: "" }));
      set(isAddingThemeAtom, (prev) => ({ ...prev, [categoryId]: false }));
    }
  });

  // Fonctions de modification de données
  export const editSubjectAtom = atom(null, async (_, set, subjectId: string, newName: string) => {
    try {
      const updatedSubject = await updateSubject(subjectId, newName);
      set(subjectsAtom, (prev) =>
        prev.map((subject) => (subject.id === subjectId ? updatedSubject : subject))
      );
    } catch (error) {
      console.error("❌ Erreur lors de la modification de la matière :", error);
    }
  });  
  
  export const editCategoryAtom = atom(null, async (get, set, categoryId: string, newName: string) => {
    try {
      const selectedSubject = get(selectedSubjectAtom);
  
      if (!selectedSubject) {
        console.warn("❌ Impossible de modifier la catégorie : aucun sujet sélectionné.");
        return;
      }
  
      const updatedCategory = await updateCategory(categoryId, newName);
  
      set(categoriesAtom, (prev) => ({
        ...prev,
        [selectedSubject]: prev[selectedSubject]?.map((category: Category) =>
          category.id === categoryId ? updatedCategory : category
        ) || [],
      }));
    } catch (error) {
      console.error("❌ Erreur lors de la modification de la catégorie :", error);
    }
  });  
  
  export const editThemeAtom = atom(null, async (get, set, themeId: string, newName: string) => {
    try {
      const selectedCategory = get(selectedCategoryAtom);
  
      if (!selectedCategory) {
        console.warn("❌ Impossible de modifier le thème : aucune catégorie sélectionnée.");
        return;
      }
  
      const updatedTheme = await updateTheme(themeId, newName);
  
      set(themesAtom, (prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory]?.map((theme: Theme) =>
          theme.id === themeId ? updatedTheme : theme
        ) || [],
      }));
    } catch (error) {
      console.error("❌ Erreur lors de la modification du thème :", error);
    }
  });  

  // Fonctions de suppression d'éléments
  export const deleteSubjectAtom = atom(null, async (_, set, subjectId: string) => {
    try {
      await deleteSubject(subjectId);
      set(subjectsAtom, (prev) => prev.filter((subject) => subject.id !== subjectId));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de la matière :", error);
    }
  });
  
  export const deleteCategoryAtom = atom(null, async (get, set, categoryId: string) => {
    try {
      const selectedSubject = get(selectedSubjectAtom);
  
      if (!selectedSubject) {
        console.warn("❌ Impossible de supprimer la catégorie : aucun sujet sélectionné.");
        return;
      }
  
      await deleteCategory(categoryId);
  
      set(categoriesAtom, (prev) => ({
        ...prev,
        [selectedSubject]: prev[selectedSubject]?.filter(
          (category: Category) => category.id !== categoryId
        ) || [],
      }));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de la catégorie :", error);
    }
  });  
  
  export const deleteThemeAtom = atom(null, async (get, set, themeId: string) => {
    try {
      const selectedCategory = get(selectedCategoryAtom);
  
      if (!selectedCategory) {
        console.warn("❌ Impossible de supprimer le thème : aucune catégorie sélectionnée.");
        return;
      }
  
      await deleteTheme(themeId);
  
      set(themesAtom, (prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory]?.filter(
          (theme: Theme) => theme.id !== themeId
        ) || [],
      }));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du thème :", error);
    }
  });   
