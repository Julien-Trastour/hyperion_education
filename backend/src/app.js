import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// 🔹 Middleware de sécurité et logs
app.use(helmet()); // Protège contre les attaques courantes
app.use(cors()); // Active CORS pour permettre les requêtes cross-origin
app.use(express.json()); // Permet de lire le JSON dans les requêtes
app.use(morgan("dev")); // Affiche les requêtes HTTP dans la console (utile en dev)

// 🔹 Routes API
app.use("/api/auth", authRoutes);

// 🔹 Page d'accueil de l'API
app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenue sur l'API Hypérion Education" });
});

// 🔹 Gestion des routes inexistantes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// 🔹 Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err.message);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

export default app;
