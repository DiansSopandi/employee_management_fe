import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 gap-10 max-w-7xl mx-auto">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Kelola SDM Lebih Mudah & Efisien
        </h1>
        <p className="text-muted-foreground text-lg">
          Aplikasi HRIS modern untuk absensi, payroll, manajemen karyawan, dan
          lainnya.
        </p>
        <Link href="/auth/register">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Coba Sekarang Gratis
          </button>
        </Link>
      </div>
      <div className="flex justify-center">
        <Image
          src="/illustrations/hr-dashboard.svg"
          alt="HR dashboard"
          width={500}
          height={500}
          className="dark:invert"
        />
      </div>
    </section>
  );
};
