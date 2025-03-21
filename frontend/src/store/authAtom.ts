import { atom } from "jotai";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  classLevel?: string;
};

export const authAtom = atom({
  token: null as string | null,
  role: null as string | null,
  user: null as User | null,
});

