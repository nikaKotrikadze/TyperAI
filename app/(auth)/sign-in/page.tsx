"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Firebase verifies the email and password automatically
      await signInWithEmailAndPassword(auth, email, password);

      // If successful, the Navbar listener will pick up the user
      // and we redirect them back to the race
      router.push("/");
    } catch (error: any) {
      console.error("Sign-in error:", error.code);

      // Friendly error messages for common auth failures
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found"
      ) {
        setSubmitError("Invalid email or password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setSubmitError("Too many attempts. Try again later.");
      } else {
        setSubmitError("Something went wrong. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6 font-geist-sans">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Sign in to pick up where you left off.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitError) setSubmitError(null);
              }}
              placeholder="Email address"
              className="relative block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-white focus:ring-1 focus:ring-white outline-none sm:text-sm"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (submitError) setSubmitError(null);
              }}
              placeholder="Password"
              className="relative block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 transition focus:border-white focus:ring-1 focus:ring-white outline-none sm:text-sm"
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-300 text-center">
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
                {submitError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 focus:outline-none disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Don&apos;t have an account? </span>
          <Link
            href="/sign-up"
            className="font-medium text-white transition hover:text-zinc-300 underline underline-offset-4"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
