import prisma from "../db.js";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

// 🔹 Créer un utilisateur (évite les doublons)
export const createUser = async (email, password, firstName, lastName, birthDate, role, classLevel = null) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.");
  }

  // ✅ Vérifier si birthDate est défini et valide
  let formattedBirthDate = null;
  if (birthDate) {
    const parsedDate = new Date(birthDate);
    if (!isNaN(parsedDate)) {
      formattedBirthDate = parsedDate;
    } else {
      throw new Error("La date de naissance fournie est invalide.");
    }
  }

  const hashedPassword = await argon2.hash(password);
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: formattedBirthDate,
      role: role || "ELEVE",
      status: "ACTIF",
      classLevel: role === "ELEVE" ? classLevel : null,
    },
  });
};


// 🔹 Trouver un utilisateur par email
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

// 🔹 Trouver un utilisateur par ID
export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true, classLevel: true,},
  });
};

// 🔹 Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, classLevel: true, createdAt: true },
  });
};

// 🔹 Modifier un utilisateur
export const updateUser = async (id, updateData, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  // ✅ Protection du SUPER_ADMIN
  if (user.role === "SUPER_ADMIN" && requestingUserRole !== "SUPER_ADMIN") {
    throw new Error("Modification du SUPER_ADMIN interdite.");
  }

  return await prisma.user.update({ where: { id }, data: updateData });
};

// 🔹 Supprimer un utilisateur par ID
export const deleteUserById = async (id, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.role === "SUPER_ADMIN") throw new Error("Suppression du SUPER_ADMIN interdite.");

  return await prisma.user.delete({ where: { id } });
};

// 🔹 Désactiver un utilisateur
export const disableUser = async (id, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  // ✅ Empêcher la désactivation d’un SUPER_ADMIN
  if (user.role === "SUPER_ADMIN") {
    throw new Error("Impossible de désactiver un SUPER_ADMIN.");
  }

  return await prisma.user.update({
    where: { id },
    data: { status: "DESACTIVE" },
  });
};

// 🔹 Générer un token de réinitialisation de mot de passe
export async function generatePasswordResetToken(userId) {
  try {
    const existingToken = await prisma.passwordResetToken.findUnique({ where: { userId } });

    if (existingToken) {
      await prisma.passwordResetToken.delete({ where: { userId } });
    }

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
    throw new Error("Impossible de générer le token de réinitialisation.");
  }
}
