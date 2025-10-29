"use client";
import React from "react";
import { Instagram } from "lucide-react";
import { ChevronRight } from "lucide-react";

const ShareCTA: React.FC = () => {
  return (
    <div className="max-w-2xl p-8 mx-auto border rounded-lg border-white/10 bg-carbon/40">
      <h3 className="mb-2 text-3xl font-heading tracking-[0.05em] text-center text-white/90">
        Share Your BMW
      </h3>
      <div className="mx-auto mb-4 h-[2px] w-[60px] bg-gradient-to-r from-[#00a0ff] via-[#0055ff] to-[#c40000] opacity-70" />
      <p className="mb-6 text-center text-white/60">
        Want to showcase your BMW? Add it to your garage or follow us for updates.
      </p>

      <div className="flex items-center justify-center gap-3">
        <a
          href="/garage/add"
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all duration-200 border rounded-md bg-white/15 border-white/15 text-white/90 hover:bg-white/25"
        >
          Add Your Car
          <ChevronRight className="w-4 h-4 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
        <a
          href="https://instagram.com/cultofdrive"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all duration-200 border rounded-md  bg-carbon/60 border-white/10 text-white/80 hover:text-white hover:bg-carbon/70"
        >
          <Instagram className="w-5 h-5 text-white/70" />
          Follow @cultofdrive
          <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};

export default ShareCTA;

