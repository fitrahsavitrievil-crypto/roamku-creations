import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, User, ShieldCheck, Clock3, Sparkles } from "lucide-react";
import { loadOrder, saveBuyer, loadBuyer, formatIDR, type Order } from "@/lib/order";
import { FlowHeader } from "@/components/flow-header";
import mascot from "@/assets/mascot_checkout.png";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — RoamKU" },
      { name: "description", content: "Isi data kamu untuk menerima eSIM." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const o = loadOrder();
    if (!o) {
      navigate({ to: "/" });
      return;
    }
    setOrder(o);
    const b = loadBuyer();
    if (b) {
      setName(b.name);
      setEmail(b.email);
    }
  }, [navigate]);

  if (!order) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: { name?: string; email?: string } = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName || cleanName.length > 80) errs.name = "Nama wajib diisi (max 80 karakter).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 200)
      errs.email = "Email tidak valid.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    saveBuyer({ name: cleanName, email: cleanEmail });
    navigate({ to: "/payment" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FlowHeader step={1} backTo="/" backLabel="Ubah paket" />

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1fr_380px]">
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-10">
          {/* decorative blob */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-56 w-56 rounded-full bg-ink/5 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="h-3 w-3" /> Hampir jadi
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Ke mana eSIM-nya<br />kita kirim?
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              QR aktivasi sampai ke inbox kamu dalam &lt; 30 detik setelah pembayaran berhasil.
            </p>

            <form onSubmit={submit} className="mt-8 max-w-md space-y-5">
              <FieldShell label="Nama lengkap" error={errors.name} icon={<User className="h-4 w-4" />}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="Budi Santoso"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </FieldShell>

              <FieldShell label="Alamat email" error={errors.email} icon={<Mail className="h-4 w-4" />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={200}
                  placeholder="kamu@email.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </FieldShell>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-4 text-sm font-semibold text-ink-foreground shadow-lg shadow-ink/20 transition hover:translate-y-[-1px] hover:shadow-xl"
              >
                Lanjut ke pembayaran
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-success" /> Data terenkripsi</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3 text-success" /> Pengiriman instan</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3 text-success" /> Tanpa spam</span>
              </div>
            </form>
          </div>

          {/* mascot peek bottom-right */}
          <img
            src={mascot}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 right-2 hidden h-44 w-44 select-none object-contain opacity-90 md:block lg:h-56 lg:w-56"
          />
        </section>

        <OrderSummary order={order} />
      </main>
    </div>
  );
}

function FieldShell({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div
        className={[
          "mt-2 flex items-center gap-2.5 rounded-2xl border bg-card px-4 py-3.5 transition",
          error
            ? "border-brand/50 ring-2 ring-brand/15"
            : "border-border focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/10",
        ].join(" ")}
      >
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-brand">{error}</p>}
    </div>
  );
}

export function OrderSummary({ order }: { order: Order }) {
  return (
    <aside className="relative h-fit overflow-hidden rounded-[28px] bg-ink p-7 text-ink-foreground shadow-2xl shadow-ink/30">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            Ringkasan pesanan
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/70">
            eSIM
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
            {order.countryFlag}
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-tight">{order.country}</div>
            <div className="text-xs text-white/60">
              {order.mode === "unlimited" ? "Unlimited · 500 MB/hari" : order.data + " tetap"} · {order.days} hari
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-sm">
          <Row k="Paket" v={order.mode === "unlimited" ? "Unlimited" : order.data} />
          <Row k="Durasi" v={`${order.days} hari`} />
          <Row k="Jumlah eSIM" v={`${order.qty}×`} />
          <Row k="Harga satuan" v={formatIDR(order.unitPrice)} />
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand to-brand/70 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
              Total bayar
            </span>
            <span className="font-display text-3xl font-extrabold text-white">
              {formatIDR(order.total)}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-white/70">Sudah termasuk PPN & biaya layanan</div>
        </div>
      </div>
    </aside>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-white/80">
      <span className="text-white/55">{k}</span>
      <span className="font-medium text-white">{v}</span>
    </div>
  );
}
