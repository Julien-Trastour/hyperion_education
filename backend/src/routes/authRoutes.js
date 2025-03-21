import express from "express";
import { register, login } from "../controllers/authController.js";
import { requestPasswordReset, resetPassword } from "../controllers/passwordResetController.js";

const router = express.Router();

// 🔹 Inscription
router.post("/register", register);

// 🔹 Connexion
router.post("/login", login);

// 🔹 Demande de réinitialisation de mot de passe
router.post("/request-password-reset", requestPasswordReset);

// 🔹 Réinitialisation du mot de passe avec un token
router.post("/reset-password", resetPassword);

export default router;
