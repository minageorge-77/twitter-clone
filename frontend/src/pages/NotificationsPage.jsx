import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications";
import { qk } from "../app/queryKeys";

export function NotificationsPage() {
  const qc = useQueryClient();

  const notifications = useQuery({
    queryKey: qk.notifications,
    queryFn: notificationsApi.list,
  });

  const clear = useMutation({
    mutationFn: notificationsApi.clear,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.notifications });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xl font-bold">Notifications</div>
        <button className="btn btn-sm" disabled={clear.isPending} onClick={() => clear.mutate()}>
          {clear.isPending ? <span className="loading loading-spinner" /> : "Clear all"}
        </button>
      </div>

      {notifications.isLoading ? <div className="skeleton h-24 w-full" /> : null}
      {notifications.isError ? (
        <div className="alert alert-error">
          <span>{notifications.error?.message ?? "Failed to load notifications"}</span>
        </div>
      ) : null}

      {notifications.data?.length ? (
        <div className="space-y-2">
          {notifications.data.map((n) => (
            <div key={n._id} className="card bg-base-100 border border-base-300">
              <div className="card-body py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-semibold">@{n.from?.username ?? "user"}</span>{" "}
                    <span className="opacity-80">
                      {n.type === "like" ? "liked your post" : n.type === "follow" ? "followed you" : "sent a notification"}
                    </span>
                  </div>
                  <div className={`badge ${n.read ? "badge-ghost" : "badge-primary"}`}>{n.read ? "read" : "new"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.isLoading ? null : (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="font-semibold">All caught up</div>
            <div className="text-sm opacity-70">Likes and follows will show up here.</div>
          </div>
        </div>
      )}
    </div>
  );
}

