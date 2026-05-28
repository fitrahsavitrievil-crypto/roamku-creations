export type Order = {
  country: string;
  countryFlag: string;
  mode: "fixed" | "unlimited";
  data: string;
  days: string;
  qty: number;
  unitPrice: number;
  total: number;
};

const KEY = "roamku.order";
const BUYER_KEY = "roamku.buyer";
const ESIM_KEY = "roamku.esim";

export function saveOrder(o: Order) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY, JSON.stringify(o));
}
export function loadOrder(): Order | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Order) : null;
}

export type Buyer = { name: string; email: string };
export function saveBuyer(b: Buyer) {
  if (typeof window !== "undefined") sessionStorage.setItem(BUYER_KEY, JSON.stringify(b));
}
export function loadBuyer(): Buyer | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(BUYER_KEY);
  return raw ? (JSON.parse(raw) as Buyer) : null;
}

export type Esim = {
  iccid: string;
  smdp: string;
  activationCode: string;
  createdAt: string;
};
export function saveEsim(e: Esim) {
  if (typeof window !== "undefined") sessionStorage.setItem(ESIM_KEY, JSON.stringify(e));
}
export function loadEsim(): Esim | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ESIM_KEY);
  return raw ? (JSON.parse(raw) as Esim) : null;
}

export function formatIDR(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
