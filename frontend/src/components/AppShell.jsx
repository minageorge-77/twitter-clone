import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Home, LogOut, Settings, UserRound, Users } from "lucide-react";
import { authApi } from "../api/auth";
import { qk } from "../app/queryKeys";
import { ThemeToggle } from "./ThemeToggle";
import { useMe } from "../hooks/useMe";

const navItems = (username) => [
  { to: "/", label: "Home", icon: Home },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/suggested", label: "Suggested", icon: Users },
  { to: `/${username ?? ""}`, label: "Profile", icon: UserRound, disabled: !username },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ theme, setTheme }) {
  const me = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.me });
      qc.clear();
      navigate("/auth", { replace: true });
    },
  });

  const username = me.data?.username;
  const items = navItems(username).filter((i) => !i.disabled);

  return (
    <div className="drawer md:drawer-open min-h-dvh bg-base-200">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100/80 backdrop-blur border-b border-base-300 sticky top-0 z-20">
          <div className="flex-none md:hidden">
            <label htmlFor="app-drawer" className="btn btn-square btn-ghost" aria-label="Open menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <Link to="/" className="btn btn-ghost text-lg font-semibold tracking-tight">
              Tweeta
              <span className="hidden sm:inline ml-2 badge badge-primary badge-outline">beta</span>
            </Link>
          </div>

          <div className="flex-none gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost" aria-label="User menu">
                {me.data?.profileImg ? (
                  <img
                    src={me.data.profileImg}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-base-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-base-300 text-base-content rounded-full w-8">
                      <span className="text-xs">{(me.data?.fullName?.[0] ?? "U").toUpperCase()}</span>
                    </div>
                  </div>
                )}
                <span className="hidden sm:inline ml-2 truncate max-w-32">{me.data?.username ?? "Account"}</span>
              </button>
              <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow w-56 mt-2 border border-base-300">
                {username ? (
                  <li>
                    <Link to={`/${username}`}>Profile</Link>
                  </li>
                ) : null}
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={() => logout.mutate()} disabled={logout.isPending}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-4">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="drawer-side z-30">
        <label htmlFor="app-drawer" aria-label="Close menu" className="drawer-overlay" />
        <aside className="w-72 bg-base-100 border-r border-base-300 min-h-dvh">
          <div className="p-4">
            <div className="text-sm opacity-70">Navigation</div>
          </div>
          <ul className="menu px-2 pb-6 text-base">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <div className="px-4 pb-6 text-xs opacity-60" />
        </aside>
      </div>
    </div>
  );
}

