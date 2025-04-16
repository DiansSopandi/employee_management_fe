// components/sidebar/SidebarMenuGroup.tsx
"use client";

import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

interface Props {
  readonly icon?: LucideIcon;
  readonly label: string;
  readonly children: React.ReactNode;
}

export function SidebarMenuGroup({ label, children, icon: Icon }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center mt-3 px-8 py-3 gap-3 rounded-lg hover:bg-slate-700 text-sm"
      >
        <div className="flex items-center space-x-3 h-full shadow-md">
          {Icon && <Icon size={18} className="w-5 h-5" />}
          <span>{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <ul className="pl-6 mt-2 space-y-1">{children}</ul>}
    </div>
  );
}
