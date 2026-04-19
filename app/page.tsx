"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useUserStore } from "@/lib/useUserStore";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    user,
    userData,
    targetText,
    setTargetText,
    topic,
    setTopic,
    loading,
  } = useUserStore();

  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightCTA, setHighlightCTA] = useState(false);

  const words = targetText ? targetText.split(" ") : [];
  const isFinished = words.length > 0 && activeWordIndex === words.length;

  // 1. Initial Fetch & Auto-Refresh on Finish
  useEffect(() => {
    if (!targetText && !isLoading) {
      fetchAiText();
    }
  }, [targetText]);

  // 2. High Score and Auto-Next-Race
  useEffect(() => {
    if (isFinished) {
      const handleFinish = async () => {
        // Save score if user is logged in
        if (user && wpm > userData.bestWpm) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { bestWpm: wpm });
          } catch (error) {
            console.error(error);
          }
        }

        // Trigger CTA for guests
        if (!user) {
          setHighlightCTA(true);
          setTimeout(() => setHighlightCTA(false), 1500);
        }

        // Auto-load new text after a small delay so they can see their score
        setTimeout(() => {
          setTargetText(""); // Clearing targetText triggers the fetch effect above
        }, 2000);
      };

      handleFinish();
    }
  }, [isFinished]);

  useEffect(() => {
    if (!isLoading && !isFinished && targetText) inputRef.current?.focus();
  }, [isLoading, isFinished, targetText]);

  const fetchAiText = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ topic: topic || "" }),
      });
      const data = await response.json();
      setTargetText(data.text);
      resetGame();
    } catch (error) {
      setTargetText("AI is taking a break. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setUserInput("");
    setActiveWordIndex(0);
    setStartTime(null);
    setWpm(0);
    setFinalTime(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime && val.length > 0) setStartTime(Date.now());

    const currentWord = words[activeWordIndex];

    // Check if user finished the last word
    if (activeWordIndex === words.length - 1 && val === currentWord) {
      const endTime = Date.now();
      setActiveWordIndex(activeWordIndex + 1);
      setUserInput(val);
      setFinalTime(Number(((endTime - startTime!) / 1000).toFixed(2)));
      calculateWpm(activeWordIndex + 1, endTime);
      return;
    }

    setUserInput(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      const currentWord = words[activeWordIndex];
      if (userInput === currentWord) {
        e.preventDefault();
        setActiveWordIndex(activeWordIndex + 1);
        setUserInput("");
        calculateWpm(activeWordIndex + 1, Date.now());
      }
    }
  };

  const calculateWpm = (wordCount: number, endTime: number) => {
    if (!startTime) return;
    const timeElapsed = (endTime - startTime) / 60000;
    setWpm(Math.round(wordCount / timeElapsed));
  };

  const renderWord = (word: string, index: number) => {
    const isCurrentWord = index === activeWordIndex;
    const isPastWord = index < activeWordIndex;

    return (
      <span key={index} className="mr-3 mb-2 transition-colors relative">
        {word.split("").map((char, charIdx) => {
          let color = "text-zinc-600";
          if (isPastWord) color = "text-green-500";
          else if (isCurrentWord) {
            if (charIdx < userInput.length) {
              color =
                char === userInput[charIdx]
                  ? "text-green-500"
                  : "text-red-500 bg-red-900/30";
            }
          }
          return (
            <span
              key={charIdx}
              className={`${color} transition-colors duration-75`}
            >
              {char}
            </span>
          );
        })}
        {isCurrentWord && (
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500" />
        )}
      </span>
    );
  };

  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Account Banner */}
      <div className="w-full max-w-4xl h-[120px] flex items-center justify-center">
        {!user && !loading && !isLoading && (
          <div
            className={`w-full px-10 py-6 flex justify-between items-center rounded-2xl border transition-all duration-700 bg-zinc-950/50 backdrop-blur-sm ${highlightCTA ? "animate-led border-white" : "border-zinc-800"}`}
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">
                Record your races with a TyperAI Account!
              </h2>
              <p className="text-sm text-zinc-500">
                Save history and scores for free.
              </p>
            </div>
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tighter text-white">
              TyperAI
            </h1>
            {topic && (
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  {topic}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono text-blue-500 bg-blue-900/20 px-3 py-1 rounded-lg border border-blue-800">
              {wpm} <span className="text-xs text-zinc-400">WPM</span>
            </div>
          </div>
        </div>{" "}
        {/* <--- THIS WAS MISSING: Closes the Header Div */}
        {/* RACING BOX */}
        <div className="relative w-full min-h-[160px] text-2xl leading-relaxed font-mono bg-zinc-900 p-8 rounded-2xl border-2 border-zinc-800 shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-zinc-400 text-lg">
                  AI is generating your challenge...
                </span>
              </div>
            </div>
          ) : null}

          <div
            className={`flex flex-wrap ${isLoading ? "opacity-20" : "opacity-100"} transition-opacity duration-500`}
          >
            {words.map((word, i) => renderWord(word, i))}
          </div>
        </div>
        {finalTime !== null && (
          <div className="text-2xl font-mono text-blue-500 bg-blue-900/20 px-3 py-1 rounded-lg w-fit self-center">
            {finalTime} <span className="text-xs text-zinc-400">Seconds</span>
          </div>
        )}
        {isFinished && (
          <div className="text-center animate-pulse text-blue-400 font-mono">
            Race complete! Loading next challenge...
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          className="w-full text-xl p-5 rounded-xl border-2 border-zinc-800 bg-zinc-900 text-white focus:border-blue-500 outline-none transition-all disabled:opacity-50"
          value={userInput}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          disabled={isLoading || isFinished}
          placeholder={
            isLoading ? "Please wait..." : "Type exactly what you see above..."
          }
        />
      </div>
    </main>
  );
}
