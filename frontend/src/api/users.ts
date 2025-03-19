import { User } from "../types/users";

// Fonction pour récupérer les headers avec le token JWT
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// 🔹 Ajouter un utilisateur
export const createUser = async (newUser: Omit<User, "id" | "createdAt"> & { password: string }): Promise<User> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newUser),
    });
  
    if (!response.ok) {
      throw new Error(`Erreur lors de la création de l'utilisateur.`);
    }
  
    return await response.json();
};

// 🔹 Récupérer tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch("/api/users", { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }

  return await response.json();
};

// 🔹 Modifier un utilisateur
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

// 🔹 Modifier le rôle d'un utilisateur (SUPER_ADMIN uniquement)
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

// 🔹 Modifier le statut d'un utilisateur (ADMIN & SUPER_ADMIN)
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

// 🔹 Supprimer un utilisateur (SUPER_ADMIN uniquement)
export const deleteUserById = async (id: string): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }
};
