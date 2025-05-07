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
import { toast } from "sonner";

const QrCodeDisplay = () => {
  const router = useRouter();
  // const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [qr, setQr] = useState<string | null>(null);
  const [userId] = useState(() => uuidv4()); // Generate UUID sekali saja
  const [authenticated, setAuthenticated] = useState(false);
  const [uuid, setUuid] = useState("");
  const [waId, setWaId] = useState("");
  const [otpShow, setOtpShow] = useState(false);

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

    // dispatch(setIsFormShow(false));
    // setOtpShow(false);

    if (!localStorage.getItem("uuid")) {
      localStorage.setItem("uuid", userId);
    }
    let uuid = localStorage.getItem("uuid");

    socket.emit("start-client", { userId: uuid }); // Emit event start-client ke backend
    // Emit event start-client ke backend

    const interval = setInterval(() => {
      if (!authenticated) {
        uuid = localStorage.getItem("uuid");
        console.log("Emitting start-client with userId:", uuid);

        socket.emit("start-client", { userId: uuid }); // Emit ulang jika belum login
      }
    }, 30000); // setiap 30 detik (atau sesuaikan dengan masa aktif QR code)

    // Listen untuk QR code
    socket.on(`qr:${uuid}`, (qrCode: string) => {
      console.log("QR Code received:", qrCode);
      setQr(qrCode);
    });

    // Listen untuk authenticated
    socket.on(`authenticated:${uuid}`, () => {
      console.log("Authenticated!");
      setQr(null);
      setAuthenticated(true);
    });

    socket.on(`login_success-${uuid}`, async (data) => {
      const { waId, redirect } = data;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/whatsapp-login`,
          {
            waId,
            uuid,
          },
          { withCredentials: true }
        );

        if (res.data?.success) {
          toast("Login success", {
            description: "You will be redirected to dashboard page.",
            duration: 1000,
            style: {
              backgroundColor: "#22c55e", // Tailwind green-500
              color: "white",
            },
          });

          localStorage.removeItem("uuid");
          // localStorage.setItem("uuid", res.data.user.id);
          router.push(redirect);
        }
      } catch (error: any) {
        console.error("Login error:", error);

        toast("Login failed", {
          description: "Invalid credentials or server error.",
          duration: 3000,
          style: {
            backgroundColor: "#ef4444", // Tailwind red-500
            color: "white",
          },
        });
      }
    });

    // socket.on(`unlinked_whatsapp-${userId}`, (data) => {
    socket.on(`unlinked_whatsapp-${uuid}`, (data) => {
      console.log({ event: "unlinked whatsapp", isFormShow, data });
      setUuid(data.uuid);
      setWaId(data.waId);
      // dispatch(setIsFormShow(!isFormShow));

      dispatch(setIsFormShow(true));
      setOtpShow(true);
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
  }, [userId, authenticated, otpShow]);

  // if (!qr) {
  //   return <p className="text-black">Waiting QR Code...</p>;
  // }

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
