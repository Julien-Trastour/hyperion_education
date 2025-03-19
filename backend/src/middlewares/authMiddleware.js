import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware pour vérifier si l'utilisateur est authentifié
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
  }

  // Vérifier le token avec la clé secrète
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide.' });
    }

    // Ajouter l'utilisateur décodé au request pour utilisation dans les autres middlewares ou routes
    req.user = user;
    next();
  });
};

// Middleware pour vérifier si l'utilisateur est un ADMIN ou un SUPER_ADMIN
export const isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Accès refusé. Vous devez être administrateur.' });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est un SUPER_ADMIN
export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Accès réservé au super-administrateur.' });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est un RESPONSABLE PÉDAGOGIQUE ou un ADMIN
export const isResponsablePedagogique = (req, res, next) => {
  if (!req.user || (req.user.role !== 'RESPONSABLE_PEDAGOGIQUE' && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: 'Accès refusé. Vous devez être responsable pédagogique ou administrateur.' });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est un ÉLÈVE
export const isEleve = (req, res, next) => {
  if (!req.user || req.user.role !== 'ELEVE') {
    return res.status(403).json({ error: 'Accès réservé aux élèves.' });
  }
  next();
};
