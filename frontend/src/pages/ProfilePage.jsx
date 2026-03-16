import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../api/posts";
import { usersApi } from "../api/users";
import { qk } from "../app/queryKeys";
import { PostList } from "../components/PostList";
import { useMe } from "../hooks/useMe";

export function ProfilePage() {
  const { username } = useParams();
  const qc = useQueryClient();
  const me = useMe();

  const profile = useQuery({
    queryKey: qk.profile(username),
    queryFn: () => usersApi.profile(username),
    enabled: Boolean(username),
  });

  const posts = useQuery({
    queryKey: qk.postsUser(username),
    queryFn: () => postsApi.userPosts(username),
    enabled: Boolean(username),
  });

  const isMe = useMemo(() => {
    return me.data?.username && username ? me.data.username === username : false;
  }, [me.data?.username, username]);

  const isFollowing = useMemo(() => {
    const meFollowing = me.data?.following ?? [];
    const profileId = profile.data?._id;
    return profileId ? meFollowing.includes(profileId) : false;
  }, [me.data?.following, profile.data?._id]);

  const follow = useMutation({
    mutationFn: () => usersApi.follow(profile.data?._id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.me }),
        qc.invalidateQueries({ queryKey: qk.profile(username) }),
        qc.invalidateQueries({ queryKey: qk.suggested }),
      ]);
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-4 space-y-3">
        {profile.isLoading ? <div className="skeleton h-56 w-full" /> : null}

        {profile.isError ? (
          <div className="alert alert-error">
            <span>{profile.error?.message ?? "Failed to load profile"}</span>
          </div>
        ) : null}

        {profile.data ? (
          <div className="card bg-base-100 border border-base-300 overflow-hidden">
            {profile.data.coverImg ? (
              <img src={profile.data.coverImg} alt="" className="h-28 w-full object-cover" />
            ) : (
              <div className="h-28 w-full bg-gradient-to-r from-primary/30 to-secondary/30" />
            )}
            <div className="card-body pt-0">
              <div className="-mt-8 flex items-end justify-between gap-3">
                <div className="shrink-0">
                  {profile.data.profileImg ? (
                    <img
                      src={profile.data.profileImg}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover ring-4 ring-base-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-base-300 text-base-content rounded-full w-16 ring-4 ring-base-100">
                        <span className="text-lg">{(profile.data.username?.[0] ?? "U").toUpperCase()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isMe ? (
                  <button className="btn btn-sm btn-primary" disabled={follow.isPending} onClick={() => follow.mutate()}>
                    {follow.isPending ? <span className="loading loading-spinner" /> : isFollowing ? "Unfollow" : "Follow"}
                  </button>
                ) : (
                  <div className="badge badge-outline">You</div>
                )}
              </div>

              <div className="mt-2">
                <div className="text-lg font-bold leading-tight">{profile.data.fullName ?? profile.data.username}</div>
                <div className="opacity-70">@{profile.data.username}</div>
              </div>

              {profile.data.bio ? <div className="text-sm mt-2 whitespace-pre-wrap">{profile.data.bio}</div> : null}
              {profile.data.link ? (
                <a className="link link-primary text-sm mt-2 break-all" href={profile.data.link} target="_blank" rel="noreferrer">
                  {profile.data.link}
                </a>
              ) : null}

              <div className="stats stats-vertical sm:stats-horizontal bg-base-200 border border-base-300 mt-3">
                <div className="stat">
                  <div className="stat-title">Followers</div>
                  <div className="stat-value text-base">{profile.data.followers?.length ?? 0}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Following</div>
                  <div className="stat-value text-base">{profile.data.following?.length ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="lg:col-span-8 space-y-3">
        <div className="text-xl font-bold">Posts</div>
        <PostList posts={posts.data} isLoading={posts.isLoading} isError={posts.isError} error={posts.error} emptyTitle="No posts yet" />
      </div>
    </div>
  );
}

