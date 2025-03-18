import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envoie un e-mail de réinitialisation de mot de passe
 * @param {string} email - L'adresse e-mail de l'utilisateur
 * @param {string} token - Le token de réinitialisation
 */
export const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password/confirm?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
    html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetLink}">Réinitialiser mon mot de passe</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de réinitialisation envoyé à ${email}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};
