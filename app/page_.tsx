// app/page.tsx
import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/form/auth/login-button";

const font = Poppins({ subsets: ["latin"], weight: "600" });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 ">
      {/* <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400  to-blue-800 "> */}
      {/* <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#38bdf8] to-[#1e3a8a]"> */}
      <div className="text-center space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          Employee Management App
        </h1>
        <p className="text-white text-lg text-gray-600">
          Simple app with Next.js 14 + NestJS backend
        </p>
        <div>
          <LoginButton asChild>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
