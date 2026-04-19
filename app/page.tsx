"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import { auth, db } from "@/lib/firebase"; // Import auth and db
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [targetText, setTargetText] = useState(
    "Loading your first challenge...",
  );
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const words = targetText.split(" ");
  const isFinished = activeWordIndex === words.length;

  const [highlightCTA, setHighlightCTA] = useState(false);
  // EFFECT: Handle Database Update on Finish
  useEffect(() => {
    const saveProgress = async () => {
      const currentUser = auth.currentUser;

      // Only attempt to save if the race is finished and a user is signed in
      if (isFinished && currentUser && wpm > 0) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const currentBest = userDoc.data().bestWpm || 0;

            // Only update if the new WPM is higher than the personal best
            if (wpm > currentBest) {
              await updateDoc(userRef, {
                bestWpm: wpm,
              });
              console.log("New high score saved!");
            }
          }
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }
    };

    saveProgress();
  }, [isFinished, wpm]); // Triggers when the race finishes

  const fetchAiText = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setTargetText(data.text);
      resetGame();
    } catch (error) {
      console.error("AI Fetch Error:", error);
      setTargetText("AI is taking a break. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiText();
  }, []);

  useEffect(() => {
    if (!isLoading && !isFinished) {
      inputRef.current?.focus();
    }
  }, [isLoading, isFinished]);

  useEffect(() => {
    if (isFinished && !auth.currentUser) {
      setHighlightCTA(true);
      // Remove the class after the animation finishes so it can trigger again if they race again
      const timer = setTimeout(() => setHighlightCTA(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isFinished]);

  const resetGame = () => {
    setUserInput("");
    setActiveWordIndex(0);
    setCorrectWords([]);
    setStartTime(null);
    setWpm(0);
    setFinalTime(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime && val.length > 0) setStartTime(Date.now());

    if (activeWordIndex === words.length - 1) {
      if (val === words[activeWordIndex]) {
        const endTime = Date.now();
        const updatedCorrectWords = [...correctWords, true];
        setCorrectWords(updatedCorrectWords);
        setActiveWordIndex(activeWordIndex + 1);
        setUserInput(val);

        const totalSeconds = ((endTime - startTime!) / 1000).toFixed(2);
        setFinalTime(Number(totalSeconds));

        const timeElapsed = (endTime - startTime!) / 60000;
        const finalWpm = Math.round(
          updatedCorrectWords.filter(Boolean).length / timeElapsed,
        );
        setWpm(finalWpm);
        return;
      }
    }
    setUserInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      if (activeWordIndex < words.length - 1) {
        e.preventDefault();
        const isCorrect = userInput.trim() === words[activeWordIndex];
        const updatedCorrectWords = [...correctWords, isCorrect];
        setCorrectWords(updatedCorrectWords);
        setActiveWordIndex(activeWordIndex + 1);
        setUserInput("");

        const timeElapsed = (Date.now() - startTime!) / 60000;
        setWpm(
          Math.round(updatedCorrectWords.filter(Boolean).length / timeElapsed),
        );
      }
    }
  };

  useEffect(() => {
    if (!isLoading && !isFinished) {
      // This tells the browser: "Find the input and click it for the user"
      inputRef.current?.focus();
    }
  }, [isLoading, isFinished]);

  const createAccountLink = () => {
    if (auth.currentUser) return null;

    return (
      <div
        className={`w-full max-w-4xl px-10 py-6 mb-12 flex justify-between items-center rounded-2xl border transition-all duration-700 bg-zinc-950/50 backdrop-blur-sm 
      ${highlightCTA ? "animate-led border-white" : "border-zinc-800"} 
`}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Record your races with a TyperAI Account!
          </h2>
          <p className="text-sm text-zinc-500">
            Save your race history and scores. It&apos;s free.
          </p>
        </div>

        <Link
          href="/sign-up"
          className="px-6 py-3 bg-white text-black text-sm font-bold rounded-lg transition hover:bg-zinc-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Create an Account
        </Link>
      </div>
    );
  };

  return (
    <main className="relative">
      <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4 transition-all duration-500">
        {createAccountLink()}
        {/* We use a wrapper that allows the content to dictate height */}
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <h1 className="text-4xl font-bold tracking-tighter">TyperAI</h1>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                {wpm} <span className="text-xs text-zinc-400">WPM</span>
              </div>

              {/* Place this above your main text box */}
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Enter a topic (e.g. Space, Cooking, Coding)..."
                  className="flex-1 p-3 rounded-lg border dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button
                  onClick={fetchAiText}
                  disabled={isLoading}
                  className="bg-zinc-900 dark:bg-zinc-100 dark:text-black text-white px-6 rounded-lg font-bold disabled:opacity-50"
                >
                  {isLoading ? "Generating..." : "Generate Text"}
                </button>
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
                  color = correctWords[wIdx]
                    ? "text-green-500"
                    : "text-red-500";
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
          {finalTime !== null && (
            <div className="text-2xl font-mono text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
              {finalTime !== null ? finalTime : 0}{" "}
              <span className="text-xs text-zinc-400">Seconds</span>
            </div>
          )}
          {!isFinished && (
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                className="w-full text-xl p-5 rounded-xl border-2 border-zinc-200 focus:border-blue-500 outline-none dark:bg-zinc-900 dark:border-zinc-800 shadow-inner transition-all"
                value={userInput}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                disabled={isLoading || isFinished}
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
    </main>
  );
}
