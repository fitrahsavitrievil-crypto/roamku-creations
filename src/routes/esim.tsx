import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Copy, Download, Mail, Smartphone, Wifi, Signal } from "lucide-react";
import {
  loadOrder,
  loadBuyer,
  loadEsim,
  formatIDR,
  type Order,
  type Buyer,
  type Esim,
} from "@/lib/order";

export const Route = createFileRoute("/esim")({
  head: () => ({
    meta: [
      { title: "eSIM Aktif — RoamKU" },
      { name: "description", content: "Detail eSIM kamu siap dipasang." },
    ],
  }),
  component: EsimPage,
});

function EsimPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [esim, setEsim] = useState<Esim | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const o = loadOrder();
    const b = loadBuyer();
    const e = loadEsim();
    if (!o || !b || !e) {
      navigate({ to: "/" });
      return;
    }
    setOrder(o);
    setBuyer(b);
    setEsim(e);
  }, [navigate]);

  if (!order || !buyer || !esim) return null;

  async function copy(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
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
        <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
          Langkah 3 dari 3 · Berhasil
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        <section className="rounded-3xl border border-border bg-card p-6 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
            <Check className="h-7 w-7 text-success" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pembayaran berhasil, eSIM siap dipasang
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Kami juga mengirim QR code aktivasi ke{" "}
            <span className="font-medium text-foreground">{buyer.email}</span>.
          </p>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          {/* QR card */}
          <div className="rounded-3xl bg-ink p-6 text-ink-foreground shadow-xl sm:p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/60">
              <span>Scan QR untuk install</span>
              <span className="flex items-center gap-1 text-success">
                <Signal className="h-3.5 w-3.5" /> 5G ready
              </span>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="rounded-2xl bg-white p-5">
                <FakeQR seed={esim.iccid} />
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <KV
                label="ICCID"
                value={esim.iccid}
                onCopy={() => copy("ICCID", esim.iccid)}
                copied={copied === "ICCID"}
              />
              <KV
                label="SM-DP+ Address"
                value={esim.smdp}
                onCopy={() => copy("SM-DP+ Address", esim.smdp)}
                copied={copied === "SM-DP+ Address"}
              />
              <KV
                label="Activation Code"
                value={esim.activationCode}
                onCopy={() => copy("Activation Code", esim.activationCode)}
                copied={copied === "Activation Code"}
                mono
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15">
                <Download className="h-4 w-4" /> Unduh QR
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15">
                <Mail className="h-4 w-4" /> Kirim ulang email
              </button>
            </div>
          </div>

          {/* Details + steps */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Detail Paket
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                  {order.countryFlag}
                </div>
                <div>
                  <div className="font-semibold">{order.country}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.mode === "unlimited" ? "Unlimited · 500 MB/hari" : order.data + " tetap"} · {order.days} hari
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-muted-foreground">Total dibayar</div>
                  <div className="font-display text-xl font-bold">{formatIDR(order.total)}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <Spec label="Pemilik" value={buyer.name} />
                <Spec label="Email" value={buyer.email} />
                <Spec
                  label="Status"
                  value={<span className="text-success">Belum dipasang</span>}
                />
                <Spec label="Berlaku" value={`${order.days} hari sejak aktif`} />
                <Spec label="Hotspot" value="Aktif" />
                <Spec label="Speed" value="3G/4G/5G" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5" /> Cara pasang
              </div>
              <ol className="mt-3 space-y-3 text-sm">
                <Step n={1}>
                  Buka <b>Pengaturan</b> → <b>Seluler</b> → <b>Tambah eSIM</b>.
                </Step>
                <Step n={2}>Scan QR code di samping atau masukkan Activation Code manual.</Step>
                <Step n={3}>
                  Beri label "RoamKU {order.country}" dan aktifkan <b>Data Roaming</b>.
                </Step>
                <Step n={4}>
                  Sampai di tujuan, pilih RoamKU sebagai jalur data — internet aktif &lt; 30 detik.
                </Step>
              </ol>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Wifi className="h-3.5 w-3.5" /> Pasang sekarang sambil di Wi-Fi, aktifkan saat
                mendarat.
              </div>
            </div>

            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Selesai · Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function KV({
  label,
  value,
  onCopy,
  copied,
  mono,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-white/60">
        <span>{label}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-white/80 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Disalin" : "Salin"}
        </button>
      </div>
      <div className={`mt-1 truncate text-sm ${mono ? "font-mono" : "font-medium"} text-white`}>
        {value}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
        {n}
      </span>
      <span className="text-foreground">{children}</span>
    </li>
  );
}

function FakeQR({ seed }: { seed: string }) {
  // Deterministic pseudo-QR from the seed so it looks the same on re-renders.
  const size = 25;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  function bit(i: number) {
    h = (h * 1103515245 + 12345 + i) >>> 0;
    return (h >>> 16) & 1;
  }
  const cells: boolean[] = Array.from({ length: size * size }, (_, i) => bit(i) === 1);
  // Carve 3 finder squares.
  const carve = (cx: number, cy: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const on =
          x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
        cells[(cy + y) * size + (cx + x)] = on;
      }
  };
  carve(0, 0);
  carve(size - 7, 0);
  carve(0, size - 7);
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${size}, 8px)`,
        gridTemplateRows: `repeat(${size}, 8px)`,
      }}
      aria-label="QR Code aktivasi eSIM"
    >
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-foreground" : "bg-white"} />
      ))}
    </div>
  );
}
