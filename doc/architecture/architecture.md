# 🏗️ Architecture technique d'Hypérion Education V2

## 📌 Vue d’ensemble

Hypérion Education V2 est une application composée de **trois éléments principaux** :
1. **Un frontend** développé en **Vite + React + TypeScript**.
2. **Un backend** basé sur **Node.js + Express** avec une base de données **PostgreSQL**.
3. **Une API REST** qui assure la communication entre le frontend et le backend.

---

## 📂 Structure du projet

L’application est organisée comme suit :
```
/HE_V2
├── backend/           # Serveur Express.js (API REST)
│   ├── src/
│   │   ├── routes/     # Endpoints de l’API
│   │   ├── controllers/ # Logique métier des endpoints
│   │   ├── services/   # Gestion de la logique métier
│   │   ├── models/     # Modèles Prisma
│   │   ├── middlewares/ # Middleware (auth, validation)
│   ├── prisma/        # Gestion des migrations de la base de données
│   ├── seeding/       # Scripts pour pré-remplir la base de données
│   ├── package.json   # Dépendances et scripts du backend
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/ # Composants réutilisables
│   │   ├── pages/     # Pages principales
│   │   ├── hooks/     # Hooks React personnalisés
│   │   ├── context/   # Gestion du state global
│   ├── public/       # Fichiers statiques (icônes, manifest.json)
│   ├── package.json   # Dépendances et scripts du frontend
└── doc/              # Documentation du projet
```

---

## 🛠️ Base de données
- La base de données est PostgreSQL.

- Prisma est utilisé comme ORM pour gérer les modèles et les migrations.

- Les relations principales entre les entités sont :
```sh
Utilisateur (1) --- (N) Parcours
Parcours (1) --- (N) Cours
Cours (1) --- (N) Exercices
```
[![📂 Documentation BDD](https://img.shields.io/badge/-📂%20Documentation%20BDD-blue?style=for-the-badge)](BDD.md)

---

## 🛡️ Communication entre le frontend et le backend
Le frontend envoie des requêtes API au backend via une API REST.
- Exemple d’appel API pour récupérer les cours :
```sh
fetch(`${import.meta.env.VITE_API_URL}/cours`)
  .then(res => res.json())
  .then(data => console.log(data));
```

--- 

### 🌍 Gestion des environnements
Trois environnements sont prévus :

1. Développement (.env local avec une base PostgreSQL locale)

2. Staging (instance pré-production)

3. Production (base de données et API sur un serveur)

---

Cette documentation est amenée à évoluer au fil du développement du projet.