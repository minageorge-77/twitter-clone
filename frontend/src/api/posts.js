import { apiFetch } from "./http";

export const postsApi = {
  all: () => apiFetch("/api/posts/all"),
  following: () => apiFetch("/api/posts/following"),
  userPosts: (username) => apiFetch(`/api/posts/user/${encodeURIComponent(username)}`),
  likedPosts: (userId) => apiFetch(`/api/posts/likes/${encodeURIComponent(userId)}`),
  create: ({ text, img }) => apiFetch("/api/posts/create", { method: "POST", body: { text, img } }),
  like: (postId) => apiFetch(`/api/posts/like/${encodeURIComponent(postId)}`, { method: "POST" }),
  comment: (postId, { text }) =>
    apiFetch(`/api/posts/comment/${encodeURIComponent(postId)}`, { method: "POST", body: { text } }),
  remove: (postId) => apiFetch(`/api/posts/${encodeURIComponent(postId)}`, { method: "DELETE" }),
};

