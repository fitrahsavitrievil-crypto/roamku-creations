import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Loader2 } from "lucide-react";
import {
  loadOrder,
  loadBuyer,
  saveEsim,
  formatIDR,
  type Order,
  type Buyer,
} from "@/lib/order";
import { OrderSummary } from "./checkout";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground font-display font-bold">
            R
          </div>
          <span className="font-display text-lg font-bold tracking-tight">RoamKU</span>
        </Link>
        <Link to="/checkout" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Ubah data
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Langkah 2 dari 3
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Pembayaran
              </h1>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> SSL 256-bit
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {(
              [
                { id: "card", label: "Kartu" },
                { id: "qris", label: "QRIS" },
                { id: "va", label: "Virtual Account" },
              ] as { id: Method; label: string }[]
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                  method === m.id
                    ? "border-foreground bg-card shadow-sm"
                    : "border-transparent bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={pay} className="mt-6 space-y-4">
            {method === "card" && (
              <>
                <Field label="Nomor kartu">
                  <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
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
                    className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Kadaluarsa">
                    <input
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none"
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none"
                    />
                  </Field>
                </div>
              </>
            )}

            {method === "qris" && (
              <div className="rounded-2xl bg-muted p-6 text-center">
                <div className="mx-auto grid h-40 w-40 grid-cols-8 gap-px rounded-xl bg-foreground p-3">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${Math.random() > 0.5 ? "bg-background" : "bg-foreground"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Scan kode QRIS dengan aplikasi e-wallet kamu, lalu tekan tombol di bawah setelah membayar.
                </p>
              </div>
            )}

            {method === "va" && (
              <div className="rounded-2xl bg-muted p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Nomor Virtual Account (BCA)
                </div>
                <div className="mt-1 font-mono text-2xl font-semibold tracking-wide">
                  8808 1234 5678 9012
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Transfer tepat sebesar <span className="font-semibold text-foreground">{formatIDR(order.total)}</span>.
                  Aktif 24 jam.
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3.5 text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memproses pembayaran…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Bayar {formatIDR(order.total)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Pembayaran diamankan oleh RoamKU Pay
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
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
