import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function createUsers() {
  try {
    // 🔹 Hachage des mots de passe
    const adminPassword = await argon2.hash("Togo55100.");
    const studentPassword = await argon2.hash("Togo55100.");

    // 🔹 Création de l'utilisateur admin
    const admin = await prisma.user.upsert({
      where: { email: "julien.trastour@outlook.com" },
      update: {},
      create: {
        email: "julien.trastour@outlook.com",
        password: adminPassword,
        firstName: "Julien",
        lastName: "Trastour",
        birthDate: new Date("1993-09-06"),
        classLevel: "N/A",
        role: "admin",
      },
    });

    // 🔹 Création de l'utilisateur étudiant
    const student = await prisma.user.upsert({
      where: { email: "demangel55@gmail.com" },
      update: {},
      create: {
        email: "demangel55@gmail.com",
        password: studentPassword,
        firstName: "Alizée",
        lastName: "Demangel",
        birthDate: new Date("1999-08-06"),
        classLevel: "Terminale",
        role: "eleve",
      },
    });

    console.log("✅ Utilisateurs créés avec succès !");
    console.log({ admin, student });
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des utilisateurs :", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécute le script
createUsers();
