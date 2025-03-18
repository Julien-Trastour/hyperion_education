import { getSubjectsByClass, createSubject, updateSubject, deleteSubject } from "../models/subjectModel.js";

// 🔹 Récupérer toutes les matières d'une classe
export const fetchSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const subjects = await getSubjectsByClass(classId);
    res.json(subjects);
  } catch (error) {
    console.error("Erreur lors de la récupération des matières :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Ajouter une nouvelle matière
export const addSubject = async (req, res) => {
  try {
    const { subjectName, classId } = req.body;
    if (!subjectName || !classId) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const newSubject = await createSubject(subjectName, classId);
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Erreur lors de la création de la matière :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Modifier une matière
export const editSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName } = req.body;
    if (!subjectName) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const updatedSubject = await updateSubject(id, subjectName);
    res.json(updatedSubject);
  } catch (error) {
    console.error("Erreur lors de la modification de la matière :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Supprimer une matière
export const removeSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSubject(id);
    res.json({ message: "Matière supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la matière :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
