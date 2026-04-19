"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { useUserStore } from "@/lib/useUserStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Grab the initialize function from your store
  const initialize = useUserStore((state) => state.initialize);

  // 2. Start the Firebase listeners once on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {/* 3. Navbar stays here so it never "restarts" during navigation */}
        <Navbar />
        <main className="flex-1 relative">{children}</main>
      </body>
    </html>
  );
}
