import express from "express";
import {
  getPathways,
  getPathway,
  getPathwaysByThemeId,
  getLessonsFromPathway,
  createNewPathway,
  editPathway,
  removePathway,
  getPathwayWithRelationsController
} from "../controllers/pathwayController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ==========================
   🔹 Routes pour la gestion des parcours
   ========================== */

// 🔹 Récupérer tous les parcours (accessible aux admins uniquement)
router.get("/", authenticateToken, isAdmin, getPathways);

// 🔹 Récupérer un parcours par ID (accessible aux admins uniquement)
router.get("/:id", authenticateToken, isAdmin, getPathway);

// 🔹 Récupérer tous les parcours d'un thème donné (accessible aux admins uniquement)
router.get("/theme/:themeId", authenticateToken, isAdmin, getPathwaysByThemeId);

// 🔹 Récupérer les leçons d’un parcours (accessible aux admins uniquement)
router.get("/:id/lessons", authenticateToken, isAdmin, getLessonsFromPathway);

// 🔹 Créer un nouveau parcours (accessible aux admins uniquement)
router.post("/", authenticateToken, isAdmin, createNewPathway);

// 🔹 Modifier un parcours existant (accessible aux admins uniquement)
router.put("/:id", authenticateToken, isAdmin, editPathway);

// 🔹 Supprimer un parcours (accessible aux admins uniquement)
router.delete("/:id", authenticateToken, isAdmin, removePathway);

// 🔹 Route pour récupérer un parcours avec toutes ses relations
router.get("/:id/full", getPathwayWithRelationsController);

export default router;
