import prisma from "../db.js"; // Connexion à la base de données via Prisma
import argon2 from "argon2"; // Pour hacher les mots de passe
import { v4 as uuidv4 } from "uuid"; // Pour générer un token unique

// 🔹 Fonction pour créer un utilisateur (évite les doublons)
export const createUser = async (email, password, firstName, lastName, birthDate, classLevel, role, profilePicture) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.");
  }

  const hashedPassword = await argon2.hash(password);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      classLevel,
      role: role || "ELEVE",
      status: "ACTIF",
      profilePicture,
    },
  });
  return newUser;
};

// 🔹 Fonction pour retrouver un utilisateur par email
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

// 🔹 Fonction pour retrouver un utilisateur par ID
export const findUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};

// 🔹 Fonction pour récupérer tous les utilisateurs
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      profilePicture: true,
      createdAt: true,
    },
  });
};

// 🔹 Fonction pour mettre à jour un utilisateur
export const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};

// 🔹 Fonction pour changer le rôle d'un utilisateur
export const updateUserRole = async (id, newRole, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.role === "SUPER_ADMIN") throw new Error("Modification du rôle du SUPER_ADMIN interdite.");

  if (requestingUserRole !== "SUPER_ADMIN" && newRole === "SUPER_ADMIN") {
    throw new Error("Seul le SUPER_ADMIN peut attribuer ce rôle.");
  }

  return await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });
};

// 🔹 Fonction pour changer le statut d'un utilisateur (ACTIF, SUSPENDU, DESACTIVE)
export const updateUserStatus = async (id, newStatus, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.role === "SUPER_ADMIN") throw new Error("Modification du statut du SUPER_ADMIN interdite.");

  return await prisma.user.update({
    where: { id },
    data: { status: newStatus },
  });
};

// 🔹 Fonction pour générer un token de réinitialisation de mot de passe
export const generatePasswordResetToken = async (userId) => {
  const token = uuidv4();

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
    },
  });

  return token;
};

// 🔹 Fonction pour supprimer un utilisateur par email (sécurisé)
export const deleteUserByEmail = async (email, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.role === "SUPER_ADMIN") throw new Error("Suppression du SUPER_ADMIN interdite.");
  if (requestingUserRole !== "SUPER_ADMIN" && user.role === "ADMIN") {
    throw new Error("Un ADMIN ne peut pas supprimer un autre ADMIN.");
  }

  return await prisma.user.delete({
    where: { email },
  });
};

// 🔹 Fonction pour supprimer un utilisateur par ID (sécurisé)
export const deleteUserById = async (id, requestingUserRole) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.role === "SUPER_ADMIN") throw new Error("Suppression du SUPER_ADMIN interdite.");
  if (requestingUserRole !== "SUPER_ADMIN" && user.role === "ADMIN") {
    throw new Error("Un ADMIN ne peut pas supprimer un autre ADMIN.");
  }

  return await prisma.user.delete({
    where: { id },
  });
};
