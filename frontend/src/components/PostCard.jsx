import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { postsApi } from "../api/posts";
import { qk } from "../app/queryKeys";
import { useMe } from "../hooks/useMe";

function formatTime(iso) {
  const d = new Date(iso);
  const delta = Date.now() - d.getTime();
  const mins = Math.floor(delta / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

export function PostCard({ post }) {
  const qc = useQueryClient();
  const me = useMe();
  const [comment, setComment] = useState("");

  const likedByMe = useMemo(() => {
    const id = me.data?._id;
    return id ? post.likes?.includes(id) : false;
  }, [me.data?._id, post.likes]);

  const canDelete = useMemo(() => {
    const id = me.data?._id;
    return id ? post.user?._id === id : false;
  }, [me.data?._id, post.user?._id]);

  const like = useMutation({
    mutationFn: () => postsApi.like(post._id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.postsAll }),
        qc.invalidateQueries({ queryKey: qk.postsFollowing }),
        qc.invalidateQueries({ queryKey: qk.postsUser(post.user?.username) }),
      ]);
    },
  });

  const remove = useMutation({
    mutationFn: () => postsApi.remove(post._id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.postsAll }),
        qc.invalidateQueries({ queryKey: qk.postsFollowing }),
        qc.invalidateQueries({ queryKey: qk.postsUser(post.user?.username) }),
      ]);
    },
  });

  const addComment = useMutation({
    mutationFn: () => postsApi.comment(post._id, { text: comment.trim() }),
    onSuccess: async () => {
      setComment("");
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.postsAll }),
        qc.invalidateQueries({ queryKey: qk.postsFollowing }),
        qc.invalidateQueries({ queryKey: qk.postsUser(post.user?.username) }),
      ]);
    },
  });

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm animate-fade-up">
      <div className="card-body gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Link to={`/${post.user?.username ?? ""}`} className="shrink-0">
              {post.user?.profileImg ? (
                <img
                  src={post.user.profileImg}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-base-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="avatar placeholder">
                  <div className="bg-base-300 text-base-content rounded-full w-10">
                    <span className="text-sm">{(post.user?.username?.[0] ?? "U").toUpperCase()}</span>
                  </div>
                </div>
              )}
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link to={`/${post.user?.username ?? ""}`} className="font-semibold truncate">
                  {post.user?.fullName ?? post.user?.username ?? "User"}
                </Link>
                <span className="text-sm opacity-70 truncate">@{post.user?.username ?? "unknown"}</span>
                <span className="text-sm opacity-50">· {formatTime(post.createdAt)}</span>
              </div>
              {post.text ? <p className="mt-1 whitespace-pre-wrap break-words">{post.text}</p> : null}
            </div>
          </div>

          {canDelete ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Delete post"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {remove.isPending ? <span className="loading loading-spinner" /> : <Trash2 className="h-4 w-4" />}
            </button>
          ) : null}
        </div>

        {post.img ? (
          <img src={post.img} alt="" className="w-full max-h-[520px] object-cover rounded-box border border-base-300" />
        ) : null}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${likedByMe ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => like.mutate()}
              disabled={like.isPending}
            >
              <Heart className={`h-4 w-4 ${likedByMe ? "fill-current" : ""}`} />
              {post.likes?.length ?? 0}
            </button>

            <button type="button" className="btn btn-sm btn-ghost">
              <MessageCircle className="h-4 w-4" />
              {post.comments?.length ?? 0}
            </button>
          </div>
        </div>

        <div className="collapse collapse-arrow bg-base-200 border border-base-300">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-medium">Comments</div>
          <div className="collapse-content">
            <div className="space-y-3">
              <div className="join w-full">
                <input
                  className="input input-bordered join-item w-full"
                  placeholder="Write a comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary join-item"
                  disabled={!comment.trim() || addComment.isPending}
                  onClick={() => addComment.mutate()}
                >
                  {addComment.isPending ? <span className="loading loading-spinner" /> : "Send"}
                </button>
              </div>

              {post.comments?.length ? (
                <ul className="space-y-2">
                  {post.comments.map((c) => (
                    <li key={c._id ?? `${c.user?._id}-${c.text}`} className="p-3 rounded-box bg-base-100 border border-base-300">
                      <div className="text-sm">
                        <span className="font-semibold">@{c.user?.username ?? "user"}</span>{" "}
                        <span className="opacity-80">{c.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm opacity-70">No comments yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

