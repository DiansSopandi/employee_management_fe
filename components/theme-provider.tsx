// components/theme-provider.tsx
"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
