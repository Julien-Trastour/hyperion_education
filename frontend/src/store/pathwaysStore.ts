import { atom } from "jotai";
import { Pathway } from "../types/pathway";

// ✅ Atom contenant tous les parcours enrichis (avec thème)
export const allPathwaysAtom = atom<Pathway[]>([]);

// ✅ Atom pour les charger depuis l'API
export const fetchAllPathwaysAtom = atom(null, async (_, set) => {
  const token = sessionStorage.getItem("token");
  const response = await fetch("/api/pathways", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Erreur lors du chargement des parcours.");

  const data = await response.json();

  set(allPathwaysAtom, data);
});
