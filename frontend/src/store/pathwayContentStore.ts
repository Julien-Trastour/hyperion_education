import { atom } from "jotai";
import { Lesson, PathwayExercise } from "../types/pathway";

// 🔹 Contenu en cours d'édition
export const currentLessonsAtom = atom<Lesson[]>([]);
export const currentExercisesAtom = atom<PathwayExercise[]>([]);
export const currentPathwayTitleAtom = atom<string>("");

// ✅ Atom pour charger un parcours complet (leçons, exercices, titre)
export const fetchPathwayContentAtom = atom(
  null,
  async (_, set, pathwayId: string) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`/api/pathways/${pathwayId}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors du chargement du contenu du parcours.");
    }

    const data = await response.json();
    set(currentLessonsAtom, data.lessons || []);
    set(currentExercisesAtom, data.exercises || []);
    set(currentPathwayTitleAtom, data.title || "");
  }
);

// ✅ Atom pour sauvegarder un parcours complet
export const updatePathwayContentAtom = atom(
  null,
  async (get, _, pathwayId: string) => {
    const token = sessionStorage.getItem("token");

    const payload = {
      title: get(currentPathwayTitleAtom),
      lessons: get(currentLessonsAtom),
      exercises: get(currentExercisesAtom),
    };

    const response = await fetch(`/api/pathways/${pathwayId}/content`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du contenu du parcours.");
    }
  }
);
