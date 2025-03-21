import { setAuthData, getToken, clearAuthData } from "../utils/auth";
import { authAtom } from "../store/authAtom";
import { getDefaultStore } from "jotai";

// ✅ Récupération de l'URL API depuis .env
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 🔐 Connexion d'un utilisateur
 * @param email Email de l'utilisateur
 * @param password Mot de passe de l'utilisateur
 * @returns Données utilisateur si la connexion réussit
 */
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Échec de la connexion");
    }

    // ✅ Stocker les données avec expiration
    setAuthData(data.token, data.user.role, data.user);
    sessionStorage.setItem("auth", JSON.stringify({ token: data.token, role: data.user.role, user: data.user }));

    // ✅ Mettre à jour Jotai
    const store = getDefaultStore();
    store.set(authAtom, { token: data.token, role: data.user.role, user: data.user });

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Erreur inconnue lors de la connexion.");
  }
}

/**
 * 📝 Inscription d'un utilisateur
 * @param userData Données du nouvel utilisateur
 * @returns Données utilisateur si l'inscription réussit
 */
export async function register(userData: object) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Inscription échouée.");
    }

    // ✅ Stocker les données avec expiration
    setAuthData(data.token, data.user.role, data.user);
    sessionStorage.setItem("auth", JSON.stringify({ token: data.token, role: data.user.role, user: data.user }));

    // ✅ Mettre à jour Jotai
    const store = getDefaultStore();
    store.set(authAtom, { token: data.token, role: data.user.role, user: data.user });

    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Erreur inconnue lors de l'inscription.");
  }
}

/**
 * 📩 Demande de réinitialisation de mot de passe
 * @param email Email de l'utilisateur
 * @returns Message de confirmation si la demande est bien envoyée
 */
export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la demande de réinitialisation.");
    }

    return data.message || "Un email de réinitialisation a été envoyé !";
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
  }
}

/**
 * 🔄 Réinitialisation du mot de passe
 * @param token Jeton de réinitialisation (fourni dans l'URL)
 * @param newPassword Nouveau mot de passe choisi par l'utilisateur
 * @returns Message de confirmation si le mot de passe est bien modifié
 */
export async function resetPassword(token: string, newPassword: string) {
  if (!token) {
    throw new Error("Le token est invalide ou manquant.");
  }

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Impossible de réinitialiser le mot de passe.");
    }

    return data.message || "Mot de passe réinitialisé avec succès !";
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
  }
}

/**
 * 🔓 Déconnexion de l'utilisateur
 */
export function logout() {
  const store = getDefaultStore();

  // ✅ Supprimer uniquement les données d'authentification
  clearAuthData();
  sessionStorage.removeItem("auth");

  // ✅ Réinitialiser l'état global avec Jotai
  store.set(authAtom, { token: null, role: null, user: null });
}

/**
 * ✅ Charger les données d'authentification au démarrage
 */
export function loadAuthFromSession() {
  const token = getToken();
  if (!token) return;

  const storedAuth = sessionStorage.getItem("auth");
  if (storedAuth) {
    const authData = JSON.parse(storedAuth);
    const store = getDefaultStore();
    store.set(authAtom, authData);
  }
}

