import prisma from "../db.js";
import { v4 as uuidv4 } from "uuid";

// 🔹 Générer un token de réinitialisation de mot de passe
export async function generatePasswordResetToken(userId) {
  try {
    // Vérifie s'il existe déjà un token pour cet utilisateur
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { userId },
    });

    if (existingToken) {
      // Supprime l'ancien token avant d'en créer un nouveau
      await prisma.passwordResetToken.delete({
        where: { userId },
      });
    }

    // Crée un nouveau token UUID unique
    const token = uuidv4();
    await prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    return token;
  } catch (error) {
    console.error("❌ Erreur lors de la génération du token :", error);
    throw new Error("Impossible de générer le token de réinitialisation.");
  }
}

// 🔹 Vérifier la validité d'un token de réinitialisation
export async function verifyPasswordResetToken(token) {
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error("Token invalide ou expiré.");
  }

  return tokenRecord.userId;
}

// 🔹 Supprimer un token après utilisation
export async function deletePasswordResetToken(token) {
  await prisma.passwordResetToken.delete({
    where: { token },
  });
}
