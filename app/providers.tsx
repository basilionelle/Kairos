'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/ThemeProvider";
import { SupabaseProvider } from "../components/SupabaseProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SupabaseProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </SupabaseProvider>
    </SessionProvider>
  );
}
