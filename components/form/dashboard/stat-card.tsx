// components/dashboard/StatCard.tsx
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-blue-600",
}: StatCardProps) => {
  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white dark:bg-zinc-900 flex items-center justify-between">
      <div>
        <h4 className="text-sm text-muted-foreground">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  );
};
