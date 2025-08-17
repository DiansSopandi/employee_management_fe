// components/form/auth/card-wrapper.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ClientWrapper } from "../common/client-wrapper";
import { BackButton } from "./auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  title,
  description,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <ClientWrapper>
      {/* <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg p-8 shadow-md"> */}
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm sm:text-base text-gray-500 text-muted-foreground text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="mb-4">{children}</CardContent>
        <CardFooter className="flex justify-between items-center">
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      </Card>
    </ClientWrapper>
  );
};
