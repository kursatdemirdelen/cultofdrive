'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise((resolve) => globalThis.setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsLoading(false);
  };

  return (
    <main className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-5xl"
        >
          <div className="p-8 border shadow-2xl bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl md:p-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="mb-20 text-center"
            >
              <motion.h1
                className="mb-6 text-5xl font-light tracking-wider text-white md:text-7xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              >
                Cult of Drive
              </motion.h1>
              <motion.p
                className="max-w-2xl mx-auto text-lg font-light tracking-wide text-gray-400 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8, ease: 'easeOut' }}
              >
                90s–2000s BMW Culture. Authentic. OEM. Driver&apos;s Cars Only.
              </motion.p>
            </motion.div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              className="relative flex justify-center mb-20 group"
            >
              <div className="relative w-full max-w-md overflow-hidden shadow-2xl rounded-2xl">
                <Image
                  src="/bmw-e36.jpg"
                  alt="BMW E36"
                  width={400}
                  height={300}
                  className="object-cover transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Quote Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
              className="max-w-3xl mx-auto mb-20 text-center"
            >
              <blockquote className="text-xl italic font-light leading-relaxed text-gray-300 md:text-2xl">
                It's not about status. It's about connection — between driver
                and machine.
              </blockquote>
              <motion.div
                className="h-px mt-6 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Coming Soon Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="inline-flex items-center px-8 py-4 mb-8 text-sm font-medium tracking-wide text-white border rounded-full bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-blue-500/30 backdrop-blur-sm">
                <motion.div
                  className="w-2 h-2 mr-3 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                Currently in Development
              </div>

              <motion.h2
                className="mb-4 text-3xl font-light tracking-wide text-white md:text-4xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
              >
                Coming Soon
              </motion.h2>

              <motion.p
                className="max-w-2xl mx-auto mb-8 text-lg font-light leading-relaxed text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
              >
                We are crafting something extraordinary for the BMW enthusiast
                community. Stay tuned for an authentic experience that
                celebrates the pure essence of driving.
              </motion.p>

              {/* Email Subscription Form */}
              <motion.div
                className="max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
              >
                {!isSubscribed ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 border rounded-full bg-white/10 border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        required
                      />
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 text-sm font-medium tracking-wide text-white transition-all duration-300 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                            <span>Joining...</span>
                          </div>
                        ) : (
                          'Join Waitlist'
                        )}
                      </motion.button>
                    </div>
                    <p className="text-xs text-center text-gray-400">
                      Be the first to know when we launch. No spam, ever.
                    </p>
                  </form>
                ) : (
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
                      You&apos;re on the list!
                    </h3>
                    <p className="text-sm text-gray-300">
                      We&apos;ll notify you as soon as Cult of Drive launches.
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center mt-8 space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8, ease: 'easeOut' }}
              >
                {['twitter', 'reddit', 'instagram'].map((_, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-gray-400 transition-colors duration-300 hover:text-white"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                    </svg>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.8, ease: 'easeOut' }}
              className="pt-8 mt-16 text-center border-t border-white/10"
            >
              <p className="text-sm font-light tracking-wide text-gray-500">
                © {new Date().getFullYear()} Cult of Drive — Built for Drivers
              </p>
            </motion.footer>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
