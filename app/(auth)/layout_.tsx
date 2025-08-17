// app/(auth)/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="absolute text-center mt-4 z-50">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition z-20"
        >
          ← Back to Home
        </Link>
      </div>
      <main className=" flex flex-col items-center justify-center min-h-screen w-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <div className="-translate-y-10 relative z-10">{children}</div>
      </main>
    </div>
  );
}
