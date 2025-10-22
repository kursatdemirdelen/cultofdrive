import EmailForm from "./EmailForm";

export default function CommunitySection() {
  return (
    <section id="community" className="mt-8 text-center">
      <span className="inline-block px-4 py-2 mb-6 text-sm text-blue-300 border rounded-full bg-blue-500/10 border-blue-500/30">
        Coming Soon
      </span>
      <h2 className="mb-4 text-2xl font-light text-white">
        Join the community
      </h2>
      <p className="max-w-xl mx-auto mb-6 text-gray-400">
        Be the first to know when we launch. No spam, unsubscribe anytime.
      </p>
      <div className="max-w-md mx-auto">
        <EmailForm />
      </div>
    </section>
  );
}
