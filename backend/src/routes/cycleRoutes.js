import express from "express";
import { 
  fetchCyclesWithClasses, 
  fetchClassById, 
  fetchClassesByCycle, 
  fetchSubjectsByCycle, 
  fetchCategoriesByCycle, 
  fetchThemesByCycle,
  fetchSubjectsByClass // ✅ Ajout du contrôleur manquant
} from "../controllers/cycleController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/cycles", authenticateToken, fetchCyclesWithClasses);
router.get("/classes/:id", authenticateToken, fetchClassById);

// 📌 Nouvelle route : récupérer toutes les classes d’un cycle
router.get("/cycles/:cycleId/classes", authenticateToken, fetchClassesByCycle);

// 📌 Récupérer toutes les matières d'un cycle
router.get("/cycles/:cycleId/subjects", authenticateToken, fetchSubjectsByCycle);

// 📌 Récupérer toutes les matières d'une classe
router.get("/classes/:classId/subjects", authenticateToken, fetchSubjectsByClass);

// 📌 Récupérer toutes les catégories d'un cycle
router.get("/cycles/:cycleId/categories", authenticateToken, fetchCategoriesByCycle);

// 📌 Récupérer tous les thèmes d'un cycle
router.get("/cycles/:cycleId/themes", authenticateToken, fetchThemesByCycle);

export default router;
