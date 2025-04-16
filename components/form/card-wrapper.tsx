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
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-lg mb-2">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="mb-4">{children}</CardContent>
        <CardFooter>
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      </Card>
    </ClientWrapper>
  );
};
