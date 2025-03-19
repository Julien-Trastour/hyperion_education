import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserRole } from "../utils/auth";

export const useAuthGuard = (allowedRoles: string[]) => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();

    if (!role || !allowedRoles.includes(role)) {
      navigate("/login");
    }
  }, [navigate, allowedRoles]);
};
