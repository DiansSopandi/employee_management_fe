"use client";

import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CardWrapper } from "../card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { FormError } from "@/components/ui/form-error";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const router = useRouter(),
    [error, setError] = useState<string | undefined>(""),
    [success, setSuccess] = useState<string | undefined>(""),
    [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: RegisterFormValues) => {
    try {
      const res = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
          ...value,
          roles: ["USER"],
        })
        .catch((error) => error.response.data);

      if (!res.success) {
        setError(res.message);
        toast("Register failed", {
          description: `${res.message}`,
          duration: 3000,
        });
      } else {
        toast("Register successfull", {
          description: "You will be redirected to login page.",
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Register failed:", error);
      toast("Register failed", {
        description: "Something went wrong, please try again.",
      });
    }
  };

  return (
    <CardWrapper
      title="HRIS Management"
      description="Create a new account"
      backButtonLabel="Back to Login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md px-6 py-4 shadow-md rounded-xl space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      {...field}
                      placeholder="guardians asguard"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      {...field}
                      placeholder="guardians.asguard@gmail.com"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="********"
                        className="w-full px-3 py-2 border rounded"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
