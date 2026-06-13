import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  QrCode,
  Building2,
  Wifi,
} from "lucide-react";
import {
  loadOrder,
  loadBuyer,
  saveEsim,
  formatIDR,
  type Order,
  type Buyer,
} from "@/lib/order";
import { OrderSummary } from "./checkout";
import { FlowHeader } from "@/components/flow-header";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Pembayaran — RoamKU" },
      { name: "description", content: "Selesaikan pembayaran eSIM kamu dengan aman." },
    ],
  }),
  component: PaymentPage,
});

type Method = "card" | "qris" | "va";

function PaymentPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [method, setMethod] = useState<Method>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const o = loadOrder();
    const b = loadBuyer();
    if (!o || !b) {
      navigate({ to: "/" });
      return;
    }
    setOrder(o);
    setBuyer(b);
    setCardName(b.name);
  }, [navigate]);

  if (!order || !buyer) return null;

  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (method === "card") {
      const num = cardNumber.replace(/\s/g, "");
      if (num.length < 13) return setError("Nomor kartu tidak valid.");
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return setError("Format kadaluarsa MM/YY.");
      if (cvc.length < 3) return setError("CVC tidak valid.");
      if (!cardName.trim()) return setError("Nama di kartu wajib diisi.");
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1600));
    const iccid =
      "8910" + Math.floor(Math.random() * 1e14).toString().padStart(14, "0");
    saveEsim({
      iccid,
      smdp: "rsp.truphone.com",
      activationCode: `LPA:1$rsp.truphone.com$${iccid.slice(-12)}`,
      createdAt: new Date().toISOString(),
    });
    navigate({ to: "/esim" });
  }

  const methods: { id: Method; label: string; sub: string; icon: React.ReactNode }[] = [
    { id: "card", label: "Kartu", sub: "Visa · Mastercard · JCB", icon: <CreditCard className="h-4 w-4" /> },
    { id: "qris", label: "QRIS", sub: "Semua e-wallet", icon: <QrCode className="h-4 w-4" /> },
    { id: "va", label: "VA Bank", sub: "BCA · Mandiri · BNI", icon: <Building2 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FlowHeader step={2} backTo="/checkout" backLabel="Ubah data" />

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1fr_380px]">
        <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-success">
                <Lock className="h-3 w-3" /> Aman & Terenkripsi
              </span>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                Pilih cara bayar<br />paling nyaman
              </h1>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Pembayaran SSL 256-bit
            </div>
          </div>

          {/* method tabs */}
          <div className="mt-7 grid grid-cols-3 gap-2.5">
            {methods.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={[
                    "group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-ink bg-ink text-ink-foreground shadow-lg shadow-ink/15"
                      : "border-border bg-card hover:border-foreground/30 hover:bg-muted",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      active ? "bg-white/10 text-white" : "bg-muted text-foreground",
                    ].join(" ")}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className={`text-[11px] ${active ? "text-white/60" : "text-muted-foreground"}`}>
                      {m.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={pay} className="mt-8 space-y-5">
            {method === "card" && (
              <>
                {/* card preview */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink to-brand/70 p-5 text-ink-foreground">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="flex items-center justify-between">
                    <Wifi className="h-5 w-5 rotate-90 text-white/70" />
                    <span className="font-display text-sm font-bold tracking-wider text-white/80">RoamKU</span>
                  </div>
                  <div className="mt-8 font-mono text-lg tracking-[0.2em] text-white">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/60">
                    <div>
                      <div>Pemilik</div>
                      <div className="mt-0.5 text-xs font-semibold text-white">
                        {cardName || "NAMA DI KARTU"}
                      </div>
                    </div>
                    <div>
                      <div>Berlaku</div>
                      <div className="mt-0.5 font-mono text-xs font-semibold text-white">
                        {expiry || "MM/YY"}
                      </div>
                    </div>
                  </div>
                </div>

                <Field label="Nomor kartu">
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 focus-within:border-ink">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <input
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>
                <Field label="Nama di kartu">
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    maxLength={80}
                    className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-ink"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Kadaluarsa">
                    <input
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-ink"
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-ink"
                    />
                  </Field>
                </div>
              </>
            )}

            {method === "qris" && (
              <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center">
                <div className="mx-auto grid h-44 w-44 grid-cols-10 gap-px rounded-xl bg-foreground p-3">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${((i * 73) ^ (i >> 1)) % 3 ? "bg-background" : "bg-foreground"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium">Scan dengan GoPay, OVO, Dana, ShopeePay</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tekan tombol di bawah setelah pembayaran selesai.
                </p>
              </div>
            )}

            {method === "va" && (
              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Virtual Account · BCA
                  </div>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                    Aktif 24 jam
                  </span>
                </div>
                <div className="mt-2 font-mono text-2xl font-bold tracking-wide">
                  8808 1234 5678 9012
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-card p-3 text-xs">
                  <span className="text-muted-foreground">Transfer tepat</span>
                  <span className="font-display text-base font-bold">{formatIDR(order.total)}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-brand/30 bg-brand/10 px-3 py-2.5 text-xs font-medium text-brand">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memproses pembayaran…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Bayar aman {formatIDR(order.total)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> Diamankan RoamKU Pay · PCI-DSS Level 1
            </div>
          </form>
        </section>

        <OrderSummary order={order} />
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
