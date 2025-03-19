export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  classLevel?: string;
  codePin?: string;
  role: "ELEVE" | "RESPONSABLE_PEDAGOGIQUE" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIF" | "SUSPENDU" | "DESACTIVE";
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}
