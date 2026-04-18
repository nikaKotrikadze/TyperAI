"use client";

import React, { useState } from "react";

export default function Navbar() {
  // Set "Race" as the default active tab
  const [activeTab, setActiveTab] = useState("Race");

  const navItems = ["Race", "Leaderboard", "Themes"];

  return (
    <nav className="w-full py-6 px-10 flex justify-between items-center bg-transparent absolute top-0 left-0 z-50">
      <div className="flex gap-10">
        {navItems.map((item) => {
          const isActive = activeTab === item;

          return (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className="group relative text-white font-medium text-lg transition-colors hover:text-zinc-300"
            >
              {item}
              {/* The Underline Logic */}
              <span
                className={`
                absolute left-0 -bottom-1 w-full h-[2px] bg-white transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "opacity-100 translate-y-0" // Visible if active
                    : "opacity-0 group-hover:opacity-100 group-hover:translate-y-2" // Hover effect if inactive
                }
              `}
              />
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 items-center text-white font-medium">
        <button className="hover:text-zinc-300 transition-colors">
          sign in
        </button>
        <span className="text-zinc-600">|</span>
        <button className="hover:text-zinc-300 transition-colors">
          sign up
        </button>
      </div>
    </nav>
  );
}
