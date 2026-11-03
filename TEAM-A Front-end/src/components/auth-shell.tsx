import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";
import shopper from "@/assets/shopper.jpg";
import { SiteFooter } from "@/components/site-footer";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-cobalt">
              <ShoppingBasket className="size-4.5 text-white" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              MARKET<span className="text-cobalt">DAY</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="grid flex-1 lg:grid-cols-2">
        <div className="relative min-h-[24rem] overflow-hidden lg:min-h-0">
          <img
            src={shopper}
            alt="Smiling shopper holding a phone after an easy MarketDay checkout"
            width={1024}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(67,56,245,0) 45%, rgba(67,56,245,0.92) 100%)",
            }}
          />
          <div className="absolute left-6 top-16 rounded-2xl bg-lime px-6 py-4 md:left-12">
            <p className="text-[11px] font-bold tracking-[0.2em] text-ink/70">FRESH MARKET</p>
            <p className="font-display text-xl font-extrabold text-ink">On the way</p>
          </div>
          <div className="absolute right-6 top-1/3 rounded-2xl bg-card px-6 py-4 shadow-lg md:right-auto md:left-1/2">
            <p className="text-[11px] font-bold tracking-[0.2em] text-cobalt">CHECKOUT</p>
            <p className="font-display text-xl font-extrabold text-ink">Done in minutes</p>
          </div>
          <div className="absolute bottom-10 left-6 right-6 md:left-12 md:right-16">
            <h2 className="font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">
              More time for your actual day.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
              Shop trusted local vendors without adding a market trip to your schedule.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12 md:px-10 lg:px-16">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
