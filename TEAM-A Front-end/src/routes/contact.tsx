import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Talk to us — MarketDay" },
      {
        name: "description",
        content: "Questions about an order, or want to sell on MarketDay? Talk to us.",
      },
      { property: "og:title", content: "Talk to us — MarketDay" },
      {
        property: "og:description",
        content: "Questions about an order, or want to sell on MarketDay? Talk to us.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-cobalt">TALK TO US</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] md:text-6xl">
            Questions, orders or a store to sell? We're listening.
          </h1>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-6">
              <Mail className="size-5 text-cobalt" />
              <p className="mt-3 text-xs font-bold tracking-[0.2em] text-muted-foreground">EMAIL</p>
              <a
                href="mailto:hello@marketday.ng"
                className="mt-1 block text-sm font-bold transition-colors hover:text-cobalt"
              >
                hello@marketday.ng
              </a>
            </div>
            <div className="rounded-2xl bg-card p-6">
              <MapPin className="size-5 text-cobalt" />
              <p className="mt-3 text-xs font-bold tracking-[0.2em] text-muted-foreground">
                WHERE WE ARE
              </p>
              <p className="mt-1 text-sm font-bold">Lagos, Nigeria</p>
            </div>
          </div>

          <form
            className="mt-10 max-w-xl space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div className="rounded-2xl bg-lime px-6 py-4 text-sm font-bold text-ink">
                Message sent — we'll reply within one business day.
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                  YOUR NAME
                </span>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-full bg-input px-5 py-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                  EMAIL ADDRESS
                </span>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-full bg-input px-5 py-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
                MESSAGE
              </span>
              <textarea
                required
                rows={4}
                placeholder="How can we help?"
                className="mt-2 w-full rounded-2xl bg-input px-5 py-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-ink py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85 md:w-auto md:px-10"
            >
              Send message
            </button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
