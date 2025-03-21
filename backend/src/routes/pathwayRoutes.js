import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getClasses,
  getCycles,
  getClassesByCycle,
  getSubjectsByClass,
  createSubjectController,
  updateSubjectController,
  deleteSubjectController,
  getCategoriesBySubject,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getThemesByCategory,
  createThemeController,
  updateThemeController,
  deleteThemeController,
  getPathwayContentController,
  updatePathwayContentController,
  getAllPathwaysController
} from "../controllers/pathwayController.js";

const router = express.Router();

/* ========================= CYCLES & CLASSES ========================= */

// 🔹 Récupérer la liste des cycles
router.get("/cycles", authenticateToken, isAdmin, getCycles);

// 🔹 Récupérer les classes d’un cycle spécifique
router.get("/classes/:cycleId", authenticateToken, isAdmin, getClassesByCycle);

// 🔹 Récupérer toutes les classes disponibles (utilisé pour les utilisateurs)
router.get("/classes", authenticateToken, getClasses);

/* ========================= SUBJECTS ========================= */

// 🔹 Récupérer les matières d’une classe
router.get("/subjects/:classId", authenticateToken, isAdmin, getSubjectsByClass);

// 🔸 Ajouter une matière
router.post("/subjects", authenticateToken, isAdmin, createSubjectController);

// 🔸 Modifier une matière
router.put("/subjects/:subjectId", authenticateToken, isAdmin, updateSubjectController);

// 🔸 Supprimer une matière
router.delete("/subjects/:subjectId", authenticateToken, isAdmin, deleteSubjectController);

/* ========================= CATEGORIES ========================= */

// 🔹 Récupérer les catégories d’une matière
router.get("/categories/:subjectId", authenticateToken, isAdmin, getCategoriesBySubject);

// 🔸 Ajouter une catégorie
router.post("/categories", authenticateToken, isAdmin, createCategoryController);

// 🔸 Modifier une catégorie
router.put("/categories/:categoryId", authenticateToken, isAdmin, updateCategoryController);

// 🔸 Supprimer une catégorie
router.delete("/categories/:categoryId", authenticateToken, isAdmin, deleteCategoryController);

/* ========================= THEMES ========================= */

// 🔹 Récupérer les thèmes d’une catégorie
router.get("/themes/:categoryId", authenticateToken, isAdmin, getThemesByCategory);

// 🔸 Ajouter un thème
router.post("/themes", authenticateToken, isAdmin, createThemeController);

// 🔸 Modifier un thème
router.put("/themes/:themeId", authenticateToken, isAdmin, updateThemeController);

// 🔸 Supprimer un thème
router.delete("/themes/:themeId", authenticateToken, isAdmin, deleteThemeController);

/* ========================= PATHWAY CONTENT ========================= */

// 🔸 Récupérer tout le contenu d’un parcours (thèmes, leçons, exercices, etc.)
router.get("/:pathwayId/content", authenticateToken, isAdmin, getPathwayContentController);

// 🔸 Modifier le contenu d’un parcours
router.put("/:pathwayId/content", authenticateToken, isAdmin, updatePathwayContentController);

// 🔹 Récupérer tous les parcours avec leçons et exercices
router.get("/", authenticateToken, isAdmin, getAllPathwaysController);

export default router;
