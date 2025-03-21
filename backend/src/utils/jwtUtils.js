import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * 🔑 Générer un token JWT
 * @param {string} userId - ID de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} role - Rôle de l'utilisateur
 * @returns {string} - Token JWT
 */
export const generateJWT = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
};

/**
 * 🔍 Vérifier un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {object|null} - Données du token ou null si invalide
 */
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
