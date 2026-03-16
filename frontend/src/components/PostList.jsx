import { PostCard } from "./PostCard";

export function PostList({ posts, isLoading, isError, error, emptyTitle = "Nothing here yet" }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-36 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>{error?.message ?? "Failed to load"}</span>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <div className="text-lg font-semibold">{emptyTitle}</div>
          <div className="opacity-70">Follow people or create a post to get started.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <div key={p._id}>
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}

