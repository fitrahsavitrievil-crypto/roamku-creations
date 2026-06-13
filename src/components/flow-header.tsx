import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

export function FlowHeader({
  step,
  backTo,
  backLabel,
}: {
  step: 1 | 2 | 3;
  backTo?: string;
  backLabel?: string;
}) {
  const steps = [
    { n: 1, label: "Data" },
    { n: 2, label: "Bayar" },
    { n: 3, label: "eSIM" },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground font-display text-base font-extrabold shadow-sm">
            R
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight">RoamKU</span>
        </Link>

        <ol className="hidden items-center gap-2 sm:flex">
          {steps.map((s, i) => {
            const done = s.n < step;
            const active = s.n === step;
            return (
              <li key={s.n} className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-7 items-center gap-2 rounded-full pl-1 pr-3 text-xs font-semibold transition",
                    active
                      ? "bg-ink text-ink-foreground"
                      : done
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                      active
                        ? "bg-brand text-brand-foreground"
                        : done
                          ? "bg-success text-background"
                          : "bg-background text-muted-foreground",
                    ].join(" ")}
                  >
                    {done ? <Check className="h-3 w-3" /> : s.n}
                  </span>
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={`h-px w-6 ${s.n < step ? "bg-success/50" : "bg-border"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {backTo ? (
          <Link
            to={backTo}
            className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {backLabel ?? "Kembali"}
          </Link>
        ) : (
          <div className="h-7 w-16" />
        )}
      </div>
    </header>
  );
}
