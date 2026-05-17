import LoginForm from "@/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-[#888888] font-inter">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
