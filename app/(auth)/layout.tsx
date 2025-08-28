import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-sky-400 to-blue-800">
      {/* Left Section (Branding) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center text-white p-12 relative">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
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
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-12 relative">
        {/* Back to Home */}
        <a
          href="/"
          className="fixed top-4 left-6 z-50 inline-flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:scale-105 hover:shadow-lg transition"
        >
          <span className="text-lg sm:text-xl">🏠</span>
          <span className="hidden sm:inline">Back to Home</span>
        </a>

        {/* Card Form */}
        <div className="w-full max-w-md">{children}</div>

        {/* Footer */}
        <p className="absolute bottom-4 text-xs text-gray-300 text-center w-full">
          © {new Date().getFullYear()} YourCompany. All rights reserved.
        </p>
      </div>
    </div>
  );
}
