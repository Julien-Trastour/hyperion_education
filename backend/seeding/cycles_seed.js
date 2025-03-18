import prisma from "../src/db.js"; // Assurez-vous que votre connexion Prisma est correcte

const seedDatabase = async () => {
    try {
      // Définition des cycles avec leurs classes associées
      const cyclesData = [
        { cycleName: "Cycle 1 : Apprentissage premiers", classes: ["Petite Section", "Moyenne Section", "Grande Section"] },
        { cycleName: "Cycle 2 : Apprentissages fondamentaux", classes: ["CP", "CE1", "CE2"] },
        { cycleName: "Cycle 3 : Consolidation", classes: ["CM1", "CM2", "6ᵉ"] },
        { cycleName: "Cycle 4 : Approfondissements", classes: ["5ᵉ", "4ᵉ", "3ᵉ"] },
        { cycleName: "Lycée", classes: ["Seconde", "Première", "Terminale"] },
      ];
  
      // Insérer les cycles et leurs classes
      for (const cycle of cyclesData) {
        const createdCycle = await prisma.cycle.create({
          data: {
            cycleName: cycle.cycleName, // Utilisation du bon nom de champ
            classes: {
              create: cycle.classes.map((className) => ({ className })), // Utilisation du bon champ pour les classes
            },
          },
        });
  
        console.log(`✅ Cycle ajouté : ${createdCycle.cycleName}`);
      }
  
      console.log("🎉 Insertion terminée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de l'insertion :", error);
    } finally {
      await prisma.$disconnect();
    }
  };
  
  // Exécuter le script
  seedDatabase();