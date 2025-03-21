# 🔗 API REST d'Hypérion Education V2

## 📌 Vue d’ensemble
Cette API suit une architecture RESTful et communique au format JSON.  
Toutes les routes protégées nécessitent un token JWT dans le header `Authorization`.

---

## 🔐 Authentification (`/api/auth`)

<details>
<summary><strong>POST</strong> <code>/api/auth/register</code> – Inscription</summary>

### 📝 Description
Permet à un nouvel utilisateur de s’inscrire.

### 📥 Corps de requête
```json
{
  "email": "eleve@example.com",
  "password": "MotDePasse123",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

### 📤 Réponse – `201 Created`
```json
{
  "message": "Utilisateur enregistré avec succès"
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/login</code> – Connexion</summary>

### 📝 Description
Authentifie l’utilisateur et retourne un token JWT.

### 📥 Corps de requête
```json
{
  "email": "eleve@example.com",
  "password": "MotDePasse123"
}
```

### 📤 Réponse – `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/request-password-reset</code> – Demande de réinitialisation</summary>

### 📝 Description
Envoie un e-mail contenant un lien de réinitialisation de mot de passe.

### 📥 Corps de requête
```json
{
  "email": "eleve@example.com"
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/reset-password</code> – Réinitialisation</summary>

### 📝 Description
Réinitialise le mot de passe d’un utilisateur à l’aide d’un token.

### 📥 Corps de requête
```json
{
  "token": "123456",
  "newPassword": "MotDePasseFort!"
}
```

</details>

---

## 👤 Utilisateurs (`/api/users`)

<details>
<summary><strong>GET</strong> <code>/api/users</code> – Liste des utilisateurs</summary>

Accessible uniquement aux administrateurs.

### 📤 Réponse – `200 OK`
```json
[
  {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
]
```

</details>

<details>
<summary><strong>GET</strong> <code>/api/users/me</code> – Infos de l'utilisateur connecté</summary>

Retourne les informations du profil de l'utilisateur courant.

</details>

<details>
<summary><strong>PUT</strong> <code>/api/users/me</code> – Modifier son profil</summary>

### 📥 Corps de requête
```json
{
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

</details>

<details>
<summary><strong>PUT</strong> <code>/api/users/:id</code> – Modifier un utilisateur</summary>

Accessible aux administrateurs pour modifier n'importe quel utilisateur.

</details>

<details>
<summary><strong>DELETE</strong> <code>/api/users/:id</code> – Supprimer un utilisateur</summary>

Accessible aux administrateurs uniquement.

</details>

<details>
<summary><strong>POST</strong> <code>/api/users</code> – Créer un utilisateur</summary>

Accessible aux administrateurs uniquement.

### 📥 Corps de requête
```json
{
  "email": "newuser@example.com",
  "password": "motdepasse",
  "firstName": "Nouveau",
  "lastName": "Utilisateur",
  "role": "ELEVE"
}
```

</details>

<details>
<summary><strong>POST</strong> <code>/api/users/reset-password</code> – Demande de réinitialisation (doublon possible)</summary>

Voir `/api/auth/request-password-reset`.

</details>

---

## 📘 Parcours (`/api/pathways`)

<details>
<summary><strong>GET</strong> <code>/api/pathways/classes</code> – Liste des classes</summary>

Accessible uniquement aux administrateurs.

### 📤 Réponse – `200 OK`
```json
[
  {
    "id": "uuid",
    "className": "6e"
  }
]
```

</details>

---

## 🔒 Headers pour les routes protégées
```http
Authorization: Bearer <votre_token_JWT>
```

---

## ⚠️ Codes d'erreur courants

| Code | Description                        |
|------|------------------------------------|
| 200  | Requête réussie                    |
| 201  | Création réussie                   |
| 400  | Requête invalide                   |
| 401  | Non authentifié                    |
| 403  | Accès interdit                     |
| 404  | Ressource non trouvée              |
| 500  | Erreur interne du serveur          |
