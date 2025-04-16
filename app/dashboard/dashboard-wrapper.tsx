import DashboardHeader from "@/components/form/dashboard/header";
import DashboardNavbar from "@/components/form/dashboard/navbar";
import Sidebar from "@/components/form/dashboard/sidebar";
import DashboardSidebar from "@/components/form/dashboard/sidebar_";
import React from "react";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex bg-gray-50 text-white w-full min-h-screen">
      {/* <DashboardSidebar /> */}
      <Sidebar />
      <main className=" flex flex-col bg-gray-50 w-full h-full text-black py-7 px-10 md:pl-24 ml-52">
        {/* <DashboardHeader /> */}
        <DashboardNavbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
