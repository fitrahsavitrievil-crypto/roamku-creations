import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Zap,
  Shield,
  RotateCcw,
  Signal,
  Search,
  Globe,
  ArrowRight,
  ShoppingCart,
  Minus,
  Plus,
  BarChart3,
  Check,
  ChevronDown,
} from "lucide-react";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoamKU — eSIM instan untuk traveler Indonesia" },
      {
        name: "description",
        content:
          "Pilih negara, pilih hari, bayar. QR code dikirim ke email dalam 30 detik — tanpa aplikasi, tanpa daftar, tanpa ribet.",
      },
      { property: "og:title", content: "RoamKU — eSIM instan untuk traveler Indonesia" },
      {
        property: "og:description",
        content: "Data internet di 219+ negara. Aktif 30 detik setelah mendarat.",
      },
    ],
  }),
  component: Index,
});

const countries = [
  { code: "EU", name: "Eropa (30+)", flag: "🇪🇺" },
  { code: "JP", name: "Jepang", flag: "🇯🇵" },
  { code: "SG", name: "Singapura", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "KR", name: "Korea Selatan", flag: "🇰🇷" },
  { code: "US", name: "Amerika", flag: "🇺🇸" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "TR", name: "Turki", flag: "🇹🇷" },
  { code: "AE", name: "UEA", flag: "🇦🇪" },
  { code: "CN", name: "China", flag: "🇨🇳" },
];

const dataPlans = ["500 MB", "1 GB", "3 GB", "5 GB", "10 GB", "20 GB", "50 GB"];
const durations = ["7", "15", "30", "180"];

