import { PrismaClient } from '@prisma/client';

// Créer une instance de PrismaClient pour interagir avec la base de données
const prisma = new PrismaClient();

// Exporter l'instance Prisma pour pouvoir l'utiliser dans les autres fichiers
export default prisma;
