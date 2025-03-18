import prisma from "../db.js";

// 📌 Récupérer toutes les catégories d'une matière
export const getCategoriesBySubject = async (subjectId) => {
  return await prisma.category.findMany({
    where: { subjectId },
  });
};

// 📌 Ajouter une nouvelle catégorie
export const createCategory = async (categoryName, subjectId) => {
  return await prisma.category.create({
    data: {
      categoryName,
      subjectId,
    },
  });
};

// 📌 Modifier une catégorie
export const updateCategory = async (id, newCategoryName) => {
  return await prisma.category.update({
    where: { id },
    data: { categoryName: newCategoryName },
  });
};

// 📌 Supprimer une catégorie
export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id },
  });
};
