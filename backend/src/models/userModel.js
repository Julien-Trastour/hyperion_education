import prisma from '../db.js';  // Connexion à la base de données via Prisma
import argon2 from 'argon2';    // Pour hacher les mots de passe
import { v4 as uuidv4 } from 'uuid';  // Pour générer un token unique

// Fonction pour créer un utilisateur
export const createUser = async (email, password, firstName, lastName, birthDate, classLevel, role) => {
  const hashedPassword = await argon2.hash(password);  // Hachage du mot de passe avec Argon2
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate: new Date(birthDate),  // Format de date correct pour la base de données
      classLevel,
      role: role || 'eleve',  // Le rôle par défaut est 'eleve'
    },
  });
  return newUser;
};

// Fonction pour retrouver un utilisateur par email
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });  // Recherche par email unique
};

// Fonction pour retrouver un utilisateur par ID
export const findUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });  // Recherche par ID unique
};

// Fonction pour mettre à jour un utilisateur
export const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,  // Mettre à jour les données de l'utilisateur
  });
};

// Fonction pour générer un token de réinitialisation de mot de passe
export const generatePasswordResetToken = async (userId) => {
  const token = uuidv4();  // Générer un token unique avec UUID
  
  // Enregistrer le token dans la base de données
  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
    },
  });

  return token;  // Retourner le token généré
};

// Fonction pour supprimer un utilisateur par email
export const deleteUserByEmail = async (email) => {
    return await prisma.user.delete({
      where: { email },
    });
  };
  
  // Fonction pour supprimer un utilisateur par ID (alternative)
  export const deleteUserById = async (id) => {
    return await prisma.user.delete({
      where: { id },
    });
  };
  