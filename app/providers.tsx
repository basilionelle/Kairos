'use client';

import { ThemeProvider } from "../components/ThemeProvider";
import { SupabaseProvider } from "../components/SupabaseProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SupabaseProvider>
  );
}
