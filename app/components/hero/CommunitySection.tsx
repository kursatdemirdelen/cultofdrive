import EmailForm from "./EmailForm";

export default function CommunitySection() {
  return (
    <section id="community" className="mt-2 text-center">
      <span className="inline-block px-3 py-1.5 mb-6 text-xs text-white/70 rounded-md bg-carbon/40 border border-white/10">
        Coming Soon
      </span>
      <h2 className="mb-4 text-3xl font-heading tracking-[0.05em] text-white/90">
        Join the community
      </h2>
      <p className="max-w-xl mx-auto mb-6 leading-relaxed text-white/60">
        Be the first to know when we launch. No spam, unsubscribe anytime.
      </p>

      <div className="max-w-md mx-auto">
        <EmailForm />
      </div>
    </section>
  );
}
