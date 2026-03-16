import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { AppShell } from "./components/AppShell";
import { useMe } from "./hooks/useMe";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { SuggestedPage } from "./pages/SuggestedPage";

export default function App({ theme, setTheme }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthGate />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell theme={theme} setTheme={setTheme} />
            </RequireAuth>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="suggested" element={<SuggestedPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path=":username" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthGate() {
  const me = useMe();

  if (me.isLoading) {
    return (
      <div className="min-h-dvh grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (me.data) return <Navigate to="/" replace />;
  return <AuthPage />;
}
