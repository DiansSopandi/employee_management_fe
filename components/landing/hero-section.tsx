import Image from "next/image";
import Link from "next/link";
import QrCodeDisplay from "./qr-code-display";
import SendMessage from "./send-message";

export const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 gap-10 max-w-7xl mx-auto">
      <div className="max-w-xl space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Empower Your HR with Modern Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Streamline employee management, payroll, and performance tracking in
          one place.
        </p>
        <Link href="/register">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Free, try now
          </button>
        </Link>
      </div>
      <div className="flex justify-center flex-1 min-w-[500px] mt-2">
        <Image
          src="/assets/images/hr-dashboard.svg"
          alt="HR dashboard"
          width={500}
          height={500}
          className="dark:invert object-contain"
        />
      </div>
      <div className="flex flex-col  items-start flex-1 md:max-w-xs ml-auto">
        <div className="flex justify-center w-full mt-2">
          <QrCodeDisplay />
        </div>
        {/* <div className="mt-5 w-full max-w-[300px]">
          <SendMessage />
        </div> */}
      </div>
    </section>
  );
};
