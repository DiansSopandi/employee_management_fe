"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const QrCodeDisplay = () => {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const fetchQr = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/whatsapp/qr`,
        {
          credentials: "include",
        }
      );
      const data = await res
        .json()
        .then((res) => res ?? null)
        .catch(() => null);
      setQr(data.qr);
    };

    fetchQr();
    const interval = setInterval(fetchQr, 10000); // Refresh setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  if (!qr) return <p className="text-black">Waiting QR Code...</p>;

  return (
    <div className="flex flex-col items-center">
      {/* <Image src={qr} alt="QR Code" width={250} height={250} /> */}
      <QRCode value={qr} size={256} />
      <p className="mt-4 text-center text-blue-400">to login, scan please </p>
    </div>
  );
};

export default QrCodeDisplay;
