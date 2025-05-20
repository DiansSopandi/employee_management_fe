"use client";

import React, { useEffect, useRef, useState } from "react";
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
import QrCodeReload from "./qr-code-reload";
import { Socket } from "socket.io-client";

interface QRCodeDisplayProps {
  userId: string;
  apiUrl: string;
}

// const QrCodeDisplay: React.FC<QRCodeDisplayProps> = ({ userId, apiUrl }) => {
const QrCodeDisplay = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Use refs to track mounted state and intervals
  const isMounted = useRef<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const emitIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emitCountRef = useRef(0);

  const [qr, setQr] = useState<string | null>(null);
  // const [userId] = useState(() => uuidv4());
  const [authenticated, setAuthenticated] = useState(false);
  const [uuid, setUuid] = useState("");
  const [waId, setWaId] = useState("");
  const [otpShow, setOtpShow] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [status, setStatus] = useState<string>("initializing");
  const [error, setError] = useState<string | null>(null);
  const [lastQrReceivedAt, setLastQrReceivedAt] = useState<number | null>(null);

  const isFormShow = useAppSelector((state) => state.global.isFormShow);

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    const newUuid = storedUuid ?? uuidv4();

    if (!storedUuid) localStorage.setItem("uuid", newUuid);

    setUuid(newUuid);
    isMounted.current = true;

    const emitInterval = emitIntervalRef.current;
    const connectionTimeout = connectionTimeoutRef.current;
    const socketInstance = socketRef.current;

    return () => {
      isMounted.current = false;
      if (emitInterval !== null) {
        clearInterval(emitInterval);
      }
      if (connectionTimeout !== null) {
        clearTimeout(connectionTimeout);
      }
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  const handleReloadQr = () => {
    const newId = uuidv4();
    localStorage.removeItem("uuid");
    localStorage.setItem("uuid", newId);

    setUuid(newId);
    setQrExpired(false);
    setAuthenticated(false);
    setQr(null);
    setOtpShow(false);
    setConnecting(true);
    emitCountRef.current = 0;

    if (emitIntervalRef.current) clearInterval(emitIntervalRef.current);
    if (connectionTimeoutRef.current)
      clearInterval(connectionTimeoutRef.current);

    socket.emit("start-client", { userId: newId });
    console.log("Emitting start-client with userId:", uuid);
  };

  useEffect(() => {
    if (!uuid) return;

    if (emitIntervalRef.current) clearInterval(emitIntervalRef.current);

    const setUpSocketListener = () => {
      socket.on(`qr:${uuid}`, (qrCode) => {
        if (isMounted.current) {
          setQr(qrCode);
          setConnecting(false);
          setLastQrReceivedAt(Date.now());
          console.log("QR Code Receive");
        }
      });

      socket.on(`authenticated:${uuid}`, () => {
        if (isMounted.current) {
          setQr(null);
          setAuthenticated(true);
          setConnecting(false);
        }
        console.log("Client authenticated");

        if (emitIntervalRef.current) clearInterval(emitIntervalRef.current);
      });

      socket.on(`ready:${uuid}`, () => {
        if (isMounted.current) {
          setQr(null);
          console.log("CLient Ready");
        }
      });

      socket.on(`auth_failure:${uuid}`, () => {
        if (isMounted.current) {
          console.log("Whatsapp authentication failure");
        }
      });

      socket.on(`disconnect:${uuid}`, (reason) => {
        if (isMounted.current) {
          setConnecting(false);
          setQrExpired(true);
          console.log(`Client disconnect ${JSON.stringify(reason)}`);
        }
      });

      socket.on(`login_success-${uuid}`, async (data) => {
        if (!isMounted.current) return;

        const { waId, redirect } = data;

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/whatsapp-login`,
            { waId, uuid },
            { withCredentials: true }
          );

          if (res.data?.success) {
            toast("Login success", {
              description: "You will be redirected to dashboard page.",
              duration: 1000,
              style: {
                backgroundColor: "#22c55e",
                color: "white",
              },
            });

            localStorage.removeItem("uuid");
            router.push(redirect);
          }
        } catch (error) {
          console.error("Login error:", error);
          toast("Login failed", {
            description: "Invalid credentials or server error.",
            duration: 3000,
            style: {
              backgroundColor: "#ef4444",
              color: "white",
            },
          });
        }
      });

      socket.on(`unlinked_whatsapp-${uuid}`, (data) => {
        if (isMounted.current) {
          setWaId(data.waId);
          dispatch(setIsFormShow(true));
          setOtpShow(true);
          console.log({ event: "unlinked whatsapp", isFormShow, data });
        }
      });

      socket.on("connect_error", (message) => {
        if (isMounted.current) {
          console.error(`Socket connection error ${message}`);
          setConnecting(false);
          setQrExpired(true);
        }
      });

      socket.on(`max_reconnect_reached:${uuid}`, () => {
        setConnecting(false);
        setQrExpired(true);
        console.log(
          "Maximum reconnection attempts reached. Please restart manually."
        );
      });
    };

    const shouldEmitStartClient = (
      lastQrReceivedAt: number | null,
      cooldownMs = 61000
    ): boolean => {
      const now = Date.now();
      if (lastQrReceivedAt && now - lastQrReceivedAt < cooldownMs) {
        console.log("Skipping emit, cooldown after QR");
        return false;
      }
      return true;
    };

    const initiateConnection = () => {
      setConnecting(true);
      setQrExpired(false);

      if (socket.connected) {
        if (!shouldEmitStartClient(lastQrReceivedAt)) return;

        if (emitCountRef.current >= 10) {
          console.warn("QR Emit limit reached, please reload QR");
          setQrExpired(true);
          return;
        }

        emitCountRef.current += 1;
        socket.emit("start-client", { userId: uuid });
        console.log(
          `Initiate emitting #${emitCountRef.current} - start-client with userId:`,
          uuid
        );
      } else {
        socket.connect();

        setTimeout(() => {
          if (socket.connected) {
            if (!shouldEmitStartClient(lastQrReceivedAt)) return;

            if (emitCountRef.current >= 10) {
              setQrExpired(true);
              console.warn("QR Emit limit reached, please reload QR");
              return;
            }

            emitCountRef.current += 1;
            socket.emit("start-client", { userId: uuid });
            console.log(
              `Emitting #${emitCountRef.current} - start-client with userId after reconnect:`,
              uuid
            );
          }
        }, 1000);
      }

      connectionTimeoutRef.current = setTimeout(() => {
        if (!authenticated && !qr && isMounted.current) {
          setConnecting(false);
          setQrExpired(true);
        }
      }, 15000);
    };

    const removeSocketListener = () => {
      socket.off(`qr:${uuid}`);
      socket.off(`authenticated:${uuid}`);
      socket.off(`ready:${uuid}`);
      socket.off(`auth_failure:${uuid}`);
      socket.off(`disconnect:${uuid}`);
      socket.off(`login_success-${uuid}`);
      socket.off(`unlinked_whatsapp-${uuid}`);
      socket.off(`max_reconnect_reached:${uuid}`);
      socket.off("connect_error");
    };

    removeSocketListener();
    setUpSocketListener();
    initiateConnection();

    emitIntervalRef.current = setInterval(() => {
      if (authenticated || !isMounted.current) {
        if (emitIntervalRef.current) {
          clearInterval(emitIntervalRef.current);
          emitIntervalRef.current = null;
        }

        return;
      }

      if (!shouldEmitStartClient(lastQrReceivedAt)) return;

      initiateConnection();
    }, 30000);

    // CleanUp function
    return () => {
      removeSocketListener();
      if (emitIntervalRef.current) {
        clearInterval(emitIntervalRef.current);
        emitIntervalRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      emitCountRef.current = 0;
      socket.disconnect();
    };
  }, [uuid, authenticated, qr, dispatch, isFormShow, router]);

  // useEffect(() => {
  //   if (!localStorage.getItem("uuid")) {
  //     localStorage.setItem("uuid", userId);
  //   }
  //   let uuid = localStorage.getItem("uuid");
  //   let emitCount = 0;
  //   const maxEmit = 10;

  //   socket.emit("start-client", { userId: uuid });

  //   const interval = setInterval(() => {
  //     if (!authenticated) {
  //       emitCount++;
  //       if (emitCount > maxEmit) {
  //         clearInterval(interval); // stop emit
  //         setQrExpired(true);
  //         return;
  //       }

  //       uuid = localStorage.getItem("uuid");

  //       socket.emit("start-client", { userId: uuid }); // Emit ulang jika belum login
  //       console.log("Emitting start-client with userId:", uuid);
  //     }
  //   }, 30000); // setiap 30 detik (atau sesuaikan dengan masa aktif QR code)

  //   // Listen untuk QR code
  //   socket.on(`qr:${uuid}`, (qrCode: string) => {
  //     console.log("QR Code received:", qrCode);
  //     setQr(qrCode);
  //   });

  //   // Listen untuk authenticated
  //   socket.on(`authenticated:${uuid}`, () => {
  //     setQr(null);
  //     setAuthenticated(true);
  //     console.log("Authenticated!");
  //   });

  //   socket.on(`login_success-${uuid}`, async (data) => {
  //     const { waId, redirect } = data;
  //     try {
  //       const res = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}/auth/whatsapp-login`,
  //         {
  //           waId,
  //           uuid,
  //         },
  //         { withCredentials: true }
  //       );

  //       if (res.data?.success) {
  //         toast("Login success", {
  //           description: "You will be redirected to dashboard page.",
  //           duration: 1000,
  //           style: {
  //             backgroundColor: "#22c55e", // Tailwind green-500
  //             color: "white",
  //           },
  //         });

  //         localStorage.removeItem("uuid");

  //         router.push(redirect);
  //       }
  //     } catch (error: any) {
  //       console.error("Login error:", error);

  //       toast("Login failed", {
  //         description: "Invalid credentials or server error.",
  //         duration: 3000,
  //         style: {
  //           backgroundColor: "#ef4444", // Tailwind red-500
  //           color: "white",
  //         },
  //       });
  //     }
  //   });

  //   // socket.on(`unlinked_whatsapp-${userId}`, (data) => {
  //   socket.on(`unlinked_whatsapp-${uuid}`, (data) => {
  //     console.log({ event: "unlinked whatsapp", isFormShow, data });
  //     setUuid(data.uuid);
  //     setWaId(data.waId);
  //     // dispatch(setIsFormShow(!isFormShow));

  //     dispatch(setIsFormShow(true));
  //     setOtpShow(true);
  //   });

  //   // Cleanup listener saat komponen unmount
  //   return () => {
  //     clearInterval(interval);
  //     socket.off(`qr:${userId}`);
  //     socket.off(`authenticated:${userId}`);
  //     socket.off(`authenticated:${userId}`);
  //     socket.off(`login_success-${userId}`);
  //     socket.off(`unlinked_whatsapp-${userId}`);
  //   };
  // }, [userId, authenticated, otpShow]);

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
        } else if (qrExpired) {
          return <QrCodeReload onReload={handleReloadQr} />;
        } else if (connecting && !qr) {
          return <p className="text-gray-500">Connecting to WhatsApp...</p>;
        } else if (qr) {
          return (
            <div>
              <QRCode value={qr} size={200} />
              <p className="mt-4 text-center text-blue-400">
                Log in with QR Code
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
