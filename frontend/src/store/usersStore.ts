import { atom } from "jotai";

// ✅ Atom pour stocker les utilisateurs
export const usersAtom = atom<User[]>([]);

// ✅ Atom pour stocker le nombre total d'élèves et d'employés
export const studentCountAtom = atom((get) => get(usersAtom).filter((user) => user.role === "ELEVE").length);
export const employeeCountAtom = atom((get) => get(usersAtom).filter((user) => user.role !== "ELEVE").length);

// ✅ Atom pour les filtres (Rôle, Statut, Classe)
export const roleFilterAtom = atom<string[]>([]);
export const statusFilterAtom = atom<string[]>([]);
export const classFilterAtom = atom<string[]>([]);
export const classLevelsAtom = atom<string[]>([]);

// ✅ Atom pour récupérer les utilisateurs depuis l'API
export const fetchUsersAtom = atom(
  null,
  async (_, set) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Impossible de récupérer les utilisateurs.");

      const data = await response.json();
      set(usersAtom, data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
    }
  }
);

// ✅ Atom pour ajouter un utilisateur
export const addUserAtom = atom(
  null,
  async (get, set, newUser: Omit<User, "id"> & { password: string }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Impossible d'ajouter l'utilisateur.");

      const createdUser = await response.json();
      set(usersAtom, [...get(usersAtom), createdUser]);
    } catch (error) {
      console.error("❌ Erreur ajout utilisateur :", error);
    }
  }
);

// ✅ Atom pour éditer un utilisateur
export const editUserAtom = atom(
  null,
  async (get, set, updatedUser: { id: string; role?: string; status?: string; classLevel?: string }) => {
    try {
      const token = sessionStorage.getItem("token");

      // ✅ Trouver l'utilisateur existant
      const existingUser = get(usersAtom).find((user) => user.id === updatedUser.id);
      if (!existingUser) throw new Error("Utilisateur non trouvé.");

      // ✅ Création d'un objet complet
      const completeUser = {
        id: updatedUser.id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: updatedUser.role || existingUser.role,
        status: updatedUser.status || existingUser.status,
        classLevel: updatedUser.classLevel ?? existingUser.classLevel,
      };

      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeUser),
      });

      if (!response.ok) throw new Error("Impossible de modifier l'utilisateur.");

      const updatedData = await response.json();
      set(usersAtom, (users) =>
        users.map((user) => (user.id === updatedUser.id ? updatedData.user : user))
      );
    } catch (error) {
      console.error("❌ Erreur modification utilisateur :", error);
    }
  }
);

// ✅ Atom pour supprimer un utilisateur
export const deleteUserAtom = atom(
  null,
  async (_, set, userId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Impossible de supprimer l'utilisateur.");

      // ✅ Retirer l'utilisateur supprimé de la liste
      set(usersAtom, (prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("❌ Erreur suppression utilisateur :", error);
    }
  }
);

// ✅ Atom pour réinitialiser le mot de passe d'un utilisateur
export const resetPasswordAtom = atom(
  null,
  async (_, __, email: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Impossible de réinitialiser le mot de passe.");
    } catch (error) {
      console.error("❌ Erreur réinitialisation mot de passe :", error);
    }
  }
);

// ✅ Atom pour récupérer les classes depuis l'API
export const fetchClassesAtom = atom(
  null,
  async (_, set) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/api/pathways/classes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Impossible de récupérer les classes.");

      const data = await response.json();
      if (Array.isArray(data)) set(classLevelsAtom, data);
    } catch (error) {
      console.error("❌ Erreur récupération classes :", error);
    }
  }
);

// ✅ Atoms pour activer/désactiver les filtres
export const toggleRoleFilterAtom = atom(
  null,
  (get, set, role: string) => {
    const currentFilters = get(roleFilterAtom);
    set(roleFilterAtom, currentFilters.includes(role) ? currentFilters.filter((r) => r !== role) : [...currentFilters, role]);
  }
);

export const toggleStatusFilterAtom = atom(
  null,
  (get, set, status: string) => {
    const currentFilters = get(statusFilterAtom);
    set(statusFilterAtom, currentFilters.includes(status) ? currentFilters.filter((s) => s !== status) : [...currentFilters, status]);
  }
);

export const toggleClassFilterAtom = atom(
  null,
  (get, set, classLevel: string) => {
    const currentFilters = get(classFilterAtom);
    set(classFilterAtom, currentFilters.includes(classLevel) ? currentFilters.filter((c) => c !== classLevel) : [...currentFilters, classLevel]);
  }
);

// ✅ Type User pour TypeScript
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  birthDate?: string;
  profilePicture?: string;
  classLevel?: string | null;
  createdAt?: string;
};
