import { useEffect, useMemo, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { createAppQueryClient } from "./app/queryClient";
import { applyTheme, getInitialTheme } from "./app/theme";

export function Root() {
  const [theme, setTheme] = useState(getInitialTheme);
  const queryClient = useMemo(() => createAppQueryClient(), []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <App theme={theme} setTheme={setTheme} />
    </QueryClientProvider>
  );
}

