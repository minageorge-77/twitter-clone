import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { qk } from "../app/queryKeys";

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const from = location.state?.from || "/";

  const [mode, setMode] = useState("login"); // login | signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.me });
      navigate(from, { replace: true });
    },
  });

  const signup = useMutation({
    mutationFn: authApi.signup,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.me });
      navigate("/", { replace: true });
    },
  });

  const pending = login.isPending || signup.isPending;
  const error = login.error?.message || signup.error?.message;

  const submitLabel = useMemo(() => (mode === "login" ? "Login" : "Create account"), [mode]);

  return (
    <div className="min-h-dvh bg-base-200 grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 border border-base-300 shadow-xl">
          <div className="card-body gap-4">
            <div>
              <div className="text-2xl font-bold tracking-tight">Welcome to Tweeta</div>
              <div className="opacity-70">Modern, fast, responsive Twitter-like clone.</div>
            </div>

            <div role="tablist" className="tabs tabs-boxed">
              <button role="tab" className={`tab ${mode === "login" ? "tab-active" : ""}`} onClick={() => setMode("login")}>
                Login
              </button>
              <button role="tab" className={`tab ${mode === "signup" ? "tab-active" : ""}`} onClick={() => setMode("signup")}>
                Sign up
              </button>
            </div>

            {error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : null}

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (mode === "login") {
                  login.mutate({ username, password });
                } else {
                  signup.mutate({ fullName, username, email, password });
                }
              }}
            >
              {mode === "signup" ? (
                <>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Full name</span>
                    </div>
                    <input className="input input-bordered" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </label>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Email</span>
                    </div>
                    <input
                      className="input input-bordered"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </>
              ) : null}

              <label className="form-control">
                <div className="label">
                  <span className="label-text">Username</span>
                </div>
                <input className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  className="input input-bordered"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {mode === "signup" ? (
                  <div className="label">
                    <span className="label-text-alt opacity-70">Use a strong password: (upper/lower/number/special).</span>
                  </div>
                ) : null}
              </label>

              <button className="btn btn-primary w-full" disabled={pending}>
                {pending ? <span className="loading loading-spinner" /> : submitLabel}
              </button>
            </form>

            <div className="text-sm opacity-70 flex items-center gap-2">
              <span>Coded by: Mina George</span>

              <a href="https://github.com/minageorge-77" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                  className="w-6 h-6 hover:scale-110 transition"
                />
              </a>
            </div>

          </div>
        </div>

        <div className="text-center text-xs opacity-60 mt-4">
          <Link to="/" className="link">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

