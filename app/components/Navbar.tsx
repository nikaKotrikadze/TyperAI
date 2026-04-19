"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/useUserStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Grab state from Zustand
  const { user, userData, loading } = useUserStore();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navItems = [
    { name: "Race", path: "/" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Themes", path: "/themes" },
  ];

  return (
    <nav className="w-full py-6 px-10 flex justify-between items-center bg-transparent absolute top-0 left-0 z-50 font-geist-sans">
      <div className="flex gap-10">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="group relative text-white font-medium text-lg transition-colors hover:text-zinc-300"
            >
              {item.name}
              <span
                className={`absolute left-0 -bottom-1 w-full h-[2px] bg-white transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
            </Link>
          );
        })}
      </div>

      <div className="flex gap-6 items-center text-white font-medium">
        {/* If loading, we show nothing to prevent the flicker */}
        {!loading && (
          <>
            {user ? (
              <div className="flex gap-6 items-center bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    Best Speed
                  </span>
                  <span
                    key={userData.bestWpm}
                    className="text-yellow-400 font-bold animate-in fade-in zoom-in duration-500"
                  >
                    {userData.bestWpm}{" "}
                    <span className="text-[10px] text-zinc-400">WPM</span>
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-zinc-800" />
                <div className="flex gap-4 items-center">
                  <Link
                    href="/settings"
                    className="text-zinc-200 hover:text-white transition-colors"
                  >
                    {userData.username || "Racer"}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/sign-in"
                  className="hover:text-zinc-300 transition-colors"
                >
                  sign in
                </Link>
                <span className="text-zinc-600">|</span>
                <Link
                  href="/sign-up"
                  className="hover:text-zinc-300 transition-colors"
                >
                  sign up
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
