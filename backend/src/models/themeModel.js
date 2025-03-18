import prisma from "../db.js";

// 📌 Récupérer tous les thèmes d'une catégorie
export const getThemesByCategory = async (categoryId) => {
  return await prisma.theme.findMany({
    where: { categoryId },
  });
};

// 📌 Ajouter un nouveau thème
export const createTheme = async (themeName, categoryId) => {
  return await prisma.theme.create({
    data: {
      themeName,
      categoryId,
    },
  });
};

// 📌 Modifier un thème
export const updateTheme = async (id, newThemeName) => {
  return await prisma.theme.update({
    where: { id },
    data: { themeName: newThemeName },
  });
};

// 📌 Supprimer un thème
export const deleteTheme = async (id) => {
  return await prisma.theme.delete({
    where: { id },
  });
};
