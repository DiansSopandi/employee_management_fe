"use client";

import React from "react";
import Link from "next/link";
// import DashboardHeaderImages from "../auth/header-images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faBox,
  faUser,
  faSignOutAlt,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const SidebarLink = ({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link
      href={href}
      className={`px-4 py-3 block rounded-md text-sm font-medium ${
        isActive
          ? "bg-red-500"
          : "hover:bg-indigo-200 hover:text-black transition"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-4" />
      {label}
    </Link>
  );
};

const DashboardSidebar = () => {
  return (
    <div className="fixed flex flex-col space-y-2 left-0 top-0 w-64 h-screen shadow-2xl z-50">
      {/* <DashboardHeaderImages /> */}
      <div className="w-64 bg-indigo-700 text-white text-xs h-screen flex flex-col p-5">
        <div className="flex justify-between items-center mb-16">
          <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-4" />
          <h2 className="text-xs font-medium tracking-wide uppercase whitespace-nowrap">
            Carik Kantor Pusat
          </h2>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-gray-300 ml-4"
          />
        </div>

        <div className="flex">
          <span className="uppercase text-xs font-normal text-gray-300 bg-indigo-900  mb-3 px-3 py-1 rounded-md inline-block">
            Menu Utama
          </span>
        </div>

        <nav className="flex flex-col space-y-2">
          <SidebarLink href="/dashboard" label="BNBA" icon={faHome} active />
          <SidebarLink
            href="/dashboard/katalog"
            label="Katalog"
            icon={faHome}
          />
          <SidebarLink
            href="/dashboard/standard"
            label="Standard Data"
            icon={faBox}
          />
          <SidebarLink
            href="/dashboard/user-management"
            label="User Management"
            icon={faUser}
          />
        </nav>

        <Link href="/" className="mt-auto pt-10">
          <button className="px-4 py-3 w-full bg-gray-800 hover:bg-gray-900 transition rounded-md text-center">
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-4" />
            Keluar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
