"use client";
import React from "react";
import { Instagram } from "lucide-react";

const ShareCTA: React.FC = () => {
  return (
    <div className="max-w-2xl p-8 mx-auto border shadow-lg rounded-xl bg-white/5 backdrop-blur-xl border-white/10">
      <h3 className="mb-4 text-2xl font-light text-center text-white">
        Share Your BMW
      </h3>
      <p className="mb-6 text-center text-gray-400">
        Want to showcase your BMW? Feature coming soon! Follow us on Instagram.
      </p>
      <div className="text-center">
        <a
          href="https://instagram.com/cultofdrive"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 shadow-sm rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 active:scale-95 shadow-black/20"
        >
          <Instagram className="w-5 h-5" />
          Follow @cultofdrive
        </a>
      </div>
    </div>
  );
};

export default ShareCTA;
