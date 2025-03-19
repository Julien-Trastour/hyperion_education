import {
    getAllPathways,
    getPathwayById,
    getPathwaysByTheme,
    getLessonsByPathway,
    createPathway,
    updatePathway,
    getPathwayWithRelations,
    deletePathway
  } from '../models/pathwayModel.js';
  
  /* ==========================
     🔹 Récupérer tous les parcours
     ========================== */
  export const getPathways = async (req, res) => {
    try {
      const pathways = await getAllPathways();
      res.json(pathways);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des parcours :", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des parcours." });
    }
  };
  
  /* ==========================
     🔹 Récupérer un parcours par ID
     ========================== */
  export const getPathway = async (req, res) => {
    try {
      const { id } = req.params;
      const pathway = await getPathwayById(id);
  
      if (!pathway) {
        return res.status(404).json({ error: "Parcours non trouvé." });
      }
  
      res.json(pathway);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du parcours :", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération du parcours." });
    }
  };
  
  /* ==========================
     🔹 Récupérer tous les parcours d'un thème donné
     ========================== */
  export const getPathwaysByThemeId = async (req, res) => {
    try {
      const { themeId } = req.params;
      const pathways = await getPathwaysByTheme(themeId);
  
      res.json(pathways);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des parcours du thème :", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des parcours." });
    }
  };
  
  /* ==========================
     🔹 Récupérer les leçons d’un parcours
     ========================== */
  export const getLessonsFromPathway = async (req, res) => {
    try {
      const { id } = req.params;
      const lessons = await getLessonsByPathway(id);
  
      res.json(lessons);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des leçons du parcours :", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des leçons." });
    }
  };
  
  /* ==========================
     🔹 Créer un nouveau parcours
     ========================== */
  export const createNewPathway = async (req, res) => {
    console.log("🛠️ Données reçues du frontend :", req.body);
    try {
      const { title, description, themeId, order, finalTestId } = req.body;
  
      if (!title || !themeId || order === undefined) {
        return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
      }
  
      const newPathway = await createPathway({ title, description, themeId, order, finalTestId });
  
      res.status(201).json(newPathway);
    } catch (error) {
      console.error("❌ Erreur lors de la création du parcours :", error);
      res.status(500).json({ error: "Erreur serveur lors de la création du parcours." });
    }
  };
  
  /* ==========================
     🔹 Modifier un parcours existant
     ========================== */
  export const editPathway = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedPathway = await updatePathway(id, updatedData);
  
      res.json(updatedPathway);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du parcours :", error);
      res.status(500).json({ error: "Erreur serveur lors de la mise à jour du parcours." });
    }
  };
  
  /* ==========================
     🔹 Supprimer un parcours
     ========================== */
  export const removePathway = async (req, res) => {
    try {
      const { id } = req.params;
  
      await deletePathway(id);
  
      res.json({ message: "✅ Parcours supprimé avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du parcours :", error);
      res.status(500).json({ error: "Erreur serveur lors de la suppression du parcours." });
    }
  };
  /* ==========================
     🔹 Fonction pour récupérer un parcours avec toutes ses relations
     ========================== */
export const getPathwayWithRelationsController = async (req, res) => {
  try {
    const pathway = await getPathwayWithRelations(req.params.id);
    if (!pathway) {
      return res.status(404).json({ error: "Parcours non trouvé" });
    }
    res.json(pathway);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du parcours avec ses relations", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération du parcours." });
  }
};