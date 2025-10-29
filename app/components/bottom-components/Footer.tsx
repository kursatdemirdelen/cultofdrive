'use client';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center border-t shadow-inner border-white/10 bg-black/50 backdrop-blur-2xl rounded-t-3xl shadow-white/10">
      <p className="text-sm text-gray-300">© {new Date().getFullYear()} Cult of Drive</p>
    </footer>
  );
};

export default Footer;

