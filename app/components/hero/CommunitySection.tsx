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
    <section id="community" className="mt-8 sm:mt-12">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-2xl font-heading tracking-[0.12em] text-white sm:text-3xl">
          What makes us different?
        </h2>
        <p className="mt-2 text-sm text-white/50">Built by enthusiasts, for enthusiasts</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {highlights.map((item, i) => (
          <div
            key={item.title}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm transition hover:bg-white/[0.04] sm:p-6"
          >
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
