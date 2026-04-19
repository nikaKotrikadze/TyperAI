"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirecting
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    symbol: /[!@#%^&*.]/.test(formData.password),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submitError) setSubmitError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Validations
    if (formData.username.length < 4) {
      setSubmitError("Username must be at least 4 characters");
      setIsSubmitting(false);
      return;
    }

    const { length, upper, lower, symbol } = passwordCriteria;
    if (!length || !upper || !lower || !symbol) {
      setSubmitError("Password does not meet requirements");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSubmitError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      // 2. FIREBASE AUTH: Create the encrypted user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      // 3. FIRESTORE: Save the non-sensitive profile data
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date(),
        bestWpm: 0, // Placeholder for their future stats
      });

      // 4. Success! Redirect home
      router.push("/");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setSubmitError("This email is already registered.");
      } else {
        setSubmitError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6 font-geist-sans">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-10 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Create Account
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Join TyperAI and track your progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-3">
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition"
            />
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Repeat Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-white placeholder-zinc-500 transition focus:ring-1 outline-none ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-700 bg-zinc-900 focus:border-white focus:ring-white"
              }`}
            />
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-[10px] space-y-1 text-zinc-500 uppercase tracking-widest">
            <p className="mb-2 text-zinc-400 font-bold border-b border-zinc-800 pb-1">
              Requirements:
            </p>
            <p className={passwordCriteria.length ? "text-green-500" : ""}>
              • 8+ Characters
            </p>
            <p className={passwordCriteria.upper ? "text-green-500" : ""}>
              • 1 Uppercase Letter
            </p>
            <p className={passwordCriteria.lower ? "text-green-500" : ""}>
              • 1 Lowercase Letter
            </p>
            <p className={passwordCriteria.symbol ? "text-green-500" : ""}>
              • 1 Symbol (!, @, #, %, ^, &, *, .)
            </p>
          </div>

          {submitError && (
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-zinc-500">Already have an account? </span>
          <Link
            href="/sign-in"
            className="font-medium text-white hover:text-zinc-300 underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
