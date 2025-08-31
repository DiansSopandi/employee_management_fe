// app/dashboard/page.tsx
"use client";

import { StatCard } from "@/components/form/dashboard/stat-card";
import { Users, CheckCircle, Clock, Building2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import chart (client-side only)
const EmployeePieChart = dynamic(
  () => import("@/components/form/dashboard/employee-pie-chart"),
  { ssr: false }
);

export default function Dashboard() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={128} icon={Users} />
        <StatCard
          title="Active Employees"
          value={115}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Pending Leaves"
          value={7}
          icon={Clock}
          color="text-yellow-600"
        />
        <StatCard
          title="Departments"
          value={6}
          icon={Building2}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Employee Distribution</h2>
        <div className="h-64 md:h-80">
          <EmployeePieChart />
        </div>
      </div>
    </main>
  );
}
