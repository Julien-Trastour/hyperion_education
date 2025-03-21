# 🏢 Architecture technique d'Hypérion Education V2

L’architecture d’**Hypérion Education V2** est conçue pour être **modulaire, scalable et facile à maintenir**.  
Elle repose sur une séparation **frontend / backend** et une communication **via API REST**.

---

## 🌍 Vision générale

L’application est composée de **trois blocs principaux** :

1️⃣ **Frontend** : Une interface utilisateur développée avec **React + Vite**  
2️⃣ **Backend** : Une API REST en **Node.js + Express** qui gère la logique métier  
3️⃣ **Base de données** : Un stockage centralisé en **PostgreSQL**, modélisé avec **Prisma**  

Chaque partie est **indépendante** et communique via **des appels API REST**.

---

## 🔧 Pourquoi cette architecture ?
Nous avons choisi cette structure pour **assurer plusieurs avantages** :

✔ **Modularité** → Chaque partie peut être développée et mise à jour indépendamment  
✔ **Scalabilité** → Possibilité d’ajouter de nouveaux services sans impacter l’ensemble  
✔ **Facilité de maintenance** → Code organisé, facile à comprendre et documenté  
✔ **Interopérabilité** → L’API peut être utilisée par d’autres clients (app mobile, chatbot, etc.)  

---

## 📊 Schéma global de l’architecture

Voici une représentation simplifiée des interactions entre les composants :

```
[Frontend React] ←→ [Backend Node.js] ←→ [Base de données PostgreSQL]
```
Et plus précisément :

```
Utilisateur  →  Interface React  →  API REST  →  Base de données PostgreSQL
                     ↑                   ↓
                 Authentification       Gestion des cours & exercices
```
Explication :

- L’utilisateur interagit avec l’interface React.

- Le frontend envoie des requêtes API REST au backend pour authentifier, récupérer des cours, envoyer des exercices, etc..

- Le backend traite les requêtes et communique avec la base de données PostgreSQL.

- Les réponses sont renvoyées au frontend et affichées à l’utilisateur.

---

## 🚀 Interaction entre les composants

### 1️⃣ Communication entre le frontend et le backend
Le frontend envoie des requêtes API au backend via des appels HTTP.

Exemple d’appel pour récupérer la liste des cours :
```js
fetch(`${import.meta.env.VITE_API_URL}/courses`)
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2️⃣ Gestion de l'authentification
L’authentification est basée sur des tokens JWT, ce qui permet :

✔ Une connexion sécurisée

✔ Une gestion des rôles et permissions

L’utilisateur doit s’authentifier avant d’accéder aux données protégées.

---

## 📚 Aller plus loin
📌 [Base de données et modèles Prisma](BDD.md)  
📌 [Détails sur l’API REST et les endpoints](API.md)  
📌 [Organisation du backend](backend.md)  
📌 [Structure du frontend React](frontend.md)  
