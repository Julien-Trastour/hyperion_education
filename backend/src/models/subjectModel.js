import prisma from "../db.js";

// 📌 Récupérer toutes les matières d'une classe
export const getSubjectsByClass = async (classId) => {
  return await prisma.subject.findMany({
    where: { classId },
  });
};

// 📌 Créer une nouvelle matière
export const createSubject = async (subjectName, classId) => {
  return await prisma.subject.create({
    data: {
      subjectName,
      classId,
    },
  });
};

// 📌 Modifier une matière
export const updateSubject = async (id, newSubjectName) => {
  return await prisma.subject.update({
    where: { id },
    data: { subjectName: newSubjectName },
  });
};

// 📌 Supprimer une matière
export const deleteSubject = async (id) => {
  return await prisma.subject.delete({
    where: { id },
  });
};
