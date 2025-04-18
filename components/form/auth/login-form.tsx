"use client";

import { startTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { CardWrapper } from "../card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false);

  const router = useRouter(),
    [error, setError] = useState("");

  const { toast } = useToast();

  type LoginFormValues = z.infer<typeof LoginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //   const handleLogin = async (e?: React.FormEvent) => {
  const handleLogin = async (value: LoginFormValues) => {
    // e?.preventDefault(); // untuk mencegah reload form
    // startTransition(() => {
    //   setEmail(value.email);
    //   setPassword(value.password);
    // });
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: value.email,
          password: value.password,
          // email,
          // password,
        },
        { withCredentials: true }
      ); // penting untuk cookie auth

      toast({
        title: "Login successful",
        description: "You will be redirected to dashboard page.",
      });

      router.push("/dashboard");
    } catch (err: any) {
      // setError("Invalid credentials");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials or server error.",
      });
    }
  };

  return (
    <CardWrapper
      title="HRIS Management"
      description="Welcome back"
      backButtonLabel="don't have an account?"
      backButtonHref="/register"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="w-full max-w-md px-6 py-4 shadow-md rounded-xl space-y-6"
        >
          <div className="space-y-4 mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      //   disabled={isPending}
                      placeholder="guardians.asguard@gmail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
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
                      <Input
                        {...field}
                        //   disabled={isPending}
                        placeholder="*******"
                        type={showPassword ? "text" : "password"}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div>
            <Button className="w-full mt-6" type="submit">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
