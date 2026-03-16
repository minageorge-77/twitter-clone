import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users";
import { qk } from "../app/queryKeys";

export function SuggestedPage() {
  const qc = useQueryClient();

  const suggested = useQuery({
    queryKey: qk.suggested,
    queryFn: usersApi.suggested,
  });

  const follow = useMutation({
    mutationFn: (userId) => usersApi.follow(userId),
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({ queryKey: qk.suggested }), qc.invalidateQueries({ queryKey: qk.me })]);
    },
  });

  return (
    <div className="space-y-3">
      <div className="text-xl font-bold">Suggested users</div>

      {suggested.isLoading ? <div className="skeleton h-24 w-full" /> : null}
      {suggested.isError ? (
        <div className="alert alert-error">
          <span>{suggested.error?.message ?? "Failed to load suggestions"}</span>
        </div>
      ) : null}

      {suggested.data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggested.data.map((u) => (
            <div key={u._id} className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/${u.username}`} className="font-semibold truncate block">
                      {u.fullName ?? u.username}
                    </Link>
                    <div className="text-sm opacity-70 truncate">@{u.username}</div>
                  </div>
                  <button className="btn btn-sm btn-primary" disabled={follow.isPending} onClick={() => follow.mutate(u._id)}>
                    {follow.isPending ? <span className="loading loading-spinner" /> : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : suggested.isLoading ? null : (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="font-semibold">No suggestions right now</div>
            <div className="text-sm opacity-70">Try again later.</div>
          </div>
        </div>
      )}
    </div>
  );
}

