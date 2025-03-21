import argon2 from "argon2";
import { getAllUsers, findUserById, findUserByEmail, updateUser, deleteUserById, createUser } from "../models/userModel.js";

/**
 * 📜 Récupérer la liste des utilisateurs
 * @route  GET /users/
 * @access Admin
 */
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ➕ Créer un utilisateur
 * @route  POST /users
 * @access Admin
 */
export const createUserController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, role, classLevel } = req.body;

    if (!firstName || !lastName || !email || !password || !role || !birthDate) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    // ✅ Vérifier si l'email est déjà utilisé
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    // ✅ Hacher le mot de passe avant création
    const hashedPassword = await argon2.hash(password);

    // ✅ Ajouter classLevel pour les élèves
    const newUser = await createUser(
      email,
      hashedPassword,
      firstName,
      lastName,
      new Date(birthDate),
      role,
      role === "ELEVE" ? classLevel : null
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * 👤 Récupérer les informations d'un utilisateur spécifique
 * @route  GET /users/me
 * @access Authentifié
 */
export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ✏️ Modifier les paramètres de son propre compte
 * @route  PUT /users/me
 * @access Authentifié
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, password, classLevel } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }

    // ✅ Vérification email unique
    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: "Cet email est déjà utilisé par un autre compte." });
    }

    // ✅ Récupérer l'utilisateur en base
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // ✅ Préparer les données de mise à jour
    const updateData = { firstName, lastName, email };

    // ✅ Si l'utilisateur est un élève, conserver/modifier `classLevel`
    if (user.role === "ELEVE") {
      updateData.classLevel = classLevel ?? user.classLevel;
    }

    if (password) {
      updateData.password = await argon2.hash(password);
    }

    // ✅ Mise à jour en base
    const updatedUser = await updateUser(userId, updateData);
    res.status(200).json({ message: "Profil mis à jour avec succès !", user: updatedUser });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ✏️ Modifier un utilisateur
 * @route  PUT /users/:id
 * @access Admin
 */
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, status, classLevel } = req.body;

    if (!firstName || !lastName || !email || !role) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    }

    // ✅ Récupérer l'utilisateur en base
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // ✅ Vérification email unique
    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.id !== id) {
      return res.status(400).json({ error: "Cet email est déjà utilisé par un autre compte." });
    }

    // ✅ Préparer les données de mise à jour
    const updateData = { firstName, lastName, email, role, status };

    // ✅ Si l'utilisateur modifié est un élève, conserver/modifier `classLevel`
    if (user.role === "ELEVE") {
      updateData.classLevel = classLevel ?? user.classLevel;
    }

    // ✅ Protection du SUPER_ADMIN
    const updatedUser = await updateUser(id, updateData, req.user.role);

    res.status(200).json({ message: "Utilisateur mis à jour avec succès !", user: updatedUser });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

/**
 * ❌ Supprimer un utilisateur
 * @route  DELETE /users/:id
 * @access Admin
 */
export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteUserById(id, req.user.role);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
