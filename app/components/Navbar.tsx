"use client";

import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full py-6 px-10 flex justify-between items-center bg-transparent absolute top-0 left-0 z-50">
      <div className="flex gap-10">
        {["Race", "Leaderboard", "Themes"].map((item) => (
          <button
            key={item}
            className="group relative cursor-pointer text-white font-medium text-lg transition-colors hover:text-zinc-300"
          >
            {item}
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-white transition-all duration-300 ease-in-out group-hover:translate-y-2 opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-center text-white font-medium">
        <button className="hover:text-zinc-300 transition-colors cursor-pointer">
          sign in
        </button>
        <span className="text-zinc-600">|</span>
        <button className="hover:text-zinc-300 transition-colors cursor-pointer">
          sign up
        </button>
      </div>
    </nav>
  );
}
