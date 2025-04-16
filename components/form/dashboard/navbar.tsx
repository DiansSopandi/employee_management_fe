import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bell, Menu, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardNavbar = () => {
  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* left Side */}
      <div className="flex justify-between items-center gap-5">
        <button className="">
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <Input
            type="search"
            placeholder="Start type to search groups & products"
            className="pl-10"
          />

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Bell className="text-gray-500" size={20} />
          </div>
        </div>
      </div>
      {/* right Side */}
      <div className=" flex justify-between items-center gap-5">
        <div className="">
          <ThemeToggle />
        </div>

        <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
            {/* Ganti ini nanti dengan <Image />D */}
            <FontAwesomeIcon icon={faUser} className=" w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">asguard</span>
        </div>

        {/* Settings */}
        <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500" size={20} />
        </Link>
      </div>
    </div>
  );
};

export default DashboardNavbar;
