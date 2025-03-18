import { Cycle, Class, Subject, Category, Theme } from "../types/courses";

// Fonction pour récupérer les headers avec le token JWT
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// 🔹 Récupérer tous les cycles avec leurs classes associées
export const fetchCycles = async (): Promise<Cycle[]> => {
  const response = await fetch("/api/cycles", { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch cycles with classes");
  }

  return await response.json();
};

// 🔹 Récupérer les classes d’un cycle donné
export const fetchClassesByCycle = async (cycleId: string): Promise<Class[]> => {
  const response = await fetch(`/api/cycles/${cycleId}/classes`, { headers: getAuthHeaders() });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch classes: ${errorText}`);
  }

  return await response.json();
};

// 🔹 Récupérer les matières d’une classe donnée
export const fetchSubjectsByClass = async (classId: string): Promise<Subject[]> => {
  try {
    const response = await fetch(`/api/subjects/${classId}`, { headers: getAuthHeaders() });

    if (!response.ok) {
      throw new Error(`❌ Erreur API : ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des matières :", error);
    return [];
  }
};

// 🔹 Ajouter une matière
export const createSubject = async (classId: string, subjectName: string): Promise<Subject> => {
  const response = await fetch("/api/subjects", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ classId, subjectName }),
  });

  if (!response.ok) {
    throw new Error(`❌ Erreur API : ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

// 🔹 Modifier une matière
export const updateSubject = async (subjectId: string, subjectName: string): Promise<Subject> => {
  const response = await fetch(`/api/subjects/${subjectId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ subjectName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de la matière.");
  }

  return await response.json();
};

// 🔹 Supprimer une matière
export const deleteSubject = async (subjectId: string): Promise<void> => {
  const response = await fetch(`/api/subjects/${subjectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la matière.");
  }
};

// 🔹 Récupérer les catégories d’une matière donnée
export const fetchCategoriesBySubject = async (subjectId: string): Promise<Category[]> => {
  try {
    const response = await fetch(`/api/categories/${subjectId}`, { headers: getAuthHeaders() });

    if (!response.ok) {
      throw new Error(`❌ Erreur API : ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des catégories :", error);
    return [];
  }
};

// 🔹 Ajouter une catégorie
export const createCategory = async (subjectId: string, categoryName: string): Promise<Category> => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ subjectId, categoryName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la catégorie.");
  }

  return await response.json();
};

// 🔹 Modifier une catégorie
export const updateCategory = async (categoryId: string, categoryName: string): Promise<Category> => {
  const response = await fetch(`/api/categories/${categoryId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ categoryName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de la catégorie.");
  }

  return await response.json();
};

// 🔹 Supprimer une catégorie
export const deleteCategory = async (categoryId: string): Promise<void> => {
  const response = await fetch(`/api/categories/${categoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la catégorie.");
  }
};

// 🔹 Récupérer les thèmes d’une catégorie donnée
export const fetchThemesByCategory = async (categoryId: string): Promise<Theme[]> => {
  try {
    const response = await fetch(`/api/themes/${categoryId}`, { headers: getAuthHeaders() });

    if (!response.ok) {
      throw new Error(`❌ Erreur API : ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des thèmes :", error);
    return [];
  }
};

// 🔹 Ajouter un thème
export const createTheme = async (categoryId: string, themeName: string): Promise<Theme> => {
  const response = await fetch("/api/themes", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ categoryId, themeName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création du thème.");
  }

  return await response.json();
};

// 🔹 Modifier un thème
export const updateTheme = async (themeId: string, themeName: string): Promise<Theme> => {
  const response = await fetch(`/api/themes/${themeId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ themeName }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification du thème.");
  }

  return await response.json();
};

// 🔹 Supprimer un thème
export const deleteTheme = async (themeId: string): Promise<void> => {
  const response = await fetch(`/api/themes/${themeId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du thème.");
  }
};
