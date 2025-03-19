import prisma from '../db.js';

/* ==========================
   🔹 Récupérer tous les parcours avec leur thème, leçons et test final
   ========================== */
export const getAllPathways = async () => {
  return await prisma.pathway.findMany({
    include: {
      theme: true,
      lessons: true,
      finalTest: true,
    },
  });
};

/* ==========================
   🔹 Récupérer un parcours par ID avec son thème, ses leçons et son test final
   ========================== */
export const getPathwayById = async (pathwayId) => {
  return await prisma.pathway.findUnique({
    where: { id: pathwayId },
    include: {
      theme: true,
      lessons: true,
      finalTest: true,
    },
  });
};

/* ==========================
   🔹 Récupérer tous les parcours d'un thème donné
   ========================== */
export const getPathwaysByTheme = async (themeId) => {
  return await prisma.pathway.findMany({
    where: { themeId },
    include: {
      lessons: true,
      finalTest: true,
    },
  });
};

/* ==========================
   🔹 Récupérer toutes les leçons d’un parcours donné
   ========================== */
export const getLessonsByPathway = async (pathwayId) => {
  return await prisma.lesson.findMany({
    where: { pathwayId },
  });
};

/* ==========================
   🔹 Créer un nouveau parcours
   ========================== */
export const createPathway = async (data) => {
  return await prisma.pathway.create({
    data,
  });
};

/* ==========================
   🔹 Modifier un parcours existant
   ========================== */
export const updatePathway = async (pathwayId, data) => {
  return await prisma.pathway.update({
    where: { id: pathwayId },
    data,
  });
};

/* ==========================
   🔹 Supprimer un parcours
   ========================== */
export const deletePathway = async (pathwayId) => {
  return await prisma.pathway.delete({
    where: { id: pathwayId },
  });
};

/* ==========================
   🔹 Récupérer un parcours par ID avec son thème, catégorie, matière, classe et cycle
   ========================== */
   export const getPathwayWithRelations = async (pathwayId) => {
    return await prisma.pathway.findUnique({
      where: { id: pathwayId },
      include: {
        theme: {
          include: {
            category: {
              include: {
                themes: true,
                subject: {
                  include: {
                    class: {
                      include: {
                        cycle: true,
                      }
                    }
                  }
                }
              }
            }
          }
        },
        lessons: true,
        finalTest: true,
      },
    });
  };  