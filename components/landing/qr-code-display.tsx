"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import socket from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsFormShow } from "@/state";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import VerifyOtpPage from "./verify-otp";

const QrCodeDisplay = () => {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [qr, setQr] = useState<string | null>(null);
  const [userId] = useState(() => uuidv4()); // Generate UUID sekali saja
  const [authenticated, setAuthenticated] = useState(false);
  const [uuid, setUuid] = useState("");
  const [waId, setWaId] = useState("");

  const isFormShow = useAppSelector((state) => state.global.isFormShow);

  useEffect(() => {
    // const fetchQr = async () => {
    // console.log("Generated userId:", userId);
    // const userId = uuidv4(); // generate UUID baru
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/whatsapp/qr`,
    //   {
    //     credentials: "include",
    //   }
    // );
    // const data = await res
    //   .json()
    //   .then((res) => res ?? null)
    //   .catch(() => null);
    // setQr(data.qr);
    // };
    // fetchQr();
    // const interval = setInterval(fetchQr, 10000); // Refresh setiap 5 detik
    // return () => clearInterval(interval);

    // Emit event start-client ke backend
    socket.emit("start-client", { userId });

    const interval = setInterval(() => {
      if (!authenticated) {
        socket.emit("start-client", { userId }); // Emit ulang jika belum login
      }
    }, 30000); // setiap 30 detik (atau sesuaikan dengan masa aktif QR code)

    // Listen untuk QR code
    socket.on(`qr:${userId}`, (qrCode: string) => {
      setQr(qrCode);
    });

    // Listen untuk authenticated
    socket.on(`authenticated:${userId}`, () => {
      console.log("Authenticated!");
      setQr(null);
      setAuthenticated(true);
    });

    socket.on(`login_success-${userId}`, async (data) => {
      const { waId, redirect } = data;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/whatsapp-login`,
          {
            waId,
          },
          { withCredentials: true }
        );

        toast({
          title: "Login success",
          description: "You will be redirected to dashboard page.",
        });

        router.push(redirect);
      } catch (error: any) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: "Invalid credentials or server error.",
        });
      }
    });

    socket.on(`unlinked_whatsapp-${userId}`, (data) => {
      console.log({ data });
      setUuid(data.uuid);
      setWaId(data.waId);
      dispatch(setIsFormShow(!isFormShow));
    });

    // return () => {
    //   socket.disconnect();
    // };

    // Cleanup listener saat komponen unmount
    return () => {
      clearInterval(interval);
      socket.off(`qr:${userId}`);
      socket.off(`authenticated:${userId}`);
      socket.off(`authenticated:${userId}`);
      socket.off(`login_success-${userId}`);
      socket.off(`unlinked_whatsapp-${userId}`);
    };
  }, [userId, authenticated]);

  if (!qr) {
    return <p className="text-black">Waiting QR Code...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      {/* <Image src={qr} alt="QR Code" width={250} height={250} /> */}

      {isFormShow && <VerifyOtpPage phoneNumber={waId} userId={uuid} />}

      {(() => {
        if (authenticated) {
          return (
            <p className="text-green-500 text-xl">
              Authenticated Successfully!
            </p>
          );
        } else if (qr) {
          return (
            <div>
              <QRCode value={qr} size={200} />
              <p className="mt-4 text-center text-blue-400">
                Log in with QR Code{" "}
              </p>
            </div>
          );
        } else {
          return <p className="text-gray-500">Loading QR Code...</p>;
        }
      })()}
    </div>
  );
};

export default QrCodeDisplay;
