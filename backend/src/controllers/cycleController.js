import { 
  getAllCyclesWithClasses, 
  getClassById, 
  getClassesByCycle,
  getSubjectsByCycle, 
  getCategoriesByCycle, 
  getThemesByCycle,
  getSubjectsByClass 
} from '../models/cycleModel.js';

// 🔹 Récupérer tous les cycles avec classes
export const fetchCyclesWithClasses = async (req, res) => {
  try {
    const cycles = await getAllCyclesWithClasses();
    res.json(cycles);
  } catch (error) {
    console.error("Erreur lors de la récupération des cycles :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer une classe par ID
export const fetchClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classe = await getClassById(id);

    if (!classe) {
      return res.status(404).json({ error: "Classe non trouvée" });
    }

    res.json(classe);
  } catch (error) {
    console.error("Erreur lors de la récupération de la classe :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer toutes les classes d’un cycle donné
export const fetchClassesByCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const classes = await getClassesByCycle(cycleId);

    if (!classes.length) {
      return res.status(404).json({ error: "Aucune classe trouvée pour ce cycle." });
    }

    res.json(classes);
  } catch (error) {
    console.error("Erreur lors de la récupération des classes :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer toutes les matières d'un cycle donné
export const fetchSubjectsByCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const cycleData = await getSubjectsByCycle(cycleId);

    if (!cycleData) {
      return res.status(404).json({ error: "Cycle non trouvé" });
    }

    res.json(cycleData);
  } catch (error) {
    console.error("Erreur lors de la récupération des matières du cycle :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer toutes les matières d'une classe donnée
export const fetchSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    console.log(`📡 Recherche des matières pour la classe ${classId}`);

    const subjects = await getSubjectsByClass(classId);

    if (!subjects.length) {
      console.warn(`⚠️ Aucune matière trouvée pour la classe ${classId}`);
      return res.status(200).json([]);
    }

    res.json(subjects);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer toutes les catégories d'un cycle donné
export const fetchCategoriesByCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const cycleData = await getCategoriesByCycle(cycleId);

    if (!cycleData) {
      return res.status(404).json({ error: "Cycle non trouvé" });
    }

    res.json(cycleData);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories du cycle :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Récupérer tous les thèmes d'un cycle donné
export const fetchThemesByCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const cycleData = await getThemesByCycle(cycleId);

    if (!cycleData) {
      return res.status(404).json({ error: "Cycle non trouvé" });
    }

    res.json(cycleData);
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes du cycle :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
