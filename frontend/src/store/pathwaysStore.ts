import { atom } from "jotai";
import { getPathways, createPathway, updatePathway, deletePathway, getPathwayWithRelations } from "../api/pathways";
import { Pathway } from "../types/pathway";

// 🔹 Stockage des parcours
export const pathwaysAtom = atom<Pathway[]>([]);

// 🔹 Stockage des parcours avec relations complètes
export const pathwaysWithRelationsAtom = atom<Record<string, any>>({});

// 🔹 Chargement des parcours depuis l'API
export const fetchPathwaysAtom = atom(null, async (_, set) => {
  try {
    const pathways: Pathway[] = await getPathways();

    if (pathways.length === 0) {
      console.warn("⚠️ Le backend renvoie une liste vide !");
    }

    set(pathwaysAtom, pathways);

    // 🔹 Charger les relations complètes pour chaque parcours
    const relationsData: Record<string, any> = {};
    for (const pathway of pathways) {
      const fullData = await getPathwayWithRelations(pathway.id);
      relationsData[pathway.id] = fullData;
    }

    set(pathwaysWithRelationsAtom, relationsData);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des parcours :", error);
  }
});

// 🔹 Ajouter un parcours
export const addPathwayAtom = atom(
  null,
  async (_, set, newPathway: Omit<Pathway, "id">) => {
    try {
      const createdPathway = await createPathway({
        title: newPathway.title, 
        description: newPathway.description || "",
        themeId: newPathway.themeId, 
        order: newPathway.order ?? 0, 
      });

      set(pathwaysAtom, (prev) => [...prev, createdPathway]);

      // 🔹 Charger les relations complètes du nouveau parcours
      const fullData = await getPathwayWithRelations(createdPathway.id);
      set(pathwaysWithRelationsAtom, (prev) => ({ ...prev, [createdPathway.id]: fullData }));
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du parcours :", error);
    }
  }
);

// 🔹 Modifier un parcours
export const editPathwayAtom = atom(
  null,
  async (_, set, updatedPathway: Partial<Pathway> & { id: string }) => {
    try {
      const modifiedPathway: Pathway = await updatePathway(updatedPathway.id, updatedPathway);
      set(pathwaysAtom, (prev) =>
        prev.map((pathway) => (pathway.id === updatedPathway.id ? modifiedPathway : pathway))
      );

      // 🔹 Mettre à jour les relations complètes
      const fullData = await getPathwayWithRelations(updatedPathway.id);
      set(pathwaysWithRelationsAtom, (prev) => ({ ...prev, [updatedPathway.id]: fullData }));
    } catch (error) {
      console.error("❌ Erreur lors de la modification du parcours :", error);
    }
  }
);

// 🔹 Supprimer un parcours
export const deletePathwayAtom = atom(
  null,
  async (_, set, pathwayId: string) => {
    try {
      if (!window.confirm("❗ Voulez-vous vraiment supprimer ce parcours ?")) return;
      await deletePathway(pathwayId);
      set(pathwaysAtom, (prev) => prev.filter((pathway) => pathway.id !== pathwayId));
      console.log(`✅ Parcours supprimé (ID: ${pathwayId})`);

      // 🔹 Supprimer les relations du parcours
      set(pathwaysWithRelationsAtom, (prev) => {
        const updatedRelations = { ...prev };
        delete updatedRelations[pathwayId];
        return updatedRelations;
      });
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du parcours :", error);
    }
  }
);
