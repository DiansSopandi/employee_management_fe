"use client";

import Cookies from "js-cookie";

export const logout = async () => {
  await fetch("http://localhost:5001/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  Cookies.remove("access_token"); // hapus token login
};
