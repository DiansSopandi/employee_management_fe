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
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
// import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false);

  const router = useRouter(),
    [error, setError] = useState("");

  // const { toast } = useToast();

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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: value.email,
          password: value.password,
          // email,
          // password,
        },
        { withCredentials: true }
      ); // penting untuk cookie auth

      toast("Login successfull", {
        description: "You will be redirected to dashboard page.",
        duration: 1000,
        style: {
          backgroundColor: "#22c55e", // Tailwind green-500
          color: "white",
        },
      });

      // await new Promise((resolve) => setTimeout(resolve, 500)); // delay 1 detik
      router.push("/dashboard");
    } catch (err: any) {
      toast("Login failed", {
        description: "Invalid credentials or server error.",
        duration: 1000,
        style: {
          backgroundColor: "#ef4444", // Tailwind red-500
          color: "white",
        },
      });

      console.error("Login error:", err);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-600 px-4">
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 space-y-6">
      {/* Branding */}
      <div className="flex flex-col items-center">
        <Image
          priority
          src="/assets/images/absence_management.png"
          alt="Company Logo"
          className="h-12 mb-3"
          width={100}
          height={200}
        />
        <h1 className="text-2xl font-bold text-gray-900">HRIS Portal</h1>
        <p className="text-gray-500">Sign in to manage your workforce</p>
      </div>

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="yourname@company.com"
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
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            type="submit"
          >
            Login
          </Button>

          <p className="text-xs text-gray-400 text-center">
            🔒 Secure enterprise login
          </p>
        </form>
      </Form>

      {/* SSO Options */}
      <div className="border-t pt-4">
        <p className="text-center text-sm text-gray-500 mb-3">
          Or continue with
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Google
          </Button>
          <Button variant="outline" className="flex-1">
            Microsoft
          </Button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex justify-between text-sm text-gray-500">
        <Link href="/forgot-password" className="hover:underline">
          Forgot Password?
        </Link>
        <Link href="/support" className="hover:underline">
          Need Help?
        </Link>
      </div>
    </div>
    // </div>
  );
  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-50 px-2 sm:px-6">
  //     <CardWrapper
  //       title="HRIS Management"
  //       description="Welcome back"
  //       backButtonLabel="don't have an account?"
  //       backButtonHref="/register"
  //     >
  //       <Form {...form}>
  //         <form
  //           onSubmit={form.handleSubmit(handleLogin)}
  //           className="w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 sm:px-6 py-6 shadow-md rounded-xl space-y-6 bg-white"
  //         >
  //           <div className="space-y-4 mb-4">
  //             <FormField
  //               control={form.control}
  //               name="email"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel className="">Email</FormLabel>
  //                   <FormControl>
  //                     <Input
  //                       {...field}
  //                       //   disabled={isPending}
  //                       placeholder="guardians.asguard@gmail.com"
  //                       type="email"
  //                       className="text-sm sm:text-base"
  //                     />
  //                   </FormControl>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />
  //             <FormField
  //               control={form.control}
  //               name="password"
  //               render={({ field }) => (
  //                 <FormItem>
  //                   <FormLabel>Password</FormLabel>
  //                   <FormControl>
  //                     <div className="relative">
  //                       <Input
  //                         {...field}
  //                         //   disabled={isPending}
  //                         placeholder="*******"
  //                         type={showPassword ? "text" : "password"}
  //                       />
  //                       <button
  //                         type="button"
  //                         onClick={() => setShowPassword(!showPassword)}
  //                         className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-black"
  //                       >
  //                         {showPassword ? (
  //                           <EyeOff size={20} />
  //                         ) : (
  //                           <Eye size={20} />
  //                         )}
  //                       </button>
  //                     </div>
  //                   </FormControl>
  //                   <FormMessage />
  //                 </FormItem>
  //               )}
  //             />
  //             {error && <p className="text-red-500 text-sm">{error}</p>}
  //           </div>
  //           <div>
  //             <Button
  //               className="w-full mt-4 sm:mt-6 text-sm sm:text-base py-2 sm:py-3"
  //               type="submit"
  //             >
  //               Login
  //             </Button>
  //           </div>
  //         </form>
  //       </Form>
  //     </CardWrapper>
  //   </div>
  // );
};
