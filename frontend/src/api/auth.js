import { apiFetch } from "./http";

export const authApi = {
  me: () => apiFetch("/api/auth/me"),
  login: ({ username, password }) =>
    apiFetch("/api/auth/login", { method: "POST", body: { username, password } }),
  signup: ({ fullName, username, email, password }) =>
    apiFetch("/api/auth/signup", {
      method: "POST",
      body: { fullName, username, email, password },
    }),
  logout: () => apiFetch("/api/auth/logout", { method: "POST" }),
};

