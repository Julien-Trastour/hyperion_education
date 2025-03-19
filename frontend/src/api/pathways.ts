import { Pathway } from "../types/pathway";

// ✅ Récupérer le token JWT pour l'authentification
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// 🔹 Récupérer tous les parcours
export const getPathways = async (): Promise<Pathway[]> => {
  try {
    const response = await fetch("/api/pathways", { headers: getAuthHeaders() });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("❌ Erreur API (getPathways) :", errorMessage);
      throw new Error("Erreur lors de la récupération des parcours.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur critique lors de la récupération des parcours :", error);
    throw error;
  }
};

// 🔹 Récupérer un parcours avec ses relations
export const getPathwayWithRelations = async (id: string): Promise<Pathway> => {
  try {
    const response = await fetch(`/api/pathways/${id}/full`, { headers: getAuthHeaders() });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`❌ Erreur API (getPathwayWithRelations - ID: ${id}) :`, errorMessage);
      throw new Error("Erreur lors de la récupération du parcours avec ses relations.");
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erreur critique lors de la récupération du parcours (ID: ${id}) avec ses relations :`, error);
    throw error;
  }
};

// 🔹 Ajouter un parcours
export const createPathway = async (newPathway: { 
    title: string; 
    description?: string; 
    themeId: string; 
    order?: number;
  }): Promise<Pathway> => {
    
  try {
    const response = await fetch("/api/pathways", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: newPathway.title,
        description: newPathway.description || "", // Ajout d'une description par défaut
        themeId: newPathway.themeId,
        order: newPathway.order ?? 0, // Ajout d'un ordre par défaut
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("❌ Erreur API (createPathway) :", errorMessage);
      throw new Error("Erreur lors de la création du parcours.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur critique lors de la création du parcours :", error);
    throw error;
  }
};

// 🔹 Modifier un parcours
export const updatePathway = async (id: string, updatedPathway: Partial<Pathway>): Promise<Pathway> => {
  try {
    const response = await fetch(`/api/pathways/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedPathway),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`❌ Erreur API (updatePathway - ID: ${id}) :`, errorMessage);
      throw new Error("Erreur lors de la mise à jour du parcours.");
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erreur critique lors de la modification du parcours (ID: ${id}) :`, error);
    throw error;
  }
};

// 🔹 Supprimer un parcours
export const deletePathway = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/pathways/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`❌ Erreur API (deletePathway - ID: ${id}) :`, errorMessage);
      throw new Error("Erreur lors de la suppression du parcours.");
    }

    console.log(`✅ Parcours supprimé avec succès (ID: ${id})`);
  } catch (error) {
    console.error(`❌ Erreur critique lors de la suppression du parcours (ID: ${id}) :`, error);
    throw error;
  }
};
