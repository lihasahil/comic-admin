import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-8">
      {/* Blue glow top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "676px",
          height: "794px",
          left: "956px",
          top: "-169px",
          background: "#42A7F8",
          opacity: 0.14,
          filter: "blur(175.6px)",
          borderRadius: "50%",
        }}
      />
      {/* Orange glow bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "676px",
          height: "794px",
          left: "-160px",
          top: "267px",
          background: "#F89342",
          opacity: 0.08,
          filter: "blur(175.6px)",
          borderRadius: "50%",
        }}
      />

      {children}
    </div>
  );
}
