const storage = sessionStorage;

const TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // Durée de validitée de 24h

export const getToken = (): string | null => {
  const expiration = storage.getItem("tokenExpiration");
  if (expiration && new Date().getTime() > parseInt(expiration, 10)) {
    clearAuthData();
    return null;
  }
  return storage.getItem("token");
};

export const getUserRole = (): string | null => storage.getItem("role");

export const getUserData = (): object | null => {
  const user = storage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token: string, role: string, user: object | null) => {
  const expiration = new Date().getTime() + TOKEN_EXPIRATION_TIME;

  storage.setItem("token", token);
  storage.setItem("role", role);
  storage.setItem("tokenExpiration", expiration.toString());

  if (user) {
    storage.setItem("user", JSON.stringify(user));
  }
};

export const clearAuthData = (): void => {
  storage.removeItem("token");
  storage.removeItem("role");
  storage.removeItem("user");
  storage.removeItem("tokenExpiration");
};
