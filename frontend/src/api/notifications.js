import { apiFetch } from "./http";

export const notificationsApi = {
  list: () => apiFetch("/api/notifications"),
  clear: () => apiFetch("/api/notifications", { method: "DELETE" }),
};

