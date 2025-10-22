'use client';

import { motion } from 'framer-motion';
import { useState, type FormEvent, type FC } from 'react';

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
    email: '',
    isSubscribed: false,
    isLoading: false,
    error: null,
  });

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.email) return;

    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formState.email }),
      });

      const data = (await response.json()) as SubscribeResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setFormState((prev) => ({ ...prev, isSubscribed: true }));
    } catch (error) {
      let message = 'Failed to subscribe. Please try again.';

      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('429')) {
          message = 'Too many requests. Please wait a moment and try again.';
        } else if (error.message.includes('409')) {
          message = 'This email is already registered.';
        } else if (error.message.includes('400')) {
          message = 'Please enter a valid email address.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          message = 'Network error. Please check your connection and try again.';
        } else {
          message = error.message;
        }
      }

      setFormState((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (formState.isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 text-center border bg-green-500/10 border-green-500/30 rounded-2xl backdrop-blur-sm"
      >
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full">
          <svg
            className="w-6 h-6 text-white"
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
        <h3 className="mb-2 text-lg font-medium text-white">
          Welcome aboard!
        </h3>
        <p className="text-sm text-gray-300">
          Thank you for joining. We&apos;ll notify you when we launch.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={formState.email}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Your email address"
          className="flex-1 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 border rounded-lg bg-white/5 border-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30"
          required
        />
        <motion.button
          type="submit"
          disabled={formState.isLoading}
          whileHover={{ scale: formState.isLoading ? 1 : 1.02 }}
          whileTap={{ scale: formState.isLoading ? 1 : 0.98 }}
          className="px-8 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          {formState.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
              <span>Subscribing...</span>
            </div>
          ) : (
            'Subscribe'
          )}
        </motion.button>
      </div>
      {formState.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm text-center text-red-400 border rounded-lg bg-red-500/10 border-red-500/30 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{formState.error}</span>
          </div>
        </motion.div>
      )}
      <p className="text-xs text-center text-gray-500">
        Join our community. No spam, unsubscribe anytime.
      </p>
    </form>
  );
};

export default EmailForm;
