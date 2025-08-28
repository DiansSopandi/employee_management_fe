"use client";

import { FaGoogle, FaGithub, FaLinkedin, FaMicrosoft } from "react-icons/fa";
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
import { SocialLoginButtons } from "./social-login-form";

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
        .then((res) => res.data)
        .catch((error) => error.response.data);
      console.log("res", res);

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
          style: {
            backgroundColor: "#22c55e", // Tailwind green-500
            color: "white",
          },
        });

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Register failed:", error);
      toast("Register failed", {
        description: "Something went wrong, please try again.",
        duration: 3000,
        style: {
          backgroundColor: "#ef4444", // Tailwind red-500
          color: "white",
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Create your HRIS Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Sign up to access your HRIS portal
      </p>

      {/* --- Registration Form --- */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
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
                    placeholder="john.doe"
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      form.formState.errors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </FormControl>
                {form.formState.errors.username && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Email */}
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
                    placeholder="john.doe@company.com"
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      form.formState.errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </FormControl>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Password */}
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
                      className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        form.formState.errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Global error */}
          <FormError message={error} />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            Create Account
          </Button>

          {/* Back to Login */}
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Login
            </a>
          </p>
        </form>
      </Form>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* --- Social Login --- */}
      <div className="flex flex-col space-y-3 mb-6">
        {/* <Button variant="outline" className="w-full flex items-center gap-2">
          <FaGoogle className="text-red-500" /> Continue with Google
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FaGithub className="text-gray-800" /> Continue with GitHub
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FaLinkedin className="text-sky-700" /> Continue with LinkedIn
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FaMicrosoft className="text-blue-600" /> Continue with Microsoft
        </Button> */}
        <SocialLoginButtons mode="register" />
      </div>
    </div>
  );

  // return (
  //   <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
  //     <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
  //       Create your HRIS Account
  //     </h2>
  //     <p className="text-sm text-gray-500 text-center mb-6">
  //       Fill in your details to get started
  //     </p>

  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
  //         {/* Username */}
  //         <FormField
  //           control={form.control}
  //           name="username"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel className="text-sm font-medium text-gray-700">
  //                 Username
  //               </FormLabel>
  //               <FormControl>
  //                 <input
  //                   type="text"
  //                   {...field}
  //                   placeholder="john.doe"
  //                   className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
  //                     form.formState.errors.username
  //                       ? "border-red-500 focus:ring-red-500"
  //                       : "border-gray-300"
  //                   }`}
  //                 />
  //               </FormControl>
  //               {form.formState.errors.username && (
  //                 <p className="text-xs text-red-500 mt-1">
  //                   {form.formState.errors.username.message}
  //                 </p>
  //               )}
  //             </FormItem>
  //           )}
  //         />

  //         {/* Email */}
  //         <FormField
  //           control={form.control}
  //           name="email"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel className="text-sm font-medium text-gray-700">
  //                 Email
  //               </FormLabel>
  //               <FormControl>
  //                 <input
  //                   type="email"
  //                   {...field}
  //                   placeholder="john.doe@company.com"
  //                   className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
  //                     form.formState.errors.email
  //                       ? "border-red-500 focus:ring-red-500"
  //                       : "border-gray-300"
  //                   }`}
  //                 />
  //               </FormControl>
  //               {form.formState.errors.email && (
  //                 <p className="text-xs text-red-500 mt-1">
  //                   {form.formState.errors.email.message}
  //                 </p>
  //               )}
  //             </FormItem>
  //           )}
  //         />

  //         {/* Password */}
  //         <FormField
  //           control={form.control}
  //           name="password"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel className="text-sm font-medium text-gray-700">
  //                 Password
  //               </FormLabel>
  //               <FormControl>
  //                 <div className="relative">
  //                   <input
  //                     type={showPassword ? "text" : "password"}
  //                     {...field}
  //                     placeholder="********"
  //                     className={`w-full px-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
  //                       form.formState.errors.password
  //                         ? "border-red-500 focus:ring-red-500"
  //                         : "border-gray-300"
  //                     }`}
  //                   />
  //                   <button
  //                     type="button"
  //                     onClick={() => setShowPassword(!showPassword)}
  //                     className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
  //                   >
  //                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  //                   </button>
  //                 </div>
  //               </FormControl>
  //               {form.formState.errors.password && (
  //                 <p className="text-xs text-red-500 mt-1">
  //                   {form.formState.errors.password.message}
  //                 </p>
  //               )}
  //             </FormItem>
  //           )}
  //         />

  //         {/* Global error */}
  //         <FormError message={error} />

  //         {/* Submit */}
  //         <Button
  //           type="submit"
  //           className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition"
  //         >
  //           Create Account
  //         </Button>

  //         {/* Back to Login */}
  //         <p className="text-sm text-gray-500 text-center">
  //           Already have an account?{" "}
  //           <a
  //             href="/login"
  //             className="text-blue-600 hover:underline hover:text-blue-800"
  //           >
  //             Login
  //           </a>
  //         </p>
  //       </form>
  //     </Form>
  //   </div>
  // );
};
