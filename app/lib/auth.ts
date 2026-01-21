// auth.ts

export const isLoggedIn = () => {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("auth=logged_in");
};

export const login = () => {
  document.cookie = "auth=logged_in; path=/";
};

export const logout = () => {
  document.cookie =
    "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
