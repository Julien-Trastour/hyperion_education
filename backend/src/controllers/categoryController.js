import { getCategoriesBySubject, createCategory, updateCategory, deleteCategory } from "../models/categoryModel.js";

// 🔹 Récupérer toutes les catégories d'une matière
export const fetchCategoriesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const categories = await getCategoriesBySubject(subjectId);

    if (!categories.length) {
      return res.status(404).json({ error: "Aucune catégorie trouvée pour cette matière." });
    }

    res.json(categories);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des catégories :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Ajouter une nouvelle catégorie
export const addCategory = async (req, res) => {
  try {
    const { categoryName, subjectId } = req.body;
    if (!categoryName || !subjectId) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const newCategory = await createCategory(categoryName, subjectId);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Modifier une catégorie
export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const updatedCategory = await updateCategory(id, categoryName);
    res.json(updatedCategory);
  } catch (error) {
    console.error("Erreur lors de la modification de la catégorie :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Supprimer une catégorie
export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.json({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
