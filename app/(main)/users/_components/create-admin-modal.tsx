"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { CreateAdminPayload } from "@/services/create-admin.service";
import { useCreateAdmin } from "@/hooks/use-create-admin";

const createAdminSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  full_name: z.string().min(1, "Full name is required"),
});

type FormErrors = Partial<Record<keyof CreateAdminPayload, string>>;

interface CreateAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAdminModal({
  open,
  onClose,
  onSuccess,
}: CreateAdminModalProps) {
  const [form, setForm] = useState<CreateAdminPayload>({
    email: "",
    password: "",
    full_name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending } = useCreateAdmin();

  const resetForm = () => {
    setForm({ email: "", password: "", full_name: "" });
    setErrors({});
  };

  const handleClose = () => {
    if (isPending) return;
    resetForm();
    onClose();
  };

  const handleChange = (field: keyof CreateAdminPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const result = createAdminSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateAdminPayload;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    mutate(result.data, {
      onSuccess: (data) => {
        toast.success("Admin account created", {
          description: `${data.email} can now sign in as an admin.`,
        });
        onSuccess?.();
        handleClose();
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.detail ??
          err?.message ??
          "Something went wrong. Please try again.";

        toast.error("Failed to create admin", {
          description:
            typeof message === "string"
              ? message
              : "Please check the form and try again.",
        });
      },
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#111111] p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus size={22} className="text-primary" />
          </div>

          <div>
            <h2 className="text-base font-michroma font-semibold text-white">
              Create admin account
            </h2>
            <p className="mt-1.5 text-sm font-sf-pro text-zinc-400">
              They&apos;ll be able to sign in with the email and password you
              set here.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 text-left">
            <div className="space-y-1">
              <label className="text-xs font-sf-pro text-zinc-500">
                Full name
              </label>
              <input
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                disabled={isPending}
                placeholder="Sahil Shrestha"
                className="w-full rounded-lg border border-zinc-800 bg-[#0D0D0D] px-3 py-2.5 text-sm font-sf-pro text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-600 disabled:opacity-50"
              />
              {errors.full_name && (
                <p className="text-xs text-red-400">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-sf-pro text-zinc-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isPending}
                placeholder="sahil@gmail.com"
                className="w-full rounded-lg border border-zinc-800 bg-[#0D0D0D] px-3 py-2.5 text-sm font-sf-pro text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-600 disabled:opacity-50"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-sf-pro text-zinc-500">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isPending}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-[#0D0D0D] px-3 py-2.5 text-sm font-sf-pro text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-600 disabled:opacity-50"
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex w-full gap-3 mt-1">
            <button
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-michroma text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#C3F001] px-4 py-2.5 text-sm font-michroma text-[#171717] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating…
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
