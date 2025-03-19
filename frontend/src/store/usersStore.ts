import { atom } from "jotai";
import {
  createUser,
  getUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUserById,
  updateUserProfile,
  changePassword,
} from "../api/users";
import { User } from "../types/users";
import { getUserData } from "../utils/auth";

// 🔹 Vérification stricte du typage d'un `User`
function isValidUser(obj: any): obj is User {
  return obj && typeof obj === "object" && "id" in obj && typeof obj.id === "string";
}

/* ===========================
   🔹 Gestion des Utilisateurs (Admin)
   =========================== */

// 🔹 Stockage des utilisateurs
export const usersAtom = atom<User[]>([]);

// 🔹 Filtres des utilisateurs
export const roleFilterAtom = atom<User["role"][]>([]);
export const statusFilterAtom = atom<User["status"][]>([]);
export const classFilterAtom = atom<string[]>([]);

// 🔹 Fonctions pour modifier les filtres
export const toggleRoleFilterAtom = atom(null, (get, set, role: User["role"]) => {
  const currentFilters = get(roleFilterAtom);
  set(roleFilterAtom, currentFilters.includes(role) ? currentFilters.filter((r) => r !== role) : [...currentFilters, role]);
});

export const toggleStatusFilterAtom = atom(null, (get, set, status: User["status"]) => {
  const currentFilters = get(statusFilterAtom);
  set(statusFilterAtom, currentFilters.includes(status) ? currentFilters.filter((s) => s !== status) : [...currentFilters, status]);
});

export const toggleClassFilterAtom = atom(null, (get, set, classLevel: string) => {
  const currentFilters = get(classFilterAtom);
  set(classFilterAtom, currentFilters.includes(classLevel) ? currentFilters.filter((c) => c !== classLevel) : [...currentFilters, classLevel]);
});

// 🔹 Récupérer la liste des utilisateurs (Admin)
export const fetchUsersAtom = atom(null, async (_, set) => {
  try {
    const users = await getUsers();
    const validUsers = users.filter(isValidUser);
    set(usersAtom, validUsers);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
  }
});

// 🔹 Ajouter un utilisateur
export const addUserAtom = atom(null, async (_, set, newUser: Omit<User, "id" | "createdAt"> & { password: string }) => {
  try {
    const response = await createUser(newUser);
    if (!response || !("user" in response) || !isValidUser(response.user)) {
      throw new Error("Données utilisateur invalides");
    }

    const createdUser = response.user as User;

    set(usersAtom, (prev: User[]) => [...prev, createdUser]);

    console.log(`✅ Utilisateur ajouté avec succès: ${createdUser.id}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de l'utilisateur :", error);
  }
});

// 🔹 Modifier un utilisateur
export const editUserAtom = atom(null, async (_, set, userUpdate: Partial<User> & { id: string }) => {
  try {
    const response = await updateUser(userUpdate.id, userUpdate);
    if (!response || !("user" in response) || !isValidUser(response.user)) {
      throw new Error("Données utilisateur invalides");
    }

    const updatedUser = response.user as User;

    set(usersAtom, (prev: User[]) =>
      prev.map((user) => (user.id === userUpdate.id ? updatedUser : user))
    );

    console.log(`✅ Utilisateur mis à jour avec succès: ${updatedUser.id}`);
  } catch (error) {
    console.error("❌ Erreur lors de la modification de l'utilisateur :", error);
  }
});

// 🔹 Modifier le rôle d'un utilisateur (Admin)
export const updateUserRoleAtom = atom(null, async (_, set, { id, newRole }: { id: string; newRole: User["role"] }) => {
  try {
    const updatedUser = await updateUserRole(id, newRole);
    if (!isValidUser(updatedUser)) throw new Error("Données utilisateur invalides");

    set(usersAtom, (prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );

    console.log(`✅ Rôle mis à jour pour l'utilisateur ID: ${id}`);
  } catch (error) {
    console.error("❌ Erreur lors de la modification du rôle :", error);
    alert("❌ Impossible de modifier le rôle.");
  }
});

// 🔹 Modifier le statut d'un utilisateur (Admin)
export const updateUserStatusAtom = atom(null, async (_, set, { id, newStatus }: { id: string; newStatus: User["status"] }) => {
  try {
    const updatedUser = await updateUserStatus(id, newStatus);
    if (!isValidUser(updatedUser)) throw new Error("Données utilisateur invalides");

    set(usersAtom, (prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user))
    );

    console.log(`✅ Statut mis à jour pour l'utilisateur ID: ${id}`);
  } catch (error) {
    console.error("❌ Erreur lors de la modification du statut :", error);
    alert("❌ Impossible de modifier le statut.");
  }
});

// 🔹 Supprimer un utilisateur (Admin)
export const deleteUserAtom = atom(null, async (_, set, userId: string) => {
  try {
    if (!window.confirm("❗ Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    await deleteUserById(userId);
    set(usersAtom, (prev) => prev.filter((user) => user.id !== userId));
    alert("✅ L'utilisateur a bien été supprimé.");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur :", error);
  }
});

// 🔹 Réinitialiser le mot de passe (Admin)
export const resetPasswordAtom = atom(null, async (_, __, userEmail: string) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/request-password-reset", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la réinitialisation.");
    }

    alert(`📧 Un email de réinitialisation a été envoyé à ${userEmail}`);
    console.log(`✅ Email de réinitialisation envoyé à ${userEmail}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "❌ Une erreur est survenue. Vérifiez l'email et réessayez.";
    console.error("❌ Erreur lors de la demande de réinitialisation :", errorMessage);
    alert(errorMessage);
  }
});

/* ===========================
   🔹 Gestion du compte utilisateur (Admin & Étudiant)
   =========================== */

// 🔹 Initialisation avec les données stockées dans localStorage
const storedUser = getUserData();

// ✅ `WritableAtom` : Permet de lire ET modifier `currentUserAtom`
export const currentUserAtom = atom<User | null, [User], void>(
  storedUser,
  (_, set, newUser) => {
    // ✅ Met à jour `localStorage` ET l'état Jotai
    localStorage.setItem("user", JSON.stringify(newUser));
    set(currentUserAtom, newUser);
  }
);

// 🔹 Atom pour mettre à jour le profil utilisateur
export const updateUserProfileAtom = atom(null, async (get, set, updatedData: Partial<User>) => {
  try {
    const currentUser = get(currentUserAtom);
    if (!currentUser) throw new Error("Utilisateur non connecté");

    const updatedUser = await updateUserProfile(updatedData);

    // ✅ Mise à jour de `currentUserAtom` et `localStorage`
    set(currentUserAtom, { ...currentUser, ...updatedUser });

    alert("✅ Profil mis à jour avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du profil :", error);
    alert("❌ Impossible de mettre à jour le profil.");
  }
});

// 🔹 Atom pour changer le mot de passe de l'utilisateur
export const changePasswordAtom = atom(null, async (_, __, { oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
  try {
    await changePassword(oldPassword, newPassword);
    alert("✅ Mot de passe mis à jour avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du changement de mot de passe :", error);
    alert("❌ Une erreur est survenue lors du changement de mot de passe.");
  }
});
