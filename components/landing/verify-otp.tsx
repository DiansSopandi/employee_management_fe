"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { toast } from "sonner";
import { setIsFormShow } from "@/state";
import InputOTPCode from "./input-otp-code";

type VerifyOtpPageProps = {
  readonly phoneNumber: string;
  readonly userId: string;
  readonly reason?: string;
};

export default function VerifyOtpPage({
  phoneNumber,
  userId,
  reason,
}: VerifyOtpPageProps) {
  const dispatch = useAppDispatch();
  const [waId, setWaId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isFormShow = useAppSelector((state) => state.global.isFormShow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        { userId, phoneNumber, otp, email },
        {
          withCredentials: true, // ⬅️ penting agar cookie diterima
        }
      );

      console.log({ res });

      if (res?.data?.success) {
        toast("Login success", {
          description: "You will be redirected to dashboard page.",
          duration: 3000,
          style: {
            backgroundColor: "#22c55e", // Tailwind green-500
            color: "white",
          },
        });

        localStorage.removeItem("uuid");
        // localStorage.setItem("uuid", res.data.userId);
        dispatch(setIsFormShow(false));
        router.push(res.data.redirect);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error occurred");
      toast("Login failed", {
        description: "Invalid OTP or email not found",
        duration: 3000,
      });
    }
  };

  // if (!isFormShow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow">
        <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
          <h1 className="text-xl font-bold mb-4">OTP Verification</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              //   className="w-full p-2 border rounded"
            />
            {/* <InputOTPCode /> */}

            <Input
              type="email"
              placeholder="Please input your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              //   className="w-full p-2 border rounded"
            />

            {/* <Input
              disabled={true}
              type="hidden"
              placeholder="WhatsApp ID"
              value={waId}
              onChange={(e) => setWaId(e.target.value)}
              //   className="w-full p-2 border rounded"
            /> */}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full text-white py-2 rounded"
              // className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Verified
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
