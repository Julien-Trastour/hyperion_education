import { User } from "../types/users";

// 🔹 Fonction pour récupérer les headers avec le token JWT
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

/* ===========================
   🔹 Gestion des Utilisateurs (Admin)
   =========================== */

// 🔹 Ajouter un utilisateur (Admin)
export const createUser = async (newUser: Omit<User, "id" | "createdAt"> & { password: string }): Promise<User> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de l'utilisateur.");
  }

  return await response.json();
};

// 🔹 Récupérer tous les utilisateurs (Admin)
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users", { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }

  return await response.json();
};

// 🔹 Modifier un utilisateur (Admin)
export const updateUser = async (id: string, updateData: Partial<User>): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour de l'utilisateur");
  }

  return await response.json();
};

// 🔹 Modifier le rôle d'un utilisateur (Admin)
export const updateUserRole = async (id: string, newRole: User["role"]): Promise<User> => {
  const response = await fetch(`/api/users/${id}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ newRole }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification du rôle");
  }

  return await response.json();
};

// 🔹 Modifier le statut d'un utilisateur (Admin)
export const updateUserStatus = async (id: string, newStatus: User["status"]): Promise<User> => {
  const response = await fetch(`/api/users/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ newStatus }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification du statut");
  }

  return await response.json();
};

// 🔹 Supprimer un utilisateur (Admin)
export const deleteUserById = async (id: string): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }
};

/* ===========================
   🔹 Gestion du compte utilisateur (Admin & Étudiant)
   =========================== */

// 🔹 Mettre à jour le profil utilisateur (Admin & Étudiant)
export const updateUserProfile = async (updatedData: Partial<User>): Promise<User> => {
  const response = await fetch("/api/users/me", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour du profil utilisateur");
  }

  return await response.json();
};

// 🔹 Changer le mot de passe (Admin & Étudiant)
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  const response = await fetch("/api/users/me/password", {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors du changement de mot de passe");
  }
};
