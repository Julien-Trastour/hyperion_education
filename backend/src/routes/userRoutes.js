import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import { getUsers, getUserById, editUser, removeUser, updateUserProfile, createUserController } from "../controllers/userController.js";
import { requestPasswordReset } from "../controllers/passwordResetController.js";

const router = express.Router();

// 🔹 Récupérer la liste des utilisateurs (accessible aux ADMIN)
router.get("/", authenticateToken, isAdmin, getUsers);

// 🔹 Récupérer les infos du propre utilisateur connecté
router.get("/me", authenticateToken, getUserById);

// 🔹 Modifier les infos du propre utilisateur connecté
router.put("/me", authenticateToken, updateUserProfile);

// 🔹 Modifier un utilisateur
router.put("/:id", authenticateToken, isAdmin, editUser);

// 🔹 Supprimer un utilisateur (admin uniquement)
router.delete("/:id", authenticateToken, isAdmin, removeUser);

// 🔹 Créer un utilisateur (admin uniquement)
router.post("/", authenticateToken, isAdmin, createUserController);

// ✅ Nouvelle route pour réinitialiser le mot de passe
router.post("/reset-password", requestPasswordReset); 

export default router;
