import type { Metadata } from "next";
import { Inter, Michroma } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-michroma",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ComicSmith - Admin",
  description: "Manage Comic Smith App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${michroma.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#171717] flex flex-col">
        <Providers>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
