"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarCheck,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";

const features = [
  {
    icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
    title: "Employee Management",
    desc: "Manage employee profiles, departments, and roles in one place.",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-indigo-600" />,
    title: "Payroll Automation",
    desc: "Generate accurate payrolls and salary slips automatically.",
  },
  {
    icon: <Clock className="w-8 h-8 text-indigo-600" />,
    title: "Attendance Tracking",
    desc: "Track employee working hours and late entries in real time.",
  },
  {
    icon: <CalendarCheck className="w-8 h-8 text-indigo-600" />,
    title: "Leave Requests",
    desc: "Simplify leave approvals with custom workflows.",
  },
  {
    icon: <Star className="w-8 h-8 text-indigo-600" />,
    title: "Performance Reviews",
    desc: "Evaluate employee performance with feedback tools.",
  },
];

export const FeatureSection = () => {
  return (
    <section className="bg-white dark:bg-gray-950 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features for Your HR Needs
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Everything you need to manage your workforce effectively.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
