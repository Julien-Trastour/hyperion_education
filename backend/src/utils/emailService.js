import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Vérification que les variables d'environnement sont bien définies
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ ERREUR : EMAIL_USER ou EMAIL_PASS non définis dans le fichier .env");
  throw new Error("Configuration email incomplète.");
}

// ✅ Configuration du transporteur avec Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 📩 Envoie un e-mail de réinitialisation de mot de passe
 * @param {string} email - L'adresse e-mail de l'utilisateur
 * @param {string} token - Le token de réinitialisation
 */
export const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password/confirm?token=${token}`;

  const mailOptions = {
    from: `"Hypérion Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔑 Réinitialisation de votre mot de passe",
    text: `Bonjour,\n\nVous avez demandé une réinitialisation de votre mot de passe.\nCliquez sur ce lien pour le réinitialiser : ${resetLink}\n\nSi vous n'avez pas fait cette demande, ignorez cet e-mail.\n\nCordialement,\nL'équipe Hypérion`,
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <p><a href="${resetLink}" style="color:blue; text-decoration:underline;">Cliquez ici pour réinitialiser votre mot de passe</a></p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet e-mail.</p>
      <p>Cordialement,<br><strong>L'équipe Hypérion</strong></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 E-mail de réinitialisation envoyé à ${email}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email. Vérifiez votre configuration SMTP.");
  }
};
