import { HeroSection } from "@/components/landing/hero-section";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FeatureSection } from "@/components/landing/feature-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-1 px-4 md:px-6 lg:px-8">
        <HeroSection />
        {/* Section lain nanti bisa kamu tambah */}
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}
