import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "../store/authAtom";

export const useAuthGuard = (allowedRoles: string[]) => {
  const navigate = useNavigate();
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    if (!auth.token || !allowedRoles.includes(auth.role || "")) {
      navigate("/login");
    }
  }, [auth.role, auth.token, allowedRoles, navigate]);
};
