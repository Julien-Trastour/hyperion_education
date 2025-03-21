# Endpoint à mettre en place dans l'API

## authRoutes.js

| Méthode | Route | Description | Accès | Etat (✅ ou ) |
| ------- | ----- | ----------- | ----- | ---- |
| POST | /auth/login | Connexion d'un utilisateur | Public |  |
| POST | /auth/register | Inscription d'un utilisateur | Public |  |
| POST | /auth/request-password-reset | Envoi d’un email de réinitialisation | Public |  |
| POST | /auth/reset-password | Réinitialisation du mot de passe via un token | Public |  |

## userRoutes.js
| Méthode | Route | Description | Accès | Etat (✅ ou ) |
| ------- | ----- | ----------- | ----- | ---- |
| GET | /users/ | Récupérer la liste des utilisateurs | Admin |  |
| GET | /users/:id | Récupérer les infos d’un utilisateur spécifique | Admin / Utilisateur Propriétaire |  |
| POST | /users/ | Créer un utilisateur (par un admin) | Admin |  |
| PUT | /users/:id | Modifier un utilisateur (nom, email, rôle, etc.) | Admin / Utilisateur Propriétaire |  |
| DELETE | /users/:id | Supprimer un utilisateur | Admin |  |

## courseRoutes.js
| Méthode | Route | Description | Accès | Etat (✅ ou ) |
| ------- | ----- | ----------- | ----- | ---- |
| GET | /courses/ | Récupérer tous les cours | Admin |  |
| GET | /courses/:id | Récupérer un cours spécifique | Admin |  |
| POST | /courses/ | Créer un nouveau cours | Admin |  |
| PUT | /courses/:id | Modifier un cours existant | Admin |  |
| DELETE | /courses/:id | Supprimer un cours | Admin |  |

