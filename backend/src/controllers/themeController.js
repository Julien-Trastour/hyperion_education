import { getThemesByCategory, createTheme, updateTheme, deleteTheme } from "../models/themeModel.js";

// 🔹 Récupérer tous les thèmes d'une catégorie
export const fetchThemesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const themes = await getThemesByCategory(categoryId);
    res.json(themes);
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Ajouter un nouveau thème
export const addTheme = async (req, res) => {
  try {
    const { themeName, categoryId } = req.body;
    if (!themeName || !categoryId) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const newTheme = await createTheme(themeName, categoryId);
    res.status(201).json(newTheme);
  } catch (error) {
    console.error("Erreur lors de la création du thème :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Modifier un thème
export const editTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { themeName } = req.body;
    if (!themeName) {
      return res.status(400).json({ error: "Données manquantes." });
    }

    const updatedTheme = await updateTheme(id, themeName);
    res.json(updatedTheme);
  } catch (error) {
    console.error("Erreur lors de la modification du thème :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🔹 Supprimer un thème
export const removeTheme = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTheme(id);
    res.json({ message: "Thème supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du thème :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
