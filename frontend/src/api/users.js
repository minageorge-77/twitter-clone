import { apiFetch } from "./http";

export const usersApi = {
  profile: (username) => apiFetch(`/api/users/profile/${encodeURIComponent(username)}`),
  suggested: () => apiFetch("/api/users/suggested"),
  follow: (userId) => apiFetch(`/api/users/follow/${encodeURIComponent(userId)}`, { method: "POST" }),
  update: (payload) => apiFetch("/api/users/update", { method: "POST", body: payload }),
};

