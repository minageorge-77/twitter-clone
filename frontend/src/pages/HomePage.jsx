import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../api/posts";
import { qk } from "../app/queryKeys";
import { PostComposer } from "../components/PostComposer";
import { PostList } from "../components/PostList";

export function HomePage() {
  const [feed, setFeed] = useState("all"); // all | following

  const query = useQuery({
    queryKey: feed === "all" ? qk.postsAll : qk.postsFollowing,
    queryFn: feed === "all" ? postsApi.all : postsApi.following,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xl font-bold">Home</div>

          <div role="tablist" className="tabs tabs-boxed">
            <button
              role="tab"
              className={`tab ${feed === "all" ? "tab-active" : ""}`}
              onClick={() => setFeed("all")}
            >
              For you
            </button>

            <button
              role="tab"
              className={`tab ${feed === "following" ? "tab-active" : ""}`}
              onClick={() => setFeed("following")}
            >
              Following
            </button>
          </div>
        </div>

        <PostComposer />

        <PostList
          posts={query.data}
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          emptyTitle={
            feed === "following"
              ? "No posts from people you follow"
              : "No posts yet"
          }
        />
      </div>

      <div className="lg:col-span-4 space-y-3">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">About the Developer</h2>

            <p className="text-sm opacity-80">
              This web application was developed by{" "}
              <span className="font-semibold">Mina George</span>.
              Passionate about building modern web applications using the MERN stack.
            </p>

            <div className="mt-2">
              <a
                href="https://github.com/minageorge-77"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 
                  11.385.6.113.82-.258.82-.577 
                  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
                  -.546-1.387-1.333-1.756-1.333-1.756
                  -1.09-.745.083-.729.083-.729
                  1.205.084 1.84 1.236 1.84 1.236
                  1.07 1.834 2.807 1.304 3.492.997
                  .108-.776.418-1.304.76-1.603
                  -2.665-.3-5.467-1.332-5.467-5.93
                  0-1.31.465-2.38 1.235-3.22
                  -.123-.303-.535-1.523.117-3.176
                  0 0 1.008-.322 3.3 1.23
                  .957-.266 1.983-.399 3.003-.404
                  1.02.005 2.047.138 3.006.404
                  2.29-1.552 3.296-1.23 3.296-1.23
                  .653 1.653.241 2.873.118 3.176
                  .77.84 1.233 1.91 1.233 3.22
                  0 4.61-2.807 5.625-5.48 5.92
                  .43.372.823 1.102.823 2.222
                  0 1.606-.015 2.898-.015 3.293
                  0 .321.216.694.825.576
                  C20.565 21.795 24 17.295 24 12
                  24 5.37 18.63 0 12 0z"
                  />
                </svg>

                View my GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}