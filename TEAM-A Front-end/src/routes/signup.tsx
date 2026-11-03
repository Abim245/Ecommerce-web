import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join MarketDay" },
      {
        name: "description",
        content: "Shop easier, or grow your store. Customer and vendor accounts on MarketDay.",
      },
      { property: "og:title", content: "Join MarketDay" },
      {
        property: "og:description",
        content: "Shop easier, or grow your store. Customer and vendor accounts on MarketDay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUp,
});

type AccountType = "customer" | "vendor";

const inputClass =
  "mt-2 w-full rounded-full bg-input px-5 py-3.5 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
const labelClass = "text-[11px] font-bold tracking-[0.15em] text-muted-foreground";

function SignUp() {
  const [accountType, setAccountType] = useState<AccountType>("customer");
  const [created, setCreated] = useState(false);

  return (
    <AuthShell>
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-cobalt">JOIN MARKETDAY</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Shop easier, or grow your store.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground md:text-base">
          Choose how you'll use MarketDay. Vendor accounts include a business profile and private
          dashboard.
        </p>

        {/* Customer / Vendor toggle */}
        <div className="mt-8 grid grid-cols-2 rounded-full bg-secondary p-1.5">
          {(
            [
              { id: "customer" as const, label: "Customer" },
              { id: "vendor" as const, label: "Vendor" },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setAccountType(option.id);
                setCreated(false);
              }}
              className={cn(
                "rounded-full py-3 text-sm font-bold transition-colors",
                accountType === option.id
                  ? "bg-ink text-primary-foreground"
                  : "text-foreground hover:text-cobalt",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setCreated(true);
          }}
        >
          {created ? (
            <div className="rounded-2xl bg-lime px-6 py-4 text-sm font-bold text-ink">
              {accountType === "customer"
                ? "Customer account created — welcome to MarketDay!"
                : "Vendor account created — we'll be in touch to set up your store."}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>FULL NAME</span>
              <input required type="text" placeholder="Your name" className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>PHONE NUMBER</span>
              <input required type="tel" placeholder="+234" className={inputClass} />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>EMAIL ADDRESS</span>
            <input required type="email" placeholder="you@example.com" className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>PASSWORD</span>
            <input
              required
              type="password"
              minLength={8}
              placeholder="At least 8 characters"
              className={inputClass}
            />
          </label>

          {accountType === "vendor" ? (
            <div className="rounded-3xl bg-secondary p-6">
              <p className="font-display text-lg font-extrabold">Business details</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className={labelClass}>STORE NAME</span>
                  <input
                    required
                    type="text"
                    placeholder="Your store name"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>BUSINESS LOCATION</span>
                  <input required type="text" placeholder="Area and city" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>WHAT DO YOU SELL?</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell customers what makes your store useful."
                    className="mt-2 w-full rounded-2xl bg-input px-5 py-3.5 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-ink py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
          >
            {accountType === "customer" ? "Create customer account" : "Create vendor account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link
            to="/signin"
            className="font-bold text-cobalt transition-colors hover:text-cobalt/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
