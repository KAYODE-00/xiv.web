"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("My Sites");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("templates"); // 'templates' | 'ai'
  const [search, setSearch] = useState("");

  const user = {
    name: "Kayode Ade",
    email: "kayode@example.com",
    plan: "Free Plan",
  };

  const [sites] = useState([
    {
      id: 1,
      name: "Coffee Shop Website",
      status: "Draft",
      statusColor: "bg-white/10 text-white/60",
      lastEdited: "2 hours ago",
      previewGradient: "from-slate-900 via-slate-800 to-slate-900",
      demoActive: false,
    },
    {
      id: 2,
      name: "My Portfolio",
      status: "Demo Active",
      statusColor: "bg-emerald-500/15 text-emerald-300",
      lastEdited: "Yesterday",
      previewGradient: "from-[#6c63ff] via-indigo-500 to-[#6c63ff]",
      demoActive: true,
    },
    {
      id: 3,
      name: "Online Store",
      status: "Draft",
      statusColor: "bg-white/10 text-white/60",
      lastEdited: "3 days ago",
      previewGradient: "from-sky-600 via-sky-500 to-indigo-500",
      demoActive: false,
    },
  ]);

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Sites", value: sites.length },
    { label: "Published", value: 0 },
    { label: "Demo Links", value: 1 },
    { label: "Total Visitors", value: 0 },
  ];

  const sidebarLinks = [
    { icon: "🏠", label: "My Sites" },
    { icon: "📊", label: "Analytics" },
    { icon: "🛍️", label: "Store" },
    { icon: "⚙️", label: "Settings" },
    { icon: "💳", label: "Billing" },
  ];

  const templates = [
    { name: "Blank", gradient: "from-slate-900 via-slate-800 to-slate-900" },
    { name: "Business", gradient: "from-sky-500 via-blue-500 to-indigo-500" },
    { name: "Portfolio", gradient: "from-fuchsia-500 via-pink-500 to-rose-500" },
    { name: "Online Store", gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
    { name: "Restaurant", gradient: "from-orange-500 via-amber-500 to-red-500" },
    { name: "Blog", gradient: "from-purple-500 via-indigo-500 to-blue-500" },
  ];

  const firstInitial = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-white">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6c63ff] to-indigo-400 text-xs font-bold">
              XIV
            </div>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              XIV Dashboard
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60">
              <span className="mr-2 text-xs" aria-hidden="true">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search sites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder:text-white/35 outline-none sm:text-sm"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white/80 hover:border-white/40 hover:bg-white/10">
              <span aria-hidden="true">🔔</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden items-center gap-2 rounded-full bg-[#6c63ff] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#6c63ff]/40 transition hover:bg-indigo-500 sm:flex"
            >
              <span className="text-sm">＋</span>
              <span>New Site</span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6c63ff]/80 text-sm font-semibold">
              {firstInitial}
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-4">
        {/* LEFT SIDEBAR */}
        <aside className="hidden w-64 flex-shrink-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-sm md:flex">
          {/* Profile */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6c63ff]/80 text-xs font-semibold">
              {firstInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-white/50">{user.email}</p>
              <span className="mt-1 inline-flex rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#b5b0ff]">
                {user.plan}
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col gap-1 text-[13px]">
            {sidebarLinks.map((item) => {
              const active = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-left transition ${
                    active
                      ? "bg-[#6c63ff]/15 text-white border border-[#6c63ff]/60"
                      : "text-white/60 hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Upgrade card */}
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#6c63ff]/40 via-[#6c63ff]/20 to-transparent p-3.5 text-xs">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Unlock full power
            </p>
            <p className="mt-2 text-[11px] text-white/80">
              Go live, sell products, use unlimited AI.
            </p>
            <button className="mt-3 w-full rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#0a0a0f] hover:bg-white">
              Upgrade for $5/month
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                My Sites
              </h1>
              <p className="mt-1 text-xs text-white/55">
                3 sites · 0 published
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#6c63ff] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#6c63ff]/40 transition hover:bg-indigo-500 md:hidden"
            >
              <span className="text-sm">＋</span>
              <span>New Site</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
              >
                <p className="text-[11px] text-white/50">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Sites */}
          <div className="mt-6">
            {filteredSites.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredSites.map((site) => (
                  <div
                    key={site.id}
                    className="flex flex-col rounded-2xl border border-white/10 bg-[#050509]/80 p-3"
                  >
                    {/* Preview */}
                    <div
                      className={`relative mb-3 h-32 rounded-xl bg-gradient-to-br ${site.previewGradient} flex items-center justify-center text-3xl text-white/80`}
                    >
                      <span aria-hidden="true">🌐</span>
                      <div className="absolute inset-0 rounded-xl border border-white/10/20" />
                    </div>

                    {/* Title + badge */}
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="truncate text-sm font-semibold">
                        {site.name}
                      </h2>
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium ${site.statusColor}`}
                      >
                        {site.status}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-white/45">
                      Last edited: {site.lastEdited}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex flex-1 gap-2">
                        <button className="flex-1 rounded-full bg-[#6c63ff] px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-[#6c63ff]/40 transition hover:bg-indigo-500">
                          Edit
                        </button>
                        <button className="flex-1 rounded-full border border-white/20 bg-transparent px-3 py-1.5 text-[11px] font-semibold text-white/80 transition hover:border-white/50 hover:bg-white/5 hover:text-white">
                          Demo Link
                        </button>
                      </div>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/70 hover:border-white/40 hover:bg-white/10">
                        ⋯
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state (if no sites)
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6c63ff]/15 text-2xl">
                  <span aria-hidden="true">＋</span>
                </div>
                <h2 className="mt-4 text-base font-semibold text-white">
                  No sites yet
                </h2>
                <p className="mt-1 text-xs text-white/55">
                  Create your first site in seconds with XIV.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 rounded-full bg-[#6c63ff] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#6c63ff]/40 transition hover:bg-indigo-500"
                >
                  Start Building
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating + button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#6c63ff] text-2xl font-normal text-white shadow-xl shadow-[#6c63ff]/50 transition hover:bg-indigo-500 md:bottom-8 md:right-8"
        aria-label="Create New Site"
      >
        +
        <span className="pointer-events-none absolute -top-9 right-1 scale-0 rounded-full bg-black/80 px-3 py-1 text-[10px] text-white opacity-0 shadow-lg shadow-black/40 transition group-hover:scale-100 group-hover:opacity-100">
          Create New Site
        </span>
      </button>

      {/* CREATE NEW SITE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#050509]/95 p-5 text-sm shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-6">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/60 hover:border-white/40 hover:bg-white/10"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold tracking-tight">
              Create New Site
            </h2>

            {/* Site name */}
            <div className="mt-4">
              <label
                htmlFor="site-name"
                className="mb-1 block text-xs font-medium text-white/70"
              >
                Site name
              </label>
              <input
                id="site-name"
                type="text"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#6c63ff]"
                placeholder="e.g. Coffee Shop Website"
              />
            </div>

            {/* Tabs */}
            <div className="mt-4 flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-medium text-white/60">
              <button
                type="button"
                onClick={() => setModalTab("templates")}
                className={`flex-1 rounded-full px-3 py-2 transition ${
                  modalTab === "templates"
                    ? "bg-[#6c63ff] text-white shadow-sm shadow-[#6c63ff]/40"
                    : "hover:bg-white/5"
                }`}
              >
                Templates
              </button>
              <button
                type="button"
                onClick={() => setModalTab("ai")}
                className={`flex-1 rounded-full px-3 py-2 transition ${
                  modalTab === "ai"
                    ? "bg-[#6c63ff] text-white shadow-sm shadow-[#6c63ff]/40"
                    : "hover:bg-white/5"
                }`}
              >
                AI Builder
              </button>
            </div>

            {/* Tab content */}
            {modalTab === "templates" ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {templates.map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-2 text-left text-xs text-white/80 transition hover:border-[#6c63ff]/70 hover:bg-white/10"
                  >
                    <div
                      className={`mb-2 h-20 rounded-xl bg-gradient-to-br ${tpl.gradient} shadow-inner`}
                    />
                    <span className="text-[11px] font-semibold">
                      {tpl.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <label
                  htmlFor="ai-description"
                  className="mb-1 block text-xs font-medium text-white/70"
                >
                  Describe your website
                </label>
                <textarea
                  id="ai-description"
                  rows={5}
                  className="w-full rounded-2xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#6c63ff]"
                  placeholder={
                    "Describe your website...\ne.g. A coffee shop in Lagos that sells specialty coffee and hosts weekend events"
                  }
                />
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#6c63ff] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#6c63ff]/40 transition hover:bg-indigo-500"
                >
                  Generate with AI ✨
                </button>
              </div>
            )}

            {/* Footer buttons */}
            <div className="mt-6 flex flex-col justify-end gap-3 border-t border-white/10 pt-4 text-xs sm:flex-row">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-white/20 bg-transparent px-4 py-2 font-semibold text-white/80 hover:border-white/50 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-[#6c63ff] px-5 py-2 font-semibold text-white shadow-md shadow-[#6c63ff]/40 transition hover:bg-indigo-500"
              >
                Create Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}