export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6c63ff] to-indigo-400 text-sm font-bold">
              XIV
            </div>
            <span className="text-lg font-semibold tracking-tight">XIV</span>
          </div>
          {/* Middle: Links */}
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#templates" className="transition hover:text-white">
              Templates
            </a>
          </nav>
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-white/15 px-4 py-1.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white md:inline-flex">
              Login
            </button>
            <button className="rounded-full bg-[#6c63ff] px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/40 transition hover:bg-indigo-500">
              Start Free
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:pt-16">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6c63ff]/20 text-[11px] text-[#b5b0ff]">
              AI
            </span>
            <span>AI-Powered Website Builder</span>
          </div>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Build any website with AI in minutes
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-sm text-white/60 sm:text-base md:text-lg">
            Create stunning websites, get a demo link instantly, go live when ready.
            No coding required.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <button className="inline-flex items-center justify-center rounded-full bg-[#6c63ff] px-7 py-3 text-sm font-semibold text-white shadow-xl shadow-[#6c63ff]/40 transition hover:bg-indigo-500">
              Start Building Free
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-7 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/5 hover:text-white">
              Watch Demo
            </button>
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Free forever · No credit card needed
          </p>
          {/* Simple abstract background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-40 -z-10 flex justify-center"
          >
            <div className="h-64 w-[480px] rounded-full bg-[#6c63ff]/40 blur-3xl opacity-40" />
          </div>
        </section>
        {/* FEATURES SECTION */}
        <section id="features" className="mt-20 md:mt-28">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Everything you need
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/60">
              From first idea to live website, XIV gives you the full stack in one
              beautiful, AI-powered workspace.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🤖",
                title: "AI Site Builder",
                desc: "Describe your site and AI builds it in seconds",
              },
              {
                icon: "🖱️",
                title: "Click to Edit",
                desc: "Click anything to edit it instantly",
              },
              {
                icon: "🔗",
                title: "Instant Demo Links",
                desc: "Share a demo link with clients in one click",
              },
              {
                icon: "🛍️",
                title: "Built-in Store",
                desc: "Sell products with full ecommerce",
              },
              {
                icon: "📈",
                title: "Auto SEO",
                desc: "AI writes perfect SEO for every page",
              },
              {
                icon: "⚡",
                title: "Fast & Reliable",
                desc: "99.9% uptime, lightning fast pages",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-[#6c63ff]/60 hover:bg-white/[0.08]"
              >
                <div className="absolute inset-0 -z-10 opacity-0 transition group-hover:opacity-100">
                  <div className="h-full w-full bg-gradient-to-br from-[#6c63ff]/15 via-transparent to-transparent" />
                </div>
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#6c63ff]/15 text-lg">
                  <span>{item.icon}</span>
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs text-white/60 sm:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
        {/* HOW IT WORKS SECTION */}
        <section className="mt-20 md:mt-28">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Launch in 3 simple steps
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/60">
              Go from idea to a fully shareable, production-ready website in minutes,
              not months.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "Describe your website",
                desc: "Tell XIV what you&apos;re building – portfolio, SaaS, store, or anything in between.",
              },
              {
                step: "Step 2",
                title: "Customize with one click",
                desc: "Refine copy, layout, colors, and sections instantly with AI-powered controls.",
              },
              {
                step: "Step 3",
                title: "Share demo or go live",
                desc: "Send a demo link to clients or publish live on your custom domain.",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6c63ff]">
                    {item.step}
                  </span>
                  <span className="text-sm text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* PRICING SECTION */}
        <section id="pricing" className="mt-20 md:mt-28">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Simple, honest pricing
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/60">
              Start for free, upgrade only when you&apos;re ready to go live. No
              contracts, cancel anytime.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* FREE */}
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <h3 className="text-sm font-semibold text-white/80">Free</h3>
              <p className="mt-3 text-3xl font-semibold">
                $0
                <span className="text-sm font-normal text-white/40"> /month</span>
              </p>
              <p className="mt-2 text-xs text-white/50">
                Perfect to explore XIV and share short demo links.
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-white/70">
                <li>• Unlimited sites to build</li>
                <li>• Demo links (14 days)</li>
                <li>• 5 templates</li>
                <li>• Basic AI</li>
                <li>• Cannot publish live</li>
              </ul>
              <button className="mt-6 w-full rounded-full border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:bg-white/5 hover:text-white">
                Start Free
              </button>
            </div>
            {/* STARTER - MOST POPULAR */}
            <div className="relative flex flex-col rounded-2xl border border-[#6c63ff] bg-gradient-to-b from-[#141322] via-[#0a0a0f] to-[#0a0a0f] p-6 shadow-[0_0_40px_rgba(108,99,255,0.35)]">
              <div className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-[#6c63ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#6c63ff]/40">
                Most Popular
              </div>
              <h3 className="text-sm font-semibold text-white">Starter</h3>
              <p className="mt-3 text-3xl font-semibold">
                $5
                <span className="text-sm font-normal text-white/50"> /month</span>
              </p>
              <p className="mt-2 text-xs text-white/60">
                For creators and small teams ready to launch real sites.
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-white/80">
                <li>• Unlimited sites to build</li>
                <li>• Demo links (30 days)</li>
                <li>• All templates</li>
                <li>• Full AI features</li>
                <li>• 3 sites live</li>
                <li>• Custom domain</li>
                <li>• Basic ecommerce</li>
              </ul>
              <button className="mt-6 w-full rounded-full bg-[#6c63ff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/40 transition hover:bg-indigo-500">
                Get Starter
              </button>
            </div>
            {/* PRO */}
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <h3 className="text-sm font-semibold text-white/80">Pro</h3>
              <p className="mt-3 text-3xl font-semibold">
                $7
                <span className="text-sm font-normal text-white/40"> /month</span>
              </p>
              <p className="mt-2 text-xs text-white/50">
                For serious businesses, agencies, and power creators.
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-white/70">
                <li>• Unlimited sites to build</li>
                <li>• Demo links (60 days)</li>
                <li>• Everything in Starter</li>
                <li>• Unlimited live sites</li>
                <li>• Full ecommerce</li>
                <li>• Analytics</li>
                <li>• 0% transaction fees</li>
              </ul>
              <button className="mt-6 w-full rounded-full border border-[#6c63ff]/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#b5b0ff] transition hover:border-[#6c63ff] hover:bg-[#6c63ff]/15 hover:text-white">
                Get Pro
              </button>
            </div>
          </div>
        </section>
        {/* TEMPLATES ANCHOR (for navbar link) */}
        <section id="templates" className="mt-20 md:mt-28">
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
            <h2 className="text-lg font-semibold tracking-tight">
              Templates coming soon
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Pre-built, AI-optimized templates for portfolios, SaaS, agencies, and
              ecommerce are on the way. Start building now and swap in templates
              later with one click.
            </p>
          </div>
        </section>
      </main>
      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6c63ff] to-indigo-400 text-xs font-bold">
                XIV
              </div>
              <span className="text-sm font-semibold tracking-tight">XIV</span>
            </div>
            <p className="mt-2 text-xs text-white/50">
              The AI-native way to build, share, and launch websites in minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
            <a href="#features" className="transition hover:text-white">
              Product
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#templates" className="transition hover:text-white">
              Templates
            </a>
            <a href="#" className="transition hover:text-white">
              Blog
            </a>
            <a href="#" className="transition hover:text-white">
              Twitter
            </a>
            <a href="#" className="transition hover:text-white">
              Instagram
            </a>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/40">
            © 2025 XIV. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}