function Index() {
  const [country, setCountry] = useState("JP");
  const [dataIdx, setDataIdx] = useState(2);
  const [durIdx, setDurIdx] = useState(0);
  const [mode, setMode] = useState<"fixed" | "unlimited">("fixed");
  const [qty, setQty] = useState(1);

  const selectedCountry = countries.find((c) => c.code === country)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground font-display font-bold">
            R
          </div>
          <span className="font-display text-lg font-bold tracking-tight">RoamKU</span>
        </div>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">Cara kerja</a>
          <a href="#destinations" className="hover:text-foreground">Destinasi</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#" className="hover:text-foreground">Bantuan</a>
        </nav>
        <a
          href="#builder"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-ink-foreground hover:opacity-90"
        >
          Beli eSIM
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-10">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-sm">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-brand text-[10px] text-brand-foreground">
                🇮🇩
              </span>
              DIBUAT DI INDONESIA · 219+ DESTINASI
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Data instan.
              <br />
              <span className="text-muted-foreground">
                Aktif begitu kamu mendarat dalam 30 detik.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Pilih negara, pilih hari, bayar. QR code dikirim ke email kamu seketika —
              tanpa aplikasi, tanpa daftar, tanpa syarat tersembunyi.
            </p>
          </div>

          {/* Mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src={mascot}
              alt="Maskot RoamKU — komodo ramah pemandu data"
              width={1024}
              height={1024}
              className="h-auto w-[min(520px,90%)] drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>

        {/* Builder */}
        <div id="builder" className="mt-2 grid gap-5 lg:grid-cols-2">
          {/* Left config card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <Step n={1} label="MAU KE MANA?" />
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Cari negara…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {countries.map((c) => {
                const active = c.code === country;
                return (
                  <button
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-ink text-ink-foreground"
                        : "bg-muted text-foreground hover:bg-accent"
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-70">{c.code}</span>
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>

            <button className="mt-5 flex w-full items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 text-left transition hover:bg-muted">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
                  <Globe className="h-4 w-4 text-brand" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Liburan ke banyak negara?</div>
                  <div className="text-xs text-muted-foreground">
                    Pilih paket regional atau global sekaligus.
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="my-6 h-px bg-border" />

            <div className="flex items-center justify-between">
              <Step n={2} label="BERAPA KUOTA?" />
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-xs">
                <button
                  onClick={() => setMode("fixed")}
                  className={`rounded-full px-3 py-1 ${mode === "fixed" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  Tetap
                </button>
                <button
                  onClick={() => setMode("unlimited")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 ${mode === "unlimited" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  Unlimited <span className="h-1.5 w-1.5 rounded-full bg-success" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {dataPlans.map((p, i) => {
                const active = i === dataIdx;
                const [num, unit] = p.split(" ");
                return (
                  <button
                    key={p}
                    onClick={() => setDataIdx(i)}
                    className={`rounded-xl border px-3 py-4 text-center transition ${
                      active
                        ? "border-foreground bg-card shadow-sm"
                        : "border-transparent bg-muted hover:bg-accent"
                    }`}
                  >
                    <div className="font-display text-2xl font-semibold leading-none">
                      {num}
                    </div>
                    <div className="mt-1 text-[10px] tracking-wider text-muted-foreground">
                      {unit}
                    </div>
                  </button>
                );
              })}
            </div>
            <button className="mt-3 flex w-full items-center justify-between rounded-xl bg-muted px-4 py-2.5 text-xs text-muted-foreground hover:bg-accent">
              Tampilkan paket lebih kecil <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <div className="my-6 h-px bg-border" />

            <Step n={3} label="BERAPA LAMA?" />
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold">{durations[durIdx]}</span>
              <span className="text-sm text-muted-foreground">hari</span>
              <span className="ml-auto text-xs text-muted-foreground">
                pilih masa aktif
              </span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {durations.map((d, i) => {
                const active = i === durIdx;
                return (
                  <button
                    key={d}
                    onClick={() => setDurIdx(i)}
                    className={`rounded-xl border px-3 py-4 text-center transition ${
                      active
                        ? "border-foreground bg-card shadow-sm"
                        : "border-transparent bg-muted hover:bg-accent"
                    }`}
                  >
                    <div className="font-display text-xl font-semibold leading-none">
                      {d}
                    </div>
                    <div className="mt-1 text-[10px] tracking-wider text-muted-foreground">
                      HARI
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right product/dark card */}
          <div className="rounded-3xl bg-ink p-6 text-ink-foreground shadow-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl">
                {selectedCountry.flag}
              </div>
              <div>
                <div className="font-semibold">{selectedCountry.name}</div>
                <div className="text-xs text-white/60">
                  Asia · {Math.floor(Math.random() * 30) + 30} paket
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs uppercase tracking-wider text-white/60">
              Pilihan Saat Ini
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-white/40 line-through">Rp 32.000</span>
              <span className="rounded-md bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                30% OFF
              </span>
            </div>

            <div className="mt-3 flex items-end gap-3">
              <button className="flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-xs">
                IDR <ChevronDown className="h-3 w-3" />
              </button>
              <button className="rounded-md bg-white/5 p-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
              </button>
              <div className="ml-1 font-display text-6xl font-bold leading-none">
                22<span className="text-2xl text-white/70">.400</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>1 eSIM</span>
              <span>1 × Rp 22.400</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px]">
              {[dataPlans[dataIdx], `${durations[durIdx]} HARI`, mode === "fixed" ? "TETAP" : "UNLIMITED", "1 ESIM"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/15 px-2 py-1 uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-y-4 text-xs">
              <Spec label="ESIM" value="1 eSIM" />
              <Spec label="COVERAGE" value={selectedCountry.name} />
              <Spec label="PAKET" value={`${dataPlans[dataIdx]} tetap`} />
              <Spec label="DURASI" value={`${durations[durIdx]} hari`} />
              <Spec
                label="DELIVERY"
                value={
                  <span className="text-success">
                    <Check className="mr-1 inline h-3 w-3" />
                    Instan
                  </span>
                }
              />
              <Spec
                label="HOTSPOT"
                value={
                  <span className="text-success">
                    <Check className="mr-1 inline h-3 w-3" />
                    Aktif
                  </span>
                }
              />
              <Spec label="SPEED" value="3G/4G/5G" />
              <Spec label="DATA EXIT" value="Singapura" />
              <Spec label="NETWORKS" value="Telkomsel mitra" />
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-white/60">
                Jaringan Operator
              </div>
              <div className="mt-1 font-semibold">1 negara dengan detail operator</div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-sm">
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="font-medium">{selectedCountry.name}</span>
                <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                  Mitra 5G
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60">
                <Globe className="h-3.5 w-3.5" /> UPGRADE REGIONAL
              </div>
              <div className="mt-1 font-semibold">Butuh cakupan lebih dari satu negara?</div>
              <div className="mt-3 space-y-2">
                {["Asia Tenggara (10 negara)", "Asia Pasifik (15 negara)", "Global (120+ area)"].map(
                  (label) => (
                    <button
                      key={label}
                      className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm hover:bg-white/10"
                    >
                      {label} <ArrowRight className="h-4 w-4 opacity-60" />
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-4">
              <Shield className="h-5 w-5 text-white/70" />
              <div className="text-sm">
                <div className="font-semibold">Tambah Travel VPN</div>
                <div className="text-xs text-white/60">
                  Privasi ekstra untuk Wi-Fi hotel & jaringan ketat.
                </div>
              </div>
              <div className="ml-auto text-right text-xs">
                <div className="text-white/50 line-through">Rp 80.000</div>
                <div className="font-semibold">+ Rp 56.000</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 rounded-full bg-white/5 p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="rounded-full bg-white/5 p-1.5 hover:bg-white/10"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="rounded-full bg-white/5 p-1.5 hover:bg-white/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15">
                <ShoppingCart className="h-4 w-4" /> Tambah ke keranjang
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90">
                Beli sekarang <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, title: "Aktif 30 detik", desc: "QR code via email begitu pembayaran berhasil." },
            { icon: Shield, title: "Layanan manusia", desc: "Tim support beneran yang baca pesanmu." },
            { icon: RotateCcw, title: "Garansi refund 30 hari", desc: "Gak jalan? Dana balik. Tanpa formulir." },
            { icon: Signal, title: "5G di mana tersedia", desc: "Operator tier-1 di tiap negara." },
          ].map((f) => (
            <div key={f.title} className="bg-card p-6">
              <f.icon className="h-5 w-5 text-foreground" />
              <div className="mt-6 font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> CARA KERJA
        </span>
        <h2 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight">
          Tiga langkah.
          <br />
          Satu menit.
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Tanpa slot SIM, tanpa konter, tanpa dokumen. HP kamu yang urus sisanya.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              n: "01",
              title: "Pilih & bayar",
              desc: "Pilih negara, hari, kuota. Bayar pakai kartu, GoPay, atau QRIS.",
              visual: (
                <div className="flex items-center gap-2">
                  <Pill>🇯🇵 Jepang</Pill>
                  <Pill>7h</Pill>
                  <Pill dark>5 GB</Pill>
                </div>
              ),
            },
            {
              n: "02",
              title: "Scan QR-nya",
              desc: "Buka email, arahkan kamera. iOS & Android langsung tahu caranya.",
              visual: (
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-foreground">
                  <div className="grid h-14 w-14 grid-cols-5 gap-px">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${[0, 2, 4, 6, 8, 11, 13, 16, 18, 20, 22, 24, 9, 15, 7].includes(i) ? "bg-background" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              ),
            },
            {
              n: "03",
              title: "Mendarat & online",
              desc: "Data aktif otomatis saat tersambung jaringan lokal. Beres.",
              visual: (
                <div className="text-center">
                  <div className="font-display text-3xl font-bold">
                    4.8 <span className="text-base text-muted-foreground">GB / 5 GB</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">5G · NTT Docomo</div>
                  <div className="mt-1 text-xs text-success">● Tersambung</div>
                </div>
              ),
            },
          ].map((s) => (
            <div key={s.n} className="rounded-3xl border border-border bg-card p-6">
              <div className="text-xs tracking-[0.2em] text-muted-foreground">STEP {s.n}</div>
              <div className="mt-3 text-xl font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.desc}</div>
              <div className="mt-6 flex h-36 items-center justify-center rounded-2xl bg-muted">
                {s.visual}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> FAQ
        </span>
        <h2 className="mt-4 font-display text-5xl font-bold tracking-tight">
          Pertanyaan, dijawab.
        </h2>

        <div className="mt-10 text-left">
          {[
            {
              q: "Apa itu eSIM?",
              a: "eSIM adalah SIM digital yang sudah tertanam di HP modern. Scan QR code dan nomor baru langsung aktif — tanpa kartu plastik. Nomor utama kamu tetap aktif.",
            },
            { q: "HP saya bisa pakai eSIM?", a: "iPhone XS ke atas, Pixel 3 ke atas, dan sebagian besar Samsung/Xiaomi flagship sejak 2020 sudah support eSIM." },
            { q: "Kapan paketnya mulai aktif?", a: "Saat eSIM pertama kali terhubung ke jaringan lokal di negara tujuan." },
            { q: "Nomor Indonesia saya tetap aktif?", a: "Ya. eSIM RoamKU jadi line kedua. WhatsApp & nomor utamamu tetap jalan via Wi-Fi atau roaming biasa." },
            { q: "Bisa tethering / hotspot?", a: "Bisa di hampir semua paket. Lihat detail di kartu paket — kalau ada centang Hotspot, berarti aktif." },
            { q: "Kalau gak jalan gimana?", a: "Tim support kami balas dalam hitungan menit. Kalau memang ada masalah dari sisi kami, refund penuh 30 hari." },
          ].map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-[10px] font-bold text-brand-foreground">
              R
            </div>
            <span>© {new Date().getFullYear()} RoamKU · Jakarta, Indonesia</span>
          </div>
          <div className="flex gap-5">
            <a href="#">Syarat</a>
            <a href="#">Privasi</a>
            <a href="#">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
        {n}
      </span>
      <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] tracking-wider text-white/50">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

function Pill({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-medium ${
        dark ? "bg-foreground text-background" : "bg-card border border-border"
      }`}
    >
      {children}
    </span>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-border py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            open ? "bg-foreground text-background" : "bg-muted text-foreground"
          }`}
        >
          {open ? "×" : "+"}
        </span>
      </button>
      {open && <p className="mt-3 max-w-xl text-sm text-muted-foreground">{a}</p>}
    </div>
  );
}
