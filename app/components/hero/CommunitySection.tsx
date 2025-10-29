const highlights = [
  {
    title: "Owner stories",
    body: "Every feature includes the car's backstory, setup, and the driver behind the wheel.",
  },
  {
    title: "Verified specs",
    body: "Engine builds, swap lists, and mod sheets pulled straight from the community.",
  },
  {
    title: "Live reactions",
    body: "Favorites and comments refresh the moment the community shows love.",
  },
];

export default function CommunitySection() {
  return (
    <section id="community" className="mt-12">
      <h2 className="text-center text-2xl font-heading tracking-[0.08em] text-white/90">
        What makes Cult of Drive different?
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-5 text-left"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">
              {item.title}
            </p>
            <p className="mt-2 text-sm text-white/70">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
