import prisma from '../db.js';

// 🔹 Récupérer tous les cycles avec leurs classes associées
export const getAllCyclesWithClasses = async () => {
  return await prisma.cycle.findMany({
    include: { classes: true },
  });
};

// 🔹 Récupérer une classe spécifique avec son cycle
export const getClassById = async (classId) => {
  return await prisma.class.findUnique({
    where: { id: classId },
    include: { cycle: true },
  });
};

// 🔹 Récupérer toutes les classes d’un cycle donné
export const getClassesByCycle = async (cycleId) => {
  return await prisma.class.findMany({
    where: { cycleId },
  });
};

// 🔹 Récupérer toutes les matières d'une classe donnée
export const getSubjectsByClass = async (classId) => {
  return await prisma.subject.findMany({
    where: { classId },
  });
};

// 🔹 Récupérer toutes les matières d'un cycle donné
export const getSubjectsByCycle = async (cycleId) => {
  return await prisma.cycle.findUnique({
    where: { id: cycleId },
    include: {
      classes: {
        include: {
          subjects: true,
        },
      },
    },
  });
};

// 🔹 Récupérer toutes les catégories d'un cycle donné
export const getCategoriesByCycle = async (cycleId) => {
  return await prisma.cycle.findUnique({
    where: { id: cycleId },
    include: {
      classes: {
        include: {
          subjects: {
            include: {
              categories: true,
            },
          },
        },
      },
    },
  });
};

// 🔹 Récupérer tous les thèmes d'un cycle donné
export const getThemesByCycle = async (cycleId) => {
  return await prisma.cycle.findUnique({
    where: { id: cycleId },
    include: {
      classes: {
        include: {
          subjects: {
            include: {
              categories: {
                include: {
                  themes: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
