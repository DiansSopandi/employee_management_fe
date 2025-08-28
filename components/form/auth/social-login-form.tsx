// components/auth/social-login-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub, FaLinkedin, FaMicrosoft } from "react-icons/fa";

interface Props {
  mode?: "login" | "register";
}

export const SocialLoginButtons = ({ mode = "login" }: Props) => {
  const handleSocialLogin = (provider: string) => {
    // Best practice: redirect ke backend endpoint, bukan langsung FE
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full"
        onClick={() => handleSocialLogin("google")}
      >
        <FaGoogle className="text-red-500" /> Continue with Google
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full"
        onClick={() => handleSocialLogin("github")}
      >
        <FaGithub className="text-gray-800" /> Continue with GitHub
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full"
        onClick={() => handleSocialLogin("linkedin")}
      >
        <FaLinkedin className="text-blue-700" /> Continue with LinkedIn
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 w-full"
        onClick={() => handleSocialLogin("microsoft")}
      >
        <FaMicrosoft className="text-blue-600" /> Continue with Microsoft
      </Button>
    </div>
  );
};
