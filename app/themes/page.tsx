"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/useUserStore";

const THEMES = [
  {
    name: "Music",
    bio: "Get ready to race through the world of music with genre-themed typing challenges!",
    emoji: "🎵",
    subcategories: [
      "90s Boom Bap Hip-Hop",
      "Modern R&B Lyrics",
      "Classic 70s Rock",
      "Synth-Pop Lyrics",
      "Delta Blues",
    ],
  },
  {
    name: "Languages",
    bio: "Test your typing skills with texts in different languages!",
    emoji: "🌐",
    subcategories: [
      "English Language",
      "Georgian Language (ქართული)",
      "Spanish Language (Español)",
      "French Language (Français)",
      "Japanese Language (日本語)",
    ],
  },
  {
    name: "Poetry",
    bio: "Immerse yourself in the beauty of words with poetry races!",
    emoji: "✍️",
    subcategories: [
      "Short Poem about Nature",
      "Shakespearian Sonnet excerpt",
      "Modern Abstract Poetry",
      "Haiku Style Verse",
    ],
  },
  {
    name: "Culture",
    bio: "Dive into the rich tapestry of world culture with these themed typing challenges!",
    emoji: "🏮",
    subcategories: [
      "Greek Mythology",
      "Traditional Culinary Arts",
      "Ancient History Moments",
      "Architectural Wonders",
      "World Folklore",
    ],
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
              <div>
                <p className="text-zinc-500">{theme.bio}</p>
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
