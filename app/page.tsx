"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-6xl font-bold text-center sm:text-left">
          Welcome to TyperAI
        </h1>
        <input
          type="text"
          placeholder="Type something..."
          className="mt-8 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p className="mt-4 text-lg text-white dark:text-gray-300">{text}</p>
      </main>
    </div>
  );
}
