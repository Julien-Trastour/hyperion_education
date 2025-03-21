import {
  getAllCycles,
  getClassesByCycleId,
  getSubjectsByClassId,
  getCategoriesBySubjectId,
  getThemesByCategoryId,
  getAllClasses,
  createSubject,
  updateSubject,
  deleteSubject,
  createCategory,
  updateCategory,
  deleteCategory,
  createTheme,
  updateTheme,
  deleteTheme,
  getPathwayContent,
  updatePathwayContent,
  getPathwaysWithRelations
} from "../models/pathwayModel.js";

/**
 * 📚 Récupérer la liste des cycles
 * @route  GET /api/pathways/cycles
 * @access Admin
 */
export const getCycles = async (req, res) => {
  try {
    const cycles = await getAllCycles();
    res.status(200).json(cycles);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des cycles :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * 🏫 Récupérer les classes d’un cycle
 * @route  GET /api/pathways/classes/:cycleId
 * @access Admin
 */
export const getClassesByCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const classes = await getClassesByCycleId(cycleId);
    res.status(200).json(classes);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des classes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/* ========================================================
        Opérations CRUD Subjects
======================================================== */

/**
 * 📘 Récupérer les matières d’une classe
 * @route  GET /api/pathways/subjects/:classId
 * @access Admin
 */
export const getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const subjects = await getSubjectsByClassId(classId);
    res.status(200).json(subjects);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des matières :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ➕ Créer une matière
 * @route  POST /api/pathways/subjects
 * @access Admin
 */
export const createSubjectController = async (req, res) => {
  try {
    const { classId, subjectName } = req.body;

    if (!classId || !subjectName) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const subject = await createSubject(classId, subjectName);
    res.status(201).json(subject);
  } catch (error) {
    console.error("❌ Erreur lors de la création de la matière :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ✏️ Modifier une matière
 * @route  PUT /api/pathways/subjects/:subjectId
 * @access Admin
 */
export const updateSubjectController = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { subjectName } = req.body;

    const updated = await updateSubject(subjectId, subjectName);
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Erreur lors de la modification de la matière :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ❌ Supprimer une matière
 * @route  DELETE /api/pathways/subjects/:subjectId
 * @access Admin
 */
export const deleteSubjectController = async (req, res) => {
  try {
    const { subjectId } = req.params;
    await deleteSubject(subjectId);
    res.status(200).json({ message: "Matière supprimée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la matière :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/* ========================================================
        Opérations CRUD Categories
======================================================== */

/**
 * 🗂️ Récupérer les catégories d’une matière
 * @route  GET /api/pathways/categories/:subjectId
 * @access Admin
 */
export const getCategoriesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const categories = await getCategoriesBySubjectId(subjectId);
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des catégories :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ➕ Créer une catégorie
 * @route  POST /api/pathways/categories
 * @access Admin
 */
export const createCategoryController = async (req, res) => {
  try {
    const { subjectId, categoryName } = req.body;

    if (!subjectId || !categoryName) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const category = await createCategory(subjectId, categoryName);
    res.status(201).json(category);
  } catch (error) {
    console.error("❌ Erreur lors de la création de la catégorie :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ✏️ Modifier une catégorie
 * @route  PUT /api/pathways/categories/:categoryId
 * @access Admin
 */
export const updateCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    const updated = await updateCategory(categoryId, categoryName);
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Erreur lors de la modification de la catégorie :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ❌ Supprimer une catégorie
 * @route  DELETE /api/pathways/categories/:categoryId
 * @access Admin
 */
export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await deleteCategory(categoryId);
    res.status(200).json({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la catégorie :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/* ========================================================
        Opérations CRUD Themes
======================================================== */

/**
 * 🎯 Récupérer les thèmes d’une catégorie
 * @route  GET /api/pathways/themes/:categoryId
 * @access Admin
 */
export const getThemesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const themes = await getThemesByCategoryId(categoryId);
    res.status(200).json(themes);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des thèmes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ➕ Créer un thème
 * @route  POST /api/pathways/themes
 * @access Admin
 */
export const createThemeController = async (req, res) => {
  try {
    const { categoryId, themeName } = req.body;

    if (!categoryId || !themeName) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const theme = await createTheme(categoryId, themeName);
    res.status(201).json(theme);
  } catch (error) {
    console.error("❌ Erreur lors de la création du thème :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ✏️ Modifier un thème
 * @route  PUT /api/pathways/themes/:themeId
 * @access Admin
 */
export const updateThemeController = async (req, res) => {
  try {
    const { themeId } = req.params;
    const { themeName } = req.body;

    const updated = await updateTheme(themeId, themeName);
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Erreur lors de la modification du thème :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ❌ Supprimer un thème
 * @route  DELETE /api/pathways/themes/:themeId
 * @access Admin
 */
export const deleteThemeController = async (req, res) => {
  try {
    const { themeId } = req.params;
    await deleteTheme(themeId);
    res.status(200).json({ message: "Thème supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du thème :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/* ========================================================
        Récupération des classes pour le user
======================================================== */

/**
 * 📚 Récupérer la liste des classes
 * @route  GET /api/pathways/classes
 * @access Admin
 */
export const getClasses = async (req, res) => {
  try {
    const classes = await getAllClasses();

    if (!classes || classes.length === 0) {
      return res.status(404).json({ error: "Aucune classe trouvée." });
    }

    res.status(200).json(classes.map((c) => c.className));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des classes :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/* ========================================================
        Contenu d’un Pathway (leçons + exercices)
======================================================== */

/**
 * 📖 Récupérer le contenu d’un pathway
 * @route  GET /api/pathways/:pathwayId/content
 * @access Admin
 */
export const getPathwayContentController = async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const content = await getPathwayContent(pathwayId);
    res.status(200).json(content);
  } catch (error) {
    console.error("❌ Erreur récupération du contenu du pathway :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * 📦 Récupérer tous les parcours avec leçons et exercices
 * @route  GET /api/pathways
 * @access Admin
 */
export const getAllPathwaysController = async (req, res) => {
  try {
    const pathways = await getPathwaysWithRelations();
    res.status(200).json(pathways);
  } catch (error) {
    console.error("❌ Erreur récupération des parcours :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ✏️ Mettre à jour le contenu d’un pathway
 * @route  PUT /api/pathways/:pathwayId/content
 * @access Admin
 */
export const updatePathwayContentController = async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const { title, lessons, exercises } = req.body;

    if (!title || !Array.isArray(lessons) || !Array.isArray(exercises)) {
      return res.status(400).json({ error: "Données de mise à jour incomplètes." });
    }

    const result = await updatePathwayContent(pathwayId, title, lessons, exercises);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erreur mise à jour du contenu du pathway :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
