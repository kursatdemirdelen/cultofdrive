"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (data.user) window.location.replace("/");
    });
  }, []);

  const signInWithGoogle = async () => {
    await supabaseBrowser.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const signInWithMagicLink = async () => {
    setLoading(true); setMessage(null); setError(null);
    try {
      const { error } = await supabaseBrowser.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
      if (error) throw error;
      setMessage('Check your email for the sign-in link.');
    } catch (e: any) {
      setError(e?.message || 'Failed to send magic link');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-12">
      <div className="max-w-md mx-auto border border-white/10 bg-black/40 backdrop-blur-lg rounded-xl p-6">
        <h1 className="text-2xl font-heading tracking-[0.1em] text-white mb-4">Sign in</h1>
        <div className="space-y-4">
          {googleEnabled && (
            <>
              <button onClick={signInWithGoogle} className="w-full btn-motorsport">Sign in with Google</button>
              <div className="h-px bg-white/10" />
            </>
          )}
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50" />
            <button onClick={signInWithMagicLink} disabled={loading || !email} className="w-full mt-3 btn-motorsport">{loading ? 'Sending...' : 'Send magic link'}</button>
          </div>
          {message && <p className="text-emerald-300 text-sm">{message}</p>}
          {error && <p className="text-red-300 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
