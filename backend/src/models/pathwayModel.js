import prisma from "../db.js";

// 🎓 Récupérer toutes les classes uniques (utilisé dans les filtres)
export const getAllClasses = async () => {
  return await prisma.class.findMany({
    select: { className: true },
  });
};

// 🔄 Récupérer tous les cycles
export const getAllCycles = async () => {
  return await prisma.cycle.findMany({
    select: {
      id: true,
      cycleName: true,
    },
  });
};

// 📘 Récupérer les classes d'un cycle donné
export const getClassesByCycleId = async (cycleId) => {
  return await prisma.class.findMany({
    where: { cycleId },
    select: {
      id: true,
      className: true,
    },
  });
};

/* ========================================================
        Opérations CRUD Subjects
======================================================== */

// 📚 Récupérer les matières d'une classe donnée
export const getSubjectsByClassId = async (classId) => {
  return await prisma.subject.findMany({
    where: { classId },
    select: {
      id: true,
      subjectName: true,
    },
  });
};

// ➕ Créer une matière
export const createSubject = async (classId, subjectName) => {
  return await prisma.subject.create({
    data: {
      subjectName,
      class: { connect: { id: classId } },
    },
  });
};

// ✏️ Modifier une matière
export const updateSubject = async (subjectId, subjectName) => {
  return await prisma.subject.update({
    where: { id: subjectId },
    data: { subjectName },
  });
};

// ❌ Supprimer une matière
export const deleteSubject = async (subjectId) => {
  return await prisma.subject.delete({
    where: { id: subjectId },
  });
};

/* ========================================================
        Opérations CRUD Categories
======================================================== */

// 🗂️ Récupérer les catégories d'une matière donnée
export const getCategoriesBySubjectId = async (subjectId) => {
  return await prisma.category.findMany({
    where: { subjectId },
    select: {
      id: true,
      categoryName: true,
    },
  });
};

// ➕ Créer une catégorie
export const createCategory = async (subjectId, categoryName) => {
  return await prisma.category.create({
    data: {
      categoryName,
      subject: { connect: { id: subjectId } },
    },
  });
};

// ✏️ Modifier une catégorie
export const updateCategory = async (categoryId, categoryName) => {
  return await prisma.category.update({
    where: { id: categoryId },
    data: { categoryName },
  });
};

// ❌ Supprimer une catégorie
export const deleteCategory = async (categoryId) => {
  return await prisma.category.delete({
    where: { id: categoryId },
  });
};

/* ========================================================
        Opérations CRUD Themes
======================================================== */

// 🧩 Récupérer les thèmes d'une catégorie donnée
export const getThemesByCategoryId = async (categoryId) => {
  return await prisma.theme.findMany({
    where: { categoryId },
    select: {
      id: true,
      themeName: true,
    },
  });
};

// ➕ Créer un thème
export const createTheme = async (categoryId, themeName) => {
  return await prisma.theme.create({
    data: {
      themeName,
      category: { connect: { id: categoryId } },
    },
  });
};

// ✏️ Modifier un thème
export const updateTheme = async (themeId, themeName) => {
  return await prisma.theme.update({
    where: { id: themeId },
    data: { themeName },
  });
};

// ❌ Supprimer un thème
export const deleteTheme = async (themeId) => {
  return await prisma.theme.delete({
    where: { id: themeId },
  });
};

/* ========================================================
        Contenu d’un Pathway (Lessons + Exercises)
======================================================== */

// 🔍 Récupérer le contenu complet d’un pathway
export const getPathwayContent = async (pathwayId) => {
  const pathway = await prisma.pathway.findUnique({
    where: { id: pathwayId },
    select: {
      title: true,
      lessons: {
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
      pathwayExercises: {
        select: {
          id: true,
          order: true,
          exercise: {
            select: {
              id: true,
              title: true,
              content: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!pathway) throw new Error("Pathway introuvable.");

  return {
    title: pathway.title,
    lessons: pathway.lessons,
    exercises: pathway.pathwayExercises.map((pe) => ({
      id: pe.exercise.id,
      title: pe.exercise.title,
      content: pe.exercise.content,
      order: pe.order,
    })),
  };
};

// 💾 Mettre à jour le contenu d’un pathway
export const updatePathwayContent = async (pathwayId, title, lessons, exercises) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Mettre à jour le titre
    await tx.pathway.update({
      where: { id: pathwayId },
      data: { title },
    });

    // 2. Supprimer les anciennes leçons
    await tx.lesson.deleteMany({ where: { pathwayId } });

    // 3. Réinsérer les leçons
    for (const [index, lesson] of lessons.entries()) {
      await tx.lesson.create({
        data: {
          title: lesson.title,
          content: lesson.content,
          order: index,
          pathway: { connect: { id: pathwayId } },
        },
      });
    }

    // 4. Supprimer les anciens liens d'exercices
    await tx.pathwayExercise.deleteMany({ where: { pathwayId } });

    // 5. Réinsérer les exercices (on suppose qu'ils existent déjà)
    for (const [index, exercise] of exercises.entries()) {
      await tx.pathwayExercise.create({
        data: {
          pathway: { connect: { id: pathwayId } },
          exercise: { connect: { id: exercise.id } },
          order: index,
        },
      });
    }

    return { message: "Contenu du pathway mis à jour." };
  });
};

// 📦 Récupérer tous les pathways avec leurs leçons + exercices
export const getPathwaysWithRelations = async () => {
  return await prisma.pathway.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      themeId: true,
      theme: {
        select: {
          id: true,
          themeName: true,
          category: {
            select: {
              id: true,
              subjectId: true,
            },
          },
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
        },
        orderBy: { order: "asc" },
      },
      pathwayExercises: {
        select: {
          id: true,
          order: true,
          exercise: {
            select: {
              id: true,
              title: true,
              content: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });
};

