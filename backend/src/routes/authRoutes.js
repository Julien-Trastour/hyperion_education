import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { register, login, requestPasswordReset, deleteUser } from '../controllers/authController.js';

const router = express.Router();

// Route pour l'inscription (pas de vérification d'authentification nécessaire)
router.post('/register', register);

// Route pour la connexion (pas de vérification d'authentification nécessaire)
router.post('/login', login);

// Route pour la demande de réinitialisation de mot de passe (pas de vérification d'authentification nécessaire)
router.post('/request-password-reset', requestPasswordReset);

// Route protégée nécessitant un utilisateur authentifié pour accéder au profil
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({ message: "Profil de l'utilisateur", user: req.user });
});

// Route protégée nécessitant un administrateur pour accéder
router.get('/admin', authenticateToken, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Accès administrateur autorisé.' });
});

// Route protégée pour supprimer un utilisateur
router.delete('/delete', authenticateToken, isAdmin, deleteUser);  // Ajout du middleware pour vérifier si l'utilisateur est un admin

export default router;
