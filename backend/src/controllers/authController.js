import { createUser, findUserByEmail, generatePasswordResetToken, deleteUserByEmail } from '../models/userModel.js';
import { sendResetEmail } from '../utils/emailService.js';
import argon2 from 'argon2';
import { generateJWT } from '../utils/jwtUtils.js';

// Inscription d'un utilisateur
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate, classLevel, role } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    const newUser = await createUser(email, password, firstName, lastName, birthDate, classLevel, role);
    const { password: _, ...userData } = newUser;

    return res.status(201).json({ message: "Utilisateur créé avec succès !", user: userData });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification si l'utilisateur existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    // Vérification du mot de passe
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    // Génération du token JWT
    const token = generateJWT(user.id, user.email, user.role);

    // Exclusion du mot de passe avant d'envoyer la réponse
    const { password: _, ...userData } = user;

    return res.status(200).json({ message: "Connexion réussie !", token, user: userData });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Demande de réinitialisation du mot de passe
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérification si l'utilisateur existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Génération du token de réinitialisation de mot de passe
    const resetToken = await generatePasswordResetToken(user.id);

    // Envoi de l'email de réinitialisation
    await sendResetEmail(email, resetToken);

    return res.status(200).json({ message: 'E-mail de réinitialisation envoyé. Veuillez vérifier votre boîte de réception.' });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;  // On reçoit l'email de l'utilisateur à supprimer

    // Vérification si l'utilisateur existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Suppression de l'utilisateur
    await deleteUserByEmail(email);

    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
