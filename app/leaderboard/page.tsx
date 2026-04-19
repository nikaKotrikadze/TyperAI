"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

interface TopRacer {
  id: string;
  username: string;
  bestWpm: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<TopRacer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        // Query the top 10 fastest typers
        const q = query(usersRef, orderBy("bestWpm", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        const results: TopRacer[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as TopRacer);
        });

        setLeaderboard(results);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center bg-black transition-all duration-500">
      <div className="w-full max-w-3xl space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white">
            Global Rankings
          </h1>
          <p className="text-zinc-500 font-medium">
            The fastest fingers in the TyperAI community.
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Rank
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Racer
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-zinc-500 font-bold text-right">
                  Best Speed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading
                ? // Simple Loading Skeletons
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={3} className="px-6 py-6 bg-zinc-900/20"></td>
                    </tr>
                  ))
                : leaderboard.map((racer, index) => (
                    <tr
                      key={racer.id}
                      className="group hover:bg-zinc-800/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-5">
                        <span
                          className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${
                          index === 0
                            ? "bg-yellow-400 text-black"
                            : index === 1
                              ? "bg-zinc-300 text-black"
                              : index === 2
                                ? "bg-orange-400 text-black"
                                : "text-zinc-500"
                        }
                      `}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {racer.username || "Anonymous Racer"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className="text-2xl font-mono font-bold text-blue-500">
                            {racer.bestWpm}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                            WPM
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!loading && leaderboard.length === 0 && (
            <div className="p-20 text-center text-zinc-500 italic">
              No races recorded yet. Be the first!
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-zinc-500 hover:text-white text-sm font-medium transition-colors border-b border-zinc-800 hover:border-white pb-1"
          >
            Back to the track 🏁
          </button>
        </div>
      </div>
    </main>
  );
}
