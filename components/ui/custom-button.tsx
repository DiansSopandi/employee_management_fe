// components/ui/custom-button.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // utility dari ShadCN
import { forwardRef, ReactNode } from "react";

interface CustomButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly variant?: "default" | "outline" | "ghost" | "destructive";
  readonly size?: "sm" | "md" | "lg";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly type?: "button" | "submit" | "reset";
  readonly width?: "auto" | "full" | string; // string: custom Tailwind width like "w-40"
}

const sizeMap = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      onClick,
      variant = "default",
      size = "md",
      disabled = false,
      className = "",
      type = "button",
      width = "auto",
    },
    ref
  ) => {
    // const sizeClasses = {
    //     sm: "px-2 py-1 text-sm",
    //     md: "px-4 py-2 text-sm",
    //     lg: "px-6 py-3 text-base",
    //   };
    const baseStyle = "bg-black text-white rounded-md";
    const widthAuto = width === "auto" ? "w-auto" : width;
    const widthClass = width === "full" ? "w-full" : widthAuto;
    const buttonClass = cn(sizeMap[size], widthClass, className);

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        onClick={onClick}
        disabled={disabled}
        // className={cn(sizeMap[size], widthClass, className)}
        className={buttonClass}
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";
