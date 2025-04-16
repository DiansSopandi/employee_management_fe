// components/common/client-wrapper.tsx
"use client";
import { motion } from "framer-motion";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
    }}
  >
    {children}
  </motion.div>
);
