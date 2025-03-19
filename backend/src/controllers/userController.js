import { 
  getAllUsers, findUserById, updateUser, 
  updateUserRole, updateUserStatus, deleteUserById 
} from "../models/userModel.js";

/**
 * 🔹 Récupérer tous les utilisateurs
 * Accessible uniquement aux ADMIN et SUPER_ADMIN
 */
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/**
 * 🔹 Modifier un utilisateur
 * Accessible aux ADMIN et SUPER_ADMIN
 */
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Modification du SUPER_ADMIN interdite." });
    }

    const updatedUser = await updateUser(id, updateData);
    return res.status(200).json({ message: "Utilisateur mis à jour avec succès.", user: updatedUser });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'utilisateur :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/**
 * 🔹 Modifier le rôle d'un utilisateur
 * Accessible uniquement aux SUPER_ADMIN
 */
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Modification du rôle du SUPER_ADMIN interdite." });
    }

    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Seul un SUPER_ADMIN peut modifier un rôle." });
    }

    const updatedUser = await updateUserRole(id, newRole, req.user.role);
    return res.status(200).json({ message: "Rôle mis à jour avec succès.", user: updatedUser });
  } catch (error) {
    console.error("❌ Erreur lors de la modification du rôle :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/**
 * 🔹 Modifier le statut d'un utilisateur (ACTIF, SUSPENDU, DESACTIVE)
 * Accessible uniquement aux ADMIN et SUPER_ADMIN
 */
export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Modification du statut du SUPER_ADMIN interdite." });
    }

    const updatedUser = await updateUserStatus(id, newStatus, req.user.role);
    return res.status(200).json({ message: "Statut mis à jour avec succès.", user: updatedUser });
  } catch (error) {
    console.error("❌ Erreur lors de la modification du statut :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

/**
 * 🔹 Supprimer un utilisateur
 * Accessible uniquement aux SUPER_ADMIN
 */
export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });

    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ error: "Suppression du SUPER_ADMIN interdite." });
    }

    if (req.user.role !== "SUPER_ADMIN" && user.role === "ADMIN") {
      return res.status(403).json({ error: "Un ADMIN ne peut pas supprimer un autre ADMIN." });
    }

    await deleteUserById(id, req.user.role);
    return res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
