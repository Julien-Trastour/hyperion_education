// ✅ Jotai store pour la gestion des cours
import { atom } from "jotai";

import type { Cycle, Class, Subject, Category, Theme } from "../types/courses";

// ✅ Cycles
export const cyclesAtom = atom<Cycle[]>([]);
export const selectedCycleAtom = atom<string | null>(null);
export const fetchCyclesAtom = atom(null, async (_, set) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch("/api/pathways/cycles", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  set(cyclesAtom, data);
});

// ✅ Classes
export const classesAtom = atom<Class[]>([]);
export const selectedClassAtom = atom<string | null>(null);
export const fetchClassesAtom = atom(null, async (get, set) => {
  const selectedCycle = get(selectedCycleAtom);
  if (!selectedCycle) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/classes/${selectedCycle}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  set(classesAtom, data);
});

/* =========================================================================
                    Atoms pour les Subjects
========================================================================= */

// ✅ Liste des matières pour une classe
export const subjectsAtom = atom<Subject[]>([]);

// ✅ ID de la matière sélectionnée
export const selectedSubjectAtom = atom<string | null>(null);

// ✅ Nom d'une nouvelle matière (formulaire)
export const newSubjectNameAtom = atom<string>("");

// ✅ Booléen : est-ce qu'on est en train d'ajouter une matière
export const isAddingSubjectAtom = atom<boolean>(false);

// ✅ Charger les matières pour une classe sélectionnée
export const fetchSubjectsAtom = atom(null, async (get, set) => {
  const selectedClass = get(selectedClassAtom);
  if (!selectedClass) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/subjects/${selectedClass}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  set(subjectsAtom, data);
});

// ✅ Ajouter une matière
export const addSubjectAtom = atom(null, async (get, set) => {
  const selectedClass = get(selectedClassAtom);
  const subjectName = get(newSubjectNameAtom);
  if (!selectedClass || !subjectName) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/subjects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ classId: selectedClass, subjectName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout de la matière.");
  }

  const newSubject = await response.json();
  set(subjectsAtom, [...get(subjectsAtom), newSubject]);
  set(newSubjectNameAtom, "");
  set(isAddingSubjectAtom, false);
});

// ✅ Modifier une matière
export const editSubjectAtom = atom(null, async (_, set, { id, subjectName }: { id: string; subjectName: string }) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/subjects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subjectName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de la matière.");
  }

  const updated = await response.json();
  set(subjectsAtom, (subjects) =>
    subjects.map((subject) => (subject.id === id ? updated : subject))
  );
});

// ✅ Supprimer une matière
export const deleteSubjectAtom = atom(null, async (_, set, id: string) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/subjects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la matière.");
  }

  set(subjectsAtom, (subjects) => subjects.filter((subject) => subject.id !== id));
});

/* =========================================================================
                    Atoms pour les Categories
========================================================================= */

// ✅ Liste des catégories indexées par ID de matière
export const categoriesAtom = atom<{ [subjectId: string]: Category[] }>({});

// ✅ ID de la catégorie sélectionnée
export const selectedCategoryAtom = atom<string | null>(null);

// ✅ Booléens par matière pour savoir si on est en mode ajout
export const isAddingCategoryAtom = atom<{ [subjectId: string]: boolean }>({});

// ✅ Nom de la nouvelle catégorie à ajouter par matière
export const newCategoryNameAtom = atom<{ [subjectId: string]: string }>({});

// ✅ Récupérer les catégories d'une matière
export const fetchCategoriesAtom = atom(null, async (get, set) => {
  const selectedSubject = get(selectedSubjectAtom);
  if (!selectedSubject) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/categories/${selectedSubject}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  set(categoriesAtom, (prev) => ({ ...prev, [selectedSubject]: data }));
});

