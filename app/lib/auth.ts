// auth.ts
{/* centralizes cookie logic, prevents repeating document.cookie everywhere
  makes auth actions reusable and readable
  */}


  // this function tells if the browser currently has the auth=logged_in cookie
export const isLoggedIn = () => {
  if (typeof document === "undefined") return false; // If this code runs on the server, just return false safely, this makes the function SSR safe 
  return document.cookie.includes("auth=logged_in");
};

//Mark the user as logged in by setting a cookie. Same logic used in login/page.tsx, just extracted into a function.
export const login = () => {
  document.cookie = "auth=logged_in; path=/";
};

//deletes the auth cookie
//deletion is done by setting the cookie value to empty, set expiry date in the past, browser removes it
export const logout = () => {
  document.cookie =
    "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
