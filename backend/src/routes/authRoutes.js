import express from 'express';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';
import { register, login, requestPasswordReset } from '../controllers/authController.js';

const router = express.Router();

// 🔹 Route pour l'inscription (ouverte à tous)
router.post('/register', register);

// 🔹 Route pour la connexion (ouverte à tous)
router.post('/login', login);

// 🔹 Route pour la demande de réinitialisation de mot de passe (ouverte à tous)
router.post('/request-password-reset', requestPasswordReset);

// 🔹 Route protégée nécessitant une authentification pour accéder au profil de l'utilisateur connecté
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: "Profil de l'utilisateur", user: req.user });
});

// 🔹 Route protégée nécessitant un administrateur pour accéder à l'espace admin
router.get('/admin', authenticateToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Accès administrateur autorisé.' });
});

export default router;
