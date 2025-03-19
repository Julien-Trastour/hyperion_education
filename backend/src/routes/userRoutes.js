import express from "express";
import { authenticateToken, isAdmin, isSuperAdmin } from "../middlewares/authMiddleware.js";
import {
  getUsers,
  editUser,
  changeUserRole,
  changeUserStatus,
  removeUser
} from "../controllers/userController.js";

const router = express.Router();

// 🔹 Récupérer la liste des utilisateurs (accessible aux ADMIN et SUPER_ADMIN)
router.get("/", authenticateToken, isAdmin, getUsers);

// 🔹 Modifier un utilisateur (accessible aux ADMIN et SUPER_ADMIN)
router.put("/:id", authenticateToken, isAdmin, editUser);

// 🔹 Modifier le rôle d'un utilisateur (seul le SUPER_ADMIN peut le faire)
router.patch("/:id/role", authenticateToken, isSuperAdmin, changeUserRole);

// 🔹 Modifier le statut d'un utilisateur (accessible aux ADMIN et SUPER_ADMIN)
router.patch("/:id/status", authenticateToken, isAdmin, changeUserStatus);

// 🔹 Supprimer un utilisateur (seul le SUPER_ADMIN peut supprimer un ADMIN ou un RESPONSABLE_PEDAGOGIQUE)
router.delete("/:id", authenticateToken, isSuperAdmin, removeUser);

export default router;
