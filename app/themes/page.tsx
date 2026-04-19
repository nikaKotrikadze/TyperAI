"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/useUserStore";

const THEMES = [
  {
    name: "Music",
    emoji: "🎵",
    subcategories: ["Hip-Hop", "R&B", "Rock", "Jazz", "Classical"],
  },
  {
    name: "Languages",
    emoji: "🌐",
    subcategories: ["English", "Georgian", "Spanish", "French", "Japanese"],
  },
  {
    name: "Poetry",
    emoji: "✍️",
    subcategories: ["Romanticism", "Haiku", "Sonnets", "Modern Verse"],
  },
  {
    name: "Culture",
    emoji: "🏮",
    subcategories: ["Mythology", "Culinary Arts", "History", "Architecture"],
  },
];

export default function ThemesPage() {
  const router = useRouter();
  const { setTopic, setTargetText } = useUserStore();

  const handleSelectTheme = (sub: string) => {
    // 1. Update the global topic
    setTopic(sub);
    // 2. Clear current text so the Home page knows to fetch a new one
    setTargetText("");
    // 3. Send them back to the race
    router.push("/");
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center bg-black transition-all duration-500">
      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white">
            Themes
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Pick a category to generate a custom race.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {THEMES.map((theme) => (
            <div
              key={theme.name}
              className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm space-y-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{theme.emoji}</span>
                <h2 className="text-2xl font-bold text-white">{theme.name}</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {theme.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSelectTheme(sub)}
                    className="px-4 py-2 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all duration-200 font-medium active:scale-95"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
