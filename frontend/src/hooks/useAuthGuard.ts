import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserRole } from "../utils/auth";

export const useAuthGuard = (requiredRole: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRole();

    if (!role || role !== requiredRole) {
      navigate("/login");
    }
  }, [navigate, requiredRole]);
};
