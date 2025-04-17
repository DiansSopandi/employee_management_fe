import { HeroSection } from "@/components/landing/hero-section";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        {/* Section lain nanti bisa kamu tambah */}
      </main>
      <Footer />
    </div>
  );
}
