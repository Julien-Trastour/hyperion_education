import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// Générer un token JWT
export const generateJWT = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
};

// Vérifier un token JWT
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
