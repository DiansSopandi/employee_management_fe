"use client";

import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  const Component = asChild ? Slot : "button"; // Slot akan render children tanpa nambah elemen baru

  if (mode === "modal") {
    return <span> TODO:Implement modal</span>;
  }

  return (
    <Component onClick={handleClick} className="cursor-pointer" type="button">
      {children}
    </Component>
  );
};
