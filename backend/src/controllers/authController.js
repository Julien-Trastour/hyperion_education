import { findUserByEmail, createUser, generatePasswordResetToken } from '../models/userModel.js';
import { sendResetEmail } from '../utils/emailService.js';
import argon2 from 'argon2';
import { generateJWT } from '../utils/jwtUtils.js';

// 🔹 Inscription d'un utilisateur
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

    if (role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Création d'un SUPER_ADMIN interdite via l'API." });
    }

    const newUser = await createUser(email, password, firstName, lastName, birthDate, classLevel, role || "ELEVE");
    const { password: _, ...userData } = newUser;

    return res.status(201).json({ message: "Utilisateur créé avec succès !", user: userData });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// 🔹 Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    if (user.status === "SUSPENDU") {
      return res.status(403).json({ error: "Votre compte est suspendu. Contactez un administrateur." });
    }
    if (user.status === "DESACTIVE") {
      return res.status(403).json({ error: "Votre compte a été désactivé." });
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const token = generateJWT(user.id, user.email, user.role);

    const { password: _, ...userData } = user;

    return res.status(200).json({ message: "Connexion réussie !", token, user: userData });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// 🔹 Demande de réinitialisation du mot de passe
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // ✅ On ne supprime plus le token ici (c'est géré dans le model)
    const resetToken = await generatePasswordResetToken(user.id);

    // ✅ Envoi de l'email
    await sendResetEmail(email, resetToken);

    return res.status(200).json({ message: "E-mail de réinitialisation envoyé. Veuillez vérifier votre boîte de réception." });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
