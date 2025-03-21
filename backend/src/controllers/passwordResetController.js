import { findUserByEmail, updateUser } from "../models/userModel.js";
import {
  generatePasswordResetToken,
  verifyPasswordResetToken,
  deletePasswordResetToken,
} from "../models/passwordResetTokenModel.js";
import { sendResetEmail } from "../utils/emailService.js"; // ✅ Vérification que l'import est présent
import argon2 from "argon2";

/**
 * 📩 Demande de réinitialisation de mot de passe
 * @route  POST /auth/request-password-reset
 * @access Public
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const token = await generatePasswordResetToken(user.id);

    // ✅ Simulation d'envoi d'email
    await sendResetEmail(email, token);

    // ✅ Ajout d'un log pour tester le lien en dev
    console.log(`📩 Lien de réinitialisation : http://localhost:5173/reset-password?token=${token}`);

    res.status(200).json({ message: "Email de réinitialisation envoyé." });
  } catch (error) {
    console.error("❌ Erreur lors de la demande de réinitialisation :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * 🔄 Réinitialisation du mot de passe avec un token valide
 * @route  POST /auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // ✅ Vérifier si le token est valide
    const userId = await verifyPasswordResetToken(token);

    // ✅ Hacher le nouveau mot de passe et l'enregistrer
    const hashedPassword = await argon2.hash(newPassword);
    await updateUser(userId, { password: hashedPassword });

    // ✅ Supprimer le token après utilisation
    await deletePasswordResetToken(token);

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(400).json({ error: error.message || "Erreur lors de la réinitialisation du mot de passe." });
  }
};
