"use client";

import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  const targetText =
    "Hello, it's me. I was wondering if after all these years you'd like to meet. To go over everything. They say that time's supposed to heal ya, but I ain't done much healing.";
  const words = targetText.split(" ");
  const isFinished = activeWordIndex === words.length;

  const resetGame = () => {
    setUserInput("");
    setActiveWordIndex(0);
    setCorrectWords([]);
    setStartTime(null);
    setWpm(0);
  };

  // 1. Monitor every single character for the "Final Finish"
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Start timer on first character
    if (!startTime && val.length > 0) setStartTime(Date.now());

    // Check if we are on the LAST word
    if (activeWordIndex === words.length - 1) {
      if (val === words[activeWordIndex]) {
        // MATCH! The last word is typed perfectly.
        setCorrectWords([...correctWords, true]);
        setActiveWordIndex(activeWordIndex + 1);
        setUserInput(val);
        calculateWpm(activeWordIndex + 1);
        return; // Exit early so we don't set input to the "completed" string
      }
    }

    setUserInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      // If user hits space on the last word, we don't want it to clear
      // unless they've actually finished it (but our onChange handles that now)
      if (activeWordIndex < words.length - 1) {
        e.preventDefault();
        const currentWord = words[activeWordIndex];
        const isCorrect = userInput.trim() === currentWord;

        setCorrectWords([...correctWords, isCorrect]);
        setActiveWordIndex(activeWordIndex + 1);
        setUserInput("");
        calculateWpm(activeWordIndex + 1);
      }
    }
  };

  const calculateWpm = (currentWordCount: number) => {
    if (!startTime) return;
    const timeElapsed = (Date.now() - startTime) / 60000;
    setWpm(Math.round(currentWordCount / timeElapsed));
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4 transition-all duration-500">
      {/* We use a wrapper that allows the content to dictate height */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <h1 className="text-4xl font-bold tracking-tighter">TyperAI</h1>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
              {wpm} <span className="text-xs text-zinc-400">WPM</span>
            </div>
            {isFinished && (
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition-transform hover:scale-105"
              >
                Race Again 🏁
              </button>
            )}
          </div>
        </div>

        {/* THE STRETCHING BOX */}
        <div
          className="
        w-full 
        h-auto 
        min-h-[150px] 
        text-2xl 
        leading-relaxed 
        font-mono 
        bg-white 
        dark:bg-zinc-900 
        p-8 
        rounded-2xl 
        border-2 
        border-zinc-200 
        dark:border-zinc-800 
        shadow-xl 
        transition-all 
        duration-300 
        ease-in-out
        overflow-hidden
      "
        >
          <div className="flex flex-wrap">
            {words.map((word, wIdx) => {
              let color = "text-zinc-400";
              if (wIdx < activeWordIndex) {
                color = correctWords[wIdx] ? "text-green-500" : "text-red-500";
              } else if (wIdx === activeWordIndex) {
                color =
                  "text-blue-500 underline underline-offset-8 decoration-2";
              }
              return (
                <span
                  key={wIdx}
                  className={`${color} mr-3 mb-2 transition-colors`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {!isFinished && (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full text-xl p-5 rounded-xl border-2 border-zinc-200 focus:border-blue-500 outline-none dark:bg-zinc-900 dark:border-zinc-800 shadow-inner transition-all"
              value={userInput}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              placeholder="Type exactly what you see above..."
              autoFocus
            />
            <p className="text-xs text-zinc-400 text-center italic">
              Tip: Pressing Space locks in the word. Accuracy counts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
