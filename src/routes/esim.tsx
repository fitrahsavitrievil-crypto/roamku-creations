import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Mail,
  Smartphone,
  Wifi,
  Signal,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import {
  loadOrder,
  loadBuyer,
  loadEsim,
  formatIDR,
  type Order,
  type Buyer,
  type Esim,
} from "@/lib/order";
import { FlowHeader } from "@/components/flow-header";
import mascot from "@/assets/mascot_success.png";

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
      <FlowHeader step={3} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero success */}
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-success/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          {/* confetti dots */}
          <div className="pointer-events-none absolute inset-0">
            {[
              { l: "12%", t: "20%", c: "bg-brand" },
              { l: "82%", t: "30%", c: "bg-success" },
              { l: "70%", t: "70%", c: "bg-ink" },
              { l: "20%", t: "75%", c: "bg-brand" },
              { l: "90%", t: "55%", c: "bg-success" },
              { l: "40%", t: "15%", c: "bg-ink" },
            ].map((d, i) => (
              <span
                key={i}
                className={`absolute h-2 w-2 rounded-full ${d.c} opacity-60`}
                style={{ left: d.l, top: d.t }}
              />
            ))}
          </div>

          <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-success">
                <PartyPopper className="h-3 w-3" /> eSIM aktif
              </span>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
                Selamat jalan,<br />
                <span className="text-brand">{buyer.name.split(" ")[0]}</span>!
              </h1>
              <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                Pembayaran sukses. QR aktivasi juga dikirim ke{" "}
                <span className="font-semibold text-foreground">{buyer.email}</span>.
                Pasang sekarang sambil di Wi-Fi, aktifkan saat mendarat.
              </p>
            </div>
            <img
              src={mascot}
              alt=""
              aria-hidden="true"
              className="h-32 w-32 select-none object-contain sm:h-40 sm:w-40"
            />
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          {/* QR card */}
          <div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-ink-foreground shadow-2xl shadow-ink/30 sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand/25 blur-3xl" />

            <div className="relative flex items-center justify-between text-[11px] uppercase tracking-wider text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Scan untuk install
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 text-success">
                <Signal className="h-3 w-3" /> 5G ready
              </span>
            </div>

            <div className="relative mt-6 flex justify-center">
              <div className="rounded-3xl bg-white p-5 shadow-2xl">
                <FakeQR seed={esim.iccid} />
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                  <div className="h-5 w-5 rounded bg-brand text-center text-[10px] font-extrabold leading-5 text-brand-foreground">R</div>
                  RoamKU eSIM
                </div>
              </div>
            </div>

            <div className="relative mt-7 space-y-2.5 text-sm">
              <KV
                label="ICCID"
                value={esim.iccid}
                onCopy={() => copy("ICCID", esim.iccid)}
                copied={copied === "ICCID"}
                mono
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

            <div className="relative mt-6 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">
                <Download className="h-4 w-4" /> Unduh QR
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-white/90">
                <Mail className="h-4 w-4" /> Kirim ulang
              </button>
            </div>
          </div>

          {/* Details + steps */}
          <div className="space-y-5">
            <div className="rounded-[28px] border border-border bg-card p-6 sm:p-7">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Detail Paket
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                  {order.countryFlag}
                </div>
                <div>
                  <div className="font-display text-lg font-bold leading-tight">{order.country}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.mode === "unlimited" ? "Unlimited · 500 MB/hari" : order.data + " tetap"} · {order.days} hari
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
                  <div className="font-display text-xl font-extrabold">{formatIDR(order.total)}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs">
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

            <div className="rounded-[28px] border border-border bg-card p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5" /> Cara pasang (2 menit)
              </div>
              <ol className="mt-4 space-y-3.5 text-sm">
                <Step n={1}>
                  Buka <b>Pengaturan</b> → <b>Seluler</b> → <b>Tambah eSIM</b>.
                </Step>
                <Step n={2}>Scan QR di samping atau masukkan Activation Code manual.</Step>
                <Step n={3}>
                  Beri label "RoamKU {order.country}" dan aktifkan <b>Data Roaming</b>.
                </Step>
                <Step n={4}>
                  Sampai tujuan, pilih RoamKU sebagai jalur data — internet aktif &lt; 30 detik.
                </Step>
              </ol>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                <Wifi className="h-3.5 w-3.5 text-success" /> Tips: pasang dari rumah dulu, aktifkan setelah mendarat.
              </div>
            </div>

            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3.5 text-sm font-semibold text-background hover:opacity-90"
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
    <div className="rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/5 transition hover:bg-white/10">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-white/55">
        <span>{label}</span>
        <button
          onClick={onCopy}
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition ${
            copied ? "bg-success/20 text-success" : "bg-white/10 text-white hover:bg-white/15"
          }`}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Disalin" : "Salin"}
        </button>
      </div>
      <div className={`mt-1.5 truncate text-sm ${mono ? "font-mono" : "font-medium"} text-white`}>
        {value}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-ink-foreground">
        {n}
      </span>
      <span className="leading-relaxed text-foreground">{children}</span>
    </li>
  );
}

function FakeQR({ seed }: { seed: string }) {
  const size = 25;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  function bit(i: number) {
    h = (h * 1103515245 + 12345 + i) >>> 0;
    return (h >>> 16) & 1;
  }
  const cells: boolean[] = Array.from({ length: size * size }, (_, i) => bit(i) === 1);
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
