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
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-heading tracking-[0.12em] text-white">
          What makes us different?
        </h2>
        <p className="mt-2 text-sm text-white/50">Built by enthusiasts, for enthusiasts</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {highlights.map((item, i) => (
          <div
            key={item.title}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition hover:bg-white/[0.04]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg font-light text-white/60">
              {i + 1}
            </div>
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-white">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
