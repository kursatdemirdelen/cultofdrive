"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent, type FC } from "react";

type SubscribeResponse = {
  success: boolean;
  message?: string;
};

interface FormState {
  email: string;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

const EmailForm: FC = () => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    isSubscribed: false,
    isLoading: false,
    error: null,
  });

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.email) return;

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formState.email }),
      });

      const data = (await response.json()) as SubscribeResponse;
      if (!response.ok) throw new Error(data.message || "Subscription failed");

      setFormState((prev) => ({ ...prev, isSubscribed: true }));
    } catch (error: any) {
      let message = "Failed to subscribe. Please try again.";
      if (error instanceof Error) message = error.message;
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (formState.isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center border rounded-xl backdrop-blur-md bg-white/10 border-white/20"
      >
        <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-white/15">
          <svg
            className="w-6 h-6 text-white/90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-medium text-white/90">
          Welcome aboard!
        </h3>
        <p className="text-sm text-white/70">
          You’ll be the first to know when we launch.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 flex items-center text-sm pointer-events-none left-3 text-white/50">
            ✉
          </span>
          <input
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Your email address"
            className="w-full py-3 pr-4 transition border rounded-lg outline-none pl-9 bg-white/10 text-white/90 placeholder-white/50 border-white/20 focus:border-white/40 focus:bg-white/15"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={formState.isLoading}
          whileHover={{ scale: formState.isLoading ? 1 : 1.02 }}
          whileTap={{ scale: formState.isLoading ? 1 : 0.97 }}
          className="relative px-8 py-3 overflow-hidden text-sm text-white transition border rounded-lg bg-white/15 border-white/25 backdrop-blur-md hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60 group"
        >
          <span
            className="pointer-events-none absolute top-0 left-[-50%] w-[60%] h-full 
            bg-gradient-to-r from-transparent via-white/35 to-transparent
            opacity-0 group-hover:opacity-100
            translate-x-[-100%] group-hover:translate-x-[200%]
            transition-transform duration-700 ease-out"
          />
          {formState.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
              <span>Subscribing...</span>
            </div>
          ) : (
            "Subscribe"
          )}
        </motion.button>
      </div>

      {formState.error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm text-center text-red-300 border rounded-lg border-red-500/20 bg-red-500/10"
        >
          {formState.error}
        </motion.div>
      )}

      <p className="text-xs text-center text-white/50">
        Join our community. No spam, unsubscribe anytime.
      </p>
    </form>
  );
};

export default EmailForm;
