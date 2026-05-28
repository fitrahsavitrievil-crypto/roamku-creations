import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, User } from "lucide-react";
import { loadOrder, saveBuyer, loadBuyer, formatIDR, type Order } from "@/lib/order";

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
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground font-display font-bold">
            R
          </div>
          <span className="font-display text-lg font-bold tracking-tight">RoamKU</span>
        </Link>
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Langkah 1 dari 3</div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ke mana eSIM-nya dikirim?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            QR code aktivasi akan dikirim ke email kamu seketika setelah pembayaran berhasil.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nama lengkap
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 focus-within:ring-2 focus-within:ring-foreground/20">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="Budi Santoso"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-brand">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Alamat email
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 focus-within:ring-2 focus-within:ring-foreground/20">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={200}
                  placeholder="kamu@email.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-brand">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3.5 text-sm font-semibold text-brand-foreground hover:opacity-90"
            >
              Lanjut ke pembayaran <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Dengan melanjutkan kamu setuju dengan Ketentuan & Kebijakan Privasi RoamKU.
            </p>
          </form>
        </section>

        <OrderSummary order={order} />
      </main>
    </div>
  );
}

export function OrderSummary({ order }: { order: Order }) {
  return (
    <aside className="h-fit rounded-3xl bg-ink p-6 text-ink-foreground shadow-xl">
      <div className="text-xs uppercase tracking-wider text-white/60">Ringkasan pesanan</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl">
          {order.countryFlag}
        </div>
        <div>
          <div className="font-semibold">{order.country}</div>
          <div className="text-xs text-white/60">
            {order.mode === "unlimited" ? "Unlimited · 500 MB/hari" : order.data + " tetap"} · {order.days} hari
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <Row k="Paket" v={order.mode === "unlimited" ? "Unlimited" : order.data} />
        <Row k="Durasi" v={`${order.days} hari`} />
        <Row k="Jumlah eSIM" v={`${order.qty}×`} />
        <Row k="Harga satuan" v={formatIDR(order.unitPrice)} />
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-white/60">Total</span>
          <span className="font-display text-3xl font-bold">{formatIDR(order.total)}</span>
        </div>
      </div>
    </aside>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-white/80">
      <span className="text-white/60">{k}</span>
      <span className="font-medium text-white">{v}</span>
    </div>
  );
}
