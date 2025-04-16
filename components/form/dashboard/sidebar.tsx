"use client";

import { logout } from "@/lib/logout";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useAppDispatch, useAppSelector } from "@/app/redux";
// import { isSidebarCollapsValue, setIsSidebarCollaps } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Folder,
  Layout,
  LayoutDashboard,
  LucideIcon,
  Menu,
  Settings,
  SlidersHorizontal,
  User,
  User2,
  Users2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { SidebarMenuGroup } from "./sidebar-menu-group";
import { SidebarItem } from "./sidebar-item";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  //   isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
}: //   isCollapsed,
SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} key={label}>
      <div
        // className={`cursor-pointer flex items-center ${
        //   isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        // } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
        //   isActive ? "bg-blue-200 text-white" : ""
        // }`}
        className={`cursor-pointer flex items-center ${"justify-start px-8 py-3"} gap-3 hover:text-blue-500 hover:bg-slate-700  transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        } rounded-sm text-sm`}
      >
        {/* <Icon className="w-6 h-6 !text-gray-700" /> */}
        <Icon className="w-5 h-5 !text-white" />
        <span
          //   className={`${
          //     isCollapsed ? "hidden" : "block"
          //   } font-medium text-gray-700`}
          // className={`${"block"} font-medium text-gray-700`}
          className={`${"block"} font-medium text-white`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const router = useRouter();

  //   const dispatch = useAppDispatch();
  // comment below do not remove
  // const isSidebarCollaps = useAppSelector(
  //   (state) => state.global.isSidebarCollaps
  // );
  //   const isSidebarCollaps = useAppSelector(isSidebarCollapsValue);

  //   const toggleSidebar = () => {
  //     dispatch(setIsSidebarCollaps(!isSidebarCollaps));
  //   };

  //   const sidebarClassNames = `fixed flex flex-col ${
  //     isSidebarCollaps ? "w-0 md:w-20" : "w-72 md:w-64"
  //   } bg-white transistion-all duration-300 overflow-hidden h-full shadow-md z-40`;
  // const sidebarClassNames = `fixed flex flex-col bg-luxeGray text-black ${"w-72 md:w-64"}  transistion-all duration-300 overflow-hidden h-full shadow-md z-40 rounded-sm`;
  const [open, setOpen] = useState(false);

  const sidebarClassNames = `fixed flex flex-col bg-[#1E293B] text-white ${"w-72 md:w-60"}  transistion-all duration-300 overflow-hidden h-full shadow-md z-40 rounded-sm ${
    open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  }`;

  const handleLogout = () => {
    logout(); // hapus token
    router.push("/login"); // redirect ke login
  };

  return (
    <>
      {/* Toggle button only for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-md"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <div className={sidebarClassNames}>
        {/* top Logo */}
        <div
          // className={`flex justify-between md:justify-normal items-center pt-8 gap-3 ${
          //   isSidebarCollaps ? "px-5" : "px-8"
          // }`}
          className={`flex justify-between md:justify-normal items-center pt-8 gap-3 ${"px-8"} mb-8`}
        >
          <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-4" />
          <h1
            //   className={`${
            //     isSidebarCollaps ? "hidden" : "block"
            //   } font-extrabold text-base`}
            className={`${"block"} font-semibold text-sm`}
          >
            HRIS Management
          </h1>

          <button
            className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
            //   onClick={toggleSidebar}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* link */}
        <nav className="flex-grow mt-8">
          <SidebarLink
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            //   isCollapsed={isSidebarCollaps}
          />
          {/* <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          //   isCollapsed={isSidebarCollaps}
        /> */}
          <SidebarLink
            href="/products"
            icon={Clipboard}
            label="Products"
            //   isCollapsed={isSidebarCollaps}
          />
          <SidebarLink
            href="/users"
            icon={Users2}
            label="Users"
            //   isCollapsed={isSidebarCollaps}
          />
          <SidebarLink
            href="/profile"
            icon={User}
            label="Profile"
            //   isCollapsed={isSidebarCollaps}
          />

          <SidebarLink
            href="/settings"
            icon={SlidersHorizontal}
            label="Setings"
            //   isCollapsed={isSidebarCollaps}
          />

          <SidebarMenuGroup label="Tasks" icon={Folder}>
            <SidebarItem label="Task List" href="/tasks/list" />
            <SidebarItem label="Add Task" href="/tasks/add" />
          </SidebarMenuGroup>
          {/* <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          //   isCollapsed={isSidebarCollaps}
        /> */}
        </nav>

        <div>
          {/* <Link href="/" className="mt-auto pt-10"> */}
          <button
            onClick={handleLogout}
            className="px-4 py-3 w-full bg-luxeMaroon  hover:text-blue-500 hover:bg-blue-100 transition rounded-md text-center text-xs text-white mb-4"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-4" />
            Logout
          </button>
          {/* </Link> */}
        </div>

        {/* footer */}
        {/* <div className={`${isSidebarCollaps ? "hidden" : "block"} mb-10`}> */}
        <div className={` "block"} mb-5`}>
          <p className="text-center text-xs text-gray-500 font-bold">
            &copy; 2024 asguard
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
