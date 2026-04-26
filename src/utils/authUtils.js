// Auth utility functions for JWT token management

// Dispatch custom event when auth state changes
const dispatchAuthChange = () => {
  window.dispatchEvent(new Event("authStateChange"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
  dispatchAuthChange();
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isGuest");
  
  // Disable Google Auto Select
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  
  dispatchAuthChange();
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isGuestMode = () => {
  return localStorage.getItem("isGuest") === "true";
};

export const setGuestMode = () => {
  localStorage.setItem("isGuest", "true");
  // Optionally remove token if any
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatchAuthChange();
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user || user === "undefined") {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatchAuthChange();
};
