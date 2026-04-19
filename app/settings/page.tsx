"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/useUserStore";

export default function Settings() {
  const router = useRouter();
  const { user, userData } = useUserStore();

  const [newUsername, setNewUsername] = useState(userData.username || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Requirements Check
    if (newUsername.length < 3 || newUsername.length > 15) {
      setMessage({ type: "error", text: "Username must be 3-15 characters." });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setMessage({
        type: "error",
        text: "Only letters, numbers, and underscores allowed.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { username: newUsername });
        setMessage({
          type: "success",
          text: "Username updated successfully! ✨",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update username. Try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="text-center space-y-4">
          <p className="text-zinc-500">Please sign in to access settings.</p>
          <button
            onClick={() => router.push("/sign-up")}
            className="text-white underline"
          >
            Sign Up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center bg-black transition-all">
      <div className="w-full max-w-2xl space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Settings
          </h1>
          <p className="text-zinc-500">
            Manage your TyperAI profile and preferences.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>👤</span> Public Profile
            </h2>

            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Username
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="New username..."
                  />
                  <button
                    type="submit"
                    disabled={isUpdating || newUsername === userData.username}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all active:scale-95"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                </div>
                {message.text && (
                  <p
                    className={`text-sm font-medium animate-in fade-in slide-in-from-top-1 ${message.type === "error" ? "text-red-400" : "text-green-400"}`}
                  >
                    {message.text}
                  </p>
                )}
              </div>
            </form>
          </section>

          {/* Account Section */}
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🔒</span> Account
            </h2>

            <div className="flex items-center justify-between p-4 bg-zinc-800/20 rounded-2xl border border-zinc-800/50">
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Sign Out</p>
                <p className="text-xs text-zinc-500">
                  End your current session on this device.
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8">
          <p className="text-zinc-600 text-xs font-mono uppercase tracking-[0.2em]">
            TyperAI v1.0.4
          </p>
        </div>
      </div>
    </main>
  );
}
