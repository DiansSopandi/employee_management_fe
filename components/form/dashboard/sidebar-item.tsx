// components/sidebar/SidebarItem.tsx
import Link from "next/link";
import { cn } from "@/lib/utils"; // Optional helper
import { LucideIcon } from "lucide-react";

interface Props {
  readonly icon?: LucideIcon;
  readonly label: string;
  readonly href: string;
  readonly badge?: string;
  readonly badgeType?: "pro" | "default";
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  badge,
  badgeType = "default",
}: Props) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between px-8 py-3 mt-4 rounded-lg hover:bg-slate-700 transition"
      >
        <div className="flex items-center space-x-3 text-sm">
          {Icon && <Icon size={18} />}
          <span>{label}</span>
        </div>
        {badge && (
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              badgeType === "pro"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            )}
          >
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
