// app/(auth)/layout.tsx
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-sky-400 to-blue-800">
      {/* Left Section (Branding / Illustration) */}
      {/* <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-white p-12 bg-gradient-to-br from-indigo-600/70 to-blue-800/90 relative"> */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-white p-12  relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="relative z-10 max-w-md text-center">
          <Image
            src="/assets/images/absence_management.png"
            alt="Company Logo"
            className="h-14 mx-auto mb-6"
            width={100}
            height={200}
          />
          <h1 className="text-3xl font-bold">Welcome to HRIS Portal</h1>
          <p className="mt-4 text-lg text-gray-200">
            Manage your workforce, payroll, and employee data in one secure
            platform.
          </p>
          {/* <Image
            src="/hris-illustration.svg"
            alt="HRIS Illustration"
            className="mt-8 w-full max-w-sm mx-auto drop-shadow-lg"
            width={300}
            height={400}
          /> */}
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-12">
        <div className="absolute top-6 left-6">
          {/* <Link
            href="/"
            className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition"
          >
            ← Back to Home
          </Link> */}

          {/* <a
            href="/"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m-4 0h10a2 2 0 002-2v-5a2 2 0 00-2-2h-3V7H9v2H6a2 2 0 00-2 2v5a2 2 0 002 2z"
              />
            </svg>
            Back to Home
          </a> */}
          <a
            href="/"
            // className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-indigo-600 hover:to-blue-500 active:scale-95"
            className="fixed top-3 left-6 z-50
                inline-flex items-center gap-2
                px-2 py-1 rounded-xl text-sm font-medium
                bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md
                hover:scale-105 hover:shadow-lg transition
                sm:px-5 sm:py-3 sm:text-base"
          >
            <span className="text-lg sm:text-xl">🏠</span>
            <span className="hidden sm:inline">Back to Home</span>
          </a>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Back to Home */}
          {/* <div className="text-left">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition"
            >
              ← Back to Home
            </Link>
          </div> */}

          {/* Injected Page (Login / Register) */}
          {/* <div className="bg-white rounded-xl shadow-xl p-8">{children}</div> */}
          <div>{children}</div>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} YourCompany. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
