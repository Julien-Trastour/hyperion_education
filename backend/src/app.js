import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cycleRoutes from "./routes/cycleRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import pathwayRoutes from "./routes/pathwayRoutes.js";

dotenv.config();

const app = express();

// 🔹 Middleware de sécurité et logs
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🔹 Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", cycleRoutes);
app.use("/api", subjectRoutes);
app.use("/api", categoryRoutes);
app.use("/api", themeRoutes);
app.use("/api/pathways", pathwayRoutes);

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
