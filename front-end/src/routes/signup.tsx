import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();
async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setLoading(true);
  setError("");
  setCreated(false);

  try {
    const response = await apiFetch<{ message: string; token: string }>(
      "/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          address,
        }),
      },
    );

    localStorage.setItem("marketday-token", response.token);

    if (accountType === "vendor") {
      await apiFetch("/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          storeName,
          location,
          phone,
          bio,
          profilePicture,
        }),
      });
    }

    await navigate({ to: "/" });
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again.",
    );
  } finally {
    setLoading(false);
  }
}

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
             {error ? (
              <div className="rounded-2xl bg-destructive/10 px-6 py-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSignUp}
        >
       {accountType === "vendor"
          ? "Your vendor profile has been created successfully!"
          : "Customer account created successfully! Welcome to MarketDay."}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>FULL NAME</span>
              <input
                required
                type="text"
                placeholder="Your name"
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClass}>PHONE NUMBER</span>
              <input
                required
                type="tel"
                placeholder="+234"
                className={inputClass}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>EMAIL ADDRESS</span>
            <input
              required
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>HOME / DELIVERY ADDRESS</span>
            <input
              required
              type="text"
              placeholder="Street, area and city"
              className={inputClass}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>PASSWORD</span>
            <input
              required
              type="password"
              minLength={8}
              placeholder="At least 8 characters"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                />
                </label>
                <label className="block">
                  <span className={labelClass}>BUSINESS LOCATION</span>
                <input
                  required
                  type="text"
                  placeholder="Area and city"
                  className={inputClass}
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />                </label>
                <label className="block">
                  <span className={labelClass}>WHAT DO YOU SELL?</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell customers what makes your store useful."
                    className="mt-2 w-full rounded-2xl bg-input px-5 py-3.5 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>PROFILE PICTURE URL</span>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/store-image.jpg"
                    className={inputClass}
                    value={profilePicture}
                    onChange={(event) => setProfilePicture(event.target.value)}
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
