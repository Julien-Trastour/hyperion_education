export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: string;
    classLevel?: string;
    role: "SUPER_ADMIN" | "ADMIN" | "RESPONSABLE_PEDAGOGIQUE" | "ELEVE";
    status: "ACTIF" | "SUSPENDU" | "DESACTIVE";
    profilePicture?: string;
    createdAt: string;
  }
  
  