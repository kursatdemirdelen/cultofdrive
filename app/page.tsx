'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Suspense } from 'react';
import EmailForm from './components/EmailForm';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <div className="p-8 bg-black/40 backdrop-blur-xl rounded-xl md:p-12">
            <header className="mb-10 text-center">
              <h1 className="mb-4 text-4xl font-light text-white md:text-5xl">Cult of Drive</h1>
              <p className="max-w-lg mx-auto text-lg text-gray-400">Experience the golden era of BMW. Pure driving machines, no compromises.</p>
            </header>

            <section className="mb-10 overflow-hidden rounded-lg">
              <Suspense fallback={
                <div className="w-full h-[600px] bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              }>
                <Image
                  src="/bmw-e36.jpg"
                  alt="BMW E36 - Classic 90s BMW driving machine"
                  width={1200}
                  height={600}
                  className="object-cover w-full rounded-lg transition-opacity duration-300"
                  priority
                />
              </Suspense>
            </section>

            <section className="text-center">
              <span className="inline-block px-4 py-2 mb-6 text-sm text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full">Coming Soon</span>
              <h2 className="mb-4 text-2xl font-light text-white">Join the community</h2>
              <p className="max-w-xl mx-auto mb-6 text-gray-400">Be the first to know when we launch. No spam, unsubscribe anytime.</p>

              <div className="max-w-md mx-auto">
                <EmailForm />
              </div>
            </section>

            <footer className="mt-12 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Cult of Drive</p>
            </footer>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
