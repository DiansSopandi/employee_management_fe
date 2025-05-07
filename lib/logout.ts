"use client";

import Cookies from "js-cookie";

export const logout = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 100)); // delay 1 detik
  return true;
};
