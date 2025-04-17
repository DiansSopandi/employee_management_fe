import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import StoreProvider from "./redux";
import { ThemeWrapper } from "@/components/theme-wrapper";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"], // Pilih weight yang dibutuhkan
  variable: "--font-poppins", // Buat variable CSS
});

export const metadata: Metadata = {
  title: "HRIS App",
  description: "A modern Human Resource Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body
        // className={`${inter.className} bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800`}
        // className={`${inter.className} bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#38bdf8] to-[#1e3a8a]`}
        className={`${inter.className} `}
      >
        <div>
          <StoreProvider>
            <ThemeWrapper>
              {children}
              <Toaster
                richColors
                position="top-right"
                closeButton
                duration={5000}
              />
            </ThemeWrapper>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
