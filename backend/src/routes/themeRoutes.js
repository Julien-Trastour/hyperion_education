import express from "express";
import { fetchThemesByCategory, addTheme, editTheme, removeTheme } from "../controllers/themeController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Récupérer les thèmes d'une catégorie (accessible à tous les utilisateurs connectés)
router.get("/themes/:categoryId", authenticateToken, fetchThemesByCategory);

// 📌 Ajouter un thème (réservé aux admins)
router.post("/themes", authenticateToken, isAdmin, addTheme);

// 📌 Modifier un thème (réservé aux admins)
router.put("/themes/:id", authenticateToken, isAdmin, editTheme);

// 📌 Supprimer un thème (réservé aux admins)
router.delete("/themes/:id", authenticateToken, isAdmin, removeTheme);

export default router;
