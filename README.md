# Hypérion Education V2

## 📖 Présentation

**Hypérion Education V2** est une plateforme interactive de **renforcement scolaire**, conçue pour accompagner les élèves dans leur apprentissage grâce à des **cours interactifs**, des **exercices variés** et des **parcours personnalisés** adaptés aux différents niveaux scolaires.

L’objectif principal du projet est de fournir une solution pédagogique dynamique qui s’adapte aux besoins de chaque apprenant, en combinant des contenus éducatifs structurés et un suivi précis de la progression.

### ✨ Fonctionnalités principales :
✔ **Parcours d’apprentissage personnalisés** en fonction du niveau et des compétences de l’élève.  
✔ **Cours interactifs** organisés par matière et par niveau scolaire.  
✔ **Exercices et évaluations** intégrés pour suivre la progression des élèves.  
✔ **Analyse des résultats et recommandations** pour améliorer l’apprentissage.  
✔ **Espace enseignants** pour gérer les élèves et suivre leurs performances.  
✔ **Interface intuitive** accessible sur ordinateur et tablette.

📂 La documentation complète est disponible dans le dossier [`doc/`](./doc/).

---

## 📂 Structure du projet

```
/HE_V2
├── doc/               # Documentation du projet
│   ├── architecture.md  # Description de l'architecture technique
│   ├── installation.md  # Guide d'installation et de configuration
│   ├── usage.md         # Instructions d'utilisation
│   ├── developpement.md # Notes pour les développeurs
│   └── ...              # Autres fichiers de documentation
├── backend/           # Code source du backend (Node.js + Express + Prisma)
│   ├── src/           # Dossier principal du backend (routes, controllers, etc.)
│   ├── prisma/        # Gestion du schéma et migrations pour la base de données
│   ├── seeding/       # Scripts pour peupler la base de données
│   ├── __tests__/     # Tests unitaires et d’intégration
│   ├── .env          # Fichier de configuration des variables d’environnement
│   ├── .gitignore    # Fichiers ignorés par Git
│   ├── package.json  # Dépendances et scripts du backend
│   ├── package-lock.json  # Fichier de verrouillage des dépendances
│   ├── server.js     # Fichier principal du serveur Express
└── frontend/          # Code source du frontend (Vite + React + TypeScript)
    ├── src/          # Code source du frontend (composants, pages, etc.)
    ├── public/       # Fichiers statiques (icônes, images, manifest.json)
    ├── .gitignore    # Fichiers ignorés par Git
    ├── package.json  # Dépendances et scripts du frontend
    ├── package-lock.json  # Fichier de verrouillage des dépendances
    ├── biome.json    # Configuration du linter Biome
    ├── index.html    # Point d'entrée du frontend
    ├── tailwind.config.js  # Configuration de Tailwind CSS
    ├── tsconfig.json  # Configuration TypeScript
    ├── vite.config.ts  # Configuration de Vite
```

---

## 🚀 Installation et Déploiement

### 1️⃣ Prérequis
Avant de commencer, assurez-vous d’avoir installé :

- **Node.js** (v18 ou supérieur)
- **PostgreSQL** (si base de données locale)
- **Git** (pour cloner le projet)

### 2️⃣ Cloner le projet
```sh
git clone https://github.com/Julien-Trastour/hyperion_education.git
cd hyperion-education
```

### 3️⃣ Installer les dépendances
📌 Installer les dépendances du backend :
```sh
cd backend
npm install
```
📌 Installer les dépendances du frontend :
```sh
cd frontend
npm install
```

### 4️⃣ Configuration de la base de données
Créer un fichier .env à la racine du projet avec :
```sh
DATABASE_URL=postgres://user:password@localhost:5432/hyperion_education
JWT_SECRET=ton_secret_pour_le_token
   ```

📌 Si vous souhaitez configurer un port spécifique pour le backend, ajoutez :
```sh
PORT=3000
   ```

📌 Si vous voulez configurer l’URL de l’API pour le frontend, ajoutez un fichier .env dans front/ :
```sh
VITE_API_URL=http://localhost:3000
   ```

### 5️⃣ Lancer l’application
📌 Démarrer le backend :
```sh
cd back
npm run dev
```

📌 Démarrer le frontend :
```sh
cd ../front
npm run dev
```

---

## 🛠️ Contribution et Développement

📌 Bonnes pratiques :
- Suivre la structure du projet pour une meilleure organisation.
- Documenter chaque nouvelle fonctionnalité dans le dossier doc/.
- Respecter les conventions de code et utiliser des commits clairs.
- Faire des pull requests pour toute modification majeure.

Nous encourageons la participation de tous pour améliorer Hypérion Education V2 et proposer une expérience d’apprentissage enrichissante ! 🚀

---
## 📞 Support
Si tu rencontres un problème, tu peux :

Vérifier la [documentation](./doc/).

Ouvrir une issue sur le dépôt GitHub.

Contacter l’équipe de développement.

---
## 📖 Documentation complète

📚 Pour plus d’informations sur l’architecture, l’installation et l’utilisation, consultez la documentation complète :

[![📖 Consulter la documentation](https://img.shields.io/badge/-Consulter%20la%20documentation-blue?style=for-the-badge)](./doc/index.md)