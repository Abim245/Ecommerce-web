import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — MarketDay" },
      {
        name: "description",
        content: "Sign in as a customer or vendor. Your market is ready when you are.",
      },
      { property: "og:title", content: "Sign in — MarketDay" },
      {
        property: "og:description",
        content: "Sign in as a customer or vendor. Your market is ready when you are.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <AuthShell>
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-cobalt">WELCOME BACK</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Your market is ready when you are.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground md:text-base">
          Sign in as a customer or vendor. We'll take you to the right place.
        </p>

        <form
          className="mt-9 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSignedIn(true);
          }}
        >
          {signedIn ? (
            <div className="rounded-2xl bg-lime px-6 py-4 text-sm font-bold text-ink">
              Welcome back! Sessions are coming soon — this preview isn't connected to accounts yet.
            </div>
          ) : null}
          <label className="block">
            <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
              EMAIL ADDRESS
            </span>
            <input
              required
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-full bg-input px-5 py-3.5 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">
              PASSWORD
            </span>
            <input
              required
              type="password"
              placeholder="Your password"
              className="mt-2 w-full rounded-full bg-input px-5 py-3.5 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-ink py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to MarketDay?{" "}
          <Link
            to="/signup"
            className="font-bold text-cobalt transition-colors hover:text-cobalt/80"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
