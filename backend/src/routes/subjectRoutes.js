import express from "express";
import { fetchSubjectsByClass, addSubject, editSubject, removeSubject } from "../controllers/subjectController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Récupérer les matières d'une classe (accessible à tous les utilisateurs connectés)
router.get("/subjects/:classId", authenticateToken, fetchSubjectsByClass);

// 📌 Ajouter une matière (réservé aux admins)
router.post("/subjects", authenticateToken, isAdmin, addSubject);

// 📌 Modifier une matière (réservé aux admins)
router.put("/subjects/:id", authenticateToken, isAdmin, editSubject);

// 📌 Supprimer une matière (réservé aux admins)
router.delete("/subjects/:id", authenticateToken, isAdmin, removeSubject);

export default router;
