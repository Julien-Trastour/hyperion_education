import { atom } from "jotai";
import { createUser, getUsers, updateUser, updateUserRole, updateUserStatus, deleteUserById } from "../api/users";
import { User } from "../types/users";

// 🔹 Type Guard : Vérifie si un objet est bien un `User`
function isValidUser(obj: any): obj is User {
  return obj && typeof obj === "object" && "id" in obj && typeof obj.id === "string";
}

// 🔹 Stockage des utilisateurs
export const usersAtom = atom<User[]>([]);

// 🔹 Récupérer les utilisateurs
export const fetchUsersAtom = atom(null, async (_, set) => {
  try {
    const users = await getUsers();

    // ✅ Vérification stricte : on garde uniquement les `User` valides
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
  
      // ✅ Vérification stricte de `response.user`
      if (!response || typeof response !== "object" || !("user" in response) || !isValidUser(response.user)) {
        console.error("❌ Réponse API invalide pour addUser :", response);
        return;
      }
  
      const createdUser = response.user;
  
      set(usersAtom, (prev) => [...prev, createdUser]);
  
      console.log(`✅ Utilisateur ajouté avec succès: ${createdUser.id}`);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de l'utilisateur :", error);
    }
});

// 🔹 Modifier un utilisateur
export const editUserAtom = atom(null, async (_, set, userUpdate: Partial<User> & { id: string }) => {
    try {
      const response = await updateUser(userUpdate.id, userUpdate);
  
      // ✅ Vérification stricte avec Type Guard
      if (!response || typeof response !== "object" || !("user" in response) || !isValidUser(response.user)) {
        console.error("❌ Réponse API invalide pour editUser :", response);
        return;
      }
  
      const updatedUser = response.user;
  
      set(usersAtom, (prev) =>
        prev.map((user) => (user.id === userUpdate.id ? updatedUser : user))
      );
  
      console.log(`✅ Utilisateur mis à jour avec succès: ${updatedUser.id}`);
    } catch (error) {
      console.error("❌ Erreur lors de la modification de l'utilisateur :", error);
    }
});  

// 🔹 Modifier le rôle d'un utilisateur (SUPER_ADMIN uniquement)
export const updateUserRoleAtom = atom(null, async (_, set, { id, newRole }: { id: string; newRole: User["role"] }) => {
  try {
    const response = await updateUserRole(id, newRole);

    if (!response || typeof response !== "object" || !("user" in response) || !isValidUser(response.user)) {
      console.error("❌ Réponse API invalide pour updateUserRole :", response);
      return;
    }

    const updatedUser = response.user;

    set(usersAtom, (prev) =>
      prev.map((user) => (user.id === id ? updatedUser : user))
    );

    console.log(`✅ Rôle mis à jour avec succès pour l'utilisateur ID: ${id}`);
  } catch (error) {
    console.error("❌ Erreur lors de la modification du rôle de l'utilisateur :", error);
  }
});

// 🔹 Modifier le statut d'un utilisateur
export const updateUserStatusAtom = atom(null, async (_, set, { id, newStatus }: { id: string; newStatus: User["status"] }) => {
  try {
    await updateUserStatus(id, newStatus);

    set(usersAtom, (prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );

    console.log(`✅ Statut mis à jour avec succès pour l'utilisateur ID: ${id}`);
  } catch (error) {
    console.error("❌ Erreur lors de la modification du statut de l'utilisateur :", error);
  }
});

// 🔹 Supprimer un utilisateur (SUPER_ADMIN uniquement)
export const deleteUserAtom = atom(null, async (_, set, userId: string) => {
    try {
      // 🔹 Affichage d'une boîte de confirmation
      const confirmDelete = window.confirm("❗ Voulez-vous vraiment supprimer cet utilisateur ?");
      if (!confirmDelete) return;
  
      await deleteUserById(userId);
      
      set(usersAtom, (prev) => prev.filter((user) => user.id !== userId));
  
      alert("✅ L'utilisateur a bien été supprimé.");
      console.log(`✅ Utilisateur ID: ${userId} supprimé avec succès.`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'utilisateur :", error);
      alert("❌ Une erreur est survenue lors de la suppression.");
    }
  });    

// 🔹 Fonction pour réinitialiser le mot de passe d'un utilisateur (SUPER_ADMIN uniquement)
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
      console.error("❌ Erreur lors de la demande de réinitialisation :", error);
      alert("❌ Une erreur est survenue. Vérifiez l'email et réessayez.");
    }
});
  