// ✅ Ajouter une catégorie à une matière
export const addCategoryAtom = atom(null, async (get, set, subjectId: string) => {
  const name = get(newCategoryNameAtom)[subjectId];
  if (!name) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subjectId, categoryName: name }),
  });

  if (!response.ok) throw new Error("Erreur lors de l'ajout de la catégorie");

  const newCategory = await response.json();
  set(categoriesAtom, (prev) => ({
    ...prev,
    [subjectId]: [...(prev[subjectId] || []), newCategory],
  }));

  set(newCategoryNameAtom, (prev) => ({ ...prev, [subjectId]: "" }));
  set(isAddingCategoryAtom, (prev) => ({ ...prev, [subjectId]: false }));
});

// ✅ Modifier une catégorie
export const editCategoryAtom = atom(null, async (_, set, { id, categoryName }: { id: string; categoryName: string }) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryName }),
  });

  if (!response.ok) throw new Error("Erreur lors de la modification de la catégorie");

  const updatedCategory = await response.json();

  set(categoriesAtom, (prev) => {
    const updated = { ...prev };
    for (const subjectId in updated) {
      updated[subjectId] = updated[subjectId].map((cat) =>
        cat.id === id ? updatedCategory : cat
      );
    }
    return updated;
  });
});

// ✅ Supprimer une catégorie
export const deleteCategoryAtom = atom(null, async (_, set, id: string) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Erreur lors de la suppression de la catégorie");

  set(categoriesAtom, (prev) => {
    const updated = { ...prev };
    for (const subjectId in updated) {
      updated[subjectId] = updated[subjectId].filter((cat) => cat.id !== id);
    }
    return updated;
  });
});

/* =========================================================================
                    Atoms pour les Themes
========================================================================= */

// ✅ Themes indexés par ID de catégorie
export const themesAtom = atom<{ [categoryId: string]: Theme[] }>({});

// ✅ ID du thème sélectionné
export const selectedThemeAtom = atom<string | null>(null);

// ✅ Booléens par catégorie pour savoir si on est en mode ajout
export const isAddingThemeAtom = atom<{ [categoryId: string]: boolean }>({});

// ✅ Nom du nouveau thème à ajouter par catégorie
export const newThemeNameAtom = atom<{ [categoryId: string]: string }>({});

// ✅ Récupérer les thèmes d'une catégorie
export const fetchThemesAtom = atom(null, async (get, set) => {
  const selectedCategory = get(selectedCategoryAtom);
  if (!selectedCategory) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/themes/${selectedCategory}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  set(themesAtom, (prev) => ({ ...prev, [selectedCategory]: data }));
});

// ✅ Ajouter un thème à une catégorie
export const addThemeAtom = atom(null, async (get, set, categoryId: string) => {
  const name = get(newThemeNameAtom)[categoryId];
  if (!name) return;

  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/themes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, themeName: name }),
  });

  if (!response.ok) throw new Error("Erreur lors de l'ajout du thème");

  const newTheme = await response.json();
  set(themesAtom, (prev) => ({
    ...prev,
    [categoryId]: [...(prev[categoryId] || []), newTheme],
  }));

  set(newThemeNameAtom, (prev) => ({ ...prev, [categoryId]: "" }));
  set(isAddingThemeAtom, (prev) => ({ ...prev, [categoryId]: false }));
});

// ✅ Modifier un thème
export const editThemeAtom = atom(null, async (_, set, { id, themeName }: { id: string; themeName: string }) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/themes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ themeName }),
  });

  if (!response.ok) throw new Error("Erreur lors de la modification du thème");

  const updatedTheme = await response.json();

  set(themesAtom, (prev) => {
    const updated = { ...prev };
    for (const categoryId in updated) {
      updated[categoryId] = updated[categoryId].map((theme) =>
        theme.id === id ? updatedTheme : theme
      );
    }
    return updated;
  });
});

// ✅ Supprimer un thème
export const deleteThemeAtom = atom(null, async (_, set, id: string) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`/api/pathways/themes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Erreur lors de la suppression du thème");

  set(themesAtom, (prev) => {
    const updated = { ...prev };
    for (const categoryId in updated) {
      updated[categoryId] = updated[categoryId].filter((theme) => theme.id !== id);
    }
    return updated;
  });
});
