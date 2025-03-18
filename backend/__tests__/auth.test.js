import request from 'supertest';
import app from '../app.js';  // Importer l'application Express
import prisma from '../db.js';  // Importer Prisma pour utiliser la base de données dans les tests
import argon2 from 'argon2';    // Importer argon2 pour hacher le mot de passe

let server;

describe('Auth Routes', () => {

  beforeAll(async () => {
    // Hachage du mot de passe avant de l'insérer dans la base de données
    const hashedPassword = await argon2.hash('password123'); // Hachage du mot de passe

    // Insérer un utilisateur de test dans la base de données avant tous les tests
    await prisma.user.create({
      data: {
        email: 'newuser@example.com',
        password: hashedPassword,  // Utilisation du mot de passe haché
        firstName: 'Jane',
        lastName: 'Doe',
        birthDate: new Date('1990-01-01'),
        classLevel: 'B',
        role: 'eleve',
      },
    });

    // Démarrer le serveur avant les tests
    server = app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  });

  afterAll(async () => {
    // Supprimer l'utilisateur de test après tous les tests
    await prisma.user.deleteMany({
      where: {
        email: 'newuser@example.com', // Utilise l'email unique pour supprimer cet utilisateur
      },
    });

    // Supprimer les tokens de réinitialisation de mot de passe si nécessaires
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: {
          in: [/* Ajoute ici les ID des utilisateurs de test si nécessaire */],
        },
      },
    });

    // Fermer le serveur après tous les tests
    server.close();
  });

  // Test de l'inscription d'un nouvel utilisateur
  it('should register a new user', async () => {
    const email = `newuser_${Date.now()}@example.com`; // Génère un email unique avec un timestamp

    const response = await request(app).post('/api/auth/register').send({
      email: email,
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      classLevel: 'B',
      role: 'eleve',
    });

    console.log(response.body);  // Affiche la réponse détaillée
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });

  // Test de la connexion d'un utilisateur existant
  it('should login an existing user', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'newuser@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Test de la demande de réinitialisation de mot de passe
  it('should request a password reset email', async () => {
    const response = await request(app).post('/api/auth/request-password-reset').send({
      email: 'newuser@example.com',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  // Test de la connexion avec un mauvais mot de passe
  it('should not login with wrong password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'newuser@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  // Test de la demande de réinitialisation pour un utilisateur inexistant
  it('should return error for non-existing user when requesting password reset', async () => {
    const response = await request(app).post('/api/auth/request-password-reset').send({
      email: 'nonexistent@example.com',
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  // Test de la suppression d'un utilisateur
  it('should delete an existing user', async () => {
    const email = `newuser_${Date.now()}@example.com`;  // Email unique pour le test
  
    // Enregistrer un nouvel utilisateur
    const response = await request(app).post('/api/auth/register').send({
      email: email,
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      classLevel: 'B',
      role: 'eleve',
    });
  
    expect(response.status).toBe(201);
  
    // Connexion avec un utilisateur admin pour obtenir un token
    const adminResponse = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',  // Utilisateur admin
      password: 'adminpassword',   // Mot de passe de l'admin
    });
  
    const token = adminResponse.body.token;  // Récupération du token admin
  
    // Appeler la route pour supprimer un utilisateur en tant qu'admin
    const deleteResponse = await request(app)
      .delete('/api/auth/delete')  // Route de suppression
      .set('Authorization', `Bearer ${token}`)  // Utilisation du token admin
      .send({
        email: email,  // L'email de l'utilisateur à supprimer
      });
  
    expect(deleteResponse.status).toBe(200);  // Vérifie que le code est 200
    expect(deleteResponse.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');
  
    // Vérifier que l'utilisateur a bien été supprimé de la base de données
    const deletedUser = await prisma.user.findUnique({
      where: { email: email },
    });
  
    expect(deletedUser).toBeNull();  // L'utilisateur doit être null
  });  
});
