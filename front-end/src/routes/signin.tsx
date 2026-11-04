import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { apiFetch } from "@/lib/api";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await apiFetch<{ message: string; token: string }>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

   localStorage.setItem("marketday-token", response.token);

    await navigate({ to: "/" });
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Unable to sign in. Please try again."
    );
  } finally {
    setLoading(false);
  }
  }
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
          onSubmit={handleSignIn}
        >
          {signedIn ? (
            <div className="rounded-2xl bg-lime px-6 py-4 text-sm font-bold text-ink">
              Signed in successfully! Welcome back.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl bg-destructive/10 px-6 py-4 text-sm text-destructive">
              {error}
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
          {loading ? "Signing in..." : "Sign in"}
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
