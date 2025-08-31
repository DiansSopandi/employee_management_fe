import DashboardNavbar from "@/components/form/dashboard/navbar";
import Sidebar from "@/components/form/dashboard/sidebar";
import React, { useEffect } from "react";
import { useAppSelector } from "../redux";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 w-full min-h-screen`}
    >
      {/* <DashboardSidebar /> */}
      <Sidebar />
      <main className=" flex flex-col bg-gray-50 w-full h-full text-black py-7 px-4 sm:px-4 lg:px-10 md:pl-24 lg:ml-60">
        {/* <DashboardHeader /> */}
        <DashboardNavbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
