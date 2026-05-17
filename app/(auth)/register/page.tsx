"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormData } from "@/schema/auth.schema";
import { useRegister } from "@/hooks/use-auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-md lg:max-w-lg xl:w-149 shrink-0 flex flex-col px-4 py-7 lg:px-10 lg:py-7 items-center gap-5 rounded-[18px] border border-[#888888]"
        style={{ background: "rgba(17, 17, 17, 0.7)" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-michroma text-[#FFFFFF] text-[24px] text-center">
            Create Account
          </h2>
          <p className="font-inter text-[#888888] text-[14px] text-center">
            Enter your details to get started.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3"
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="font-inter font-medium text-[#FFFFFF] text-[13px]">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      type="text"
                      {...field}
                      className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-[#888888] placeholder:text-[#888888] font-inter text-[13px] rounded-[8px] px-4 focus-visible:ring-[#C3F001] focus-visible:border-[#C3F001]"
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="font-inter font-medium text-[#FFFFFF] text-[13px]">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
                      type="email"
                      {...field}
                      className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-[#888888] placeholder:text-[#888888] font-inter text-[13px] rounded-[8px] px-4 focus-visible:ring-[#C3F001] focus-visible:border-[#C3F001]"
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="font-inter font-medium text-[#FFFFFF] text-[13px]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...field}
                        className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-[#888888] placeholder:text-[#888888] font-inter text-[13px] rounded-[8px] px-4 pr-10 focus-visible:ring-[#C3F001] focus-visible:border-[#C3F001]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FFFFFF] focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="font-inter text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="font-inter font-medium text-[#FFFFFF] text-[13px]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-[#888888] placeholder:text-[#888888] font-inter text-[13px] rounded-[8px] px-4 pr-10 focus-visible:ring-[#C3F001] focus-visible:border-[#C3F001]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FFFFFF] focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="font-inter text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-red-400 text-xs text-center font-inter">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-11 bg-[#C3F001] hover:bg-[#d4f821] text-[#171717] font-michroma text-[13px] rounded-[14px] transition-colors mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create Account"}
            </Button>

            <p className="font-inter text-[#F2F2F2] text-[12px] text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#C3F001] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
