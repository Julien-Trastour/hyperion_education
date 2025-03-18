import express from "express";
import { fetchCategoriesBySubject, addCategory, editCategory, removeCategory } from "../controllers/categoryController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Récupérer les catégories d'une matière (accessible à tous les utilisateurs connectés)
router.get("/categories/:subjectId", authenticateToken, fetchCategoriesBySubject);

// 📌 Ajouter une catégorie (réservé aux admins)
router.post("/categories", authenticateToken, isAdmin, addCategory);

// 📌 Modifier une catégorie (réservé aux admins)
router.put("/categories/:id", authenticateToken, isAdmin, editCategory);

// 📌 Supprimer une catégorie (réservé aux admins)
router.delete("/categories/:id", authenticateToken, isAdmin, removeCategory);

export default router;
