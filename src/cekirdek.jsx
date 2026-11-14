import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from "recharts";
import {
  Compass, Target, Feather, Mic, MessageSquare, Book, TrendingUp, Search,
  Check, X, ChevronRight, ChevronDown, ChevronLeft, Clock, Zap, RotateCcw,
  Play, ArrowRight, Layers, Trash2, Command, Eye, EyeOff, Sparkles, Filter,
  Loader2, Send, Info, CheckCircle, XCircle, Crosshair, Swords, Pickaxe,
  ScrollText, History, Gauge, Waypoints, Lock, Flame, PenLine, Square,
  CircleDot, Radio, Volume2, Copy, Plus, Minus, Bookmark, GitCompare, Library, Star
} from "lucide-react";

import { HAM_HEPSI, HATLAR, DURAK_META } from "./veri/index.js";

/* ══════════════════════════════════════════════════════════════════════
   N A H İ V   ·   ikinci defter
   Türkçe konuşan birinin İngilizce üretirken yaptığı hataları teşhis eden,
   kaynağına kadar izleyen ve tekrarlanmasını engelleyen bir sistem.
   ══════════════════════════════════════════════════════════════════════ */

/* ─── RENK ─────────────────────────────────────────────────────────── */

export const C = {
  kagit:       "#EEF3F8",
  muhre:       "#FFFFFF",
  kagitAlt:    "#F4F7FB",
  kagitDerin:  "#E1E8F1",
  golge:       "#C5D0DF",
  cizgi:       "#D9E1EC",
  cetvel:      "#9FB1CC",
  murekkep:    "#0F1B33",
  murekkepAlt: "#44536E",
  murekkepSis: "#66758F",
  altin:       "#1B4FCF",
  altinAcik:   "#5E86F0",
  altinSis:    "#E3EBFF",
  lal:         "#D7322A",
  lalAcik:     "#EE6A60",
  lalSis:      "#FDE7E4",
  lacivert:    "#0A7F8E",
  laciAcik:    "#2FB3C2",
  laciSis:     "#DDF3F6",
  zumrut:      "#0C8A54",
  zumSis:      "#DDF4E8",
  erguvan:     "#B8257A",
  erguvanSis:  "#FBE4F1",
  safran:      "#F0A400",
  safranKoyu:  "#9A6700",
  safranSis:   "#FFF2CC",
  mor:         "#6A3BD6",
  morSis:      "#EEE8FD",
  gece:        "#0B1630",
  geceAlt:     "#16254A"
};

export const YAZI_TIPLERI = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Atkinson+Hyperlegible+Next:ital,wght@0,400..800;1,400..800&family=Atkinson+Hyperlegible+Mono:wght@400..700&display=swap');`;

export const T = {
  hat:   "'Bricolage Grotesque', 'Atkinson Hyperlegible Next', system-ui, sans-serif",
  govde: "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, -apple-system, 'Segoe UI', sans-serif",
  berrak:"'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
  kalem: "'Atkinson Hyperlegible Mono', 'Atkinson Hyperlegible Next', ui-monospace, Menlo, Consolas, monospace",

  d0: { fontSize: 42, fontWeight: 750, letterSpacing: "-0.025em", lineHeight: 1.05 },
  d1: { fontSize: 30, fontWeight: 720, letterSpacing: "-0.02em", lineHeight: 1.15 },
  d2: { fontSize: 23, fontWeight: 680, letterSpacing: "-0.012em", lineHeight: 1.22 },
  d3: { fontSize: 18.5, fontWeight: 680, letterSpacing: "-0.005em", lineHeight: 1.3 },
  m:  { fontSize: 17.5, lineHeight: 1.66 },
  s:  { fontSize: 15.5, lineHeight: 1.58 },
  xs: { fontSize: 13.5, lineHeight: 1.5 },
  cap:{ fontSize: 12.5, letterSpacing: "0.015em", fontWeight: 700 },
  rakam: { fontVariantNumeric: "tabular-nums" }
};

export const S = { xs: 4, sm: 8, md: 14, lg: 22, xl: 34, xxl: 54, xxxl: 78 };

/* Kâğıt dokusu — çok ince gren, mührelenmiş kâğıt izlenimi */
export const DOKU = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

/* ─── DEPOLAMA ─────────────────────────────────────────────────────── */

/* ⚠ DEPOLAMA ANAHTARLARI ASLA YENİDEN ADLANDIRILMAZ.
   Sürüm değiştiğinde anahtar değiştirilirse eski verinin bağı kopar.
   Yeni alan gerekiyorsa yeni anahtar eklenir, eskisi bırakılır.        */
export const SURUM = 2;
export const UYGULAMA_SURUMU = "4.0";

export const K = {
  profil:  "nahiv2:profil",
  ustalik: "nahiv2:ustalik",
  hatalar: "nahiv2:hatalar",
  metinler:"nahiv2:metinler",
  oturum:  "nahiv2:oturum",
  derin:   "nahiv2:derin",
  sohbet:  "nahiv2:sohbet",
  esdizim: "nahiv2:esdizim",
  kehanet: "nahiv2:kehanet",
  taslak:  "nahiv2:taslak",
  yedek:   "nahiv2:yedek",
  gunluk:  "nahiv2:gunluk",
  dagarcik:"nahiv2:dagarcik",
  rekor:   "nahiv2:rekor",
  oyun:    "nahiv2:oyun",
  sinav:   "nahiv2:sinav"
};

/* Taşınacak veri anahtarları — yedek ve günlük dışarıda kalır */
export const VERI_ANAHTARLARI = [K.profil, K.ustalik, K.hatalar, K.metinler, K.oturum, K.derin, K.sohbet, K.esdizim, K.taslak, K.dagarcik, K.rekor, K.oyun, K.sinav];

/* v1 → v2 eşlemesi. Eski sürümde adlandırma "nahiv:*" idi. */
export const ESKI_ESLEME = {
  "nahiv:profil": K.profil, "nahiv:ustalik": K.ustalik, "nahiv:hatalar": K.hatalar,
  "nahiv:metinler": K.metinler, "nahiv:oturumlar": K.oturum, "nahiv:derin": K.derin
};

export async function sGet(key, yedek) {
  try {
    const r = await window.storage.get(key);
    if (!r || r.value == null) return yedek;
    return JSON.parse(r.value);
  } catch { return yedek; }
}
export async function sSet(key, deger) {
  try { await window.storage.set(key, JSON.stringify(deger)); return true; }
  catch (e) { console.error("kayıt", key, e); return false; }
}
export async function sSil(key) { try { await window.storage.delete(key); return true; } catch { return false; } }

/* ─── SANDIK: yedekleme, taşıma, kurtarma ──────────────────────────
   window.storage kalıcıdır ama uygulamanın kimliği değişirse
   (yeni sürüm, yeni oturum, temizlenen tarayıcı) erişim kopabilir.
   Tek gerçek koruma dışa aktarılmış bir dosyadır. ───────────────── */

export async function depoSagligi() {
  const t = "nahiv2:saglik";
  try {
    const damga = String(Date.now());
    await window.storage.set(t, JSON.stringify({ damga }));
    const geri = await window.storage.get(t);
    if (!geri || JSON.parse(geri.value).damga !== damga) return "bozuk";
    return "iyi";
  } catch { return "yok"; }
}

export async function veriTopla() {
  const veri = {};
  for (const k of VERI_ANAHTARLARI) {
    const v = await sGet(k, undefined);
    if (v !== undefined) veri[k] = v;
  }
  return { uygulama: "nahiv", surum: SURUM, tarih: new Date().toISOString(), veri };
}

export function paketOzeti(p) {
  const v = (p && p.veri) || {};
  return {
    hatalar: (v[K.hatalar] || []).length,
    metinler: (v[K.metinler] || []).length,
    oturumlar: (v[K.oturum] || []).length,
    dugumler: Object.keys(v[K.ustalik] || {}).length,
    esdizim: Object.keys(v[K.esdizim] || {}).length,
    dagarcik: Object.keys(v[K.dagarcik] || {}).length,
    ad: (v[K.profil] || {}).ad || null,
    baslangic: (v[K.profil] || {}).baslangic || null
  };
}

export const idKume = (a) => new Map((a || []).filter((x) => x && x.id).map((x) => [x.id, x]));

export function diziBirlestir(mevcut, gelen) {
  const m = idKume(mevcut);
  (gelen || []).forEach((x) => {
    if (!x || !x.id) return;
    const eski = m.get(x.id);
    if (!eski) m.set(x.id, x);
    else if (new Date(x.tarih || 0) > new Date(eski.tarih || 0)) m.set(x.id, { ...eski, ...x });
  });
  return [...m.values()].sort((a, b) => new Date(a.tarih || 0) - new Date(b.tarih || 0));
}

export function ustalikBirlestir(mevcut, gelen) {
  const y = { ...(mevcut || {}) };
  Object.entries(gelen || {}).forEach(([id, k]) => {
    const e = y[id];
    if (!e) { y[id] = k; return; }
    // daha yeni görülen kayıt kazanır; eşitse yüksek puanlı
    const eT = e.sonGorulme || "0000-00-00", kT = k.sonGorulme || "0000-00-00";
    y[id] = kT > eT ? k : kT < eT ? e : (k.puan || 0) >= (e.puan || 0) ? k : e;
  });
  return y;
}

export async function veriYaz(paket, mod) {
  if (!paket || paket.uygulama !== "nahiv" || !paket.veri) throw new Error("Bu dosya bir NAHİV yedeği değil.");
  const v = paket.veri;
  for (const k of VERI_ANAHTARLARI) {
    if (v[k] === undefined) continue;
    if (mod === "degistir") { await sSet(k, v[k]); continue; }
    // birleştirme
    if (k === K.hatalar || k === K.metinler || k === K.oturum) {
      await sSet(k, diziBirlestir(await sGet(k, []), v[k]));
    } else if (k === K.ustalik) {
      await sSet(k, ustalikBirlestir(await sGet(k, {}), v[k]));
    } else if (k === K.dagarcik) {
      const e = await sGet(k, {}); const y = { ...e };
      Object.entries(v[k] || {}).forEach(([id, s]) => {
        const o = y[id];
        if (!o) { y[id] = s; return; }
        const oT = o.sonGorulme || "0000-00-00", sT = s.sonGorulme || "0000-00-00";
        y[id] = sT > oT ? s : sT < oT ? o : ((s.kutu || 0) >= (o.kutu || 0) ? s : o);
      });
      await sSet(k, y);
    } else if (k === K.rekor) {
      const e = await sGet(k, {}); const y = { ...e };
      Object.entries(v[k] || {}).forEach(([id, r]) => {
        const kucukIyi = id === "eslestir" || id === "hafiza";
        if (y[id] == null) y[id] = r;
        else y[id] = kucukIyi ? Math.min(y[id], r) : Math.max(y[id], r);
      });
      await sSet(k, y);
    } else if (k === K.oyun) {
      const e = await sGet(k, {}); const g = { ...(e.gunler || {}) };
      Object.entries((v[k] && v[k].gunler) || {}).forEach(([gun, xp]) => { g[gun] = Math.max(g[gun] || 0, xp || 0); });
      await sSet(k, { ...v[k], ...e, xp: Math.max(e.xp || 0, (v[k] && v[k].xp) || 0), gunler: g });
    } else if (k === K.sinav) {
      const e = await sGet(k, {}); const g = v[k] || {};
      await sSet(k, { ...g, ...e, eserler: (e.eserler && e.eserler.some((x) => x && x.ad)) ? e.eserler : g.eserler,
        p1: diziBirlestir(e.p1 || [], g.p1 || []), p2: { ...(g.p2 || {}), ...(e.p2 || {}) } });
    } else if (k === K.derin || k === K.sohbet || k === K.esdizim) {
      await sSet(k, { ...(await sGet(k, {})), ...v[k] });
    } else if (k === K.profil) {
      const e = await sGet(k, {});
      await sSet(k, { ...e, ...v[k], taniBitti: e.taniBitti || v[k].taniBitti });
    } else if (k === K.taslak) {
      const e = await sGet(k, "");
      await sSet(k, String(v[k] || "").length > String(e || "").length ? v[k] : e);
    }
  }
  return true;
}

/* v1 kurtarma: eski "nahiv:*" anahtarları duruyorsa taşı */
export async function eskiSurumTara() {
  const bulunan = {};
  for (const [eski, yeni] of Object.entries(ESKI_ESLEME)) {
    const v = await sGet(eski, undefined);
    if (v !== undefined && v !== null) bulunan[yeni] = v;
  }
  return Object.keys(bulunan).length ? { uygulama: "nahiv", surum: 1, tarih: new Date().toISOString(), veri: bulunan } : null;
}

export async function gunlukYedek() {
  const g = await sGet(K.gunluk, {});
  if (g.tarih === bugun()) return false;
  const paket = await veriTopla();
  const oz = paketOzeti(paket);
  if (!oz.hatalar && !oz.dugumler) return false;
  await sSet(K.yedek, paket);
  await sSet(K.gunluk, { tarih: bugun() });
  return true;
}

export function dosyaIndir(paket) {
  const metin = JSON.stringify(paket, null, 2);
  const ad = `nahiv-yedek-${bugun()}.json`;
  try {
    const blob = new Blob([metin], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = ad;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch { return false; }
}

/* ─── TARİH ────────────────────────────────────────────────────────── */

export const bugun = () => new Date().toISOString().slice(0, 10);
export const gunEkle = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const gunFarki = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);
export const AYLAR = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
export const trTarih = (iso) => { if (!iso) return "—"; const [y,m,g] = iso.slice(0,10).split("-"); return `${parseInt(g)} ${AYLAR[parseInt(m)-1]} ${y}`; };
export const yeniId = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
export const sayiFmt = (n) => new Intl.NumberFormat("tr-TR").format(n);

/* ─── YAPAY ZEKÂ ───────────────────────────────────────────────────── */

export async function sor(prompt, maxTokens = 1600) {
  const c = await fetch((typeof window !== "undefined" && window.NAHIV_AI_URL) || "https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] })
  });
  if (!c.ok) throw new Error(`sunucu ${c.status}`);
  const v = await c.json();
  return (v.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

export async function sorJSON(prompt, maxTokens = 1600) {
  const ham = await sor(prompt, maxTokens);
  const t = ham.replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a === -1 || b === -1) throw new Error("JSON yok");
  return JSON.parse(t.slice(a, b + 1));
}

export const ZEMIN = `Sen Türkçe anadilli ileri seviye İngilizce öğrencileri üzerine uzmanlaşmış bir uygulamalı dilbilimcisin.
Öğrenci: 18 yaşında, Türk, IB Diploma Programı, English B HL. Alıcı becerisi güçlü, üretici doğruluğu zayıf.
İlgi alanları: uluslararası ilişkiler, siyaset felsefesi, tarih, sinema, futbol. Tüm örnekleri bu alanlardan üret; genel veya çocuksu cümle kurma.
Türkçe açıklama yaz. İltifat etme, dolgu cümle kurma. Doğrudan ve klinik ol.`;

export const BARANCA = `Baranca Öğrenme Protokolü:
1. Sıfırdan başla, ön bilgi varsayma. 2. Formülden önce mantık: bu kural hangi problemi çözüyor?
3. Gündelik hayattan analoji kur. 4. Kısa artımlı adımlar, her adımdan sonra anlama kontrolü.
5. Hatayı yumuşatmadan doğrudan düzelt. 6. Sonunda mini test.
Her açıklamayı Türkçe karşılaştırmasıyla bitir: Türkçe bunu nasıl yapıyor, İngilizce neden başka bir yol seçiyor?`;

/* ─── AİLELER ──────────────────────────────────────────────────────── */

export const AILELER = [
  { id: "iskelet",     ad: "Cümle İskeleti",        kisa: "İskelet",   en: "Sentence Structure", aci: 0 },
  { id: "ad-obegi",    ad: "Ad Öbeği",              kisa: "Ad Öbeği",  en: "Noun Phrase",        aci: 1 },
  { id: "zaman",       ad: "Zaman ve Görünüş",      kisa: "Zaman",     en: "Tense & Aspect",     aci: 2 },
  { id: "kip",         ad: "Kip",                   kisa: "Kip",       en: "Modality",           aci: 3 },
  { id: "cati",        ad: "Çatı",                  kisa: "Çatı",      en: "Voice",              aci: 4 },
  { id: "fiil-oruntu", ad: "Fiil Örüntüleri",       kisa: "Fiil",      en: "Verb Patterns",      aci: 5 },
  { id: "yan-cumle",   ad: "Yan Cümleler",          kisa: "Yan Cümle", en: "Subordination",      aci: 6 },
  { id: "kosul",       ad: "Koşul ve Varsayım",     kisa: "Koşul",     en: "Conditionals",       aci: 7 },
  { id: "soylem",      ad: "Bağlaç ve Söylem",      kisa: "Söylem",    en: "Cohesion",           aci: 8 },
  { id: "edat",        ad: "Edat Dizgesi",          kisa: "Edat",      en: "Prepositions",       aci: 9 },
  { id: "nitel",       ad: "Sıfat ve Zarf",         kisa: "Nitel",     en: "Modification",       aci: 10 },
  { id: "vurgu",       ad: "Vurgu ve Bilgi Yapısı", kisa: "Vurgu",     en: "Emphasis",           aci: 11 },
  { id: "kayit",       ad: "Akademik Kayıt",        kisa: "Kayıt",     en: "Register",           aci: 12 },
  { id: "mekanik",     ad: "Noktalama ve Mekanik",  kisa: "Mekanik",   en: "Mechanics",          aci: 13 }
];
export const aileAd = (id) => (AILELER.find((a) => a.id === id) || {}).ad || id;
export const aileKisa = (id) => (AILELER.find((a) => a.id === id) || {}).kisa || id;
/* ─── TÜRKÇE GİRİŞİM KATALOĞU ──────────────────────────────────── */

export const L1 = [
  { id: 1,  ad: "Artikel eksiltme", dugum: "ad.artikel-the",
    ozet: `Türkçede belirli artikel yoktur; öğrenci "the"yi tamamen atlar.`,
    yanlis: `Government should protect its citizens.`, dogru: `The government should protect its citizens.` },
  { id: 2,  ad: "the fazlalığı", dugum: "ad.artikel-sifir",
    ozet: `Genelleme yaparken gereksiz "the" eklenir. Türkçede çoğul genelleme yalın gelir, öğrenci bunu telafi etmeye çalışır.`,
    yanlis: `The wars are rarely caused by a single factor.`, dogru: `Wars are rarely caused by a single factor.` },
  { id: 3,  ad: "Present perfect ↔ past simple karışması", dugum: "zaman.pp-vs-past",
    ozet: `Türkçe -di ve -miş ayrımı İngilizce zaman/görünüş ayrımına oturmaz.`,
    yanlis: `The Cold War has ended in 1991.`, dogru: `The Cold War ended in 1991.` },
  { id: 4,  ad: "Geniş zaman ↔ şimdiki zaman karışması", dugum: "zaman.present-simple",
    ozet: `Türkçe -iyor eki hem anlık hem alışkanlık bildirebilir; İngilizce ikisini ayırır.`,
    yanlis: `I am reading three books every month.`, dogru: `I read three books every month.` },
  { id: 5,  ad: "Süre ifadesinde zaman hatası", dugum: "zaman.present-perfect-cont",
    ozet: `"5 yıldır çalışıyorum" Türkçede şimdiki zamandır; İngilizce present perfect ister.`,
    yanlis: `I am studying English for five years.`, dogru: `I have been studying English for five years.` },
  { id: 6,  ad: "Hâl eki ↔ edat körü körüne eşleme", dugum: "edat.hal-eki-tuzagi",
    ozet: `-de için hep "in", -e için hep "to" seçilir. İngilizce edat seçimi fiile bağlıdır, hâle değil.`,
    yanlis: `I attended to the conference.`, dogru: `I attended the conference.` },
  { id: 7,  ad: "Fiile bağımlı edat unutma", dugum: "edat.fiil-bagimli",
    ozet: `Türkçede ek fiile yapışıktır ve görünmez; İngilizcede ayrı bir sözcük olarak hatırlanması gerekir.`,
    yanlis: `The crisis resulted a collapse.`, dogru: `The crisis resulted in a collapse.` },
  { id: 8,  ad: "İlgi cümlesini isimden önce kurma", dugum: "yc.ilgi-tanimlayan",
    ozet: `Türkçe ortacı isimden önce koyar (kazanan aday); İngilizce sonra koyar.`,
    yanlis: `The winning the election candidate resigned.`, dogru: `The candidate who won the election resigned.` },
  { id: 9,  ad: "Tanımlayan / tanımlamayan ayrımının kaybı", dugum: "yc.ilgi-tanimlamayan",
    ozet: `Türkçede virgülle işaretlenen bu anlam farkı yoktur; öğrenci virgülü rastgele koyar.`,
    yanlis: `The treaty, which was signed in 1919, is the Treaty of Versailles.`, dogru: `The treaty that was signed in 1919 shaped the interwar order.` },
  { id: 10, ad: "Dolaylı anlatımda zaman geriletmeme", dugum: "yc.zaman-uyumu",
    ozet: `Türkçe aktarımda zaman değişmez; İngilizce ana fiil geçmişse yan cümleyi geriletir.`,
    yanlis: `He said that he is ready to negotiate.`, dogru: `He said that he was ready to negotiate.` },
  { id: 11, ad: "3. tekil -s düşmesi", dugum: "zaman.present-simple",
    ozet: `Türkçe özne-yüklem uyumu ekle sağlanır ve öğrenci İngilizcede bunu önemsiz sanır.`,
    yanlis: `The state protect its own interests.`, dogru: `The state protects its own interests.` },
  { id: 12, ad: "Araya giren öbekle uyum bozulması", dugum: "iskelet.ozne-yuklem",
    ozet: `Uzun ad öbeğinde öğrenci en yakın isme uyum sağlar.`,
    yanlis: `The impact of these policies are severe.`, dogru: `The impact of these policies is severe.` },
  { id: 13, ad: "Sayılamaz adı çoğullama", dugum: "ad.sayilabilir",
    ozet: `Türkçede "bilgiler, tavsiyeler" doğaldır; İngilizcede information/advice çoğullanmaz.`,
    yanlis: `The report contains many informations.`, dogru: `The report contains a great deal of information.` },
  { id: 14, ad: "Gerund / mastar karışması", dugum: "fiil.gerund-mastar",
    ozet: `Türkçede -mek ve -me ayrımı fiile göre değişmez; İngilizcede fiil hangisini alacağını belirler.`,
    yanlis: `I suggest to increase the defence budget.`, dogru: `I suggest increasing the defence budget.` },
  { id: 15, ad: "Sıfat / zarf karışması", dugum: "nitel.zarf-bicim",
    ozet: `Türkçede aynı sözcük hem sıfat hem zarf olabilir (güzel konuştu); İngilizce -ly ister.`,
    yanlis: `He explained the theory very clear.`, dogru: `He explained the theory very clearly.` },
  { id: 16, ad: "-ing / -ed sıfat karışması", dugum: "nitel.ing-ed-sifat",
    ozet: `Türkçede kaynak ile deneyimleyen aynı ekle işaretlenmez; öğrenci ikisini karıştırır.`,
    yanlis: `I am boring with this debate.`, dogru: `I am bored with this debate.` },
  { id: 17, ad: "Virgül yanlışı (comma splice)", dugum: "mek.comma-splice",
    ozet: `Türkçe iki bağımsız cümleyi virgülle bağlayabilir; İngilizce bağlayamaz.`,
    yanlis: `The theory is dated, it is still useful.`, dogru: `The theory is dated, but it is still useful.` },
  { id: 18, ad: "var/yok yapısının aktarımı", dugum: "iskelet.there-is",
    ozet: `"Bir sorun var" doğrudan "It is a problem" diye çevrilir.`,
    yanlis: `It is several reasons for this outcome.`, dogru: `There are several reasons for this outcome.` },
  { id: 19, ad: "Öznenin düşürülmesi", dugum: "iskelet.ozne-zorunlulugu",
    ozet: `Türkçe özneyi ekle taşıdığı için düşürebilir; İngilizce cümlesi öznesiz olamaz.`,
    yanlis: `Is difficult to predict the outcome.`, dogru: `It is difficult to predict the outcome.` },
  { id: 20, ad: "Sözcüğü sözcüğüne deyim çevirisi", dugum: "kayit.akademik-sozcuk",
    ozet: `Türkçe eşdizim İngilizceye taşınır: "karar almak" → take a decision.`,
    yanlis: `The council took a decision to intervene.`, dogru: `The council made a decision to intervene.` }
];

/* ─── MÜFREDAT ─────────────────────────────────────────────────────
   Alan kısaltmaları:
   id, a=aile, tr/en=ad, on=önkoşullar, z=zorluk(1-5), l1=girişim şiddeti(0-3)
   k=kural, t=Türkçe tuzağı, m=mantık, an=analoji,
   ex=örnekler [{en,tr,f}]  ([[...]] işaretli parça altınla vurgulanır)
   kp=karşıt çift {d,y,f}, sh=sık hatalar [{y,d}], ak=akademik not
   ─────────────────────────────────────────────────────────────── */

export const D_A = [

/* ═══ 1. CÜMLE İSKELETİ ═══ */
{ id: "iskelet.svo", a: "iskelet", tr: "Temel sözdizim: Özne–Yüklem–Nesne", en: "Basic word order (SVO)", on: [], z: 1, l1: 3,
  m: `İngilizcede sözcüğün ne iş yaptığını konumu belirler. Türkçede bunu ekler belirler. Bu tek fark, Türk öğrencinin yaptığı hataların yarısının kaynağıdır: Türkçede sözcükleri istediğin sıraya koyabilirsin, çünkü ekler kimin kime ne yaptığını taşır. İngilizcede ek yok — sıra bozulursa anlam bozulur.`,
  an: `Türkçe, valizin içine etiket koymak gibidir: valizi nereye koyarsan koy, etiket hangi valiz olduğunu söyler. İngilizce, bagaj bandı gibidir: sıra bozulursa valizler karışır.`,
  k: `Özne + Yüklem + Nesne. Bu üçlünün sırası neredeyse hiç değişmez. Zarf ve tümleçler bu iskeletin etrafına eklenir, arasına değil.`,
  t: `Türkçe SOV dizilidir (Ben kitabı okudum). Öğrenci nesneyi fiilden önce koymaya veya özneyi cümle içinde gezdirmeye eğilimlidir. Ayrıca Türkçede "Kitabı ben okudum" vurgulu bir cümledir; İngilizcede aynı etkiyi sıra değiştirerek değil, yarmalı yapıyla (It was I who read it) elde edersin.`,
  ex: [
    { en: `[[The Security Council]] [[adopted]] [[the resolution]].`, tr: `[[Güvenlik Konseyi]] [[kararı]] [[kabul etti]].`, f: `İngilizcede nesne fiilden sonra, Türkçede önce gelir.` },
    { en: `Realists [[view]] the state [[as]] the primary actor.`, tr: `Realistler devleti birincil aktör [[olarak görür]].`, f: `Türkçede fiil sona atılır; İngilizcede özneden hemen sonra gelir.` },
    { en: `In 1945, [[the great powers]] [[created]] a new order.`, tr: `1945'te [[büyük güçler]] yeni bir düzen [[kurdu]].`, f: `Zaman tümleci iskeletin dışında; başa veya sona gelebilir, ortasına giremez.` }
  ],
  kp: { d: `The alliance rapidly lost its coherence.`, y: `The alliance its coherence rapidly lost.`, f: `Nesne fiilden sonra gelmek zorundadır.` },
  sh: [ { y: `Turkey NATO in 1952 joined.`, d: `Turkey joined NATO in 1952.` },
        { y: `The theory realist assumptions rejects.`, d: `The theory rejects realist assumptions.` } ],
  ak: `IB yazımında en sık görülen okunabilirlik sorunu, uzun özne öbeğinin fiili çok uzaklaştırmasıdır. Özne ile fiil arasına on sözcükten fazla girmesin.` },

{ id: "iskelet.ozne-zorunlulugu", a: "iskelet", tr: "Öznenin zorunluluğu", en: "Obligatory subject", on: ["iskelet.svo"], z: 2, l1: 3,
  m: `Türkçe "pro-drop" bir dildir: fiil eki özneyi taşıdığı için özneyi söylemek zorunda değilsin. İngilizcede fiil eki bu bilgiyi taşımaz, bu yüzden her cümlenin görünür bir öznesi olmak zorundadır — anlamı olmasa bile.`,
  an: `Türkçe fiil, üstünde adres yazan bir zarf gibidir. İngilizce fiil boş bir zarftır; adresi ayrıca yazmalısın. Yazacak gerçek bir adres yoksa bile "boş" yazarsın: it, there.`,
  k: `Her sonlu cümlede özne bulunur. Gerçek bir özne yoksa boş özne kullanılır: "it" (durum/hava/mesafe/mastar öznesi) veya "there" (varoluş).`,
  t: `"Zor." veya "Yağmur yağıyor." Türkçede tam cümledir. Öğrenci "Is difficult", "Is raining", "Is important to note that…" yazar. Özellikle mastar öznesi taşındığında: "To predict the outcome is difficult" yerine "It is difficult to predict the outcome" doğaldır.`,
  ex: [
    { en: `[[It]] is difficult to predict the outcome of the negotiation.`, tr: `Müzakerenin sonucunu öngörmek zor[[dur]].`, f: `Türkçede "-dur" eki yeterli; İngilizce boş bir özne (it) ister.` },
    { en: `[[There]] are three competing explanations for the crisis.`, tr: `Krizin üç rakip açıklaması [[var]].`, f: `Türkçedeki "var" bir yüklemdir; İngilizcede özne + fiil gerekir.` },
    { en: `[[It]] became clear that the coalition would not survive.`, tr: `Koalisyonun ayakta kalamayacağı açık hale geldi.`, f: `Türkçede uzun ad cümlesi özne olur; İngilizce onu sona atıp başa "it" koyar.` }
  ],
  kp: { d: `It is widely accepted that democracies rarely fight one another.`, y: `Is widely accepted that democracies rarely fight one another.`, f: `Özne olmadan cümle olmaz; anlamsız da olsa "it" gerekir.` },
  sh: [ { y: `Is necessary to reconsider the strategy.`, d: `It is necessary to reconsider the strategy.` },
        { y: `Seems that the treaty will collapse.`, d: `It seems that the treaty will collapse.` } ],
  ak: `Akademik yazımda ağır özneyi sona atma (extraposition) tercih edilir: "It is striking that…" yapısı, "That… is striking" yapısından çok daha okunabilirdir.` },

{ id: "iskelet.there-is", a: "iskelet", tr: "Varoluş: there is / there are", en: "Existential there", on: ["iskelet.ozne-zorunlulugu"], z: 2, l1: 3,
  m: `Türkçe varlığı bir yüklemle bildirir: var / yok. İngilizce bunun için ayrı bir yapı kurar: "there" boş bir özne olarak öne geçer, gerçek özne fiilden sonra gelir. Uyum, "there" ile değil, arkadan gelen gerçek özneyle sağlanır.`,
  an: `"There" bir kapı görevlisidir: kendisi misafir değil, misafiri duyurur. Kaç kişi geldiğini kapı görevlisi değil, arkadan gelen kalabalık belirler.`,
  k: `there + is/are + gerçek özne. Uyum arkadaki özneyle. Sıralamada ilk öğe belirleyicidir: "There is a report and three annexes."`,
  t: `Öğrenci "var" karşılığı olarak "it is" veya "we have" kullanır. Ayrıca uyumu "there" ile kurmaya çalışıp "There is many reasons" der.`,
  ex: [
    { en: `[[There are]] several reasons for the collapse of détente.`, tr: `Yumuşamanın çöküşünün birçok nedeni [[var]].`, f: `Türkçe tek sözcükle (var) hallediyor; İngilizce özne + fiil kuruyor.` },
    { en: `[[There has been]] no significant progress since March.`, tr: `Mart'tan bu yana kayda değer bir ilerleme [[olmadı]].`, f: `Türkçede olumsuzluk fiile yapışır; İngilizcede "no" ad öbeğine gelir.` }
  ],
  kp: { d: `There are two flaws in this argument.`, y: `It is two flaws in this argument.`, f: `Varoluş bildirimi "there" ister; "it" belirli bir şeye gönderme yapar.` },
  sh: [ { y: `In this theory it is a serious gap.`, d: `In this theory there is a serious gap.` },
        { y: `There is many actors involved.`, d: `There are many actors involved.` } ],
  ak: `Akademik yazımda "there is/are" fazla kullanılırsa metin zayıflar. "There are three reasons why…" yerine "Three factors explain…" daha güçlüdür.` },

{ id: "iskelet.ozne-yuklem", a: "iskelet", tr: "Özne–yüklem uyumu", en: "Subject–verb agreement", on: ["iskelet.svo"], z: 2, l1: 3,
  m: `İngilizce fiil, öznenin tekil mi çoğul mu olduğunu işaretler. Sorun kuralda değil, öznenin ne olduğunu doğru tespit etmektedir: uzun bir ad öbeğinde çekirdek isim başta, tamlayanlar arkadadır.`,
  an: `Bir trenin lokomotifini bul. Vagonların sayısı lokomotifi değiştirmez. "The impact of these policies" treninin lokomotifi "impact" — tekil.`,
  k: `Fiil, ad öbeğinin çekirdeğiyle uyuşur, araya giren tamlayanla değil. Çekirdek genellikle "of"tan önceki isimdir.`,
  t: `Türkçede uyum çoğu zaman isteğe bağlıdır ("Öğrenciler geldi" doğrudur). Öğrenci uyumu önemsiz sanır ve en yakın isme uyar.`,
  ex: [
    { en: `The [[impact]] of these policies [[is]] severe.`, tr: `Bu politikaların [[etkisi]] ağır[[dır]].`, f: `Çekirdek "impact"; "policies" sadece tamlayan.` },
    { en: `Neither of the proposals [[addresses]] the root cause.`, tr: `Önerilerin hiçbiri kök nedeni [[ele almıyor]].`, f: `"Neither" tekildir; Türkçede "hiçbiri" tekil ya da çoğul çekilebilir.` }
  ],
  kp: { d: `The number of refugees has risen sharply.`, y: `The number of refugees have risen sharply.`, f: `Çekirdek "number", tekil. (Ancak "A number of refugees have…" çoğuldur.)` },
  sh: [ { y: `The role of international institutions are contested.`, d: `The role of international institutions is contested.` },
        { y: `Each of the states have veto power.`, d: `Each of the states has veto power.` } ],
  ak: `Sınav okuyucusunun ilk fark ettiği hata türüdür ve Dil ölçütünde doğrudan bant düşürür.` },

{ id: "iskelet.zarf-yerlesim", a: "iskelet", tr: "Zarf yerleşimi", en: "Adverb placement", on: ["iskelet.svo"], z: 3, l1: 2,
  k: `Sıklık zarfları ana fiilden önce, "be" fiilinden sonra gelir. Tarz zarfları genellikle nesneden sonra. Özne ile fiil arasına nesne giremez, ama sıklık zarfı girebilir.`,
  t: `Türkçede zarf serbestçe gezer. Öğrenci "He speaks always English" veya "I like very much this film" der. İkincisi çok yaygındır: "very much" nesneden sonra gelmelidir.`,
  m: `Zarf, iskeleti bozmadan yerleşmek zorundadır. İngilizce fiil ile nesnesi arasını kutsal sayar; araya hiçbir şey giremez.`,
  an: `Fiil ile nesnesi el ele tutuşmuş iki kişidir. Zarf aralarına giremez, ancak yanlarına geçebilir.`,
  ex: [
    { en: `The council [[rarely]] intervenes in internal conflicts.`, tr: `Konsey iç çatışmalara [[nadiren]] müdahale eder.`, f: `Sıklık zarfı ana fiilden önce.` },
    { en: `I liked that film [[very much]].`, tr: `O filmi [[çok]] beğendim.`, f: `Türkçede "çok" fiilden önce; İngilizcede nesneden sonra.` }
  ],
  kp: { d: `He always arrives late to the sessions.`, y: `He arrives always late to the sessions.`, f: `Sıklık zarfı ana fiilin önüne gelir.` },
  sh: [ { y: `I like very much political philosophy.`, d: `I like political philosophy very much.` },
        { y: `She speaks fluently French.`, d: `She speaks French fluently.` } ] },

{ id: "iskelet.soru", a: "iskelet", tr: "Soru kuruluşu ve yardımcı fiil", en: "Question formation", on: ["iskelet.svo"], z: 2, l1: 2,
  k: `Yardımcı fiil özneden önce gelir: Does the treaty apply…? Yardımcı yoksa "do/does/did" getirilir ve ana fiil yalın kalır.`,
  t: `Türkçede soru bir ekle kurulur (mı/mi) ve sıra değişmez. Öğrenci "The treaty applies here?" gibi tonlamayla soru sormaya çalışır ya da "Does the treaty applies?" der.` },

{ id: "iskelet.olumsuzluk", a: "iskelet", tr: "Olumsuzluk ve do-desteği", en: "Negation and do-support", on: ["iskelet.soru"], z: 2, l1: 2,
  k: `not, yardımcı fiile eklenir. Yardımcı yoksa do/does/did getirilir: "The state does not recognise…"`,
  t: `Türkçede olumsuzluk eki fiile yapışır (-me/-ma). Öğrenci "The state not recognises" yazar veya çift olumsuzluk kurar: "doesn't recognise nothing".` },

/* ═══ 2. AD ÖBEĞİ ═══ */
{ id: "ad.sayilabilir", a: "ad-obegi", tr: "Sayılabilir ve sayılamaz adlar", en: "Countable & uncountable nouns", on: [], z: 2, l1: 3,
  m: `İngilizce isimleri iki sınıfa ayırır: parçalara ayrılıp sayılabilenler ve kütle olarak düşünülenler. Bu ayrım mantıksal değil, sözlükseldir — "furniture" sayılamaz ama "chair" sayılabilir. Ezberlenmesi gerekir çünkü Türkçede bu ayrım yoktur.`,
  an: `Su ile buz küpü gibi. Buzu sayabilirsin, suyu ölçersin. İngilizce bazı soyut kavramları su, bazılarını buz sayar ve hangisinin hangisi olduğuna kendisi karar vermiştir.`,
  k: `Sayılamaz adlar çoğul almaz, "a/an" almaz, "much/a great deal of/little" ile ölçülür. Sayılabilir adlar "many/few/a number of" ile sayılır.`,
  t: `Türkçede her isim çoğullanabilir: bilgiler, tavsiyeler, araştırmalar, kanıtlar. Öğrenci bunları doğrudan çevirir. En sık kurbanlar: information, advice, research, evidence, knowledge, progress, equipment, feedback, news, staff.`,
  ex: [
    { en: `The report contains [[a great deal of information]].`, tr: `Rapor [[çok bilgi]] içeriyor.`, f: `Türkçede "bilgiler" doğal; İngilizcede information çoğullanmaz.` },
    { en: `The committee offered [[some useful advice]].`, tr: `Komite [[birkaç yararlı tavsiye]] verdi.`, f: `"advices" yoktur; sayman gerekiyorsa "pieces of advice".` },
    { en: `There is little [[evidence]] to support this claim.`, tr: `Bu iddiayı destekleyen az [[kanıt]] var.`, f: `evidence sayılamaz; "evidences" yalnızca hukuki argoda.` }
  ],
  kp: { d: `Recent research suggests otherwise.`, y: `Recent researches suggest otherwise.`, f: `research sayılamaz; çoğul gerekiyorsa "studies".` },
  sh: [ { y: `He gave me many advices.`, d: `He gave me a lot of advice.` },
        { y: `We collected many informations.`, d: `We collected a great deal of information.` },
        { y: `The evidences are conclusive.`, d: `The evidence is conclusive.` } ],
  ak: `IB denemelerinde "researches" ve "informations" hatası çok yaygındır ve tek başına metnin dil bandını düşürür. Yerine "studies", "data", "findings" kullan.` },

{ id: "ad.cogul", a: "ad-obegi", tr: "Çoğul biçimler", en: "Plural forms", on: ["ad.sayilabilir"], z: 1, l1: 1,
  k: `-s / -es. Düzensizler ezberlenir: criteria (criterion), phenomena (phenomenon), analyses (analysis), theses, crises, hypotheses.`,
  t: `Akademik yazıda tekil-çoğul karışması sık: "this criteria", "a phenomena", "this data". Doğrusu: this criterion, a phenomenon, these data (veya kabul gören tekil kullanım).` },

{ id: "ad.artikel-a", a: "ad-obegi", tr: "Belirsiz artikel: a / an", en: "Indefinite article", on: ["ad.sayilabilir"], z: 2, l1: 3,
  m: `"A/an" iki iş yapar: adı ilk kez sahneye çıkarır ve onun bir sınıfın herhangi bir üyesi olduğunu bildirir. Türkçede "bir" bu işi kısmen görür ama zorunlu değildir; İngilizcede tekil sayılabilir bir ad artikelsiz duramaz.`,
  an: `Bir toplantıya girip birini tanıtıyorsun: "Bu bir delege." Henüz kim olduğu önemli değil, sadece kategorisi. İkinci kez andığında "the delege" olur.`,
  k: `Tekil sayılabilir ad, çıplak duramaz. İlk anma veya sınıf üyeliği → a/an. Seçim yazıya değil sese göre: an hour, a university, an MP, a European.`,
  t: `Türkçede "Delege konuştu" tam cümledir. Öğrenci artikeli tamamen atlar. Ayrıca a/an seçimini harfe göre yapar: "an university" (yanlış, /juː/ sesiyle başlar), "a hour" (yanlış, h okunmaz).`,
  ex: [
    { en: `Realism offers [[a]] pessimistic account of human nature.`, tr: `Realizm insan doğasına dair karamsar [[bir]] açıklama sunar.`, f: `Türkçede "bir" atılabilir; İngilizcede atılamaz.` },
    { en: `He is [[an]] honest broker in this dispute.`, tr: `Bu anlaşmazlıkta dürüst [[bir]] arabulucu.`, f: `honest'ta h okunmaz, sesli sesle başlar → an.` },
    { en: `She is [[a]] university lecturer.`, tr: `Üniversitede öğretim görevlisi.`, f: `university /juː/ ile başlar, ünsüz ses → a.` }
  ],
  kp: { d: `The crisis revealed a structural weakness.`, y: `The crisis revealed structural weakness.`, f: `Tekil sayılabilir ad artikelsiz kalamaz.` },
  sh: [ { y: `He made important point.`, d: `He made an important point.` },
        { y: `It took an hour and half.`, d: `It took an hour and a half.` } ] },

{ id: "ad.artikel-the", a: "ad-obegi", tr: "Belirli artikel: the", en: "Definite article", on: ["ad.artikel-a"], z: 4, l1: 3,
  m: `"The" tek bir şey söyler: "hangisinden bahsettiğimi biliyorsun." Bu bilgi ya daha önce andığımızdan gelir, ya ortak bilgiden, ya da cümlenin kendisi tekilleştirdiği için. Türkçede bu bilgi çoğu zaman belirtme hâli ekiyle (-i) veya hiç taşınmaz.`,
  an: `Bir odaya girip "Kapıyı kapat" diyorsun. Hangi kapı? Belli — odada bir tane var. "The" bu "belli"liğin sesli halidir.`,
  k: `Şu durumlarda the: (1) ikinci ve sonraki anmalar, (2) bağlamda tek olan (the sun, the government, the Cold War), (3) sonrasında tamlayanla tekilleşen (the impact of X, the fall of the Wall), (4) üstünlük ve sıra sayıları (the first, the most), (5) belirli kurumlar ve çoğul/bileşik ülke adları (the UN, the United States, the Netherlands).`,
  t: `İki yönlü hata: (a) atlama — "Government should act" (b) fazlalık — genellemede "The wars are destructive". Türkçenin belirtme ekiyle kurulan ayrımı ("Kitabı okudum" / "Kitap okudum") İngilizce artikeliyle birebir örtüşmez, öğrenci güvenilmez bir eşleme kurar.`,
  ex: [
    { en: `[[The]] government announced a new sanctions package.`, tr: `Hükümet yeni bir yaptırım paketi açıkladı.`, f: `Türkçede işaretsiz; bağlamda tek olan kurum İngilizcede the alır.` },
    { en: `[[The]] impact [[of]] the invasion was immediate.`, tr: `İşgalin etkisi ani oldu.`, f: `"of" ile tamlanan ad tekilleşir → the zorunlu.` },
    { en: `He read a paper. [[The]] paper argued for restraint.`, tr: `Bir makale okudu. Makale itidal savunuyordu.`, f: `İkinci anma → the. Türkçede aynı sözcük değişmeden tekrarlanır.` },
    { en: `[[The]] Netherlands opposed [[the]] proposal.`, tr: `Hollanda öneriye karşı çıktı.`, f: `Çoğul biçimli ülke adları the alır; Turkey, France almaz.` }
  ],
  kp: { d: `The role of the state has changed.`, y: `Role of state has changed.`, f: `Hem tamlanan ad hem bağlamda tek olan kurum the ister.` },
  sh: [ { y: `Government must protect citizens.`, d: `The government must protect its citizens.` },
        { y: `In the 1991, the USSR collapsed.`, d: `In 1991, the USSR collapsed.` },
        { y: `He studied at the Boğaziçi University.`, d: `He studied at Boğaziçi University.` } ],
  ak: `Artikel hatası IB Dil ölçütünde en sık işaretlenen hatadır çünkü her cümlede fırsat vardır. Kontrol alışkanlığı: her tekil sayılabilir adın önünde bir belirleyici olmalı — a, the, my, this, each veya çoğul/sayılamaz olmalı.` },

{ id: "ad.artikel-sifir", a: "ad-obegi", tr: "Sıfır artikel ve genelleme", en: "Zero article & generic reference", on: ["ad.artikel-the"], z: 4, l1: 3,
  m: `Bir sınıfın tamamından bahsederken İngilizce artikeli düşürür. Çünkü "the" tekilleştirir; genelleme tekilleştirmenin tersidir.`,
  an: `"The" bir spot ışığıdır: sahnede birini aydınlatır. Genelleme yaparken ışığı kapatırsın, tüm salonu kastedersin.`,
  k: `Çoğul ve sayılamaz adlarla genelleme yapılırken artikel kullanılmaz: Wars are destructive. Democracy requires institutions. Ayrıca çoğu ülke, dil, akademik disiplin, öğün ve genel yer adları artikel almaz.`,
  t: `Öğrenci artikel kuralını öğrendikten sonra aşırı düzeltmeye geçer ve genellemeye "the" ekler: "The wars", "The democracy", "The international relations". Bu, artikel atlamaktan daha göze batan bir hatadır çünkü öğrenilmiş yanlışlık izlenimi verir.`,
  ex: [
    { en: `Wars are rarely caused by a single factor.`, tr: `Savaşlar nadiren tek bir nedenle çıkar.`, f: `Genelleme → artikel yok. "The wars" belirli savaşları kasteder.` },
    { en: `Democracy requires more than elections.`, tr: `Demokrasi seçimlerden fazlasını gerektirir.`, f: `Soyut kavram genel anlamda → artikel yok.` },
    { en: `He studies [[international relations]] at university.`, tr: `Üniversitede uluslararası ilişkiler okuyor.`, f: `Akademik disiplin adları artikel almaz.` }
  ],
  kp: { d: `Sanctions rarely change a regime's behaviour.`, y: `The sanctions rarely change a regime's behaviour.`, f: `Genel iddia artikel istemez; "the sanctions" belirli bir yaptırım paketidir.` },
  sh: [ { y: `The history teaches us that empires overreach.`, d: `History teaches us that empires overreach.` },
        { y: `The nationalism is a modern phenomenon.`, d: `Nationalism is a modern phenomenon.` } ],
  ak: `Deneme girişlerinde en sık hata budur: "The globalisation has transformed…" Doğrusu "Globalisation has transformed…"` },

{ id: "ad.niceleyici", a: "ad-obegi", tr: "Niceleyiciler", en: "Quantifiers", on: ["ad.sayilabilir"], z: 2, l1: 2,
  k: `Sayılabilir: many, few, a few, a number of, several. Sayılamaz: much, little, a little, a great deal of, a large amount of. İkisi: some, any, a lot of, plenty of, most.`,
  t: `"az" ve "biraz" ayrımı Türkçede tek sözcükle kurulmaz; "few" (yetersiz derecede az) ile "a few" (birkaç, olumlu) arasındaki fark kaçırılır. "Few states supported it" ile "A few states supported it" zıt izlenimler verir.`,
  ex: [
    { en: `[[Few]] states supported the intervention.`, tr: `Müdahaleyi [[çok az]] devlet destekledi.`, f: `Olumsuz vurgu: neredeyse hiç.` },
    { en: `[[A few]] states supported the intervention.`, tr: `[[Birkaç]] devlet müdahaleyi destekledi.`, f: `Olumlu vurgu: en azından birkaç tane vardı.` }
  ],
  kp: { d: `There is little evidence for this claim.`, y: `There are little evidences for this claim.`, f: `little sayılamazla; evidence çoğullanmaz.` } },

{ id: "ad.iyelik", a: "ad-obegi", tr: "İyelik: 's ve of", en: "Possessives: 's vs of", on: [], z: 2, l1: 2,
  k: `Canlı ve kurumlarda 's: the government's decision, Turkey's foreign policy. Cansız ve soyutlarda of: the cause of the war, the impact of the policy.`,
  t: `Türkçede tek bir tamlama yapısı vardır (hükümetin kararı / savaşın nedeni), bu yüzden öğrenci ikisini rastgele seçer ve "the war's cause" gibi doğal olmayan yapılar kurar. Ayrıca çoğul iyelikte kesme yeri kaçar: "the states' interests" (devletlerin) / "the state's interests" (devletin).`,
  ex: [
    { en: `[[Turkey's]] foreign policy shifted after 2016.`, tr: `[[Türkiye'nin]] dış politikası 2016'dan sonra değişti.`, f: `Ülke ve kurumlar 's alır.` },
    { en: `The [[causes of]] the First World War remain contested.`, tr: `Birinci Dünya Savaşı'nın [[nedenleri]] tartışmalıdır.`, f: `Soyut/cansız tamlama "of" ile kurulur.` }
  ],
  sh: [ { y: `The war's causes are debated.`, d: `The causes of the war are debated.` },
        { y: `The two states relations improved.`, d: `The two states' relations improved.` } ] },

{ id: "ad.belirtec", a: "ad-obegi", tr: "Belirteçler", en: "Determiners", on: ["ad.artikel-the"], z: 2, l1: 1,
  k: `this/that/these/those, some/any, each/every, both/all. Bir ad öbeğinde yalnızca bir belirleyici olur: "the my book" olmaz.`,
  t: `Türkçede "benim bu kitabım" mümkündür; İngilizcede "my this book" olmaz, "this book of mine" denir.` },

{ id: "ad.ad-tamlamasi", a: "ad-obegi", tr: "Ad tamlamaları", en: "Noun + noun compounds", on: [], z: 3, l1: 2,
  k: `İngilizcede isim ismi niteleyebilir ve niteleyen tekil kalır: foreign policy analysis, human rights violations (istisna: çoğul zaten anlamın parçasıysa).`,
  t: `Türkçe tamlamayı ekle kurar (dış politika analizi). Öğrenci "analysis of foreign policy" ile "foreign policy analysis" arasında gereksiz uzun olanı seçer veya niteleyeni çoğullar: "sanctions policy" değil "sanction policy".` },

{ id: "ad.ozel-ad-artikel", a: "ad-obegi", tr: "Özel adlarda artikel", en: "Articles with proper nouns", on: ["ad.artikel-the"], z: 3, l1: 2,
  k: `the alır: çoğul/bileşik ülkeler (the Netherlands, the United States), kurumlar (the UN, the European Union), nehir ve okyanuslar, gazeteler. the almaz: tekil ülke, şehir, göl, dağ, üniversite adları (Boğaziçi University), cadde adları.`,
  t: `Öğrenci ya hepsine the ekler ("the Turkey") ya da hiçbirine ("United Nations decided"). Sınav yazımında "the UN", "the EU", "the US" neredeyse her zaman the alır.` },

{ id: "ad.topluluk", a: "ad-obegi", tr: "Topluluk adları ve uyum", en: "Collective nouns", on: ["iskelet.ozne-yuklem"], z: 3, l1: 1,
  k: `government, committee, team, police gibi adlar İngiliz kullanımında çoğul, Amerikan kullanımında tekil çekilebilir. Bir metin içinde tutarlı ol.`,
  t: `"police" her zaman çoğuldur: "The police have arrested…" Öğrenci "The police has" der.` },
];

export const D_B = [
/* ═══ 3. ZAMAN VE GÖRÜNÜŞ ═══ */
{ id: "zaman.present-simple", a: "zaman", tr: "Geniş zaman", en: "Present simple", on: ["iskelet.svo"], z: 1, l1: 3,
  m: `Present simple zaman değil, durum bildirir: değişmeyen gerçekler, alışkanlıklar, kalıcı özellikler. "Şu an" ile ilgisi yoktur. İngilizce, "şu an oluyor" ile "genel olarak böyledir" arasına kalın bir çizgi çeker.`,
  an: `Bir ülkenin anayasası ile o günkü haberleri gibi. Anayasa present simple, haber present continuous.`,
  k: `Değişmeyen gerçek, alışkanlık, kalıcı durum, kitap/film özeti, bilimsel iddia. 3. tekilde -s zorunludur.`,
  t: `İki hata: (a) Türkçe -iyor eki hem alışkanlığı hem anlık eylemi bildirebildiği için öğrenci alışkanlığa continuous kurar; (b) 3. tekil -s düşürülür, çünkü Türkçede uyum ekle sağlanır ve öğrenci bunu önemsiz sanır.`,
  ex: [
    { en: `The state [[protects]] its own interests above all.`, tr: `Devlet her şeyden çok kendi çıkarını korur.`, f: `3. tekil -s zorunlu.` },
    { en: `Realists [[assume]] that the system is anarchic.`, tr: `Realistler sistemin anarşik olduğunu varsayar.`, f: `Kuramsal iddia → present simple.` },
    { en: `I [[read]] two books on IR every month.`, tr: `Her ay iki UİT kitabı [[okuyorum]].`, f: `Türkçe -iyor kullanıyor ama alışkanlık; İngilizce simple ister.` }
  ],
  kp: { d: `He writes a column every week.`, y: `He is writing a column every week.`, f: `"every week" alışkanlık işaretidir → simple.` },
  sh: [ { y: `The government protect its citizens.`, d: `The government protects its citizens.` },
        { y: `I am going to the club every Friday.`, d: `I go to the club every Friday.` } ],
  ak: `Edebi eser ve film analizinde olay örgüsü daima present simple ile anlatılır: "Soysal depicts…", "The protagonist realises…"` },

{ id: "zaman.present-continuous", a: "zaman", tr: "Şimdiki zaman", en: "Present continuous", on: ["zaman.present-simple"], z: 2, l1: 3,
  k: `Şu an süren eylem, geçici durum, planlanmış yakın gelecek, değişen eğilim (is increasing).`,
  t: `Türkçe -iyor eki İngilizce present continuous'a otomatik eşitlenir sanılır. Ama "Biliyorum" → "I know", "İnanıyorum" → "I believe". Durum fiilleri continuous almaz.`,
  m: `Continuous bir eylemin devam ettiğini değil, geçici olduğunu vurgular. Kalıcılık ile geçicilik arasındaki fark bu yapıyla kurulur.`,
  an: `Kiralık ev ile mülk gibi. "I live in Istanbul" mülktür, "I am living in Ankara this year" kiralıktır.`,
  ex: [
    { en: `The balance of power [[is shifting]] towards Asia.`, tr: `Güç dengesi Asya'ya doğru kayıyor.`, f: `Süregelen değişim → continuous.` },
    { en: `I [[believe]] the argument is flawed.`, tr: `Argümanın kusurlu olduğuna inanıyorum.`, f: `Türkçe -iyor kullanıyor ama believe durum fiili → simple.` }
  ],
  kp: { d: `China's influence is growing.`, y: `China's influence grows.`, f: `Devam eden eğilim continuous ister.` } },

{ id: "zaman.durum-fiilleri", a: "zaman", tr: "Durum fiilleri", en: "Stative verbs", on: ["zaman.present-continuous"], z: 3, l1: 3,
  m: `Bazı fiiller eylem değil, durum anlatır: bilmek, inanmak, sahip olmak, istemek. Durumun süresi olmaz — zaten süreklidir. Bu yüzden İngilizce onlara continuous eklemez.`,
  an: `Bir lamba yanıyor olabilir ya da yanmıyor olabilir; "yanıyor olmakta olmak" saçmadır. Durum fiilleri böyledir.`,
  k: `know, believe, understand, want, need, own, belong, contain, consist, seem, prefer, mean, matter continuous almaz. Bazıları anlam değişince alabilir: "I think it works" (görüş) / "I am thinking about it" (zihinsel etkinlik).`,
  t: `Türkçe bu fiilleri -iyor ile çeker: biliyorum, istiyorum, anlıyorum. Öğrenci doğrudan çevirir: "I am knowing", "I am wanting", "I am understanding". Bu hata çok göze batar ve seviyeyi düşük gösterir.`,
  ex: [
    { en: `I [[understand]] what the author means.`, tr: `Yazarın ne demek istediğini anlıyorum.`, f: `Türkçe -iyor; İngilizce simple.` },
    { en: `The treaty [[consists]] of four protocols.`, tr: `Antlaşma dört protokolden oluşuyor.`, f: `consist durum fiili.` }
  ],
  kp: { d: `I am thinking about your proposal.`, y: `I am believing your proposal.`, f: `think etkinlik olabilir, believe olamaz.` },
  sh: [ { y: `I am knowing the answer.`, d: `I know the answer.` },
        { y: `This is belonging to the state.`, d: `This belongs to the state.` } ] },

{ id: "zaman.past-simple", a: "zaman", tr: "Basit geçmiş", en: "Past simple", on: ["zaman.present-simple"], z: 1, l1: 2,
  k: `Bitmiş, zamanı belirli veya bağlamdan belli olay. Tarih verilmişse daima past simple.`,
  t: `Türkçedeki -di ekiyle iyi eşleşir, asıl sorun present perfect ile sınırının nerede olduğudur (bkz. zaman.pp-vs-past). Ayrıca düzensiz fiil listesi ezber ister.` },

{ id: "zaman.past-continuous", a: "zaman", tr: "Sürekli geçmiş", en: "Past continuous", on: ["zaman.past-simple"], z: 2, l1: 1,
  k: `Geçmişte bir noktada sürmekte olan arka plan eylemi; genellikle past simple ile kesilir: "While the council was debating, the invasion began."`,
  t: `Türkçe "-iyordu" ile iyi eşleşir; asıl hata arka plan ile kesen olayın rollerini ters çevirmektir.` },

{ id: "zaman.present-perfect", a: "zaman", tr: "Present perfect", en: "Present perfect", on: ["zaman.past-simple"], z: 4, l1: 3,
  m: `Present perfect bir geçmiş zamanı değil, geçmişin şimdiye bağlanışıdır. Olayın kendisi geçmişte, önemi şimdidedir. Bu yüzden "ne zaman?" sorusuna cevap veremez — verirse past simple olur.`,
  an: `Bir yara izi gibi. Yara geçmişte açıldı, iz bugün duruyor. Present perfect izi gösterir, yaranın tarihini değil.`,
  k: `have/has + 3. hâl. Kullanım alanları: (1) sonucu bugüne uzanan olay, (2) belirsiz zamanlı deneyim (I have read Waltz), (3) şimdiye kadar devam eden dönem (since, for, so far, yet, already, recently, over the past decade).`,
  t: `Türkçede karşılığı yoktur. Öğrenci ya hiç kullanmaz (her şeye past simple der) ya da öğrendikten sonra tarihli cümlelere de uygular: "The war has ended in 1945" — bu ağır bir hatadır. Kural sabittir: belirli geçmiş zaman ifadesi varsa present perfect kullanılamaz.`,
  ex: [
    { en: `The alliance [[has expanded]] considerably since 1999.`, tr: `İttifak 1999'dan beri hayli genişledi.`, f: `since → bugüne uzanan dönem.` },
    { en: `[[Have]] you [[read]] Waltz's Theory of International Politics?`, tr: `Waltz'un kitabını okudun mu?`, f: `Belirsiz zamanlı deneyim.` },
    { en: `The government [[has not yet responded]] to the ultimatum.`, tr: `Hükümet ültimatoma henüz yanıt vermedi.`, f: `yet → present perfect işaretçisi.` }
  ],
  kp: { d: `The Cold War ended in 1991.`, y: `The Cold War has ended in 1991.`, f: `Tarih verilmiş → past simple zorunlu.` },
  sh: [ { y: `I have seen him yesterday.`, d: `I saw him yesterday.` },
        { y: `He has wrote three papers.`, d: `He has written three papers.` } ],
  ak: `Akademik yazımda literatür özeti present perfect ister: "Scholars have long argued that…" — alan hâlâ canlı olduğu için.` },

{ id: "zaman.pp-vs-past", a: "zaman", tr: "Present perfect ile past simple ayrımı", en: "Present perfect vs past simple", on: ["zaman.present-perfect"], z: 4, l1: 3,
  m: `Tek soru: zaman penceresi kapandı mı? Kapandıysa past simple. Hâlâ açıksa present perfect. "Yesterday" kapalı bir penceredir; "this week" içinde bulunduğun için açıktır.`,
  an: `Kapalı dosya / açık dosya. Dosya kapandıysa (1991, yesterday, last year) past simple. Dosya hâlâ masandaysa (since, so far, this year) present perfect.`,
  k: `Belirli geçmiş zaman ifadesi (in 1991, yesterday, two years ago, last week, when I was a child) → past simple, istisnasız. Açık dönem veya belirsiz zaman → present perfect.`,
  t: `Türkçede her ikisi de -di ile karşılanabildiği için öğrencinin ayrım için hiçbir sezgisi yoktur. Kural ezberlenmek ve zaman ifadesi işaretçi olarak kullanılmak zorundadır.`,
  ex: [
    { en: `Turkey [[joined]] NATO [[in 1952]].`, tr: `Türkiye 1952'de NATO'ya katıldı.`, f: `Tarih → kapalı pencere → past simple.` },
    { en: `Turkey [[has been]] a NATO member [[since 1952]].`, tr: `Türkiye 1952'den beri NATO üyesi.`, f: `since → açık pencere → present perfect.` },
    { en: `The council [[has met]] three times [[this month]].`, tr: `Konsey bu ay üç kez toplandı.`, f: `"this month" henüz bitmedi → açık.` },
    { en: `The council [[met]] three times [[last month]].`, tr: `Konsey geçen ay üç kez toplandı.`, f: `"last month" bitti → kapalı.` }
  ],
  kp: { d: `He has published four articles this year.`, y: `He published four articles this year.`, f: `Yıl bitmediği için pencere açık.` },
  sh: [ { y: `The Berlin Wall has fallen in 1989.`, d: `The Berlin Wall fell in 1989.` },
        { y: `I studied French since 2020.`, d: `I have studied French since 2020.` } ],
  ak: `Tarihsel olayları anlatan her IB cümlesinde bu ayrımı kontrol et. Tarih varsa past simple — bu tek kural hataların çoğunu keser.` },

{ id: "zaman.present-perfect-cont", a: "zaman", tr: "Present perfect continuous", en: "Present perfect continuous", on: ["zaman.pp-vs-past"], z: 4, l1: 3,
  m: `Geçmişte başlayıp hâlâ süren eylemin süresini vurgular. Perfect "bağlantı", continuous "süreklilik" katar; ikisi birleşince "ne zamandır sürüyor" sorusunun cevabı olur.`,
  an: `Yağmurun ne kadardır yağdığını söylemek gibi. "It has rained" yağmurun izini bildirir; "It has been raining for hours" süresini.`,
  k: `have/has been + -ing. "for" (süre) ve "since" (başlangıç noktası) ile kullanılır. Durum fiilleri bu yapıya girmez → "I have known him for years."`,
  t: `Türkçede "beş yıldır çalışıyorum" şimdiki zamandır. Öğrenci doğrudan çevirir: "I am working for five years." Bu, Türk öğrencinin en tanınabilir hatalarından biridir ve seviye izlenimini ciddi biçimde düşürür.`,
  ex: [
    { en: `I [[have been studying]] English [[for five years]].`, tr: `Beş yıldır İngilizce çalışıyorum.`, f: `Türkçe şimdiki zaman; İngilizce present perfect continuous.` },
    { en: `Tensions [[have been rising]] [[since]] the election.`, tr: `Seçimden bu yana gerginlik artıyor.`, f: `since → başlangıç noktası.` },
    { en: `He [[has known]] the ambassador for years.`, tr: `Büyükelçiyi yıllardır tanıyor.`, f: `know durum fiili → continuous almaz.` }
  ],
  kp: { d: `She has been working on the thesis since March.`, y: `She is working on the thesis since March.`, f: `since ile şimdiki zaman kullanılamaz.` },
  sh: [ { y: `I am living here since 2019.`, d: `I have been living here since 2019.` },
        { y: `He is teaching for ten years.`, d: `He has been teaching for ten years.` } ],
  ak: `Kişisel deneyim anlatan IB metin türlerinde (blog, mektup) bu yapı kaçınılmazdır ve hatası hemen görülür.` },

{ id: "zaman.past-perfect", a: "zaman", tr: "Past perfect", en: "Past perfect", on: ["zaman.past-simple"], z: 3, l1: 2,
  m: `İki geçmiş olay varsa ve hangisinin önce olduğu önemliyse, önceki olay past perfect ile geriye itilir. Sıralama zaten açıksa (before/after ile) zorunlu değildir.`,
  an: `Bir fotoğrafın arka planı gibi. Past simple ön plan, past perfect arka plan.`,
  k: `had + 3. hâl. Geçmişteki bir andan daha önce olmuş olayı işaretler.`,
  t: `Türkçe "-mişti" ile iyi eşleşir ama öğrenci genellikle hiç kullanmaz ve iki olayı da past simple ile yazar; anlatım sırası bulanıklaşır.`,
  ex: [
    { en: `By the time the council convened, the invasion [[had already begun]].`, tr: `Konsey toplandığında işgal çoktan başlamıştı.`, f: `Daha önceki olay geriye itiliyor.` },
    { en: `He realised that he [[had misread]] the treaty.`, tr: `Antlaşmayı yanlış okuduğunu fark etti.`, f: `Fark etme sonra, yanlış okuma önce.` }
  ],
  kp: { d: `The war had ended before the treaty was signed.`, y: `The war ended before the treaty had been signed.`, f: `Perfect, önce olan olaya gelir.` } },

{ id: "zaman.past-perfect-cont", a: "zaman", tr: "Past perfect continuous", en: "Past perfect continuous", on: ["zaman.past-perfect"], z: 3, l1: 1,
  k: `had been + -ing. Geçmişteki bir ana kadar süregelmiş eylem: "Negotiations had been dragging on for months before the breakthrough."`,
  t: `Present perfect continuous'un geçmişe kaydırılmış hâli; aynı Türkçe girişim burada da geçerlidir.` },

{ id: "zaman.gelecek-will-going", a: "zaman", tr: "will ve be going to", en: "will vs be going to", on: ["zaman.present-simple"], z: 3, l1: 2,
  m: `will konuşma anında alınan karar, tahmin veya söz verir. be going to önceden verilmiş kararı veya şimdiki kanıta dayanan tahmini bildirir.`,
  an: `will bir el kaldırmadır, be going to takvimde işaretli bir gündür.`,
  k: `Anlık karar/söz/tahmin → will. Planlanmış niyet veya görünür kanıt → be going to. Kesin program → present simple (The session starts at nine).`,
  t: `Türkçe "-ecek" eki her ikisini de karşılar, bu yüzden öğrenci ayrımı hiç yapmaz ve her şeye will kullanır. Anlam kaybı büyük değildir ama doğallık kaybı fark edilir.`,
  ex: [
    { en: `Look at the polls — the incumbent [[is going to]] lose.`, tr: `Anketlere bak, iktidar kaybedecek.`, f: `Görünür kanıta dayalı tahmin.` },
    { en: `I [[will]] send you the resolution draft tonight.`, tr: `Karar taslağını bu akşam göndereceğim.`, f: `Konuşma anında verilen söz.` }
  ] },

{ id: "zaman.gelecek-diger", a: "zaman", tr: "Gelecekte süreklilik ve tamamlanma", en: "Future continuous & perfect", on: ["zaman.gelecek-will-going"], z: 3, l1: 1,
  k: `will be + -ing: gelecekte bir anda sürüyor olacak. will have + 3. hâl: gelecekteki bir andan önce tamamlanmış olacak.`,
  t: `Türkçede "yapıyor olacağım / yapmış olacağım" nadiren kullanılır, öğrenci bu yapıları hiç üretmez ve metni tekdüzeleşir.` },

{ id: "zaman.anlati-zamanlari", a: "zaman", tr: "Anlatı zamanları", en: "Narrative tenses", on: ["zaman.past-perfect", "zaman.past-continuous"], z: 4, l1: 1,
  k: `Bir olay anlatısında dört zaman birlikte çalışır: past simple (olay zinciri), past continuous (arka plan), past perfect (öncesi), past perfect continuous (öncesinde süregelen).`,
  t: `Öğrenci tüm anlatıyı past simple ile yazar; metin düz ve amatör okunur. IB Paper 1'in anlatı içeren türlerinde (blog, günlük, hatıra) bu farkı yaratan başlıca unsurdur.` },

{ id: "zaman.tarihsel-simdiki", a: "zaman", tr: "Tarihsel ve eleştirel şimdiki zaman", en: "Historical & critical present", on: ["zaman.present-simple"], z: 3, l1: 1,
  k: `Edebiyat, film analizi ve kuram tartışmasında olay örgüsü ve yazarın iddiası present simple ile anlatılır: "Waltz argues…", "The protagonist confronts…"`,
  t: `Öğrenci roman veya film özetini past simple ile yazar; bu Türkçede doğaldır ama İngilizce akademik yazımda yanlış gelenektir.` },
];

export const D_C = [
/* ═══ 4. KİP ═══ */
{ id: "kip.yetenek", a: "kip", tr: "Yetenek", en: "Ability", on: [], z: 1, l1: 1,
  k: `can / could / be able to. Geçmişte tek seferlik başarı için "was able to" veya "managed to" — "could" kullanılmaz.`,
  t: `Türkçedeki -ebil eki hem yetenek hem olasılık bildirir; öğrenci ikisini ayırmaz. "He could solve it" (genel yetenek) ile "He was able to solve it" (o gün çözdü) farkı kaçırılır.` },

{ id: "kip.izin-rica", a: "kip", tr: "İzin ve rica", en: "Permission & requests", on: ["kip.yetenek"], z: 2, l1: 1,
  k: `can (gündelik) < could / may (resmî) < would you mind + -ing (en resmî).`,
  t: `IB Paper 1'de resmî e-posta yazarken öğrenci gündelik kipe düşer: "Can you send me…" yerine "I would be grateful if you could send…"` },

{ id: "kip.zorunluluk", a: "kip", tr: "Zorunluluk ve tavsiye", en: "Obligation & advice", on: [], z: 2, l1: 2,
  m: `must içeriden gelen, konuşanın kendi koyduğu zorunluluktur. have to dışarıdan gelen, kural veya koşulun dayattığı zorunluluktur. should tavsiyedir, zorunluluk değil.`,
  an: `must kendi kendine verdiğin sözdür; have to trafik levhasıdır.`,
  k: `must → konuşanın otoritesi. have to → dış zorunluluk. should/ought to → tavsiye. Geçmişte must yoktur, "had to" kullanılır.`,
  t: `Türkçe -meli/-malı eki hepsini birden karşılar. Öğrenci bu üçünü rastgele seçer ve akademik metinde aşırı "must" kullanarak sertleşir.`,
  ex: [
    { en: `Delegates [[must]] submit resolutions by Friday.`, tr: `Delegeler kararları Cuma'ya kadar sunmalı.`, f: `Kurumun koyduğu kural.` },
    { en: `The analysis [[should]] account for domestic factors.`, tr: `Analiz iç etkenleri hesaba katmalı.`, f: `Tavsiye; must burada fazla sert olurdu.` }
  ],
  ak: `Akademik yazıda "must" iddiayı dogmatikleştirir. "should", "needs to", "would benefit from" daha ölçülüdür.` },

{ id: "kip.olumsuz-zorunluluk", a: "kip", tr: "mustn't ile don't have to", en: "mustn't vs don't have to", on: ["kip.zorunluluk"], z: 3, l1: 3,
  m: `Bu iki yapı zıt anlamlıdır. mustn't yasaktır. don't have to gerek yokluğudur. Türkçede ikisi de "-mek zorunda değil" ya da "-memeli" ile karışabilir.`,
  an: `mustn't kırmızı ışıktır; don't have to yeşil ama isteğe bağlı bir yoldur.`,
  k: `mustn't = yasak. don't have to / needn't = gereksiz.`,
  t: `Öğrenci "You mustn't come" diyerek "gelmene gerek yok" demek ister ama "gelmen yasak" demiş olur. Ciddi anlam hatasıdır.`,
  ex: [
    { en: `Observers [[mustn't]] intervene in the debate.`, tr: `Gözlemciler tartışmaya müdahale [[edemez]].`, f: `Yasak.` },
    { en: `You [[don't have to]] cite the entire source.`, tr: `Kaynağın tamamını alıntılamak [[zorunda değilsin]].`, f: `Gereksiz, yasak değil.` }
  ],
  kp: { d: `You don't have to attend the session.`, y: `You mustn't attend the session.`, f: `İlki serbestlik, ikincisi yasak.` } },

{ id: "kip.cikarim", a: "kip", tr: "Çıkarım", en: "Deduction", on: ["kip.zorunluluk"], z: 3, l1: 2,
  k: `must be (kesine yakın olumlu) / might-may-could be (olasılık) / can't be (kesine yakın olumsuz). Olumsuz çıkarımda "mustn't" değil "can't" kullanılır.`,
  t: `Türkçe "olmalı / olabilir / olamaz" ile iyi eşleşir; asıl hata olumsuz çıkarımda "mustn't be" demektir.`,
  ex: [
    { en: `The leak [[must have come]] from within the ministry.`, tr: `Sızıntı bakanlık içinden gelmiş olmalı.`, f: `Kesine yakın çıkarım.` },
    { en: `That [[can't be]] the original document.`, tr: `Bu orijinal belge olamaz.`, f: `Olumsuz çıkarımda can't.` }
  ] },

{ id: "kip.gecmis-kip", a: "kip", tr: "Geçmiş kipler", en: "Past modals", on: ["kip.cikarim"], z: 4, l1: 3,
  m: `Kip + have + 3. hâl yapısı, geçmiş hakkında bugünden yorum yapmanı sağlar: çıkarım, pişmanlık, eleştiri.`,
  an: `Bir maçın tekrarını izlerken "orada pas atmalıydı" demek gibi. Olay bitti, yorum şimdi.`,
  k: `must have (kesin çıkarım) / might have (olasılık) / can't have (olamaz) / should have (yapmalıydı, yapmadı) / needn't have (yaptı ama gerek yoktu) / could have (yapabilirdi, yapmadı).`,
  t: `Türkçede "-meliydi" tek kalıpla karşılanır; öğrenci "should have" dışındakileri hiç üretmez. Ayrıca yapının kendisi zordur: "should have went" gibi biçim hataları sıktır — üçüncü hâl gelmelidir.`,
  ex: [
    { en: `The alliance [[should have acted]] earlier.`, tr: `İttifak daha erken harekete geçmeliydi.`, f: `Yapmadı; eleştiri.` },
    { en: `He [[must have read]] the memo before the meeting.`, tr: `Toplantıdan önce notu okumuş olmalı.`, f: `Kanıta dayalı çıkarım.` },
    { en: `They [[needn't have escalated]] the crisis.`, tr: `Krizi tırmandırmalarına gerek yoktu.`, f: `Yaptılar ama gereksizdi.` }
  ],
  kp: { d: `They should have anticipated the backlash.`, y: `They should anticipate the backlash.`, f: `Geçmişte olmuş bir eksiklik için have + 3. hâl gerekir.` },
  sh: [ { y: `He must have went there.`, d: `He must have gone there.` },
        { y: `We should have to warn them.`, d: `We should have warned them.` } ],
  ak: `Değerlendirme ve eleştiri gerektiren IB görevlerinde (öneri raporu, editöre mektup) bu yapı olmadan ölçütlerin üst bandına çıkmak zordur.` },

{ id: "kip.yari-kip", a: "kip", tr: "Yarı kipler", en: "Semi-modals", on: ["kip.zorunluluk"], z: 3, l1: 1,
  k: `ought to, had better (uyarı içerir), be supposed to (beklenti), be to (resmî talimat), be bound to (kaçınılmaz).`,
  t: `Öğrenci bunları hiç kullanmaz; metin kip çeşitliliği açısından fakir kalır. "had better" tavsiye değil uyarıdır — yanlış bağlamda sert düşer.` },

{ id: "kip.used-to", a: "kip", tr: "used to, would ve be used to", en: "used to / would / be used to", on: ["zaman.past-simple"], z: 3, l1: 3,
  m: `Üç ayrı yapı, birbirine benzeyen biçimler. used to + yalın fiil: artık olmayan geçmiş alışkanlık. would + yalın fiil: geçmişteki yinelenen eylem (durum bildiremez). be used to + -ing: alışkın olmak, şimdiki durum.`,
  an: `used to eski bir fotoğraftır. be used to ise ayakkabının ayağına oturmasıdır.`,
  k: `used to do = eskiden yapardı. be/get used to doing = yapmaya alışkın/alışmak.`,
  t: `Türkçe "alışmak" ile "eskiden yapardım" arasında biçimsel benzerlik olmadığından öğrenci bu üçünü karıştırır ve "I am used to work here" der (doğrusu: working).`,
  ex: [
    { en: `The council [[used to meet]] twice a year.`, tr: `Konsey eskiden yılda iki kez toplanırdı.`, f: `Artık öyle değil.` },
    { en: `I [[am used to writing]] under time pressure.`, tr: `Zaman baskısı altında yazmaya alışkınım.`, f: `be used to + -ing.` }
  ],
  kp: { d: `I am used to speaking in public.`, y: `I am used to speak in public.`, f: `Buradaki "to" edattır; ardından -ing gelir.` } },

{ id: "kip.akademik-kip", a: "kip", tr: "Akademik ihtiyat ve kip", en: "Modality in academic hedging", on: ["kip.cikarim"], z: 4, l1: 2,
  k: `may, might, could, tend to, appear to, suggest, is likely to — iddiayı mutlaklıktan kurtarır.`,
  t: `Türkçe akademik yazım daha kesin iddialara izin verir; öğrenci "This proves that…" gibi savunulamaz ifadeler kurar. İngilizce akademik gelenek ihtiyat ister: "This suggests that…"` },

/* ═══ 5. ÇATI ═══ */
{ id: "cati.edilgen-temel", a: "cati", tr: "Edilgen çatı", en: "The passive", on: ["iskelet.svo"], z: 3, l1: 2,
  m: `Edilgen, eylemi yapanı sahneden çeker ve etkileneni öne alır. Kim yaptığı bilinmiyorsa, önemsizse veya kasten gizleniyorsa kullanılır.`,
  an: `Bir sahne ışığı gibi: ışığı failden alıp nesneye çevirirsin.`,
  k: `be + 3. hâl. Fail gerekiyorsa "by" ile eklenir. Yalnızca geçişli fiiller edilgen olur.`,
  t: `Türkçede edilgen ekle kurulur (-il/-in) ve fail çoğu zaman hiç anılmaz. Öğrenci "by" öbeğini gereksiz yere ekler ya da geçişsiz fiili edilgen yapar: "The war was happened" (yanlış).`,
  ex: [
    { en: `The resolution [[was adopted]] without amendment.`, tr: `Karar değişiklik yapılmadan kabul edildi.`, f: `Fail önemsiz → düşürüldü.` },
    { en: `The treaty [[was signed]] [[by]] all five powers.`, tr: `Antlaşma beş gücün hepsi tarafından imzalandı.`, f: `Fail bilgi taşıyorsa by ile verilir.` }
  ],
  sh: [ { y: `The revolution was occurred in 1789.`, d: `The revolution occurred in 1789.` },
        { y: `The problem was consisted of two parts.`, d: `The problem consisted of two parts.` } ] },

{ id: "cati.edilgen-zamanlar", a: "cati", tr: "Zamanlara göre edilgen", en: "Passive across tenses", on: ["cati.edilgen-temel"], z: 3, l1: 1,
  k: `is done / is being done / was done / was being done / has been done / had been done / will be done / must be done.`,
  t: `Öğrenci yardımcı fiil zincirini kısaltır: "has been adopt", "will be adopt". Üçüncü hâl her zaman gerekir.` },

{ id: "cati.kisisiz-edilgen", a: "cati", tr: "Kişisiz edilgen", en: "Impersonal passive", on: ["cati.edilgen-temel"], z: 4, l1: 2,
  m: `Bir görüşü kimseye atfetmeden aktarmak için kullanılır. Akademik yazımın temel araçlarındandır.`,
  an: `"Söylenir ki…" demek gibi. Kaynağı vermeden aktarırsın.`,
  k: `İki kalıp: It is believed/argued/assumed that + cümle. veya Özne + is believed/said to + mastar.`,
  t: `Türkçedeki "-dığı düşünülmektedir" yapısına karşılık gelir ama öğrenci bunu "People think that…" ile karşılar; metin akademik kayıttan düşer.`,
  ex: [
    { en: `[[It is widely argued that]] institutions mitigate anarchy.`, tr: `Kurumların anarşiyi yumuşattığı yaygın olarak savunulur.`, f: `Kaynak belirtmeden aktarım.` },
    { en: `The policy [[is thought to have]] failed.`, tr: `Politikanın başarısız olduğu düşünülüyor.`, f: `İkinci kalıp: özne + is thought to.` }
  ],
  ak: `IB denemesinde "I think" yerine bu yapıya geçmek, Kavramsal Anlayış ölçütünde doğrudan fark yaratır.` },

{ id: "cati.ettirgen", a: "cati", tr: "Ettirgen yapı", en: "Causative", on: ["cati.edilgen-temel"], z: 4, l1: 3,
  m: `Bir işi başkasına yaptırdığını anlatır. İngilizce bunun için ayrı bir kalıp kurar; Türkçe ise fiile bir ek takar.`,
  an: `Saç kestirmek gibi. Sen kesmiyorsun ama işlem senin adına yapılıyor.`,
  k: `have/get + nesne + 3. hâl (iş yaptırma). have/make/let + kişi + yalın fiil (birine iş yaptırma). get + kişi + to + fiil (ikna ederek).`,
  t: `Türkçede ettirgenlik tek bir ekle kurulur (-tir/-dir): yaptırdım, kestirdim. Öğrenci bu eke doğrudan bir İngilizce fiil arar ve "I made cut my hair" gibi yapılar kurar.`,
  ex: [
    { en: `The ministry [[had the report translated]] overnight.`, tr: `Bakanlık raporu bir gecede çevirtti.`, f: `Türkçe -tir eki; İngilizce have + nesne + 3. hâl.` },
    { en: `He [[made the delegates revise]] the draft.`, tr: `Delegelere taslağı revize ettirdi.`, f: `make + kişi + yalın fiil.` }
  ],
  kp: { d: `I had my essay proofread.`, y: `I proofread my essay.`, f: `İlkinde başkası yaptı, ikincisinde sen.` },
  sh: [ { y: `I made translate the document.`, d: `I had the document translated.` } ] },

{ id: "cati.get-edilgen", a: "cati", tr: "get-edilgen", en: "get-passive", on: ["cati.edilgen-temel"], z: 3, l1: 1,
  k: `get + 3. hâl: beklenmedik veya olumsuz olayları anlatan, daha gündelik bir edilgen: "The proposal got rejected."`,
  t: `Resmî IB metinlerinde kullanılmamalı; blog veya kişisel anlatı türlerinde doğal düşer. Öğrenci ya hiç bilmez ya da resmî metinde kullanır.` },

{ id: "cati.akademik-edilgen", a: "cati", tr: "Edilgenin akademik işlevi", en: "Passive in academic writing", on: ["cati.kisisiz-edilgen"], z: 4, l1: 1,
  k: `Edilgen, yöntem ve süreç anlatımında özneyi silerek nesnelleştirir. Ancak aşırı kullanımı metni ağırlaştırır ve sorumluyu gizler.`,
  t: `Öğrenci "akademik = edilgen" sanır ve her cümleyi edilgen kurar. Ölçü: fail bilgi taşıyorsa etken yaz.` },
];

export const D_D = [
/* ═══ 6. FİİL ÖRÜNTÜLERİ ═══ */
{ id: "fiil.gerund-mastar", a: "fiil-oruntu", tr: "Gerund ve mastar seçimi", en: "Gerund vs infinitive", on: ["iskelet.svo"], z: 4, l1: 3,
  m: `Bir fiilden sonra başka bir fiil geldiğinde, ikincisinin biçimini birinci fiil belirler. Bunun mantıklı bir kuralı yoktur; sözlüksel bir gerçektir ve öğrenilmesi gerekir. Kabaca: mastar geleceğe ve niyete, gerund gerçekleşmiş veya soyut eyleme bakar.`,
  an: `Bir prizle fiş gibi. Her fiilin kendi priz tipi vardır; zorlayamazsın, uygun fişi takarsın.`,
  k: `Mastar alanlar: want, decide, hope, agree, refuse, manage, offer, promise, fail, tend, seem, afford. Gerund alanlar: suggest, avoid, consider, deny, recommend, involve, risk, mind, enjoy, admit, postpone, resist. Her edattan sonra daima gerund.`,
  t: `Türkçede iki fiil arka arkaya gelirken -mek/-meyi ayrımı fiile göre değişmez ve öğrenci sezgisiyle seçer. En yaygın hata: "suggest to do" ve "recommend to do". İkisi de gerund alır.`,
  ex: [
    { en: `I [[suggest increasing]] the defence budget.`, tr: `Savunma bütçesinin artırılmasını öneriyorum.`, f: `suggest gerund alır; "suggest to increase" yanlıştır.` },
    { en: `The council [[decided to postpone]] the vote.`, tr: `Konsey oylamayı ertelemeye karar verdi.`, f: `decide mastar alır.` },
    { en: `They [[avoided taking]] a public position.`, tr: `Açık tavır almaktan kaçındılar.`, f: `avoid gerund alır.` }
  ],
  kp: { d: `He recommended revising the draft.`, y: `He recommended to revise the draft.`, f: `recommend + gerund.` },
  sh: [ { y: `I suggest to build a new system.`, d: `I suggest building a new system.` },
        { y: `They avoided to answer the question.`, d: `They avoided answering the question.` },
        { y: `We look forward to hear from you.`, d: `We look forward to hearing from you.` } ],
  ak: `"Look forward to" ve "be committed to" kalıplarındaki "to" edattır, mastar işareti değil. Resmî e-postada bu hata çok sık ve çok görünürdür.` },

{ id: "fiil.anlam-degistiren", a: "fiil-oruntu", tr: "Anlamı değişen fiiller", en: "Meaning-changing verbs", on: ["fiil.gerund-mastar"], z: 4, l1: 2,
  k: `stop doing (bırakmak) / stop to do (yapmak için durmak). remember doing (yaptığını hatırlamak) / remember to do (yapmayı unutmamak). try doing (deneme olarak) / try to do (çabalamak). regret doing (pişmanlık) / regret to say (üzülerek bildirmek).`,
  t: `Türkçe bu ayrımı tamamen farklı sözcüklerle kurar, bu yüzden öğrenci farkın varlığından habersizdir ve anlam kayması yapar.`,
  ex: [
    { en: `He [[stopped negotiating]].`, tr: `Müzakereyi bıraktı.`, f: `Eylemi sonlandırdı.` },
    { en: `He [[stopped to negotiate]].`, tr: `Müzakere etmek için durdu.`, f: `Başka bir şeyi bırakıp müzakereye başladı.` }
  ] },

{ id: "fiil.nesne-mastar", a: "fiil-oruntu", tr: "Nesne + mastar", en: "Verb + object + infinitive", on: ["fiil.gerund-mastar"], z: 3, l1: 2,
  k: `want/expect/ask/allow/persuade/enable + nesne + to + fiil: "The chair asked the delegates to reconvene."`,
  t: `Türkçe bunu yan cümleyle kurar (delegelerin toplanmasını istedi). Öğrenci "wanted that they reconvene" gibi that-cümlesi kurmaya çalışır — İngilizcede want bu yapıyı almaz.` },

{ id: "fiil.yalin-mastar", a: "fiil-oruntu", tr: "Yalın mastar", en: "Bare infinitive", on: ["fiil.nesne-mastar"], z: 3, l1: 2,
  k: `make / let / have + kişi + yalın fiil (to yok). help her ikisini de alır. Edilgende "make" to alır: "He was made to resign."`,
  t: `Öğrenci "let him to go" der. "to" burada yasaktır.` },

{ id: "fiil.ortac-obek", a: "fiil-oruntu", tr: "Ortaç öbekleri", en: "Participle clauses", on: ["yc.ilgi-tanimlayan"], z: 5, l1: 2,
  m: `Yan cümleyi kısaltarak metni sıkıştırır. Özneler aynı olmalıdır, yoksa "sarkan ortaç" oluşur ve cümle komikleşir.`,
  an: `Bagajı sıkıştırmak gibi: yer kazanırsın ama yanlış katlarsan içindekiler karışır.`,
  k: `Having + 3. hâl (önceki eylem), -ing (eşzamanlı), -ed (edilgen). Ana cümlenin öznesi ortacın da öznesi olmalıdır.`,
  t: `Türkçede tam olarak bu iş -ip, -erek, -dikten sonra ekleriyle yapılır ve özne uyumu daha esnektir. Öğrenci bunu İngilizceye taşıyınca sarkan ortaç üretir.`,
  ex: [
    { en: `[[Having reviewed the evidence]], the committee revised its position.`, tr: `Kanıtları inceledikten sonra komite tutumunu değiştirdi.`, f: `Türkçe -dikten sonra; İngilizce having + 3. hâl.` },
    { en: `[[Written in 1919]], the treaty reflected wartime resentment.`, tr: `1919'da yazılan antlaşma savaş dönemi hıncını yansıtıyordu.`, f: `Edilgen ortaç.` }
  ],
  kp: { d: `Having read the report, I found the conclusion weak.`, y: `Having read the report, the conclusion seemed weak.`, f: `İkincisinde raporu okuyan "sonuç" oluyor — sarkan ortaç.` },
  ak: `Bu yapı, üst bant IB yazımının en belirgin işaretlerinden biridir. Bir denemede iki üç kez, doğru kullanılarak yer almalıdır.` },

{ id: "fiil.edatli-gerund", a: "fiil-oruntu", tr: "Edattan sonra gerund", en: "Preposition + gerund", on: ["fiil.gerund-mastar"], z: 3, l1: 3,
  k: `Her edattan sonra fiil -ing alır. İstisnasız. Sorun, bazı kalıplardaki "to"nun edat olduğunu fark etmektir: look forward to, be used to, object to, be committed to, in addition to.`,
  t: `Öğrenci "to" gördüğü an mastar sanır: "I look forward to meet you." Doğrusu "meeting". Resmî e-postada en görünür hatalardan biridir.`,
  ex: [
    { en: `I look forward to [[hearing]] from you.`, tr: `Sizden haber almayı bekliyorum.`, f: `Buradaki "to" edattır.` },
    { en: `They objected to [[being excluded]] from the talks.`, tr: `Görüşmelerden dışlanmaya itiraz ettiler.`, f: `Edat + edilgen gerund.` }
  ] },

{ id: "fiil.deyimsel-fiil", a: "fiil-oruntu", tr: "Deyimsel fiiller", en: "Phrasal verbs", on: ["edat.fiil-bagimli"], z: 4, l1: 2,
  k: `fiil + parçacık; anlam bileşenlerinden çıkarılamaz (call off = iptal etmek). Ayrılabilenlerde zamir daima ortaya girer: "call it off", "call off it" değil.`,
  t: `Türkçede eşdeğeri yoktur; öğrenci ya hiç kullanmaz (metin resmî ve donuk kalır) ya da resmî metinde gündelik olanı kullanır. IB'de kayıt uyumu için: resmî metinde "postpone", gündelik metinde "put off".` },

/* ═══ 7. YAN CÜMLELER ═══ */
{ id: "yc.ilgi-tanimlayan", a: "yan-cumle", tr: "Tanımlayan ilgi cümlesi", en: "Defining relative clause", on: ["iskelet.svo"], z: 3, l1: 3,
  m: `İlgi cümlesi, bir ismi tanımlayarak hangisinden bahsettiğini belirler. İngilizce bunu ismin arkasına ekler; Türkçe önüne. Bu yön farkı, Türk öğrencinin en görünür sözdizim hatasını üretir.`,
  an: `İngilizce bir kutuya etiketi arkadan yapıştırır, Türkçe önden. İkisi de kutuyu tanımlar ama sıra farklıdır.`,
  k: `İsim + who/which/that + yüklem. Virgül yok. Nesne konumundaki ilgi adılı düşürülebilir: "the book (that) I read".`,
  t: `Türkçe ortacı (-en, -diği) isimden önce koyar: "seçimi kazanan aday". Öğrenci bu sırayı taşımaya çalışır ya da ilgi adılını unutur. Ayrıca ilgi cümlesi içinde özneyi tekrarlar: "the candidate who he won" (yanlış).`,
  ex: [
    { en: `The candidate [[who won the election]] resigned.`, tr: `[[Seçimi kazanan]] aday istifa etti.`, f: `İngilizce isimden sonra, Türkçe önce.` },
    { en: `The treaty [[that ended the war]] was signed in 1919.`, tr: `[[Savaşı bitiren]] antlaşma 1919'da imzalandı.`, f: `Yön farkı aynı.` },
    { en: `The book [[I read]] last week changed my view.`, tr: `Geçen hafta [[okuduğum]] kitap görüşümü değiştirdi.`, f: `Nesne konumunda ilgi adılı düşürülebilir.` }
  ],
  kp: { d: `The state that violates the treaty faces sanctions.`, y: `The violating the treaty state faces sanctions.`, f: `İlgi cümlesi isimden sonra gelir.` },
  sh: [ { y: `The delegate who he spoke first was from Brazil.`, d: `The delegate who spoke first was from Brazil.` },
        { y: `The winning the debate team celebrated.`, d: `The team that won the debate celebrated.` } ],
  ak: `Uzun ad öbeklerini ilgi cümlesiyle açmak, IB yazımında cümle çeşitliliğinin temel aracıdır.` },

{ id: "yc.ilgi-tanimlamayan", a: "yan-cumle", tr: "Tanımlamayan ilgi cümlesi", en: "Non-defining relative clause", on: ["yc.ilgi-tanimlayan"], z: 4, l1: 3,
  m: `Virgül burada noktalama değil, anlam taşır. Virgüllü ilgi cümlesi ek bilgidir, çıkarılabilir. Virgülsüz olan tanımlar, çıkarılırsa cümle anlamsızlaşır.`,
  an: `Virgülsüz ilgi cümlesi kimlik kartıdır; virgüllü olan dipnottur.`,
  k: `Tanımlamayan: virgülle ayrılır, "that" kullanılamaz, ilgi adılı düşürülemez. Özel adlardan sonra daima tanımlamayan olur.`,
  t: `Türkçede bu ayrım yoktur; öğrenci virgülü rastgele koyar veya hiç koymaz. Anlam kayması yaratır: "Delegates who opposed the motion left" (sadece karşı olanlar) ile "Delegates, who opposed the motion, left" (hepsi karşıydı ve hepsi çıktı) farkı büyüktür.`,
  ex: [
    { en: `Waltz, [[who]] founded neorealism, died in 2013.`, tr: `Neorealizmin kurucusu Waltz 2013'te öldü.`, f: `Özel ad → tanımlamayan, virgüllü, that olmaz.` },
    { en: `The states [[that]] ratified the treaty gained access.`, tr: `Antlaşmayı onaylayan devletler erişim kazandı.`, f: `Tanımlayan: hangi devletler olduğunu belirtiyor.` }
  ],
  kp: { d: `My brother who lives in Ankara is a lawyer.`, y: `My brother, who lives in Ankara, is a lawyer.`, f: `İlkinde birden çok kardeş var; ikincisinde tek kardeş.` } },

{ id: "yc.which-who-that", a: "yan-cumle", tr: "which, who, that seçimi", en: "Choosing the relative pronoun", on: ["yc.ilgi-tanimlamayan"], z: 3, l1: 2,
  k: `who → insan. which → insan dışı. that → her ikisi, ama yalnızca tanımlayanda. whose → iyelik. where/when → yer ve zaman.`,
  t: `Öğrenci kurumları insan sanıp "the government who" der. Doğrusu "the government which/that". Ayrıca tüm bir cümleye gönderme yapan "which" kullanımı hiç bilinmez: "The talks collapsed, which surprised no one."` },

{ id: "yc.edatli-ilgi", a: "yan-cumle", tr: "Edatlı ilgi cümlesi", en: "Relative clauses with prepositions", on: ["yc.which-who-that"], z: 5, l1: 2,
  k: `Resmî: the framework [[within which]] states operate. Gündelik: the framework [[that]] states operate [[within]].`,
  t: `Öğrenci edatı tamamen düşürür. Akademik IB yazımında "in which", "of which", "to whom" yapıları üst bandın işaretidir.`,
  ex: [
    { en: `The conditions [[under which]] the treaty was signed remain disputed.`, tr: `Antlaşmanın imzalandığı koşullar tartışmalıdır.`, f: `Türkçe -dığı ekiyle çözer; İngilizce edat + which ister.` }
  ] },

{ id: "yc.indirgenmis-ilgi", a: "yan-cumle", tr: "İndirgenmiş ilgi cümlesi", en: "Reduced relative clauses", on: ["yc.ilgi-tanimlayan"], z: 5, l1: 1,
  k: `İlgi adılı + be düşürülür: "the states (that were) affected by sanctions". Etken için -ing: "the states (that are) seeking membership".`,
  t: `Öğrenci hiç kullanmaz. Bu yapı, metni sıkıştırıp olgun gösteren en ucuz araçtır.` },

{ id: "yc.isim-cumlecigi", a: "yan-cumle", tr: "İsim cümlecikleri", en: "Noun clauses", on: ["iskelet.svo"], z: 3, l1: 2,
  k: `that + cümle bir ismin yerini tutar: "The fact that the talks failed…", "It is clear that…"`,
  t: `Türkçe bunu -diği ekiyle kurar (görüşmelerin başarısız olduğu gerçeği). Öğrenci "that"i düşürür veya "the fact of the talks failed" gibi karma yapı üretir.` },

{ id: "yc.gomulu-soru", a: "yan-cumle", tr: "Gömülü sorular", en: "Embedded questions", on: ["iskelet.soru"], z: 4, l1: 3,
  m: `Bir soru cümle içine gömüldüğünde soru olmaktan çıkar ve düz cümle sırasına döner. Yardımcı fiil öne geçmez.`,
  an: `Soru işareti kaybolunca cümle de asker duruşundan rahat duruşa geçer.`,
  k: `I wonder / Could you tell me / It is unclear + soru sözcüğü + ÖZNE + YÜKLEM. Evet-hayır sorusu gömülürse "whether/if" gelir.`,
  t: `Türkçede gömülü soru da düz cümle sırasındadır, dolayısıyla asıl sorun öğrencinin İngilizce soru sırasını fazladan uygulamasıdır: "I wonder why did the policy fail."`,
  ex: [
    { en: `It is unclear [[why the policy failed]].`, tr: `Politikanın neden başarısız olduğu belirsiz.`, f: `Düz cümle sırası; "did" yok.` },
    { en: `Could you tell me [[whether the session has begun]]?`, tr: `Oturumun başlayıp başlamadığını söyler misiniz?`, f: `Evet-hayır sorusu → whether.` }
  ],
  kp: { d: `I don't know where he is.`, y: `I don't know where is he.`, f: `Gömülü soruda devrik sıra kullanılmaz.` } },

{ id: "yc.dolayli-anlatim", a: "yan-cumle", tr: "Dolaylı anlatım", en: "Reported speech", on: ["yc.isim-cumlecigi"], z: 4, l1: 3,
  k: `say/tell/claim/argue + that + cümle. Zaman, kişi ve zaman-yer zarfları kaydırılır (now → then, tomorrow → the following day, here → there).`,
  t: `Türkçe aktarımda özgün sözcükler korunur ve zaman değişmez ("geleceğim dedi"). Öğrenci bunu doğrudan taşır.`,
  ex: [
    { en: `The minister said that the talks [[were]] progressing.`, tr: `Bakan görüşmelerin ilerlediğini söyledi.`, f: `Türkçede "ilerliyor" değişmez; İngilizcede geriler.` }
  ] },

{ id: "yc.zaman-uyumu", a: "yan-cumle", tr: "Zaman geriletme", en: "Backshift / sequence of tenses", on: ["yc.dolayli-anlatim"], z: 4, l1: 3,
  m: `Ana fiil geçmişteyse, yan cümledeki zaman bir adım geriye kayar. Çünkü konuşma anı ile aktarma anı farklıdır ve İngilizce bu farkı dilbilgisiyle işaretler.`,
  an: `Bir saati farklı zaman dilimine ayarlamak gibi. Ana fiil hangi dilimdeyse yan cümle ona göre kurulur.`,
  k: `present → past, past → past perfect, will → would, can → could, must → had to. Değişmeyen gerçekler geriletilmeyebilir.`,
  t: `Türkçede geriletme yoktur. Bu, öğrencinin en tutarlı hatalarından biridir ve her aktarımda tekrarlanır: "He said he is ready."`,
  ex: [
    { en: `He said that he [[was]] ready to negotiate.`, tr: `Müzakereye hazır olduğunu söyledi.`, f: `is → was.` },
    { en: `She claimed that the report [[had been]] leaked.`, tr: `Raporun sızdırıldığını iddia etti.`, f: `was → had been.` },
    { en: `They announced that they [[would]] withdraw.`, tr: `Çekileceklerini duyurdular.`, f: `will → would.` }
  ],
  kp: { d: `He told me he had already submitted it.`, y: `He told me he has already submitted it.`, f: `Ana fiil geçmişse present perfect past perfect'e kayar.` },
  ak: `Kaynak özetleyen ve alıntı aktaran her IB metninde geçer; hatası her paragrafta tekrarlandığı için dil bandını hızla düşürür.` },

{ id: "yc.zaman-cumleciği", a: "yan-cumle", tr: "Zaman yan cümleleri", en: "Time clauses", on: ["zaman.gelecek-will-going"], z: 3, l1: 2,
  k: `when, as soon as, before, after, until, by the time + present (gelecek anlamında will kullanılmaz): "When the report is published, we will respond."`,
  t: `Türkçede gelecek yan cümlede de gelecek ekiyle kurulur; öğrenci "When the report will be published" der. Sık ve göze batan bir hatadır.` },

/* ═══ 8. KOŞUL VE VARSAYIM ═══ */
{ id: "kosul.tip0-1", a: "kosul", tr: "Gerçek koşul", en: "Zero & first conditional", on: ["zaman.present-simple"], z: 2, l1: 2,
  k: `0. tip: if + present, present (değişmez gerçek). 1. tip: if + present, will + fiil (olası gelecek). "if" cümleciğinde will kullanılmaz.`,
  t: `Türkçede koşul cümlesi de gelecek ekiyle kurulabilir. Öğrenci "If the council will act…" der; yanlıştır.` },

{ id: "kosul.tip2", a: "kosul", tr: "Varsayımsal koşul", en: "Second conditional", on: ["kosul.tip0-1"], z: 3, l1: 2,
  m: `Şimdiki gerçeğe aykırı varsayım. Geçmiş zaman biçimi kullanılır ama geçmişten bahsedilmez — bu biçim burada "gerçek dışı" demektir.`,
  an: `Bir adım geri çekilmek gibi: dilbilgisi zamanı bir adım geriye alınır ki gerçeklikten uzaklaştığı anlaşılsın.`,
  k: `if + past simple, would + yalın fiil. Resmî yazımda "were" tüm kişilerde: "If I were the delegate…"`,
  t: `Türkçe -se/-sa eki hem gerçek hem gerçek dışı koşulu karşılar. Öğrenci ikisini ayırmaz. Ayrıca "if" cümleciğinde would kullanır: "If he would come…"`,
  ex: [
    { en: `If the veto [[were abolished]], the Council [[would function]] differently.`, tr: `Veto kaldırılsaydı Konsey farklı işlerdi.`, f: `Şimdiki gerçeğe aykırı varsayım.` }
  ],
  kp: { d: `If I had more time, I would revise it.`, y: `If I would have more time, I would revise it.`, f: `if cümleciğinde would yer almaz.` } },

{ id: "kosul.tip3", a: "kosul", tr: "Geçmişe aykırı koşul", en: "Third conditional", on: ["kosul.tip2", "zaman.past-perfect"], z: 4, l1: 3,
  m: `Geçmişte olmamış bir şeyi varsayar. Olmuş bitmiş bir tarihi yeniden kurgular; bu yüzden tarih ve siyaset yazımında vazgeçilmezdir.`,
  an: `Maçın tekrarını izleyip "orada gol olsaydı" demek gibi. Maç bitti; senaryo hayali.`,
  k: `if + past perfect, would have + 3. hâl.`,
  t: `Türkçede "-seydi ... -irdi" ile karşılanır ve tek yapıdır; İngilizcede iki ayrı perfect biçimi üst üste binmek zorundadır. Öğrenci ya birini eksik bırakır ya da 2. tiple karıştırır.`,
  ex: [
    { en: `If the alliance [[had intervened]] earlier, the war [[would have been]] shorter.`, tr: `İttifak daha erken müdahale etseydi savaş daha kısa sürerdi.`, f: `İki perfect biçimi birlikte.` }
  ],
  kp: { d: `If they had acted, the crisis would have been avoided.`, y: `If they acted, the crisis would be avoided.`, f: `İkincisi geçmiş değil, şimdiki varsayım.` },
  ak: `Tarihsel karşı-olgusal tartışma (counterfactual) IB Global Politics ve History yazımında sık istenir; bu yapı olmadan kurulamaz.` },

{ id: "kosul.karma", a: "kosul", tr: "Karma koşul", en: "Mixed conditional", on: ["kosul.tip3"], z: 5, l1: 2,
  k: `Geçmiş koşul → şimdiki sonuç: if + past perfect, would + yalın fiil. "If the treaty had been ratified, the region would be more stable today."`,
  t: `Öğrenci bu yapıyı hiç kullanmaz; oysa "geçmişteki karar bugünkü durumu belirledi" argümanı UİT yazımının belkemiğidir.` },

{ id: "kosul.devrik", a: "kosul", tr: "Devrik koşul", en: "Inverted conditionals", on: ["kosul.tip3"], z: 5, l1: 1,
  k: `"if" atılır, yardımcı fiil öne alınır: Had the council acted… / Were the veto abolished… / Should you require further information…`,
  t: `Resmî yazımın işaretidir. Öğrenci bilmediği için metin hep aynı "if" kalıbıyla ilerler.`,
  ex: [
    { en: `[[Had the alliance acted]] sooner, the outcome might have differed.`, tr: `İttifak daha erken hareket etseydi sonuç farklı olabilirdi.`, f: `if düşer, had öne geçer.` }
  ],
  ak: `Resmî e-posta ve öneri raporunda "Should you require any further information, please contact me" kalıbı neredeyse standarttır.` },

{ id: "kosul.wish", a: "kosul", tr: "wish ve if only", en: "wish / if only", on: ["kosul.tip2"], z: 4, l1: 3,
  m: `Gerçekleşmemiş bir dileği bildirir ve zamanı bir adım geriye atar: şimdiki dilek için past, geçmiş pişmanlık için past perfect.`,
  k: `wish + past simple (şimdiki durum keşke böyle olmasa). wish + past perfect (geçmiş pişmanlık). wish + would (başkasının davranışından şikâyet).`,
  t: `Türkçe "keşke" tek sözcükle her üçünü karşılar. Öğrenci zaman kaydırmasını yapmaz: "I wish I have more time."`,
  ex: [
    { en: `I [[wish I had]] more time to revise.`, tr: `Keşke gözden geçirmek için daha çok zamanım olsa.`, f: `Şimdiki dilek → past simple.` },
    { en: `I [[wish I had read]] the source earlier.`, tr: `Keşke kaynağı daha erken okusaydım.`, f: `Geçmiş pişmanlık → past perfect.` }
  ] },

{ id: "kosul.baglaclar", a: "kosul", tr: "Koşul bağlaçları", en: "Conditional conjunctions", on: ["kosul.tip0-1"], z: 3, l1: 2,
  k: `unless (= if not), provided that / as long as (koşuluyla), in case (ihtimaline karşı), otherwise (aksi hâlde).`,
  t: `"unless" zaten olumsuzdur; öğrenci bir kez daha olumsuzlar: "unless he doesn't come". Ayrıca "in case" ile "if" karıştırılır: "Take an umbrella in case it rains" (ihtimale karşı) ≠ "if it rains".` },
];

export const D_E = [
/* ═══ 9. BAĞLAÇ VE SÖYLEM ═══ */
{ id: "soylem.baglac-turleri", a: "soylem", tr: "Bağlaç türleri", en: "Types of connectors", on: ["iskelet.svo"], z: 3, l1: 3,
  m: `İngilizce üç ayrı bağlama aracı kullanır ve her birinin noktalaması farklıdır: bağlaçlar (and, but, although) iki cümleciği tek cümlede birleştirir; söylem belirteçleri (however, therefore) ayrı cümleleri bağlar; edatlar (despite, because of) ad öbeği alır.`,
  an: `Üç farklı kablo ucu gibi. Aynı elektriği taşırlar ama prizleri farklıdır; zorlarsan takılmaz.`,
  k: `Bağlaç + cümlecik. Edat + ad öbeği/gerund. Söylem belirteci + nokta veya noktalı virgül, ardından virgül.`,
  t: `Türkçede "rağmen" hem "-mesine rağmen" hem "buna rağmen" olarak çalışabilir; öğrenci İngilizcede aynı esnekliği bekler ve "Despite he tried" veya "Although the crisis, …" yazar. İkisi de yanlıştır.`,
  ex: [
    { en: `[[Although]] the talks failed, the ceasefire held.`, tr: `Görüşmeler başarısız olsa da ateşkes tuttu.`, f: `although + cümlecik.` },
    { en: `[[Despite]] the failure of the talks, the ceasefire held.`, tr: `Görüşmelerin başarısızlığına rağmen ateşkes tuttu.`, f: `despite + ad öbeği.` },
    { en: `The talks failed. [[However]], the ceasefire held.`, tr: `Görüşmeler başarısız oldu. Ancak ateşkes tuttu.`, f: `however ayrı cümle başlatır.` }
  ],
  kp: { d: `Despite the delay, the vote proceeded.`, y: `Despite the vote was delayed, it proceeded.`, f: `despite cümlecik almaz.` },
  sh: [ { y: `Although of the crisis, trade continued.`, d: `Despite the crisis, trade continued.` },
        { y: `Despite he opposed it, the motion passed.`, d: `Although he opposed it, the motion passed.` } ] },

{ id: "soylem.although-despite", a: "soylem", tr: "although ve despite ayrımı", en: "although vs despite", on: ["soylem.baglac-turleri"], z: 3, l1: 3,
  k: `although / though / even though + ÖZNE + YÜKLEM. despite / in spite of + ad öbeği veya -ing. "despite the fact that" ile cümlecik alabilir ama ağırdır.`,
  t: `Türkçe "rağmen" tek sözcük olduğu için öğrenci ikisi arasında seçim yapması gerektiğini fark etmez. En sık hatalardan biridir.`,
  ex: [
    { en: `[[Despite being]] outnumbered, the coalition prevailed.`, tr: `Sayıca az olmasına rağmen koalisyon üstün geldi.`, f: `despite + -ing.` }
  ] },

{ id: "soylem.soylem-belirtec", a: "soylem", tr: "Söylem belirteçleri", en: "Discourse markers", on: ["soylem.baglac-turleri"], z: 3, l1: 2,
  k: `Ekleme: moreover, furthermore, in addition. Karşıtlık: however, nevertheless, by contrast, conversely. Sonuç: therefore, consequently, as a result. Örnekleme: for instance, notably. Noktalama: cümle başındaysa arkasına virgül; iki cümleyi bağlıyorsa öncesine noktalı virgül.`,
  t: `Öğrenci bunları virgülle bağlar ve comma splice üretir: "The theory is dated, however it remains useful." Doğrusu nokta veya noktalı virgüldür.`,
  ex: [
    { en: `The theory is dated[[;]] however, it remains useful.`, tr: `Kuram eskimiştir; yine de yararlıdır.`, f: `however virgülle bağlanamaz.` }
  ] },

{ id: "soylem.bagdasiklik", a: "soylem", tr: "Bağdaşıklık", en: "Cohesion: reference & substitution", on: ["soylem.soylem-belirtec"], z: 4, l1: 1,
  k: `Adıllar, "this/such" ile geriye gönderme, "the former/the latter", "one/ones" ile yerine koyma.`,
  t: `Öğrenci ismi tekrarlar ve metin tekdüzeleşir. "This argument", "such a view", "the latter" gibi araçlar üst bandın işaretidir.` },

{ id: "soylem.kosutluk", a: "soylem", tr: "Koşutluk", en: "Parallelism", on: ["soylem.baglac-turleri"], z: 4, l1: 2,
  m: `Bir listede veya karşılaştırmada öğeler aynı dilbilgisel biçimde olmalıdır. Kulak bunu bozukluk olarak duyar, mantık ise dengesizlik olarak.`,
  an: `Bir terazinin iki kefesi gibi: ikisine de aynı türden ağırlık koyarsın.`,
  k: `not only … but also, both … and, either … or arasındaki öğeler aynı türde olmalı.`,
  t: `Türkçe listelerde biçim serbestliği daha fazladır; öğrenci "The policy aims to reduce inflation, stabilising the currency and growth" gibi karma listeler kurar.`,
  ex: [
    { en: `The policy aims to [[reduce]] inflation, [[stabilise]] the currency and [[restore]] confidence.`, tr: `Politika enflasyonu düşürmeyi, kuru istikrara kavuşturmayı ve güveni onarmayı amaçlıyor.`, f: `Üç mastar, aynı biçim.` }
  ],
  kp: { d: `He is respected not only for his scholarship but also for his integrity.`, y: `He is respected not only for his scholarship but also he has integrity.`, f: `İki taraf aynı yapıda olmalı.` } },

{ id: "soylem.neden-sonuc", a: "soylem", tr: "Neden ve sonuç ifadeleri", en: "Cause and effect", on: ["soylem.baglac-turleri"], z: 3, l1: 2,
  k: `because + cümlecik / because of + ad öbeği / due to + ad öbeği / therefore, consequently + cümle / lead to, result in, give rise to + ad öbeği.`,
  t: `"because of" ile "because" karıştırılır: "because of the crisis started" yanlıştır. Ayrıca "due to" resmî yazımda ad öbeği ister.` },

{ id: "soylem.karsitlik", a: "soylem", tr: "Karşıtlık ve ödün", en: "Contrast and concession", on: ["soylem.although-despite"], z: 4, l1: 1,
  k: `while / whereas (karşılaştırma), admittedly / granted (ödün verme), it could be argued that … however (karşı görüş kurma).`,
  t: `IB'nin üst bantları karşı görüş kurmayı ister. Öğrenci tek yönlü yazar; ödün verme kalıpları eksiktir.` },

{ id: "soylem.paragraf-akisi", a: "soylem", tr: "Paragraf akışı", en: "Paragraph flow", on: ["soylem.bagdasiklik"], z: 4, l1: 1,
  k: `Konu cümlesi → geliştirme → kanıt → değerlendirme → bağlama. Yeni bilgi cümle sonunda, bilinen bilgi cümle başında olmalı (bilinenden yeniye ilkesi).`,
  t: `Türkçe akademik yazımda paragraf sınırları daha esnektir. IB okuyucusu her paragrafta tek bir iddia bekler.` },

/* ═══ 10. EDAT DİZGESİ ═══ */
{ id: "edat.zaman", a: "edat", tr: "Zaman edatları", en: "Prepositions of time", on: [], z: 2, l1: 3,
  m: `İngilizce zamanı üç ölçekte düşünür: geniş dilim (in), belirli gün (on), tam nokta (at). Küçüldükçe edat değişir.`,
  an: `Bir haritanın ölçeği gibi: ülke (in), şehir (on), sokak numarası (at).`,
  k: `in + yıl, ay, mevsim, yüzyıl, sabah/öğleden sonra. on + gün, tarih, belirli sabah. at + saat, gece, hafta sonu (İng.), bayram.`,
  t: `Türkçede hepsi -de/-da ekiyle karşılanır (1945'te, Pazartesi'de, saat üçte). Öğrenci tek bir edata sabitlenir, genellikle "in".`,
  ex: [
    { en: `The UN was founded [[in]] 1945.`, tr: `BM 1945'te kuruldu.`, f: `Yıl → in.` },
    { en: `The session begins [[at]] nine [[on]] Monday.`, tr: `Oturum Pazartesi saat dokuzda başlıyor.`, f: `Türkçe iki kez -de kullanıyor; İngilizce iki farklı edat.` }
  ],
  sh: [ { y: `The vote is in Monday.`, d: `The vote is on Monday.` },
        { y: `He arrived at 1990.`, d: `He arrived in 1990.` } ] },

{ id: "edat.yer", a: "edat", tr: "Yer edatları", en: "Prepositions of place", on: ["edat.zaman"], z: 2, l1: 3,
  k: `in (kapalı alan, şehir, ülke), on (yüzey, cadde, sayfa), at (nokta, adres, etkinlik).`,
  t: `Yine tek Türkçe eke karşı üç İngilizce edat. "at the university" (kurum olarak) ile "in the university" (bina içinde) farkı kaçırılır.` },

{ id: "edat.yon", a: "edat", tr: "Yön ve hareket edatları", en: "Prepositions of movement", on: ["edat.yer"], z: 2, l1: 2,
  k: `to (hedef), into (içine), onto (üzerine), towards (yönünde), from (kaynak), through (içinden).`,
  t: `Türkçe -e/-a eki için otomatik olarak "to" seçilir; ama "enter the room" (to yok), "arrive at/in" (to yok) gibi istisnalar vardır.` },

{ id: "edat.fiil-bagimli", a: "edat", tr: "Fiile bağımlı edatlar", en: "Dependent prepositions (verbs)", on: ["edat.yon"], z: 5, l1: 3,
  m: `Bazı fiiller kendi edatını yanında taşır. Bu edat anlam üretmez, fiilin parçasıdır. Sözlükten fiili öğrenirken edatıyla birlikte öğrenmek zorundasın.`,
  an: `Bir vidayla tornavida ucu gibi. Vidanın başı hangi ucu istiyorsa onu kullanırsın; mantığı yoktur, uyumu vardır.`,
  k: `Ezberlenecek çekirdek liste: depend on, result in, result from, consist of, contribute to, lead to, refer to, cope with, deal with, comply with, insist on, focus on, rely on, account for, benefit from, differ from, participate in, succeed in, object to, respond to, attribute to, associate with.`,
  t: `Türkçede bu bilgi fiile yapışık ekle taşınır ve görünmez (bağlıdır, sonuçlanır). Öğrenci İngilizcede edatın ayrı bir sözcük olduğunu ve ezberlenmesi gerektiğini kavramaz; ya atlar ya da Türkçe hâl ekinden yola çıkıp yanlışını seçer.`,
  ex: [
    { en: `The outcome [[depends on]] several variables.`, tr: `Sonuç birkaç değişkene bağlıdır.`, f: `Türkçede -e hâli; İngilizcede "on", "to" değil.` },
    { en: `The crisis [[resulted in]] a wave of migration.`, tr: `Kriz bir göç dalgasıyla sonuçlandı.`, f: `result in = sonuç doğurmak; result from = kaynaklanmak.` },
    { en: `The theory [[accounts for]] anomalies better.`, tr: `Kuram aykırılıkları daha iyi açıklıyor.`, f: `account for = açıklamak.` }
  ],
  kp: { d: `Instability results from weak institutions.`, y: `Instability results in weak institutions.`, f: `from = neden, in = sonuç. Yön tersine döner.` },
  sh: [ { y: `It depends to the context.`, d: `It depends on the context.` },
        { y: `The report consists three chapters.`, d: `The report consists of three chapters.` },
        { y: `They complied to the ruling.`, d: `They complied with the ruling.` } ],
  ak: `Bu düğüm, tek başına Türk öğrencilerin akademik İngilizcedeki hata sayısının en büyük payını üretir. Kelime öğrenirken fiili daima edatıyla kaydet.` },

{ id: "edat.edat-yok", a: "edat", tr: "Edat almayan fiiller", en: "Verbs without prepositions", on: ["edat.fiil-bagimli"], z: 4, l1: 3,
  m: `Bazı İngilizce fiiller doğrudan nesne alır, oysa Türkçe karşılıkları hâl eki ister. Öğrenci hâl ekini görüp edat ekler.`,
  k: `Edat almayanlar: discuss, enter, answer, approach, attend, contact, marry, lack, resemble, emphasise, mention, request, influence, affect.`,
  t: `"toplantıya katıldım" → "I attended to the meeting" (yanlış). "sorunu tartıştık" → "We discussed about the problem" (yanlış). Türkçe hâl eki edat sanılıyor.`,
  ex: [
    { en: `The committee will [[discuss]] the proposal.`, tr: `Komite öneriyi tartışacak.`, f: `discuss about yoktur.` },
    { en: `I [[attended]] the conference in Ankara.`, tr: `Ankara'daki konferansa katıldım.`, f: `Türkçe -e hâli var, İngilizce edat yok.` }
  ],
  sh: [ { y: `We discussed about the resolution.`, d: `We discussed the resolution.` },
        { y: `He entered to the hall.`, d: `He entered the hall.` },
        { y: `Please contact with me.`, d: `Please contact me.` } ] },

{ id: "edat.sifat-bagimli", a: "edat", tr: "Sıfata bağımlı edatlar", en: "Dependent prepositions (adjectives)", on: ["edat.fiil-bagimli"], z: 4, l1: 3,
  k: `responsible for, aware of, capable of, dependent on, similar to, different from, consistent with, relevant to, subject to, prone to, committed to.`,
  t: `Aynı girişim: Türkçe hâl ekinden yola çıkarak edat seçilir. "different from" yerine "different than" (Amerikan gündelik) veya "different to" karışır; akademik yazımda "from" kullan.`,
  ex: [
    { en: `The findings are [[consistent with]] earlier studies.`, tr: `Bulgular önceki çalışmalarla tutarlı.`, f: `Türkçe "ile" → İngilizce "with", doğru eşleşiyor.` },
    { en: `This approach is [[different from]] the classical model.`, tr: `Bu yaklaşım klasik modelden farklı.`, f: `Türkçe -den hâli → from.` }
  ] },

{ id: "edat.ad-bagimli", a: "edat", tr: "Ada bağımlı edatlar", en: "Dependent prepositions (nouns)", on: ["edat.sifat-bagimli"], z: 4, l1: 2,
  k: `reason for, solution to, effect on, increase in, cause of, attitude towards, approach to, access to, alternative to.`,
  t: `"solution of the problem" yerine "solution to the problem"; "the reason of" yerine "the reason for". Türkçe tamlama eki tek biçimli olduğu için hepsi "of" olur sanılır.` },

{ id: "edat.hal-eki-tuzagi", a: "edat", tr: "Hâl eki ile edat eşleme tuzağı", en: "Case-suffix to preposition mapping trap", on: ["edat.fiil-bagimli"], z: 5, l1: 3,
  m: `Bu düğüm bir kural değil, bir uyarıdır: Türkçe hâl eki ile İngilizce edat arasında güvenilir bir eşleme yoktur. Edat seçimi hâle değil, fiile bağlıdır.`,
  an: `İki dil arasında sözlük değil, telefon rehberi vardır. -e hâli "to"yu aramaz; hangi fiili aradığına bakar.`,
  k: `Bir fiili öğrenirken üç şeyi birlikte kaydet: fiil + edatı (varsa) + örnek cümle. Hâl ekinden edat türetme.`,
  t: `Bu, kataloğun 6. maddesidir ve tek başına diğer edat hatalarının kökeni sayılabilir. Bir hatanın kaynağını bulamıyorsan önce buraya bak.`,
  ex: [
    { en: `I [[attended]] the conference.`, tr: `Konferans[[a]] katıldım.`, f: `-a var, edat yok.` },
    { en: `The result [[depends on]] context.`, tr: `Sonuç bağlam[[a]] bağlıdır.`, f: `-a var, ama "to" değil "on".` },
    { en: `He [[objected to]] the proposal.`, tr: `Öneri[[ye]] itiraz etti.`, f: `-ye var, burada gerçekten "to".` }
  ] },

{ id: "edat.karmasik-edat", a: "edat", tr: "Bileşik edatlar", en: "Complex prepositions", on: ["edat.ad-bagimli"], z: 4, l1: 1,
  k: `in terms of, with regard to, in accordance with, on the basis of, in the context of, as opposed to, in the light of.`,
  t: `Akademik kayıt için gerekli ama öğrenci bunları yanlış biçimde ezberler: "in terms of" yerine "in term of", "with regard to" yerine "with regards to".` },

/* ═══ 11. SIFAT VE ZARF ═══ */
{ id: "nitel.zarf-bicim", a: "nitel", tr: "Sıfat mı zarf mı", en: "Adjective or adverb", on: ["iskelet.zarf-yerlesim"], z: 2, l1: 3,
  m: `Sıfat ismi niteler, zarf fiili. İngilizce bu ikisini biçimsel olarak ayırır (-ly); Türkçe çoğu zaman ayırmaz.`,
  an: `Aynı boya, farklı fırça. İsmi boyarken sıfat fırçası, fiili boyarken zarf fırçası.`,
  k: `Fiili niteliyorsa -ly. "be, seem, appear, become, feel, look" gibi bağlayıcı fiillerden sonra sıfat gelir: "The argument seems weak" (weakly değil).`,
  t: `Türkçede "güzel konuştu" ve "güzel konuşma" aynı sözcüğü kullanır. Öğrenci "He spoke very good" veya "explained it clear" der. Çok yaygın ve seviye izlenimini düşüren bir hatadır.`,
  ex: [
    { en: `He explained the theory [[clearly]].`, tr: `Kuramı açık açık anlattı.`, f: `Fiili niteliyor → -ly.` },
    { en: `The argument seems [[weak]].`, tr: `Argüman zayıf görünüyor.`, f: `Bağlayıcı fiilden sonra sıfat.` }
  ],
  sh: [ { y: `She performed very good.`, d: `She performed very well.` },
        { y: `The policy worked efficient.`, d: `The policy worked efficiently.` } ] },

{ id: "nitel.sifat-sirasi", a: "nitel", tr: "Sıfat sırası", en: "Adjective order", on: [], z: 3, l1: 2,
  k: `Görüş → boyut → yaş → biçim → renk → köken → malzeme → amaç → İSİM. "a controversial new French documentary".`,
  t: `Türkçede sıra daha serbesttir ve virgülle ayrılabilir. Yanlış sıra dilbilgisi hatası sayılmaz ama kulağa yabancı gelir.` },

{ id: "nitel.karsilastirma", a: "nitel", tr: "Karşılaştırma ve üstünlük", en: "Comparatives & superlatives", on: [], z: 2, l1: 2,
  k: `Tek heceli: -er / -est. İki heceden fazla: more / most. Karşılaştırmada "than", üstünlükte "the".`,
  t: `Çift işaretleme sık: "more better", "the most biggest". Ayrıca "than" yerine "from" kullanılır çünkü Türkçe -den hâli kullanır: "bigger from" (yanlış).`,
  ex: [
    { en: `This model is more persuasive [[than]] the classical one.`, tr: `Bu model klasik olan[[dan]] daha ikna edici.`, f: `Türkçe -den hâli; İngilizce "than", "from" değil.` }
  ],
  sh: [ { y: `Realism is more older than liberalism.`, d: `Realism is older than liberalism.` },
        { y: `It is bigger from the previous one.`, d: `It is bigger than the previous one.` } ] },

{ id: "nitel.ing-ed-sifat", a: "nitel", tr: "-ing ve -ed sıfatlar", en: "-ing vs -ed adjectives", on: ["nitel.zarf-bicim"], z: 3, l1: 3,
  m: `-ing sıfat duyguyu üretenin özelliğidir; -ed sıfat duyguyu yaşayanın hâlidir. Kaynak ile deneyimleyen ayrımıdır.`,
  an: `Bir ısıtıcı ile üşüyen kişi gibi: ısıtıcı "heating", kişi "heated". Rolleri karıştırırsan kişi ısıtıcı olur.`,
  k: `Kaynak → -ing (boring, confusing, interesting). Deneyimleyen → -ed (bored, confused, interested).`,
  t: `Türkçe bu ayrımı ayrı sözcüklerle kurar (sıkıcı / sıkılmış) ve öğrenci ekleri karıştırır. "I am boring" demek "ben sıkıcı biriyim" anlamına gelir — istemediğin bir cümle.`,
  ex: [
    { en: `I was [[bored]] by the lecture; the lecture was [[boring]].`, tr: `Dersten sıkıldım; ders sıkıcıydı.`, f: `Deneyimleyen -ed, kaynak -ing.` },
    { en: `The findings are [[surprising]] and the committee is [[surprised]].`, tr: `Bulgular şaşırtıcı ve komite şaşkın.`, f: `Aynı çift.` }
  ],
  kp: { d: `I am confused by the terminology.`, y: `I am confusing by the terminology.`, f: `İkincisi "ben kafa karıştırıcıyım" demektir.` } },

{ id: "nitel.zarf-turleri", a: "nitel", tr: "Zarf türleri", en: "Types of adverbs", on: ["nitel.zarf-bicim"], z: 3, l1: 1,
  k: `Tarz (carefully), sıklık (rarely), derece (entirely), cümle zarfı (arguably, admittedly, notably), bağlayıcı (however).`,
  t: `Cümle zarfları akademik yazımda ihtiyat ve tavır bildirir (arguably, admittedly). Öğrenci bunları hiç kullanmaz.` },

{ id: "nitel.pekistirici", a: "nitel", tr: "Pekiştiriciler", en: "Intensifiers", on: ["nitel.zarf-bicim"], z: 3, l1: 3,
  k: `very (nötr), too (olumsuz, fazlalık), so (sonuç bildiren), such (ad öbeğiyle), quite/rather/fairly (derece).`,
  t: `Türkçe "çok" hepsini birden karşılar ve öğrenci "too" ile "very"yi karıştırır. "The book is too interesting" demek "kitap gereğinden fazla ilginç" demektir — istenmeyen anlam. Ayrıca akademik yazıda "very" aşırı kullanılır; daha güçlü bir sıfat seçmek gerekir (very important → crucial).`,
  ex: [
    { en: `The argument is [[very]] persuasive.`, tr: `Argüman çok ikna edici.`, f: `Nötr pekiştirme.` },
    { en: `The deadline is [[too]] tight to meet.`, tr: `Süre yetişemeyecek kadar dar.`, f: `Olumsuz fazlalık: engel bildirir.` },
    { en: `It was [[such a]] decisive moment [[that]] the alliance split.`, tr: `O kadar belirleyici bir andı ki ittifak bölündü.`, f: `such + a + sıfat + isim.` }
  ],
  sh: [ { y: `The topic is too interesting.`, d: `The topic is very interesting.` } ] },

{ id: "nitel.derecelendirilemeyen", a: "nitel", tr: "Derecelendirilemeyen sıfatlar", en: "Non-gradable adjectives", on: ["nitel.pekistirici"], z: 4, l1: 1,
  k: `essential, impossible, unique, perfect, fundamental gibi mutlak sıfatlar "very" almaz; "absolutely, entirely, utterly" alır.`,
  t: `"very unique", "very essential" yaygın hatadır. Doğrusu "absolutely essential", "entirely unique" veya sadece "essential".` },

/* ═══ 12. VURGU VE BİLGİ YAPISI ═══ */
{ id: "vurgu.devrik", a: "vurgu", tr: "Devrik yapı", en: "Inversion", on: ["iskelet.soru"], z: 5, l1: 1,
  m: `Olumsuz veya sınırlayıcı bir zarf cümle başına çekildiğinde, İngilizce özne ile yardımcı fiili yer değiştirir. Bu resmî ve vurgulu bir tondur.`,
  an: `Bir cümleyi ayağa kaldırmak gibi. Sıra bozulunca kulak dikkat kesilir.`,
  k: `Never, rarely, seldom, not only, no sooner, under no circumstances, little did cümle başında → yardımcı fiil özneden önce.`,
  t: `Türkçe vurguyu sözcük sırasıyla ve tonlamayla kurar; öğrenci bu yapıyı bilmez ve metin retorik olarak düz kalır.`,
  ex: [
    { en: `[[Never before had]] the region faced such a crisis.`, tr: `Bölge daha önce hiç böyle bir krizle karşılaşmamıştı.`, f: `Never başa geçince had öne alınır.` },
    { en: `[[Not only did]] the policy fail, [[but it also]] deepened the crisis.`, tr: `Politika yalnızca başarısız olmadı, krizi de derinleştirdi.`, f: `Not only + devrik yapı.` }
  ],
  ak: `Bir denemede bir kez, doğru yerde kullanılan devrik yapı retorik olgunluk gösterir. İkiden fazlası yapmacık düşer.` },

{ id: "vurgu.yarmali", a: "vurgu", tr: "Yarmalı cümle", en: "Cleft sentences", on: ["yc.ilgi-tanimlayan"], z: 5, l1: 2,
  m: `Cümleyi ikiye bölerek bir öğeyi öne çıkarır. Türkçe bunu vurgu ve sıra değişikliğiyle yapar; İngilizce ayrı bir yapı kurar.`,
  k: `It was X that/who … / What matters is … / The reason why … is that …`,
  t: `Türkçede "Kararı ASIL Konsey aldı" vurguyla kurulur. Öğrenci İngilizcede aynı vurguyu sıra değiştirerek elde etmeye çalışır ve bozuk cümle üretir.`,
  ex: [
    { en: `[[It was]] the veto [[that]] paralysed the Council.`, tr: `Konseyi felç eden şey vetoydu.`, f: `Vurgulanan öğe öne çekilir.` },
    { en: `[[What]] the argument overlooks [[is]] domestic politics.`, tr: `Argümanın gözden kaçırdığı şey iç siyasettir.`, f: `what-yarması.` }
  ] },

{ id: "vurgu.one-cekme", a: "vurgu", tr: "Öne çekme", en: "Fronting", on: ["vurgu.devrik"], z: 5, l1: 1,
  k: `Bir öğeyi vurgu için cümle başına almak: "Of these three explanations, the second is the most persuasive."`,
  t: `Türkçe zaten esnek sıralıdır; öğrenci bunu doğal bulur ama İngilizcede sınırlı ve biçimsel bir araç olduğunu bilmez.` },

{ id: "vurgu.eksilti", a: "vurgu", tr: "Eksilti ve yerine koyma", en: "Ellipsis & substitution", on: ["soylem.bagdasiklik"], z: 4, l1: 2,
  k: `Tekrarı önlemek için düşürme: "Some states ratified the treaty; others did not." "do so", "one", "the former/latter".`,
  t: `Türkçe eksiltiyi farklı işletir; öğrenci tam cümleyi tekrarlar ve metin şişer.` },

{ id: "vurgu.do-vurgu", a: "vurgu", tr: "do ile vurgulama", en: "Emphatic do", on: ["iskelet.olumsuzluk"], z: 3, l1: 1,
  k: `Olumlu cümleye do/does/did eklenerek karşı çıkma vurgusu: "The theory does explain state behaviour, but it ignores agency."`,
  t: `Öğrenci bu aracı bilmez; ödün verme ve karşı görüş kurmada çok işe yarar.` },

/* ═══ 13. AKADEMİK KAYIT ═══ */
{ id: "kayit.oznellik", a: "kayit", tr: "Öznellik denetimi", en: "Managing subjectivity", on: ["cati.kisisiz-edilgen"], z: 4, l1: 2,
  m: `Akademik İngilizce, iddiayı yazarın kişiliğinden ayırır. "Bence" demek iddiayı zayıflatır çünkü tartışmayı kanıttan kişiye taşır.`,
  an: `Mahkemede tanık değil, delil konuşur.`,
  k: `I think → It could be argued that / The evidence suggests that / This analysis indicates that. IB metin türü resmîyse birinci tekil şahıstan kaçın; blog veya kişisel mektupsa serbest.`,
  t: `Türkçe akademik yazımında "kanaatimce, bence" görece daha kabul edilebilirdir. Öğrenci bunu taşır ve deneme boyunca "I think" tekrar eder.`,
  ex: [
    { en: `[[It could be argued that]] institutions constrain state behaviour.`, tr: `Kurumların devlet davranışını sınırladığı savunulabilir.`, f: `İddia kişiden ayrılıyor.` }
  ],
  ak: `Paper 1'de metin türü kayıt belirler. Deneme ve rapor → kişisiz. Blog ve mektup → birinci tekil şahıs zorunlu. Yanlış kayıt seçimi, dilbilgisi kusursuz olsa bile bandı düşürür.` },

{ id: "kayit.ihtiyat", a: "kayit", tr: "İhtiyatlı dil", en: "Hedging", on: ["kip.akademik-kip"], z: 4, l1: 2,
  k: `may, might, tend to, appear to, suggest, largely, arguably, in many cases, it is likely that.`,
  t: `Türkçe akademik gelenek daha kesin iddiaya izin verir. Öğrenci "This proves that…" yazar; savunulamaz. "This suggests that…" hem doğru hem daha güçlüdür.`,
  ex: [
    { en: `The data [[suggest]] that sanctions [[rarely]] alter regime behaviour.`, tr: `Veriler yaptırımların rejim davranışını nadiren değiştirdiğini gösteriyor.`, f: `İki katmanlı ihtiyat.` }
  ] },

{ id: "kayit.resmiyet", a: "kayit", tr: "Resmiyet düzeyi", en: "Formality", on: [], z: 3, l1: 2,
  k: `Resmî metinde: kısaltma yok (don't → do not), deyimsel fiil yerine tek sözcüklü fiil (put off → postpone), "get" yerine "obtain/become", soru etiketleri yok, ünlem yok.`,
  t: `Türkçe resmiyet çoğunlukla sözcük seçimiyle kurulur ve dilbilgisel işaret azdır. Öğrenci resmî metinde gündelik kalıplar kullanır.` },

{ id: "kayit.adlastirma", a: "kayit", tr: "Adlaştırma", en: "Nominalisation", on: ["kayit.resmiyet"], z: 5, l1: 2,
  m: `Fiili isme çevirerek cümleyi yoğunlaştırır ve akademik ton verir: "The government failed" → "the failure of the government".`,
  an: `Bir eylemi paketleyip rafa koymak gibi. Paketlenince başka cümlelerde taşıyabilirsin.`,
  k: `-tion, -ment, -ance, -ity, -al ekleriyle isimleştirme. Aşırısı metni ağırlaştırır; ölçülü kullan.`,
  t: `Türkçe adlaştırmayı -me/-iş ekleriyle kolayca yapar (başarısızlığı, gelişi), ama öğrenci İngilizcede bunu kullanmaz ve metin basit kalır.`,
  ex: [
    { en: `[[The collapse of]] the alliance surprised no one.`, tr: `İttifakın çöküşü kimseyi şaşırtmadı.`, f: `Fiil isme dönüşüp özne oluyor.` }
  ],
  ak: `Üst bant IB denemelerinin en belirgin özelliği yoğun ad öbekleridir. Ama her cümlede kullanılırsa metin okunmaz hale gelir.` },

{ id: "kayit.ib-metin-turleri", a: "kayit", tr: "IB metin türleri ve kayıt", en: "IB text types & register", on: ["kayit.resmiyet"], z: 4, l1: 1,
  k: `Blog: birinci tekil, gündelik, doğrudan hitap, sorular. Resmî e-posta: Dear …, resmî kalıplar, kısaltma yok, Yours sincerely. Makale: başlık, alt başlık, üçüncü şahıs. Konuşma: doğrudan hitap, retorik soru, tekrar. Öneri raporu: başlıklar, madde işaretleri, öneri kipleri. İnceleme: değerlendirici sıfatlar, öneri cümlesi.`,
  t: `Öğrenci tüm metin türlerini aynı kayıtta yazar. IB'de metin türüne uygun kayıt, Mesaj ölçütünün doğrudan parçasıdır.` },

{ id: "kayit.akademik-sozcuk", a: "kayit", tr: "Akademik sözcük seçimi", en: "Academic word choice", on: ["kayit.resmiyet"], z: 4, l1: 2,
  k: `get → obtain/receive. big → substantial/significant. show → demonstrate/indicate. a lot of → considerable. thing → factor/element/aspect.`,
  t: `Türkçe eşdizimler doğrudan taşınır: "take a decision" (doğrusu make), "do a mistake" (doğrusu make), "make a research" (doğrusu conduct/carry out).`,
  sh: [ { y: `The council took a decision.`, d: `The council made a decision.` },
        { y: `We made a research on this topic.`, d: `We conducted research on this topic.` } ] },

{ id: "kayit.asiri-pekistirme", a: "kayit", tr: "Aşırı pekiştirme", en: "Overstatement", on: ["kayit.ihtiyat"], z: 3, l1: 2,
  k: `always, never, all, completely, everyone gibi mutlak ifadeler savunulması zor iddialar üretir. "generally, in most cases, tends to" tercih edilir.`,
  t: `Türkçe retorik gelenek mutlak ifadelere daha toleranslıdır. IB okuyucusu savunulamaz iddiayı kavramsal zayıflık sayar.` },

/* ═══ 14. NOKTALAMA VE MEKANİK ═══ */
{ id: "mek.comma-splice", a: "mekanik", tr: "Virgül yanlışı", en: "Comma splice", on: ["soylem.baglac-turleri"], z: 3, l1: 3,
  m: `İki bağımsız cümle virgülle bağlanamaz. Virgül İngilizcede bağlama gücü olmayan bir işarettir; bağlamak için bağlaç, noktalı virgül veya nokta gerekir.`,
  an: `Virgül bir ip değil, bir nefes molasıdır. İki vagonu nefesle bağlayamazsın, kancaya ihtiyaç var.`,
  k: `Dört çözüm: (1) nokta, (2) noktalı virgül, (3) bağlaç ekle (and, but, so, because), (4) birini yan cümleye çevir.`,
  t: `Türkçede iki bağımsız cümle virgülle bağlanabilir ve bu doğaldır: "Kuram eskimiştir, yine de yararlıdır." Öğrenci bunu doğrudan taşır ve İngilizce metinde her paragrafta tekrarlar.`,
  ex: [
    { en: `The theory is dated[[, but]] it remains useful.`, tr: `Kuram eskimiştir, ama yararlıdır.`, f: `Bağlaç eklendi.` },
    { en: `The theory is dated[[;]] it remains useful.`, tr: `Kuram eskimiştir; yararlıdır.`, f: `Noktalı virgül.` }
  ],
  kp: { d: `The talks failed; however, the ceasefire held.`, y: `The talks failed, however the ceasefire held.`, f: `however virgülle bağlayamaz.` },
  sh: [ { y: `Realism explains conflict, it ignores cooperation.`, d: `Realism explains conflict, but it ignores cooperation.` } ],
  ak: `IB okuyucularının en sık işaretlediği noktalama hatasıdır ve bir metinde birden çok kez görülürse Dil ölçütünde belirleyici olur.` },

{ id: "mek.virgul", a: "mekanik", tr: "Virgül kuralları", en: "Comma rules", on: ["mek.comma-splice"], z: 3, l1: 2,
  k: `Cümle başı öbeğinden sonra, tanımlamayan ilgi cümlesinin iki yanına, listelerde, bağlaçtan önce (and/but iki bağımsız cümleyi bağlarken). Özne ile yüklem arasına asla.`,
  t: `Türkçede virgül tonlamaya göre serbestçe kullanılır. Öğrenci uzun öznelerden sonra virgül koyar: "The impact of these policies, is severe" — yanlış.` },

{ id: "mek.noktali-virgul", a: "mekanik", tr: "Noktalı virgül ve iki nokta", en: "Semicolon & colon", on: ["mek.virgul"], z: 4, l1: 1,
  k: `Noktalı virgül: yakın ilişkili iki bağımsız cümleyi bağlar. İki nokta: açıklama, liste veya alıntı sunar; öncesi tam cümle olmalıdır.`,
  t: `Öğrenci ikisini karıştırır veya hiç kullanmaz. Doğru kullanılmış tek bir noktalı virgül, metnin olgunluk izlenimini yükseltir.` },

{ id: "mek.kesme", a: "mekanik", tr: "Kesme işareti", en: "Apostrophe", on: [], z: 2, l1: 2,
  k: `İyelik (the state's) ve kısaltma (it's = it is). "its" iyelik adılıdır ve kesme almaz. Çoğullarda kesme yoktur: "the 1990s", "NGOs".`,
  t: `its/it's karışması İngilizce anadili konuşurlarında bile yaygındır ve okuyucunun ilk fark ettiği hatalardandır.`,
  sh: [ { y: `The state defended it's interests.`, d: `The state defended its interests.` },
        { y: `Its a complex issue.`, d: `It's a complex issue.` } ] },

{ id: "mek.buyuk-harf", a: "mekanik", tr: "Büyük harf kuralları", en: "Capitalisation", on: [], z: 2, l1: 2,
  k: `Diller, milletler, aylar, günler, özel adlar büyük: English, Turkish, Monday, March. Mevsimler ve akademik disiplinler küçük: spring, political science.`,
  t: `Türkçede aylar ve milletler yazımı farklıdır; ayrıca öğrenci "Political Science" gibi disiplin adlarını gereksiz büyütür.` },

{ id: "mek.tire", a: "mekanik", tr: "Tire ve parantez", en: "Hyphen, dash, parentheses", on: ["mek.virgul"], z: 3, l1: 1,
  k: `Birleşik sıfatta tire: a well-known scholar, a two-day summit (isimden önce). Uzun tire ara açıklama için; parantez ikincil bilgi için.`,
  t: `"a 20 years old student" yerine "a 20-year-old student". Öğrenci birleşik sıfatta çoğul bırakır.` }
];

export const DUGUMLER = [...D_A, ...D_B, ...D_C, ...D_D, ...D_E];
export const DUGUM_HARITA = Object.fromEntries(DUGUMLER.map((d) => [d.id, d]));
export const dugum = (id) => DUGUM_HARITA[id];
export const aileninDugumleri = (aid) => DUGUMLER.filter((d) => d.a === aid);

/* ─── EŞDİZİM DAĞARCIĞI ─────────────────────────────────────────────
   Fiile/sıfata/ada bağımlı edatlar Türk öğrencinin en pahalı hata
   kaynağıdır. Ayrı bir aralıklı tekrar modülü hak eder. ─────────── */

export const ESDIZIM = [
  { e: "depend", p: "on", t: "-e bağlı olmak", c: `The outcome depends on domestic politics.`, tuzak: "Türkçe -e hâli 'to' düşündürür." },
  { e: "result", p: "in", t: "ile sonuçlanmak", c: `The crisis resulted in mass displacement.`, tuzak: "result from = kaynaklanmak. Yön ters." },
  { e: "result", p: "from", t: "-den kaynaklanmak", c: `The deadlock resulted from mutual distrust.`, tuzak: "in ile karıştırılır." },
  { e: "consist", p: "of", t: "-den oluşmak", c: `The treaty consists of four protocols.`, tuzak: "Edat tamamen düşürülür." },
  { e: "contribute", p: "to", t: "-e katkıda bulunmak", c: `Sanctions contributed to the collapse.`, tuzak: null },
  { e: "lead", p: "to", t: "-e yol açmak", c: `Polarisation leads to institutional decay.`, tuzak: null },
  { e: "refer", p: "to", t: "-e atıfta bulunmak", c: `The author refers to Waltz throughout.`, tuzak: null },
  { e: "cope", p: "with", t: "ile baş etmek", c: `States cope with anarchy by balancing.`, tuzak: "Türkçe 'ile' → with, doğru eşleşir." },
  { e: "comply", p: "with", t: "-e uymak", c: `The regime refused to comply with the ruling.`, tuzak: "Türkçe -e hâli 'to' düşündürür." },
  { e: "insist", p: "on", t: "-de ısrar etmek", c: `He insisted on an immediate ceasefire.`, tuzak: null },
  { e: "focus", p: "on", t: "-e odaklanmak", c: `The chapter focuses on regional security.`, tuzak: null },
  { e: "rely", p: "on", t: "-e güvenmek", c: `Small states rely on institutions.`, tuzak: null },
  { e: "account", p: "for", t: "açıklamak / oranını oluşturmak", c: `Realism cannot account for cooperation.`, tuzak: "Tek sözcük değil, anlamı bileşenlerden çıkmaz." },
  { e: "benefit", p: "from", t: "-den yararlanmak", c: `Both sides benefited from the truce.`, tuzak: "Türkçe -den → from, doğru." },
  { e: "differ", p: "from", t: "-den farklı olmak", c: `Neorealism differs from classical realism.`, tuzak: "'than' değil." },
  { e: "participate", p: "in", t: "-e katılmak", c: `Turkey participated in the summit.`, tuzak: "attend edat almaz, participate alır." },
  { e: "succeed", p: "in", t: "-de başarılı olmak", c: `They succeeded in blocking the motion.`, tuzak: "Ardından gerund gelir." },
  { e: "object", p: "to", t: "-e itiraz etmek", c: `Delegates objected to the wording.`, tuzak: "to edattır → object to doing." },
  { e: "respond", p: "to", t: "-e yanıt vermek", c: `The ministry responded to the allegations.`, tuzak: null },
  { e: "attribute", p: "to", t: "-e atfetmek", c: `Scholars attribute the failure to weak enforcement.`, tuzak: null },
  { e: "associate", p: "with", t: "ile ilişkilendirmek", c: `Democracy is associated with peace.`, tuzak: null },
  { e: "amount", p: "to", t: "-e varmak / eşdeğer olmak", c: `The move amounts to a de facto annexation.`, tuzak: null },
  { e: "engage", p: "in", t: "-e girişmek", c: `The parties engaged in indirect talks.`, tuzak: null },
  { e: "adhere", p: "to", t: "-e bağlı kalmak", c: `Signatories must adhere to the protocol.`, tuzak: null },
  { e: "stem", p: "from", t: "-den kaynaklanmak", c: `The dispute stems from colonial borders.`, tuzak: null },
  { e: "discuss", p: null, t: "tartışmak", c: `The committee will discuss the proposal.`, tuzak: "discuss about YOKTUR. Türkçe -i hâli edat düşündürmemeli." },
  { e: "attend", p: null, t: "-e katılmak", c: `She attended the conference in Ankara.`, tuzak: "attend to = ilgilenmek, farklı anlam. Toplantıya katılmak edat almaz." },
  { e: "enter", p: null, t: "-e girmek", c: `The delegation entered the chamber.`, tuzak: "enter to YOKTUR." },
  { e: "contact", p: null, t: "ile temas kurmak", c: `Please contact the secretariat.`, tuzak: "contact with YOKTUR." },
  { e: "approach", p: null, t: "-e yaklaşmak", c: `They approached the problem differently.`, tuzak: "approach to YOKTUR (fiil olarak)." },
  { e: "answer", p: null, t: "-e cevap vermek", c: `He answered the question directly.`, tuzak: "answer to = birine hesap vermek, farklı." },
  { e: "emphasise", p: null, t: "vurgulamak", c: `The report emphasises institutional design.`, tuzak: "emphasise on YOKTUR." },
  { e: "lack", p: null, t: "-den yoksun olmak", c: `The council lacks enforcement power.`, tuzak: "lack of yalnızca isim olarak." },
  { e: "responsible", p: "for", t: "-den sorumlu", c: `The ministry is responsible for enforcement.`, tuzak: null, tip: "sifat" },
  { e: "aware", p: "of", t: "-in farkında", c: `Delegates were aware of the risks.`, tuzak: null, tip: "sifat" },
  { e: "capable", p: "of", t: "-e muktedir", c: `The state is capable of projecting power.`, tuzak: "Ardından gerund.", tip: "sifat" },
  { e: "consistent", p: "with", t: "ile tutarlı", c: `The findings are consistent with earlier work.`, tuzak: null, tip: "sifat" },
  { e: "relevant", p: "to", t: "-le ilgili", c: `That objection is not relevant to the motion.`, tuzak: null, tip: "sifat" },
  { e: "subject", p: "to", t: "-e tabi", c: `The clause is subject to review.`, tuzak: null, tip: "sifat" },
  { e: "prone", p: "to", t: "-e yatkın", c: `Weak states are prone to external intervention.`, tuzak: null, tip: "sifat" },
  { e: "committed", p: "to", t: "-e bağlı / adanmış", c: `They remain committed to disarmament.`, tuzak: "to edattır → committed to doing.", tip: "sifat" },
  { e: "reason", p: "for", t: "-in nedeni", c: `The reason for the delay was procedural.`, tuzak: "reason of YANLIŞ.", tip: "ad" },
  { e: "solution", p: "to", t: "-in çözümü", c: `There is no military solution to this conflict.`, tuzak: "solution of YANLIŞ.", tip: "ad" },
  { e: "effect", p: "on", t: "-e etkisi", c: `Sanctions had little effect on the regime.`, tuzak: "effect to YANLIŞ.", tip: "ad" },
  { e: "increase", p: "in", t: "-de artış", c: `A sharp increase in defence spending followed.`, tuzak: "increase of yalnızca miktar için.", tip: "ad" },
  { e: "attitude", p: "towards", t: "-e karşı tutum", c: `Public attitudes towards migration hardened.`, tuzak: null, tip: "ad" },
  { e: "approach", p: "to", t: "-e yaklaşım", c: `A pragmatic approach to enforcement is needed.`, tuzak: "Fiil hâli edat almaz, ad hâli 'to' alır.", tip: "ad" },
  { e: "access", p: "to", t: "-e erişim", c: `Access to the archives remains restricted.`, tuzak: null, tip: "ad" },
  { e: "alternative", p: "to", t: "-e alternatif", c: `There is no credible alternative to negotiation.`, tuzak: null, tip: "ad" }
];

/* ══════════════════════ MOTOR ══════════════════════ */

export const SEVIYELER = [
  { esik: 0,  ad: "Tanışma",     renk: C.murekkepSis },
  { esik: 21, ad: "Tanıma",      renk: C.lacivert },
  { esik: 41, ad: "Uygulama",    renk: C.zumrut },
  { esik: 61, ad: "Üretim",      renk: C.altin },
  { esik: 81, ad: "Otomatiklik", renk: C.lal }
];
export const seviyeBul = (p) => [...SEVIYELER].reverse().find((s) => p >= s.esik) || SEVIYELER[0];

export const BOS_KAYIT = { puan: 0, dogru: 0, yanlis: 0, basamak: 1, sonGorulme: null, guven: 0, gecmis: [] };

export function ustalikGuncelle(kayit, dogruMu, basamak) {
  const k = { ...BOS_KAYIT, ...(kayit || {}) };
  const agirlik = [0, 4, 5, 7, 9, 12][Math.min(basamak, 5)] || 5;
  if (dogruMu) { k.puan = Math.min(100, Math.round(k.puan + agirlik * (1 - k.puan / 135))); k.dogru += 1; }
  else { k.puan = Math.max(0, Math.round(k.puan - agirlik * 0.85)); k.yanlis += 1; }
  k.gecmis = [...(k.gecmis || []), dogruMu ? 1 : 0].slice(-12);
  const n = k.gecmis.length;
  k.guven = n < 4 ? 0 : Math.round((k.gecmis.reduce((a, b) => a + b, 0) / n) * 100) / 100;
  k.sonGorulme = bugun();
  if (dogruMu && k.puan >= [0, 25, 45, 62, 80, 100][k.basamak]) k.basamak = Math.min(5, k.basamak + 1);
  return k;
}

export function sonumlenmisPuan(kayit) {
  if (!kayit || !kayit.sonGorulme) return kayit ? kayit.puan || 0 : 0;
  const gun = gunFarki(kayit.sonGorulme, bugun());
  if (gun < 21) return kayit.puan;
  return Math.max(0, Math.round(kayit.puan * Math.pow(0.9, Math.floor(gun / 21))));
}

export function aileOrtalamasi(ustalik, aid) {
  const ds = aileninDugumleri(aid);
  if (!ds.length) return 0;
  return Math.round(ds.reduce((a, d) => a + sonumlenmisPuan(ustalik[d.id]), 0) / ds.length);
}

export const genelUstalik = (ustalik) =>
  Math.round(DUGUMLER.reduce((a, d) => a + sonumlenmisPuan(ustalik[d.id]), 0) / DUGUMLER.length);

export function kilitliMi(d, ustalik) {
  if (!d.on || !d.on.length) return false;
  return d.on.some((o) => sonumlenmisPuan(ustalik[o]) < 30);
}

export function zayifDugumler(ustalik, hatalar, adet = 5, kilitSay = true) {
  const hataSayi = {};
  (hatalar || []).forEach((h) => { if (!h.cozuldu && h.dugumId) hataSayi[h.dugumId] = (hataSayi[h.dugumId] || 0) + (h.maliyet || 2); });
  return DUGUMLER
    .filter((d) => !kilitSay || !kilitliMi(d, ustalik))
    .map((d) => {
      const p = sonumlenmisPuan(ustalik[d.id]);
      const skor = (100 - p) * (1 + d.l1 * 0.35) + (hataSayi[d.id] || 0) * 6 - (!ustalik[d.id] ? 18 : 0);
      return { d, p, skor };
    })
    .sort((a, b) => b.skor - a.skor)
    .slice(0, adet);
}

/* ─── ARALIKLI TEKRAR ──────────────────────────────────────────────── */

export function srsGuncelle(kart, kalite) {
  let tekrar = kart.tekrar || 0, aralik = kart.aralik || 0, kolaylik = kart.kolaylik || 2.5;
  if (kalite < 3) { tekrar = 0; aralik = 1; }
  else { tekrar += 1; aralik = tekrar === 1 ? 1 : tekrar === 2 ? 4 : Math.max(1, Math.round(aralik * kolaylik)); }
  kolaylik = Math.max(1.3, Math.min(2.8, kolaylik + (0.1 - (5 - kalite) * (0.08 + (5 - kalite) * 0.02))));
  return { ...kart, tekrar, aralik, kolaylik, sonrakiTarih: gunEkle(bugun(), aralik), sonGorulme: bugun() };
}
export const bekleyenTekrarlar = (hatalar) =>
  (hatalar || []).filter((h) => !h.cozuldu && (!h.srs || !h.srs.sonrakiTarih || h.srs.sonrakiTarih <= bugun()));
export const musallatHatalar = (hatalar) =>
  (hatalar || []).filter((h) => !h.cozuldu && (h.tekrarSayisi || 1) >= 3);

/* ─── HATA ÇÖZÜMLEME ───────────────────────────────────────────────── */

export function hataOrguleri(hatalar, adet = 5) {
  const grup = {};
  (hatalar || []).forEach((h) => {
    if (h.cozuldu) return;
    const a = h.dugumId || h.dugumAdi || h.aile || "?";
    if (!grup[a]) grup[a] = { anahtar: a, dugumId: h.dugumId, dugumAdi: h.dugumAdi, aile: h.aile, sayi: 0, maliyet: 0, l1: 0, ornek: h };
    grup[a].sayi += 1; grup[a].maliyet += h.maliyet || 2;
    if (h.l1Kaynakli) grup[a].l1 += 1;
  });
  return Object.values(grup)
    .map((g) => ({ ...g, oncelik: g.maliyet * Math.log2(1 + g.sayi) }))
    .sort((a, b) => b.oncelik - a.oncelik).slice(0, adet);
}

export function hataYogunlugu(metinler, kac = 5) {
  const son = (metinler || []).filter((m) => m.kelimeSayisi).slice(-kac);
  if (!son.length) return null;
  const k = son.reduce((a, m) => a + m.kelimeSayisi, 0);
  const h = son.reduce((a, m) => a + (m.hataSayisi || 0), 0);
  return k ? Math.round((h / k) * 1000) : null;
}

export function l1Payi(hatalar) {
  const a = hatalar || [];
  return a.length ? Math.round((a.filter((h) => h.l1Kaynakli).length / a.length) * 100) : null;
}

/* ─── KEHANET: hata öngörü modeli ───────────────────────────────────
   Uygulama, sen yazmadan önce hangi hataları yapacağını tahmin eder.
   Tahmin isabeti yükseldikçe modelin seni tanıdığı, düştükçe senin
   modelden kaçtığın anlaşılır. Nihai hedef: isabetin çökmesi. ────── */

export function kehanetUret(hatalar, ustalik, adet = 4) {
  const orgu = hataOrguleri(hatalar, 14);
  const puanlar = orgu.map((g) => {
    const d = g.dugumId ? dugum(g.dugumId) : null;
    const taze = g.ornek && g.ornek.tarih ? Math.max(0, 30 - gunFarki(g.ornek.tarih.slice(0, 10), bugun())) / 30 : 0.4;
    const ust = d ? sonumlenmisPuan(ustalik[d.id]) : 30;
    return { ...g, olasilik: Math.min(0.96, (g.sayi * 0.16 + taze * 0.3 + (100 - ust) / 210) * (g.l1 > 0 ? 1.18 : 1)) };
  });
  return puanlar.sort((a, b) => b.olasilik - a.olasilik).slice(0, adet);
}

export function kehanetDegerlendir(tahminler, gercekHatalar) {
  if (!tahminler || !tahminler.length) return null;
  const gercek = new Set((gercekHatalar || []).map((h) => h.dugumId || h.dugumAdi || h.aile));
  const tutan = tahminler.filter((t) => gercek.has(t.anahtar) || gercek.has(t.dugumId) || gercek.has(t.aile));
  return { toplam: tahminler.length, tutan: tutan.length, isabet: Math.round((tutan.length / tahminler.length) * 100), tutanlar: tutan.map((t) => t.anahtar) };
}

/* ─── EŞDİZİM MOTORU ───────────────────────────────────────────────── */

export const esdizimAnahtar = (x) => `${x.e}|${x.p || "-"}`;
export function esdizimKuyrugu(durum) {
  return ESDIZIM.filter((x) => {
    const k = durum[esdizimAnahtar(x)];
    return !k || !k.sonrakiTarih || k.sonrakiTarih <= bugun();
  });
}

/* ─── PALİMPSEST: geçmiş metnin yeniden yazımı ─────────────────────── */

export function palimpsestAdaylari(metinler) {
  return (metinler || [])
    .filter((m) => m.tamMetin && m.gorev && !m.palimpsestId && gunFarki(m.tarih.slice(0, 10), bugun()) >= 21)
    .sort((a, b) => new Date(a.tarih) - new Date(b.tarih));
}

/* ─── OCAK: günün on dakikası ──────────────────────────────────────── */

export function ocakKur(ustalik, hatalar, esdizim, dag) {
  const kelimeTekrar = dag ? vadesiGelenler(dag).length : 0;
  const tekrar = bekleyenTekrarlar(hatalar).length;
  const zayif = zayifDugumler(ustalik, hatalar, 1)[0];
  const esd = esdizimKuyrugu(esdizim || {}).length;
  const musallat = musallatHatalar(hatalar)[0];
  const adimlar = [];
  if (tekrar > 0) adimlar.push({ tip: "tekrar", ad: `${Math.min(tekrar, 12)} hata kartı`, dk: Math.ceil(Math.min(tekrar, 12) * 0.5), hedef: "defter" });
  if (musallat) adimlar.push({ tip: "musallat", ad: "Musallat hatayı kır", dk: 4, hedef: "defter" });
  if (zayif) adimlar.push({ tip: "tuzak", ad: `Tuzak cümle · ${zayif.d.tr}`, dk: 3, hedef: "talim", dugumId: zayif.d.id });
  if (esd > 0) adimlar.push({ tip: "esdizim", ad: `${Math.min(esd, 10)} eşdizim`, dk: 2, hedef: "talim" });
  if (kelimeTekrar > 0) adimlar.push({ tip: "kelime", ad: `${Math.min(kelimeTekrar, 20)} kelime tekrarı`, dk: Math.ceil(Math.min(kelimeTekrar, 20) * 0.25), hedef: "dagarcik" });
  else adimlar.push({ tip: "kelime", ad: "Yeni kelime keşfet", dk: 4, hedef: "dagarcik" });
  adimlar.push({ tip: "yaz", ad: "60 saniyelik serbest üretim", dk: 2, hedef: "yazihane" });
  return { adimlar, toplamDk: adimlar.reduce((a, x) => a + x.dk, 0) };
}

/* ─── SERİ ─────────────────────────────────────────────────────────── */

export function seriHesapla(oturumlar) {
  const gunler = [...new Set((oturumlar || []).map((o) => (o.tarih || "").slice(0, 10)))].sort().reverse();
  if (!gunler.length) return 0;
  let s = 0, g = bugun();
  if (gunler[0] !== bugun() && gunler[0] !== gunEkle(bugun(), -1)) return 0;
  if (gunler[0] === gunEkle(bugun(), -1)) g = gunEkle(bugun(), -1);
  for (const x of gunler) { if (x === g) { s += 1; g = gunEkle(g, -1); } else if (x < g) break; }
  return s;
}

export const norm = (s) => String(s || "").toLocaleLowerCase("en").replace(/[.,;:!?—–"'`]/g, "").replace(/\s+/g, " ").trim();
export const kelimeSay = (s) => (String(s || "").trim() ? String(s).trim().split(/\s+/).length : 0);


/* ══════════════════════════════════════════════════════════════════════
   D A Ğ A R C I K   —   IB English B HL kelime hazinesi
   1024 kelime · B1/B2/C1 · beş tema, kırk iki durak
   Her kelime: İngilizce · Türkçe · seviye · tür · durak · örnek · eşdizim
   ══════════════════════════════════════════════════════════════════════ */

export const HAM = HAM_HEPSI;

/* ─── Hatlar ve duraklar ───────────────────────────────────────────
   Beş IB teması = beş hat. Her konu bir durak. Ek setler altıncı
   hatta toplanır: sınavın kendisi için gereken dil. ─────────────── */

export { HATLAR, DURAK_META };

export const TUR_AD = { n: "isim", v: "fiil", adj: "sıfat", adv: "zarf", phr: "kalıp", conj: "bağlaç", prep: "edat", idm: "deyim", pv: "öbek fiil" };
export const turYaz = (p) => String(p || "").split(",").map((x) => TUR_AD[x.trim()] || x.trim()).join(", ");

/* ─── Ayrıştırma ───────────────────────────────────────────────────
   Aynı kelime birden çok durakta geçebilir (bias: medya, eşitlik,
   bilim). Tek kart olarak birleştirilir, durakların hepsi saklanır,
   böylece tekrar kuyruğunda üç kez çıkmaz. ──────────────────────── */

export const KELIMELER = (() => {
  const harita = new Map();
  HAM.trim().split("\n").forEach((satir) => {
    const s = satir.trim();
    if (!s || s.startsWith("#")) return;
    const p = s.split("|");
    if (p.length !== 7) return;
    const [w, tr, lv, pos, durak, ornek, esdizim] = p.map((x) => x.trim());
    if (!DURAK_META[durak]) return;
    const anahtar = w.toLocaleLowerCase("en");
    const mevcut = harita.get(anahtar);
    if (mevcut) {
      if (!mevcut.duraklar.includes(durak)) {
        mevcut.duraklar.push(durak);
        mevcut.ekAnlam.push({ durak, tr, ornek, esdizim });
      }
      return;
    }
    harita.set(anahtar, {
      id: "k_" + anahtar.replace(/-/g, "x").replace(/[^a-z0-9]+/g, "_"),
      w, tr, lv, pos, ornek, esdizim,
      durak, duraklar: [durak], ekAnlam: [],
      hat: DURAK_META[durak].hat
    });
  });
  return [...harita.values()];
})();

export const KELIME_HARITA = Object.fromEntries(KELIMELER.map((k) => [k.id, k]));
export const kelime = (id) => KELIME_HARITA[id];
export const duraginKelimeleri = (d) => KELIMELER.filter((k) => k.duraklar.includes(d));
export const hattinKelimeleri = (h) => KELIMELER.filter((k) => k.duraklar.some((d) => DURAK_META[d].hat === h));
export const SEVIYE_RENK = { A2: "#66758F", B1: "#0C8A54", B2: "#1B4FCF", C1: "#B8257A", C2: "#6A3BD6" };

/* ─── Leitner kutuları ─────────────────────────────────────────────
   Metro des Mots'taki beş kutu: 1 gün, 3 gün, 1 hafta, 2 hafta,
   1 ay. Beşini de geçen kelime ustalaşılmış sayılır. ────────────── */

export const KUTULAR = [
  { no: 1, gun: 1,  ad: "ilk gün" },
  { no: 2, gun: 3,  ad: "üç gün" },
  { no: 3, gun: 7,  ad: "bir hafta" },
  { no: 4, gun: 14, ad: "iki hafta" },
  { no: 5, gun: 30, ad: "bir ay" }
];

export const BOS_KELIME = { kutu: 0, dogru: 0, yanlis: 0, sonrakiTarih: null, sonGorulme: null, usta: false, zor: false, seri: 0 };

export function kelimeGuncelle(kayit, dogruMu) {
  const k = { ...BOS_KELIME, ...(kayit || {}) };
  if (dogruMu) {
    k.dogru += 1; k.seri += 1;
    k.kutu = Math.min(5, (k.kutu || 0) + 1);
    if (k.kutu >= 5 && k.seri >= 2) k.usta = true;
  } else {
    k.yanlis += 1; k.seri = 0;
    k.kutu = Math.max(1, (k.kutu || 1) - 1);
    k.usta = false;
    if (k.yanlis >= 2) k.zor = true;
  }
  const g = (KUTULAR[Math.max(0, k.kutu - 1)] || KUTULAR[0]).gun;
  k.sonrakiTarih = gunEkle(bugun(), dogruMu ? g : 1);
  k.sonGorulme = bugun();
  return k;
}

export const ogrenilenler = (dag) => KELIMELER.filter((k) => dag[k.id] && dag[k.id].kutu > 0);
export const ustalasilanlar = (dag) => KELIMELER.filter((k) => dag[k.id] && dag[k.id].usta);
export const zorKelimeler = (dag) => KELIMELER.filter((k) => dag[k.id] && dag[k.id].zor && !dag[k.id].usta);
export const vadesiGelenler = (dag) => KELIMELER.filter((k) => {
  const s = dag[k.id];
  return s && s.kutu > 0 && !s.usta && (!s.sonrakiTarih || s.sonrakiTarih <= bugun());
});
export const kesfedilmemis = (dag, liste) => (liste || KELIMELER).filter((k) => !dag[k.id] || !dag[k.id].kutu);

export function durakIlerleme(dag, d) {
  const ks = duraginKelimeleri(d);
  if (!ks.length) return { toplam: 0, baslanan: 0, usta: 0, oran: 0 };
  const baslanan = ks.filter((k) => dag[k.id] && dag[k.id].kutu > 0).length;
  const usta = ks.filter((k) => dag[k.id] && dag[k.id].usta).length;
  return { toplam: ks.length, baslanan, usta, oran: Math.round((usta / ks.length) * 100) };
}

export function hatIlerleme(dag, h) {
  const ks = hattinKelimeleri(h);
  if (!ks.length) return { toplam: 0, usta: 0, oran: 0 };
  const usta = ks.filter((k) => dag[k.id] && dag[k.id].usta).length;
  return { toplam: ks.length, usta, oran: Math.round((usta / ks.length) * 100) };
}

/* Kelime dağarcığı tahmini: ustalaşılan + kısmen bilinen */
export function dagarcikTahmini(dag) {
  let t = 0;
  KELIMELER.forEach((k) => { const s = dag[k.id]; if (s && s.kutu) t += s.usta ? 1 : s.kutu / 6; });
  return Math.round(t);
}

export const karistir = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const rastgele = (a) => a[Math.floor(Math.random() * a.length)];

/* Cevap karşılaştırma: aksan, noktalama ve ufak yazım hatası affedilir */
export function kelimeEsit(verilen, hedef) {
  const sade = (x) => String(x || "").toLocaleLowerCase("en").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const a = sade(verilen), b = sade(hedef);
  if (!a) return { ok: false, yakin: false };
  if (a === b) return { ok: true, yakin: false };
  if (b.length > 4 && mesafe(a, b) <= 1) return { ok: true, yakin: true };
  return { ok: false, yakin: b.length > 5 && mesafe(a, b) <= 2 };
}

export function mesafe(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let onceki = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const simdi = [i];
    for (let j = 1; j <= n; j++) {
      simdi[j] = Math.min(onceki[j] + 1, simdi[j - 1] + 1, onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    onceki = simdi;
  }
  return onceki[n];
}

/* Çeldirici üretimi: aynı duraktan, aynı türden, benzer uzunlukta */
export function celdiriciler(hedef, havuz, adet) {
  const ayni = havuz.filter((k) => k.id !== hedef.id && k.durak === hedef.durak && k.pos === hedef.pos);
  const tur = havuz.filter((k) => k.id !== hedef.id && k.pos === hedef.pos);
  const hepsi = havuz.filter((k) => k.id !== hedef.id);
  const sec = [];
  for (const kume of [ayni, tur, hepsi, KELIMELER]) {
    for (const k of karistir(kume)) {
      if (sec.length >= adet) break;
      if (!sec.some((x) => x.id === k.id) && k.id !== hedef.id) sec.push(k);
    }
    if (sec.length >= adet) break;
  }
  return sec.slice(0, adet);
}


/* ══════════════════════════════════════════════════════════════════════
   F X   —   parçacık, hareket ve yaşayan gökyüzü
   Uygulamayı açmanın kendisi bir şey olsun diye. ═══════════════════════ */

export const AZ_HAREKET = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } };

export function titre(sure) { try { if (navigator.vibrate && !AZ_HAREKET()) navigator.vibrate(sure || 12); } catch {} }

/* ─── Parçacık motoru ─────────────────────────────────────────────── */
export const PRC = { tuval: null, ctx: null, liste: [], calisiyor: false };

export function prcCtx() {
  if (PRC.ctx) return PRC.ctx;
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:120";
  const o = window.devicePixelRatio || 1;
  c.width = innerWidth * o; c.height = innerHeight * o;
  c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
  document.body.appendChild(c);
  const x = c.getContext("2d"); x.scale(o, o);
  PRC.tuval = c; PRC.ctx = x;
  return x;
}

export function prcCalistir() {
  if (PRC.calisiyor) return;
  PRC.calisiyor = true;
  const ctx = prcCtx(); if (!ctx) { PRC.calisiyor = false; return; }
  const adim = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    PRC.liste = PRC.liste.filter((p) => {
      p.omur -= 1; if (p.omur <= 0) return false;
      p.vy += p.k === "k" ? 0.34 : 0.05;
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.995;
      const a = Math.min(1, p.omur / 36);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(p.x, p.y);
      if (p.k === "k") {
        p.r += p.vr; p.ph += p.vph;
        ctx.rotate(p.r);
        const g = Math.abs(Math.cos(p.ph));
        ctx.fillStyle = p.c;
        if (p.yildiz) {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const t = (i / 5) * Math.PI * 2 - Math.PI / 2;
            ctx.lineTo(Math.cos(t) * p.b, Math.sin(t) * p.b * g);
            const t2 = t + Math.PI / 5;
            ctx.lineTo(Math.cos(t2) * p.b * 0.44, Math.sin(t2) * p.b * 0.44 * g);
          }
          ctx.closePath(); ctx.fill();
        } else ctx.fillRect(-p.b / 2, -p.b * g / 2, p.b, p.b * g);
      } else {
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(0, 0, p.b * a, 0, 7); ctx.fill();
      }
      ctx.restore();
      return true;
    });
    if (PRC.liste.length) requestAnimationFrame(adim);
    else { PRC.calisiyor = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  };
  requestAnimationFrame(adim);
}

export const KONFETI_RENK = ["#1B4FCF", "#F0A400", "#D7322A", "#0C8A54", "#0C97A8", "#B8257A", "#6A3BD6"];

export function konfeti(n, opt) {
  if (AZ_HAREKET() || !prcCtx()) return;
  n = n || 110; opt = opt || {};
  const yanlardan = n >= 150;
  for (let i = 0; i < n; i++) {
    let x, y, vx, vy;
    if (yanlardan && i % 3 !== 0) {
      const sol = i % 2 === 0;
      x = sol ? -10 : innerWidth + 10; y = innerHeight * (0.52 + Math.random() * 0.22);
      vx = (sol ? 1 : -1) * (6 + Math.random() * 9); vy = -9 - Math.random() * 9;
    } else {
      x = (opt.x ?? innerWidth / 2) + (Math.random() - 0.5) * 90;
      y = opt.y ?? innerHeight * 0.33;
      vx = (Math.random() - 0.5) * 14; vy = -Math.random() * 11 - 5;
    }
    PRC.liste.push({ k: "k", x, y, vx, vy, b: 6 + Math.random() * 7, r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.24, ph: Math.random() * 6, vph: 0.08 + Math.random() * 0.13,
      c: KONFETI_RENK[i % KONFETI_RENK.length], yildiz: Math.random() < 0.16, omur: 160 + Math.random() * 44 });
  }
  prcCalistir();
}

export function kivilcim(x, y, renk, n) {
  if (AZ_HAREKET() || !prcCtx()) return;
  for (let i = 0; i < (n || 16); i++) {
    const a = (i / (n || 16)) * Math.PI * 2 + Math.random() * 0.5, h = 2 + Math.random() * 4.5;
    PRC.liste.push({ k: "p", x, y, vx: Math.cos(a) * h, vy: Math.sin(a) * h - 1,
      b: 1.8 + Math.random() * 2.4, c: renk || "#F0A400", omur: 34 + Math.random() * 20 });
  }
  prcCalistir();
}

export function kivilcimOge(el, renk, n) {
  if (!el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect();
  kivilcim(r.left + r.width / 2, r.top + r.height / 2, renk, n);
}

/* ─── Sayı sayma animasyonu ───────────────────────────────────────── */
export function useSayac(hedef, sure) {
  const [n, setN] = useState(AZ_HAREKET() ? hedef : 0);
  const ref = useRef(hedef);
  useEffect(() => {
    if (AZ_HAREKET()) { setN(hedef); ref.current = hedef; return; }
    const bas = ref.current, fark = hedef - bas, t0 = Date.now(), T = sure || 900;
    if (!fark) { setN(hedef); return; }
    let id = 0;
    const adim = () => {
      const p = Math.min(1, (Date.now() - t0) / T);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(bas + fark * e));
      if (p < 1) id = requestAnimationFrame(adim); else ref.current = hedef;
    };
    id = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(id);
  }, [hedef, sure]);
  return n;
}

/* ─── Gökyüzü evreleri ────────────────────────────────────────────── */

export function gunesSaatleri(d) {
  /* İstanbul için yaklaşık doğuş/batış, dakika cinsinden */
  const bas = new Date(d.getFullYear(), 0, 0);
  const gun = Math.floor((d - bas) / 86400000);
  const enlem = 41.01 * Math.PI / 180;
  const egim = 23.44 * Math.PI / 180 * Math.sin(2 * Math.PI * (gun - 81) / 365);
  let cos_h = -Math.tan(enlem) * Math.tan(egim);
  cos_h = Math.max(-1, Math.min(1, cos_h));
  const h = Math.acos(cos_h) * 180 / Math.PI / 15;
  const ogle = 12 * 60 + 12;
  return { dogus: Math.round(ogle - h * 60), batis: Math.round(ogle + h * 60) };
}

export const GOKYUZU = {
  gece:   { ust: "#07102E", orta: "#122250", alt: "#263B74", murekkep: "light", yildiz: 1,   ay: 1,   gunes: 0, pencere: .40, bulut: "#2A3A6E", bO: .34, uzak: "#1A2550", yuz: "#1E2A56", cati: "#131C3E", pKapali: "#26346A", pAcik: "#FFD27A", deniz1: "#0D1B48", deniz2: "#060D26", kule: "#FFE0A0", vapur: "#C4CBDA" },
  gecYari:{ ust: "#040A20", orta: "#0C1842", alt: "#1E3066", murekkep: "light", yildiz: 1,   ay: 1,   gunes: 0, pencere: .08, bulut: "#283464", bO: .3,  uzak: "#152048", yuz: "#1A254E", cati: "#101736", pKapali: "#23305C", pAcik: "#FFCF6E", deniz1: "#0A1536", deniz2: "#04091F", kule: "#E8C877", vapur: "#B8C0D2" },
  safak:  { ust: "#2A3C7E", orta: "#B87CA6", alt: "#FFC88E", murekkep: "light", yildiz: .32, ay: .65, gunes: 1, pencere: .18, bulut: "#F3BAB4", bO: .72, uzak: "#8E7FA6", yuz: "#C9A9A4", cati: "#6C6C92", pKapali: "#9E95B6", pAcik: "#FFD27A", deniz1: "#C5909F", deniz2: "#5C5C8C", kule: "#FFE4B0", vapur: "#EEF0F4" },
  gunduz: { ust: "#5E9BE8", orta: "#A6CFF5", alt: "#E6F3FF", murekkep: "dark",  yildiz: 0,   ay: 0,   gunes: 1, pencere: 0,   bulut: "#FFFFFF", bO: .9,  uzak: "#AEC2DC", yuz: "#EFE1C8", cati: "#73849F", pKapali: "#A1B6CE", pAcik: "#FFE6A3", deniz1: "#82B0DD", deniz2: "#4472AA", kule: "#D8C49A", vapur: "#F3F5F8" },
  altin:  { ust: "#4A62BA", orta: "#EFA080", alt: "#FFD890", murekkep: "light", yildiz: 0,   ay: 0,   gunes: 1, pencere: .14, bulut: "#FFDAC4", bO: .86, uzak: "#B791A2", yuz: "#E9C197", cati: "#706C91", pKapali: "#B99CA0", pAcik: "#FFD27A", deniz1: "#E69E85", deniz2: "#6E619C", kule: "#FFE0A0", vapur: "#F6EFE6" },
  mavi:   { ust: "#17276A", orta: "#4959A8", alt: "#E2917C", murekkep: "light", yildiz: .5,  ay: 1,   gunes: 0, pencere: .36, bulut: "#5C66A8", bO: .52, uzak: "#35427C", yuz: "#38437C", cati: "#252E5E", pKapali: "#404C88", pAcik: "#FFD27A", deniz1: "#3D4D94", deniz2: "#162054", kule: "#FFD890", vapur: "#D2D7E4" }
};

export function gokEvresi(d) {
  d = d || new Date();
  const { dogus, batis } = gunesSaatleri(d);
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= dogus - 70 && m < dogus + 28) return "safak";
  if (m >= dogus + 28 && m < batis - 70) return "gunduz";
  if (m >= batis - 70 && m < batis + 14) return "altin";
  if (m >= batis + 14 && m < batis + 72) return "mavi";
  return (m >= 60 && m < dogus - 70) ? "gecYari" : "gece";
}

export const AY_ADLARI = ["Yeni ay", "Hilal", "İlk dördün", "Şişkin ay", "Dolunay", "Solan şişkin ay", "Son dördün", "Solan hilal"];
export function ayYasi(d) {
  const bilinen = Date.UTC(2000, 0, 6, 18, 14);
  const devir = 29.530588853 * 86400000;
  return (((d.getTime() - bilinen) % devir) + devir) % devir / devir;
}
export const ayAdi = (d) => AY_ADLARI[Math.round(ayYasi(d) * 8) % 8];

/* ─── İstanbul silueti ────────────────────────────────────────────── */

export function ayYolu(cx, cy, r, evre) {
  const aci = evre * Math.PI * 2;
  const k = Math.cos(aci) * r;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${Math.abs(k)} ${r} 0 0 ${k > 0 ? 1 : 0} ${cx} ${cy - r} Z`;
}

export function istanbulSVG(d) {
  d = d || new Date();
  const e = gokEvresi(d), G = GOKYUZU[e];
  const yas = ayYasi(d);
  const rast = (i) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };

  const yildizlar = G.yildiz > 0 ? Array.from({ length: 54 }, (_, i) => {
    const x = rast(i) * 800, y = rast(i + 90) * 118, r = 0.5 + rast(i + 50) * 1.15;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${(G.yildiz * (0.25 + rast(i + 30) * 0.7)).toFixed(2)}"/>`;
  }).join("") : "";

  /* pencere ışıkları */
  const pencere = (x, y, w, h, tohum) => {
    let s = "";
    const sut = Math.max(1, Math.floor(w / 9)), sat = Math.max(1, Math.floor(h / 11));
    for (let i = 0; i < sut; i++) for (let j = 0; j < sat; j++) {
      const t = tohum + i * 7 + j * 13;
      const acik = rast(t) < G.pencere;
      s += `<rect x="${(x + 4 + i * 9).toFixed(1)}" y="${(y + 5 + j * 11).toFixed(1)}" width="3.4" height="4.6" fill="${acik ? G.pAcik : G.pKapali}" opacity="${acik ? 0.92 : 0.5}"/>`;
    }
    return s;
  };

  const gunesAy = G.gunes
    ? `<circle cx="560" cy="${e === "safak" ? 104 : e === "altin" ? 112 : 70}" r="19" fill="#FFF3D0" opacity=".95"/>
       <circle cx="560" cy="${e === "safak" ? 104 : e === "altin" ? 112 : 70}" r="31" fill="#FFF3D0" opacity=".2"/>`
    : G.ay ? `<g opacity="${G.ay}"><circle cx="560" cy="62" r="16" fill="#FAF3DE" opacity=".16"/>
       <path d="${ayYolu(560, 62, 13, yas)}" fill="#FDF6E3"/></g>` : "";

  return `<svg viewBox="0 0 800 300" preserveAspectRatio="none" style="display:block;width:100%;height:100%">
  <defs>
    <linearGradient id="gk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${G.ust}"/><stop offset="52%" stop-color="${G.orta}"/><stop offset="100%" stop-color="${G.alt}"/>
    </linearGradient>
    <linearGradient id="su" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${G.deniz1}"/><stop offset="100%" stop-color="${G.deniz2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="300" fill="url(#gk)"/>
  ${yildizlar}${gunesAy}
  <g fill="${G.bulut}" opacity="${G.bO}">
    <ellipse cx="170" cy="72" rx="56" ry="13"/><ellipse cx="212" cy="66" rx="38" ry="11"/>
    <ellipse cx="560" cy="48" rx="46" ry="10"/><ellipse cx="596" cy="54" rx="30" ry="8"/>
  </g>

  <g fill="${G.uzak}" opacity=".86">
    <rect x="0" y="176" width="70" height="42"/><rect x="74" y="168" width="52" height="50"/>
    <rect x="690" y="172" width="60" height="46"/><rect x="754" y="180" width="46" height="38"/>
  </g>

  <g>
    <rect x="86" y="150" width="88" height="68" fill="${G.yuz}"/>
    <path d="M86 150 Q130 118 174 150 Z" fill="${G.cati}"/>
    ${pencere(86, 158, 88, 56, 3)}
    <rect x="80" y="104" width="5" height="114" fill="${G.cati}"/>
    <path d="M82.5 96 l4 10 h-8 Z" fill="${G.kule}"/>
    <rect x="176" y="104" width="5" height="114" fill="${G.cati}"/>
    <path d="M178.5 96 l4 10 h-8 Z" fill="${G.kule}"/>
  </g>

  <g>
    <path d="M250 218 V168 Q250 128 296 112 Q342 128 342 168 V218 Z" fill="${G.yuz}"/>
    <ellipse cx="296" cy="118" rx="48" ry="26" fill="${G.cati}"/>
    <ellipse cx="258" cy="150" rx="22" ry="14" fill="${G.cati}" opacity=".9"/>
    <ellipse cx="334" cy="150" rx="22" ry="14" fill="${G.cati}" opacity=".9"/>
    <path d="M294 86 l4 12 h-8 Z" fill="${G.kule}"/>
    <rect x="294.5" y="84" width="3" height="30" fill="${G.cati}"/>
    ${pencere(252, 170, 88, 44, 21)}
    <rect x="240" y="98" width="5" height="120" fill="${G.cati}"/>
    <path d="M242.5 90 l4 10 h-8 Z" fill="${G.kule}"/>
    <rect x="348" y="98" width="5" height="120" fill="${G.cati}"/>
    <path d="M350.5 90 l4 10 h-8 Z" fill="${G.kule}"/>
  </g>

  <g>
    <rect x="400" y="156" width="64" height="62" fill="${G.yuz}"/>
    ${pencere(400, 162, 64, 50, 44)}
    <path d="M400 156 L432 132 L464 156 Z" fill="${G.cati}"/>
  </g>

  <g>
    <rect x="486" y="128" width="26" height="90" fill="${G.yuz}"/>
    <path d="M486 128 L499 104 L512 128 Z" fill="${G.cati}"/>
    <rect x="484" y="150" width="30" height="4" fill="${G.cati}"/>
    <circle cx="499" cy="140" r="4" fill="${G.pAcik}" opacity=".9"/>
  </g>

  <g>
    <path d="M556 218 V150 h52 v68 Z" fill="${G.yuz}"/>
    ${pencere(556, 156, 52, 56, 61)}
    <path d="M556 150 Q582 126 608 150 Z" fill="${G.cati}"/>
  </g>

  <path d="M0 218 h800 v82 H0 Z" fill="url(#su)"/>
  <g stroke="${G.vapur}" stroke-width="1" opacity=".22">
    <path d="M30 240 h120 M210 254 h150 M430 236 h110 M600 262 h140 M120 274 h180"/>
  </g>

  <g>
    <path d="M632 218 V150" stroke="${G.cati}" stroke-width="7" fill="none"/>
    <path d="M760 218 V150" stroke="${G.cati}" stroke-width="7" fill="none"/>
    <path d="M600 176 Q696 212 792 176" stroke="${G.cati}" stroke-width="3.4" fill="none"/>
    <path d="M600 158 h200" stroke="${G.cati}" stroke-width="4" fill="none"/>
    <g stroke="${G.cati}" stroke-width="1.2" opacity=".8">
      <path d="M624 158 V172 M648 158 V182 M672 158 V192 M696 158 V196 M720 158 V192 M744 158 V182 M768 158 V172"/>
    </g>
    ${G.pencere > 0.1 ? `<g fill="${G.pAcik}" opacity=".85"><circle cx="632" cy="150" r="2.4"/><circle cx="760" cy="150" r="2.4"/><circle cx="696" cy="172" r="2"/></g>` : ""}
  </g>

  <g class="nv-vapur">
    <path d="M0 252 h30 l-4 9 h-22 Z" fill="${G.vapur}"/>
    <rect x="8" y="245" width="13" height="7" fill="${G.vapur}"/>
    <rect x="18" y="240" width="3.4" height="6" fill="${G.cati}"/>
  </g>
</svg>`;
}

export function selamla(d, ad) {
  const s = d.getHours(), e = gokEvresi(d);
  const isim = ad ? `, ${ad}` : "";
  if (e === "gecYari") return `Gece yarısını geçti${isim}.`;
  if (s >= 4 && s < 7) return `Sabahın körü${isim}.`;
  if (s >= 7 && s < 12) return `Günaydın${isim}.`;
  if (s >= 12 && s < 17) return `İyi günler${isim}.`;
  if (s >= 17 && s < 21) return `İyi akşamlar${isim}.`;
  return `İyi geceler${isim}.`;
}

/* ══════════════════════ TEZHİP KATMANI ══════════════════════
   El yazması sayfasının araçları: cetvel (çerçeve), serlevha
   (başlık tezhibi), gül (bölüm gülü), köşe süsü, rakam.
   ════════════════════════════════════════════════════════════ */

export function Gul({ boy = 16, renk = C.altin, opak = 1 }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg width={boy} height={boy} viewBox="0 0 40 40" style={{ opacity: opak, flexShrink: 0 }}>
      {petals.map((a) => (
        <ellipse key={a} cx="20" cy="11" rx="3.4" ry="7.6" fill="none" stroke={renk}
          strokeWidth="1.1" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3.1" fill={renk} />
      <circle cx="20" cy="20" r="6.4" fill="none" stroke={renk} strokeWidth="0.7" opacity="0.55" />
    </svg>
  );
}

export function Serlevha() { return null; }

export function KoseSusu({ boy = 22, renk = C.cetvel, don = 0 }) {
  return (
    <svg width={boy} height={boy} viewBox="0 0 24 24" style={{ transform: `rotate(${don}deg)`, display: "block" }}>
      <path d="M1 1 L1 9 M1 1 L9 1" stroke={renk} strokeWidth="1.2" fill="none" />
      <path d="M4 4 Q4 12 12 12" stroke={renk} strokeWidth="0.7" fill="none" opacity="0.7" />
      <circle cx="4" cy="4" r="1.5" fill={renk} opacity="0.85" />
    </svg>
  );
}

/* Cetvel — sade, yumuşak gölgeli kart */
export function Cetvel({ children, style, sikilik = "normal" }) {
  const ic = sikilik === "genis" ? S.xl : sikilik === "dar" ? S.md : S.lg;
  return (
    <div style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 26, padding: ic,
      boxShadow: "0 1px 2px rgba(15,27,51,.04), 0 22px 40px -30px rgba(15,27,51,.5)", ...style }}>{children}</div>
  );
}

export function Baslik({ ust, ad, alt, sag }) {
  return (
    <div style={{ marginBottom: S.xl, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: S.lg, flexWrap: "wrap" }}>
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        {ust && <div style={{ fontSize: 15, fontWeight: 750, color: C.altin, marginBottom: 4 }}>{ust}</div>}
        <h1 style={{ fontFamily: T.hat, ...T.d0, margin: 0, color: C.murekkep }}>{ad}</h1>
        {alt && <div style={{ ...T.m, color: C.murekkepAlt, marginTop: 8, maxWidth: 640 }}>{alt}</div>}
      </div>
      {sag}
    </div>
  );
}

export function Fasil({ ad, sag, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: S.sm, margin: `${S.xl}px 0 ${S.md}px`, ...style }}>
      <div style={{ fontFamily: T.hat, fontSize: 21, fontWeight: 780, letterSpacing: "-0.015em", color: C.murekkep }}>{ad}</div>
      <span style={{ flex: 1 }} />
      {sag}
    </div>
  );
}

/* ══════════ İMZA ÖĞE: ARALIK (satır arası tercüme) ══════════
   Klasik el yazmalarında tercüme satır aralarına, daha küçük
   ve eğik yazılırdı. Burada aynısını yapıyoruz: İngilizce üstte,
   Türkçe karşılığı tam altında. Türkçede karşılığı olmayan yere
   ∅ konur — artikelin yokluğu böylece görülür hale gelir. ════ */

export function parcala(metin) {
  return String(metin || "").split(/(\[\[.*?\]\])/g).filter((x) => x !== "")
    .map((p) => p.startsWith("[[") && p.endsWith("]]")
      ? { v: true, m: p.slice(2, -2) } : { v: false, m: p });
}

export function hizala(en, tr) {
  const pe = parcala(en), pt = parcala(tr);
  const trV = pt.filter((x) => x.v);
  // göreli konumlar — yer değişimi tespiti için
  const konum = (parcalar, hedefIndex) => {
    let toplam = parcalar.reduce((a, x) => a + x.m.length, 0), gecen = 0, k = -1;
    for (const x of parcalar) { if (x.v) { k++; if (k === hedefIndex) return gecen / Math.max(toplam, 1); } gecen += x.m.length; }
    return null;
  };
  let vi = -1;
  // Türkçe tarafta hiç işaret yoksa: karşılığı yok demektir (artikel vb.) → ∅
  // Türkçe tarafta işaret var ama sayıca azsa: hizalama kısmi, ∅ iddia etme
  const hicYok = trV.length === 0;
  return pe.map((p) => {
    if (!p.v) return { en: p.m, tr: null, vurgu: false };
    vi++;
    const es = trV[vi];
    if (!es) return { en: p.m, tr: hicYok ? "∅" : null, vurgu: true, yok: hicYok, kaydi: false };
    const ke = konum(pe, vi), kt = konum(pt, vi);
    const kaydi = ke != null && kt != null && Math.abs(ke - kt) > 0.28;
    return { en: p.m, tr: es.m, vurgu: true, yok: false, kaydi };
  });
}

export function Aralik({ en, tr, fark, acikBasla, kompakt }) {
  const [acik, setAcik] = useState(!!acikBasla);
  useEffect(() => { setAcik(!!acikBasla); }, [acikBasla]);
  const parcalar = useMemo(() => hizala(en, tr), [en, tr]);
  const kayan = parcalar.some((p) => p.kaydi);
  const bosluk = parcalar.some((p) => p.yok);

  return (
    <div style={{ border: `1px solid ${C.cizgi}`, borderRadius: 14, background: C.muhre, overflow: "hidden" }}>
      <div onClick={() => setAcik(!acik)} style={{ cursor: "pointer", padding: `${kompakt ? S.sm + 2 : S.md}px ${S.md}px` }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", rowGap: acik ? 10 : 0 }}>
          {parcalar.map((p, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{
                fontFamily: T.kalem, fontSize: kompakt ? 14.5 : 16, lineHeight: 1.55, color: C.murekkep,
                whiteSpace: "pre-wrap",
                borderBottom: p.vurgu && acik ? `1.5px solid ${p.yok ? C.lal : C.altin}` : "none",
                background: p.vurgu && acik ? (p.yok ? C.lalSis : C.altinSis) : "transparent",
                padding: p.vurgu && acik ? "0 2px" : 0
              }}>{p.en}</span>
              {acik && p.vurgu && p.tr && (
                <span style={{
                  fontFamily: T.govde, fontSize: kompakt ? 13.5 : 14.5,
                  lineHeight: 1.35, marginTop: 3, padding: "0 2px",
                  color: p.yok ? C.lal : C.altin, letterSpacing: "0.01em"
                }}>
                  {p.tr}{p.kaydi && <span style={{ color: C.lacivert, marginLeft: 3, fontStyle: "normal" }}>⤺</span>}
                </span>
              )}
            </div>
          ))}
          <ChevronDown size={13} style={{
            color: C.murekkepSis, marginLeft: "auto", alignSelf: "center", flexShrink: 0,
            transform: acik ? "rotate(180deg)" : "none", transition: "transform .2s"
          }} />
        </div>
      </div>

      {acik && (
        <div style={{ borderTop: `1px dashed ${C.cizgi}`, background: C.kagitAlt, padding: `${S.sm + 2}px ${S.md}px` }}>
          <div style={{ fontFamily: T.govde, fontSize: kompakt ? 14.5 : 15.5, color: C.murekkepAlt, marginBottom: fark ? 6 : 0 }}>
            {parcala(tr).map((p, i) => (
              <span key={i} style={{ color: p.v ? C.altin : C.murekkepAlt, fontWeight: p.v ? 600 : 400 }}>{p.m}</span>
            ))}
          </div>
          {(bosluk || kayan) && (
            <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap", marginBottom: fark ? 6 : 0 }}>
              {bosluk && <span style={{ ...T.xs, fontSize: 13, color: C.lal }}>∅ · Türkçede karşılığı yok</span>}
              {kayan && <span style={{ ...T.xs, fontSize: 13, color: C.lacivert }}>⤺ · konumu değişti</span>}
            </div>
          )}
          {fark && (
            <div style={{ ...T.xs, color: C.murekkep, borderLeft: `2px solid ${C.altin}`, paddingLeft: S.sm }}>{fark}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ ORTAK ARAYÜZ ══════════════════════ */

export function Levha({ children, style, vurgu, tikla, ic = S.lg, renk }) {
  const [uzeri, setUzeri] = useState(false);
  return (
    <div onClick={tikla}
      onMouseEnter={() => setUzeri(true)} onMouseLeave={() => setUzeri(false)}
      style={{
        background: C.muhre, border: `1px solid ${vurgu ? C.altin : uzeri && tikla ? C.cetvel : C.cizgi}`,
        borderLeft: renk ? `5px solid ${renk}` : undefined,
        borderRadius: 18, padding: ic, cursor: tikla ? "pointer" : "default",
        boxShadow: vurgu ? `0 0 0 4px ${C.altinSis}` : uzeri && tikla ? "0 10px 24px -12px rgba(15,27,51,.28)" : "0 1px 0 rgba(15,27,51,.03)",
        transform: uzeri && tikla ? "translateY(-2px)" : "none",
        transition: "box-shadow .2s, border-color .2s, transform .2s", ...style
      }}>{children}</div>
  );
}

export function Etiket({ children, renk = C.murekkepAlt, style }) {
  return <div style={{ ...T.cap, color: renk, marginBottom: S.sm, ...style }}>{children}</div>;
}

export function Nisan({ children, renk = C.murekkepAlt, zemin, kucuk, dolu }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: kucuk ? "2px 8px" : "4px 11px", fontFamily: T.govde,
      fontSize: kucuk ? 12.5 : 13.5, fontWeight: 700, letterSpacing: "0.01em",
      color: dolu ? C.muhre : renk, background: dolu ? renk : zemin || "transparent",
      border: `1px solid ${dolu ? renk : renk + "40"}`, borderRadius: 99, whiteSpace: "nowrap"
    }}>{children}</span>
  );
}

export function Dugme({ children, tikla, tur = "birincil", kucuk, pasif, style, tam }) {
  const [uzeri, setUzeri] = useState(false);
  const s = {
    birincil: { bg: C.murekkep, fg: C.muhre, bd: C.murekkep },
    altin:    { bg: C.altin, fg: "#FFFFFF", bd: C.altin },
    lacivert: { bg: C.lacivert, fg: "#F5F7FC", bd: C.lacivert },
    ikincil:  { bg: C.muhre, fg: C.murekkep, bd: C.golge },
    tehlike:  { bg: "transparent", fg: C.lal, bd: C.lal + "66" },
    sessiz:   { bg: "transparent", fg: C.murekkepAlt, bd: "transparent" }
  }[tur] || { bg: C.murekkep, fg: C.muhre, bd: C.murekkep };
  return (
    <button className="n-dugme" onClick={pasif ? undefined : tikla} disabled={pasif}
      onMouseEnter={() => setUzeri(true)} onMouseLeave={() => setUzeri(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        fontFamily: T.govde, fontSize: kucuk ? 14.5 : 16, fontWeight: 700, letterSpacing: "0",
        padding: kucuk ? "8px 14px" : "12px 22px", minHeight: kucuk ? 38 : 46, background: s.bg, color: s.fg,
        border: `1.5px solid ${s.bd}`, borderRadius: 13, cursor: pasif ? "not-allowed" : "pointer",
        opacity: pasif ? 0.4 : 1, width: tam ? "100%" : undefined,
        transform: uzeri && !pasif ? "translateY(-1px)" : "none",
        boxShadow: uzeri && !pasif && s.bg !== "transparent" ? "0 6px 14px -8px rgba(15,27,51,.45)" : "none",
        transition: "transform .14s, box-shadow .14s", ...style
      }}>{children}</button>
  );
}

export function Cubuk({ deger, renk = C.altin, boy = 8, zemin }) {
  return (
    <div style={{ background: zemin || C.kagitDerin, height: boy, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, deger))}%`, height: "100%", background: renk, transition: "width .45s ease-out" }} />
    </div>
  );
}

export function Halka({ deger, boy = 62, renk = C.altin, kalinlik = 4, ic }) {
  const r = (boy - kalinlik) / 2, cev = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: boy, height: boy, flexShrink: 0 }}>
      <svg width={boy} height={boy} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={boy / 2} cy={boy / 2} r={r} fill="none" stroke={C.kagitDerin} strokeWidth={kalinlik} />
        <circle cx={boy / 2} cy={boy / 2} r={r} fill="none" stroke={renk} strokeWidth={kalinlik}
          strokeDasharray={cev} strokeDashoffset={cev * (1 - Math.max(0, Math.min(100, deger)) / 100)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s ease-out" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</div>
    </div>
  );
}

export function Bekle({ asamalar = ["Çalışılıyor…"] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(x + 1, asamalar.length - 1)), 1700);
    return () => clearInterval(t);
  }, [asamalar.length]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: S.md, padding: `${S.md}px 0`, color: C.murekkepAlt, ...T.s }}>
      <Loader2 size={15} style={{ animation: "nspin 1.1s linear infinite", flexShrink: 0 }} />
      <span style={{ fontStyle: "italic" }}>{asamalar[i]}</span>
    </div>
  );
}

export function Haber({ children, tur = "bilgi", basli }) {
  const r = { hata: C.lal, iyi: C.zumrut, bilgi: C.lacivert, altin: C.altin }[tur] || C.lacivert;
  const z = { hata: C.lalSis, iyi: C.zumSis, bilgi: C.laciSis, altin: C.altinSis }[tur] || C.laciSis;
  return (
    <div style={{ background: z, border: `1px solid ${r}33`, borderLeft: `5px solid ${r}`,
      padding: `${S.md}px ${S.lg}px`, borderRadius: 10, color: C.murekkep, ...T.s }}>
      {basli && <div style={{ ...T.cap, color: r, marginBottom: 5 }}>{basli}</div>}
      {children}
    </div>
  );
}

export function Bos({ baslik, aciklama, eylem, eylemAd }) {
  return (
    <div style={{ textAlign: "center", padding: `${S.xxl}px ${S.lg}px`, color: C.murekkepAlt }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: S.md }}><Gul boy={26} opak={0.4} /></div>
      <div style={{ fontFamily: T.hat, ...T.d2, color: C.murekkep, marginBottom: S.sm }}>{baslik}</div>
      <div style={{ ...T.s, maxWidth: 430, margin: "0 auto", marginBottom: eylem ? S.lg : 0 }}>{aciklama}</div>
      {eylem && <Dugme tikla={eylem}>{eylemAd}</Dugme>}
    </div>
  );
}

export function Olcu({ sayi, ad, renk = C.murekkep, alt, tikla, vurgu }) {
  return (
    <Levha tikla={tikla} vurgu={vurgu} ic={S.md} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: T.hat, fontSize: 27, fontWeight: 680, color: renk, ...T.rakam, lineHeight: 1.1 }}>{sayi}</div>
      <div style={{ ...T.cap, fontSize: 11.5, color: C.murekkepAlt, marginTop: 5 }}>{ad}</div>
      {alt && <div style={{ ...T.xs, fontSize: 13, color: C.murekkepSis, marginTop: 3 }}>{alt}</div>}
    </Levha>
  );
}

export function Alan({ deger, degistir, satir = 4, ipucu, kalem = true, pasif, style }) {
  return (
    <textarea value={deger} onChange={(e) => degistir(e.target.value)} rows={satir} placeholder={ipucu} disabled={pasif}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: kalem ? T.kalem : T.govde,
        fontSize: kalem ? 16 : 16.5, lineHeight: 1.85, padding: S.md,
        border: `1px solid ${C.cizgi}`, borderRadius: 14, background: pasif ? C.kagitAlt : C.muhre,
        color: C.murekkep, outline: "none", resize: "vertical", ...style
      }} />
  );
}

export function Satir({ deger, degistir, ipucu, style, gonder }) {
  return (
    <input value={deger} onChange={(e) => degistir(e.target.value)} placeholder={ipucu}
      onKeyDown={(e) => { if (e.key === "Enter" && gonder) gonder(); }}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: T.govde, fontSize: 16,
        padding: `${S.sm + 1}px ${S.md}px`, border: `1px solid ${C.cizgi}`, borderRadius: 14,
        background: C.muhre, color: C.murekkep, outline: "none", ...style
      }} />
  );
}

/* ─── TASHİHLİ METİN + HAŞİYE (kenar notu) ─────────────────────────── */

export function TashihliMetin({ metin, hatalar, secili, sec, kompakt }) {
  const parcalar = useMemo(() => {
    if (!hatalar || !hatalar.length) return [{ tip: "duz", m: metin }];
    const bulunan = [];
    hatalar.forEach((h, i) => {
      const p = h.hataliParca;
      if (!p) return;
      const idx = metin.indexOf(p);
      if (idx === -1) return;
      if (bulunan.some((b) => idx < b.son && idx + p.length > b.bas)) return;
      bulunan.push({ bas: idx, son: idx + p.length, h, i });
    });
    bulunan.sort((a, b) => a.bas - b.bas);
    const out = []; let im = 0;
    bulunan.forEach((b) => {
      if (b.bas > im) out.push({ tip: "duz", m: metin.slice(im, b.bas) });
      out.push({ tip: "hata", m: metin.slice(b.bas, b.son), h: b.h, i: b.i });
      im = b.son;
    });
    if (im < metin.length) out.push({ tip: "duz", m: metin.slice(im) });
    return out;
  }, [metin, hatalar]);

  return (
    <div style={{ fontFamily: T.kalem, fontSize: kompakt ? 15 : 16, lineHeight: 2.35, whiteSpace: "pre-wrap" }}>
      {parcalar.map((p, i) =>
        p.tip === "duz" ? <span key={i}>{p.m}</span> : (
          <span key={i} onClick={() => sec && sec(secili === p.i ? null : p.i)}
            style={{ cursor: sec ? "pointer" : "default", background: secili === p.i ? C.altinSis : "transparent", borderRadius: 10, padding: "1px 0" }}>
            <span style={{ textDecoration: "line-through", textDecorationColor: C.lal, textDecorationThickness: 1.5, color: C.lal, opacity: 0.72 }}>{p.m}</span>
            <sup style={{ color: C.lal, fontSize: 12.5, margin: "0 2px", fontWeight: 700 }}>∧</sup>
            <span style={{ color: C.zumrut, fontWeight: 500, borderBottom: `1px solid ${C.zumrut}66` }}>{p.h.duzeltme}</span>
          </span>
        )
      )}
    </div>
  );
}

/* Haşiye — kenar notu sütunu */
export function Hasiye({ children, baslik }) {
  return (
    <div style={{ borderLeft: `1px solid ${C.cizgi}`, paddingLeft: S.md }}>
      {baslik && <Etiket renk={C.altin}>{baslik}</Etiket>}
      {children}
    </div>
  );
}

/* ══════════════════════ TAKIMYILDIZ ══════════════════════
   113 düğüm, önkoşul bağlarıyla birlikte bir yıldız haritası.
   Yarıçap zorluğu, parlaklık ustalığı, halka Türkçe girişim
   şiddetini gösterir. Kilitli düğümler sönük durur. ═════════ */

export const HARITA = (() => {
  const N = AILELER.length, merkez = 400, taban = 96, adim = 51;
  const yer = {};
  AILELER.forEach((a, ai) => {
    const ds = aileninDugumleri(a.id).slice().sort((x, y) => x.z - y.z || x.id.localeCompare(y.id));
    const sektor = (2 * Math.PI) / N, bas = ai * sektor - Math.PI / 2;
    const kademe = {};
    ds.forEach((d) => { (kademe[d.z] = kademe[d.z] || []).push(d); });
    Object.entries(kademe).forEach(([z, grup]) => {
      const r = taban + (Number(z) - 1) * adim;
      grup.forEach((d, gi) => {
        const pay = sektor * 0.82;
        const t = grup.length === 1 ? 0.5 : gi / (grup.length - 1);
        const aci = bas + sektor * 0.09 + pay * t;
        yer[d.id] = { x: merkez + r * Math.cos(aci), y: merkez + r * Math.sin(aci), r, aci, aile: a.id };
      });
    });
  });
  const baglar = [];
  DUGUMLER.forEach((d) => (d.on || []).forEach((o) => {
    if (yer[d.id] && yer[o]) baglar.push({ a: o, b: d.id });
  }));
  return { yer, baglar, merkez };
})();

export function Takimyildiz({ ustalik, hatalar, sec, seciliAile, setSeciliAile, ara }) {
  const [uzeri, setUzeri] = useState(null);
  const hataSayi = useMemo(() => {
    const m = {};
    (hatalar || []).forEach((h) => { if (h.dugumId && !h.cozuldu) m[h.dugumId] = (m[h.dugumId] || 0) + 1; });
    return m;
  }, [hatalar]);

  const aramaEsles = useCallback((d) => {
    const q = (ara || "").trim().toLocaleLowerCase("tr");
    if (!q) return true;
    return (d.tr + " " + d.en).toLocaleLowerCase("tr").includes(q);
  }, [ara]);

  const sonuk = (d) => (seciliAile && d.a !== seciliAile) || !aramaEsles(d);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 800 800" style={{ width: "100%", height: "auto", display: "block", userSelect: "none" }}>
        <defs>
          <radialGradient id="cekirdek">
            <stop offset="0%" stopColor={C.altinSis} stopOpacity="0.9" />
            <stop offset="100%" stopColor={C.altinSis} stopOpacity="0" />
          </radialGradient>
        </defs>

        {[96, 147, 198, 249, 300].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke={C.cizgi} strokeWidth="0.6" strokeDasharray="1 6" opacity="0.7" />
        ))}
        <circle cx="400" cy="400" r="330" fill="url(#cekirdek)" />

        {AILELER.map((a, i) => {
          const aci = (i * 2 * Math.PI) / AILELER.length - Math.PI / 2;
          const x = 400 + 352 * Math.cos(aci), y = 400 + 352 * Math.sin(aci);
          const ort = aileOrtalamasi(ustalik, a.id);
          const etkin = !seciliAile || seciliAile === a.id;
          return (
            <g key={a.id} onClick={() => setSeciliAile(seciliAile === a.id ? null : a.id)} style={{ cursor: "pointer" }}>
              <line x1="400" y1="400" x2={400 + 318 * Math.cos(aci)} y2={400 + 318 * Math.sin(aci)}
                stroke={C.cizgi} strokeWidth="0.5" opacity={etkin ? 0.55 : 0.15} />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: T.govde, fontSize: 14.5, fill: etkin ? C.murekkepAlt : C.murekkepSis,
                  letterSpacing: "0.05em", opacity: etkin ? 1 : 0.4 }}>{a.kisa}</text>
              <text x={x} y={y + 15} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: T.hat, fontSize: 13.5, fill: C.altin, opacity: etkin ? 0.85 : 0.25 }}>{ort}</text>
            </g>
          );
        })}

        {HARITA.baglar.map((b, i) => {
          const A = HARITA.yer[b.a], B = HARITA.yer[b.b];
          const da = dugum(b.a), db = dugum(b.b);
          const gorunur = !sonuk(da) && !sonuk(db);
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
          const cx = 400 + (mx - 400) * 0.78, cy = 400 + (my - 400) * 0.78;
          return (
            <path key={i} d={`M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`} fill="none"
              stroke={C.cetvel} strokeWidth="0.7" opacity={gorunur ? 0.42 : 0.07} />
          );
        })}

        {DUGUMLER.map((d) => {
          const p = HARITA.yer[d.id];
          if (!p) return null;
          const puan = sonumlenmisPuan(ustalik[d.id]);
          const kilit = kilitliMi(d, ustalik);
          const sv = seviyeBul(puan);
          const hs = hataSayi[d.id] || 0;
          const soluk = sonuk(d);
          const R = 4.4 + d.z * 0.85;
          const uz = uzeri === d.id;
          return (
            <g key={d.id} onClick={() => sec(d.id)}
              onMouseEnter={() => setUzeri(d.id)} onMouseLeave={() => setUzeri(null)}
              style={{ cursor: "pointer", opacity: soluk ? 0.13 : kilit ? 0.42 : 1, transition: "opacity .25s" }}>
              {puan > 0 && <circle cx={p.x} cy={p.y} r={R + 5 + puan / 14} fill={sv.renk} opacity={0.1} />}
              {d.l1 === 3 && <circle cx={p.x} cy={p.y} r={R + 3.2} fill="none" stroke={C.lal} strokeWidth="0.9" opacity="0.68" />}
              <circle cx={p.x} cy={p.y} r={uz ? R + 2.4 : R}
                fill={puan > 0 ? sv.renk : C.muhre} stroke={puan > 0 ? sv.renk : C.golge}
                strokeWidth={uz ? 2 : 1.1} style={{ transition: "r .15s" }} />
              {hs > 0 && <circle cx={p.x + R + 2} cy={p.y - R - 1} r="2.6" fill={C.lal} />}
              {uz && (
                <g>
                  <rect x={p.x - 96} y={p.y - R - 34} width="192" height="25" rx="1"
                    fill={C.murekkep} opacity="0.94" />
                  <text x={p.x} y={p.y - R - 17} textAnchor="middle"
                    style={{ fontFamily: T.govde, fontSize: 14, fill: C.muhre }}>
                    {d.tr.length > 30 ? d.tr.slice(0, 29) + "…" : d.tr}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <circle cx="400" cy="400" r="26" fill={C.muhre} stroke={C.cetvel} strokeWidth="1" />
        <text x="400" y="396" textAnchor="middle" style={{ fontFamily: T.hat, fontSize: 19, fill: C.altin, letterSpacing: "-0.01em" }}>
          {genelUstalik(ustalik)}
        </text>
        <text x="400" y="410" textAnchor="middle" style={{ fontFamily: T.govde, fontSize: 8.5, fill: C.murekkepSis, letterSpacing: "0.13em" }}>
          USTALIK
        </text>
      </svg>
    </div>
  );
}

/* ─── DÜĞÜM SAYFASI ────────────────────────────────────────────────── */

export function DugumSayfa({ d, ustalik, hatalar, derin, derinlestir, git, calis, konus }) {
  const [yuklu, setYuklu] = useState(false);
  const [hataM, setHataM] = useState(null);
  const [hepsi, setHepsi] = useState(false);
  const ek = derin[d.id] || {};
  const buHatalar = (hatalar || []).filter((h) => h.dugumId === d.id);
  const puan = sonumlenmisPuan(ustalik[d.id]);
  const kayit = ustalik[d.id] || BOS_KAYIT;
  const sv = seviyeBul(puan);
  const ex = d.ex || ek.ex || [];
  const sh = d.sh || ek.sh || [];
  const kp = d.kp || ek.kp;
  const kilit = kilitliMi(d, ustalik);
  const ardil = DUGUMLER.filter((x) => (x.on || []).includes(d.id));

  async function getir() {
    setYuklu(true); setHataM(null);
    try {
      const j = await sorJSON(`${ZEMIN}

Gramer düğümü: "${d.tr}" (${d.en}), aile: ${aileAd(d.a)}.
Bilinen kural: ${d.k || "-"}
Bilinen Türkçe tuzağı: ${d.t || "-"}

YALNIZCA şu JSON'u döndür:
{"m":"kural neden var, hangi problemi çözüyor, 2-3 cümle",
"an":"gündelik hayattan analoji, 1-2 cümle",
"ex":[{"en":"İngilizce cümle, vurgulanacak parça [[çift köşeli parantez]] içinde","tr":"Türkçe karşılığı, karşılık gelen parça [[çift köşeli parantez]] içinde; İngilizcedeki parçanın Türkçede karşılığı yoksa o parçayı Türkçede işaretleme","f":"iki dil arasındaki yapısal fark, tek cümle"}],
"kp":{"d":"doğru cümle","y":"yanlış cümle","f":"fark"},
"sh":[{"y":"tipik hatalı cümle","d":"düzeltilmiş hali"}],
"ak":"IB akademik yazımındaki önemi, tek cümle"}
ex dizisinde 3, sh dizisinde 3 öğe olsun.`, 1900);
      derinlestir(d.id, j);
    } catch { setHataM("İçerik alınamadı. Tekrar dene."); }
    setYuklu(false);
  }

  return (
    <div>
      <Baslik ust={aileAd(d.a)} ad={d.tr}
        sag={<Halka deger={puan} boy={64} renk={sv.renk}
          ic={<div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.hat, fontSize: 18, color: sv.renk, ...T.rakam }}>{puan}</div>
          </div>} />}
        alt={null} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: -S.lg, marginBottom: S.lg }}>
        <span style={{ fontFamily: T.kalem, fontSize: 14, color: C.murekkepSis }}>{d.en}</span>
        <span style={{ width: 1, height: 12, background: C.cizgi }} />
        <Nisan kucuk renk={sv.renk} zemin={sv.renk + "12"}>{sv.ad}</Nisan>
        <Nisan kucuk>Basamak {kayit.basamak || 1}/5</Nisan>
        <Nisan kucuk>Zorluk {d.z}/5</Nisan>
        {d.l1 >= 2 && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>Türkçe girişimi {d.l1 === 3 ? "yüksek" : "orta"}</Nisan>}
        {buHatalar.length > 0 && <Nisan kucuk renk={C.lal} dolu>{buHatalar.length} hatan</Nisan>}
        {kilit && <Nisan kucuk renk={C.murekkepSis}><Lock size={9} /> önkoşul eksik</Nisan>}
      </div>

      <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap", marginBottom: S.xl }}>
        <Dugme tur="altin" kucuk tikla={() => calis(d.id)}><Target size={12} /> Talimhane'de çalış</Dugme>
        <Dugme tur="ikincil" kucuk tikla={() => konus(d.id)}><MessageSquare size={12} /> Sokrates'e sor</Dugme>
      </div>

      {(d.on || []).length > 0 && (
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.lg }}>
          <span style={{ ...T.cap, color: C.murekkepSis, marginRight: 8 }}>Önkoşul</span>
          {d.on.map((o, i) => {
            const p = dugum(o); if (!p) return null;
            const pp = sonumlenmisPuan(ustalik[o]);
            return (
              <span key={o}>
                <span onClick={() => git(o)} style={{ color: pp < 30 ? C.lal : C.lacivert, cursor: "pointer", borderBottom: `1px dotted currentColor` }}>
                  {p.tr} ({pp})
                </span>{i < d.on.length - 1 ? " · " : ""}
              </span>
            );
          })}
        </div>
      )}

      <div style={{ display: "grid", gap: S.md }}>
        {(d.m || ek.m) && (
          <Cetvel>
            <Etiket renk={C.altin}>Mantık</Etiket>
            <div style={{ fontFamily: T.govde, ...T.m, color: C.murekkep }}>{d.m || ek.m}</div>
            {(d.an || ek.an) && (
              <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}`,
                ...T.s, color: C.murekkepAlt }}>{d.an || ek.an}</div>
            )}
          </Cetvel>
        )}

        {d.k && (
          <Levha style={{ background: C.kagitAlt }}>
            <Etiket renk={C.altin}>Kural</Etiket>
            <div style={{ fontFamily: T.govde, ...T.m, color: C.murekkep }}>{d.k}</div>
          </Levha>
        )}

        {d.t && (
          <div style={{ border: `1px solid ${C.lal}44`, borderLeft: `3px solid ${C.lal}`, background: C.lalSis, borderRadius: 10, padding: S.lg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: S.sm }}>
              <Gul boy={13} renk={C.lal} />
              <span style={{ ...T.cap, color: C.lal }}>Türkçe tuzağı</span>
            </div>
            <div style={{ fontFamily: T.govde, ...T.m, color: C.murekkep }}>{d.t}</div>
          </div>
        )}
      </div>

      {ex.length > 0 && (
        <>
          <Fasil ad="Aralık · satır arası tercüme"
            sag={<Dugme tur="sessiz" kucuk tikla={() => setHepsi(!hepsi)}>
              {hepsi ? <><EyeOff size={11} /> kapat</> : <><Eye size={11} /> hepsini aç</>}
            </Dugme>} />
          <div style={{ display: "grid", gap: S.sm }}>
            {ex.map((e, i) => <Aralik key={i} en={e.en} tr={e.tr} fark={e.f} acikBasla={hepsi} />)}
          </div>
        </>
      )}

      {kp && (
        <>
          <Fasil ad="Karşıt çift" />
          <Levha>
            <div style={{ display: "grid", gap: S.sm }}>
              <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.zumrut, display: "flex", gap: S.sm }}>
                <Check size={14} style={{ flexShrink: 0, marginTop: 3 }} /><span>{kp.d}</span>
              </div>
              <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.lal, display: "flex", gap: S.sm }}>
                <X size={14} style={{ flexShrink: 0, marginTop: 3 }} /><span>{kp.y}</span>
              </div>
            </div>
            <div style={{ ...T.s, color: C.murekkepAlt, marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}` }}>{kp.f}</div>
          </Levha>
        </>
      )}

      {sh.length > 0 && (
        <>
          <Fasil ad="Sık yapılan hatalar" />
          <Levha>
            <div style={{ display: "grid", gap: S.md }}>
              {sh.map((s, i) => (
                <div key={i} style={{ fontFamily: T.kalem, fontSize: 15 }}>
                  <div style={{ color: C.lal, textDecoration: "line-through", textDecorationColor: C.lal + "77" }}>{s.y}</div>
                  <div style={{ color: C.zumrut }}>{s.d}</div>
                </div>
              ))}
            </div>
          </Levha>
        </>
      )}

      {buHatalar.length > 0 && (
        <>
          <Fasil ad={`Bu düğümdeki kendi hataların · ${buHatalar.length}`} />
          <div style={{ display: "grid", gap: 5 }}>
            {buHatalar.slice(-5).reverse().map((h) => (
              <Levha key={h.id} ic={S.md} renk={h.cozuldu ? C.zumrut : C.lal}>
                <div style={{ fontFamily: T.kalem, fontSize: 14.5 }}>
                  <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.hataliMetin}</span>
                  <ArrowRight size={11} style={{ margin: "0 6px", verticalAlign: -1, color: C.murekkepSis }} />
                  <span style={{ color: C.zumrut }}>{h.dogruMetin}</span>
                </div>
                <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 4 }}>{trTarih(h.tarih)} · {h.kaynak}</div>
              </Levha>
            ))}
          </div>
        </>
      )}

      {(d.ak || ek.ak) && (
        <div style={{ marginTop: S.lg }}><Haber tur="bilgi" basli="IB notu">{d.ak || ek.ak}</Haber></div>
      )}

      {ardil.length > 0 && (
        <>
          <Fasil ad="Bu düğüm neyi açar" />
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {ardil.map((x) => (
              <Dugme key={x.id} tur="ikincil" kucuk tikla={() => git(x.id)}>{x.tr}</Dugme>
            ))}
          </div>
        </>
      )}

      {!d.m && !ek.m && (
        <div style={{ marginTop: S.lg }}>
          <Levha style={{ borderStyle: "dashed", textAlign: "center" }}>
            <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>Bu düğümün derin içeriği henüz üretilmedi.</div>
            {yuklu ? <Bekle asamalar={["Mantık kuruluyor…", "Örnekler üretiliyor…", "Aralık hizalanıyor…"]} />
                   : <Dugme tur="altin" tikla={getir}><Sparkles size={13} /> Derinleştir</Dugme>}
            {hataM && <div style={{ ...T.s, color: C.lal, marginTop: S.sm }}>{hataM}</div>}
          </Levha>
        </div>
      )}
    </div>
  );
}

/* ─── SEKME: HARİTA ────────────────────────────────────────────────── */

export function Harita({ ustalik, hatalar, derin, derinlestir, secili, setSecili, calis, konus }) {
  const [ara, setAra] = useState("");
  const [aile, setAile] = useState(null);
  const [gorunum, setGorunum] = useState("harita");

  if (secili) {
    const d = dugum(secili);
    return (
      <div>
        <Dugme tur="sessiz" kucuk tikla={() => setSecili(null)} style={{ marginBottom: S.lg }}>
          <ChevronLeft size={13} /> Haritaya dön
        </Dugme>
        {d && <DugumSayfa d={d} ustalik={ustalik} hatalar={hatalar} derin={derin}
          derinlestir={derinlestir} git={setSecili} calis={calis} konus={konus} />}
      </div>
    );
  }

  const liste = DUGUMLER.filter((d) => {
    const q = ara.trim().toLocaleLowerCase("tr");
    if (aile && d.a !== aile) return false;
    if (!q) return true;
    return (d.tr + " " + d.en + " " + (d.k || "") + " " + (d.t || "")).toLocaleLowerCase("tr").includes(q);
  });

  return (
    <div>
      <Baslik ust="Kütüphane" ad="Takımyıldız"
        alt="Yüz on üç düğüm, önkoşul bağlarıyla. Yarıçap zorluğu, dolgu ustalığı, kırmızı halka Türkçe girişim şiddetini gösterir. Sönük düğümlerin önkoşulu henüz açılmadı."
        sag={<div style={{ display: "flex", gap: 4 }}>
          <Dugme tur={gorunum === "harita" ? "ikincil" : "sessiz"} kucuk tikla={() => setGorunum("harita")}><Waypoints size={12} /> Harita</Dugme>
          <Dugme tur={gorunum === "liste" ? "ikincil" : "sessiz"} kucuk tikla={() => setGorunum("liste")}><ScrollText size={12} /> Liste</Dugme>
        </div>} />

      <div style={{ display: "flex", gap: S.sm, marginBottom: S.md, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: S.sm, border: `1px solid ${C.cizgi}`,
          borderRadius: 14, padding: `${S.sm}px ${S.md}px`, background: C.muhre }}>
          <Search size={14} style={{ color: C.murekkepSis }} />
          <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Düğüm, kural veya tuzak ara…"
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: T.govde, fontSize: 16, color: C.murekkep }} />
          {ara && <X size={14} style={{ color: C.murekkepSis, cursor: "pointer" }} onClick={() => setAra("")} />}
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: S.lg }}>
        <Dugme tur={aile ? "sessiz" : "ikincil"} kucuk tikla={() => setAile(null)}>Tümü</Dugme>
        {AILELER.map((a) => (
          <Dugme key={a.id} tur={aile === a.id ? "ikincil" : "sessiz"} kucuk tikla={() => setAile(aile === a.id ? null : a.id)}>{a.kisa}</Dugme>
        ))}
      </div>

      {gorunum === "harita" ? (
        <Cetvel sikilik="dar" style={{ background: C.kagit }}>
          <Takimyildiz ustalik={ustalik} hatalar={hatalar} sec={setSecili}
            seciliAile={aile} setSeciliAile={setAile} ara={ara} />
          <div style={{ display: "flex", gap: S.lg, justifyContent: "center", flexWrap: "wrap", marginTop: S.sm, ...T.xs, color: C.murekkepSis }}>
            {SEVIYELER.map((s) => (
              <span key={s.ad} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: s.renk, display: "inline-block" }} />{s.ad}
              </span>
            ))}
          </div>
        </Cetvel>
      ) : (
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 4 }}>{liste.length} düğüm</div>
          {liste.map((d) => {
            const p = sonumlenmisPuan(ustalik[d.id]);
            const sv = seviyeBul(p);
            const hs = (hatalar || []).filter((h) => h.dugumId === d.id && !h.cozuldu).length;
            return (
              <Levha key={d.id} tikla={() => setSecili(d.id)} ic={S.md} renk={p > 0 ? sv.renk : C.cizgi}>
                <div style={{ display: "flex", alignItems: "center", gap: S.md }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.govde, fontSize: 16.5, color: C.murekkep }}>{d.tr}</div>
                    <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepSis, marginTop: 2 }}>{d.en}</div>
                  </div>
                  {d.l1 === 3 && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>L1</Nisan>}
                  {hs > 0 && <Nisan kucuk renk={C.lal} dolu>{hs}</Nisan>}
                  <div style={{ width: 42 }}><Cubuk deger={p} renk={sv.renk} boy={4} /></div>
                  <ChevronRight size={14} style={{ color: C.murekkepSis }} />
                </div>
              </Levha>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ TALİMHANE ══════════════════════ */

export const BASAMAK = [null,
  { ad: "Tanıma",           ac: "Doğruyu seç. Henüz üretmiyorsun, tanıyorsun." },
  { ad: "Boşluk",           ac: "Kontrollü üretim. Yapı verilmiş, parçayı sen koyuyorsun." },
  { ad: "Dönüştürme",       ac: "Verilen cümleyi hedef yapıya çevir." },
  { ad: "Çeviri",           ac: "Girişimin açığa çıktığı yer. Zorunlu basamak." },
  { ad: "Serbest üretim",   ac: "Süre baskısı altında üret. Otomatikliğin tek gerçek testi." }
];

export const TALIM_MODLARI = [
  { id: "merdiven", ad: "Merdiven", ikon: Target,    ac: "Tek düğüm, beş basamak. Tanımadan otomatikliğe." },
  { id: "tuzak",    ad: "Tuzak",    ikon: Crosshair, ac: "Senin en sık üç hatanı aynı anda tetiklemek için kurulmuş cümle." },
  { id: "kur",      ad: "Kur",      ikon: Swords,    ac: "Rol değişir. Metni ben yazarım, hataları sen bulursun." },
  { id: "esdizim",  ad: "Eşdizim",  ikon: Layers,    ac: "Fiil + edat. En pahalı hata kaynağının hızlı turu." }
];

/* ── Tuzak ── */
export function TuzakModu({ hatalar, ustalik, hataEkle, kaydet, oturumBitir }) {
  const [gorev, setGorev] = useState(null);
  const [cevap, setCevap] = useState("");
  const [rapor, setRapor] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const [degerlen, setDeg] = useState(false);
  const [hataM, setHataM] = useState(null);

  const hedefler = useMemo(() => {
    const o = hataOrguleri(hatalar, 3);
    if (o.length >= 2) return o.map((g) => g.dugumId ? (dugum(g.dugumId) || {}).tr || g.dugumAdi : g.dugumAdi || aileAd(g.aile));
    return zayifDugumler(ustalik, hatalar, 3).map((z) => z.d.tr);
  }, [hatalar, ustalik]);

  const hedefIdler = useMemo(() => {
    const o = hataOrguleri(hatalar, 3).map((g) => g.dugumId).filter(Boolean);
    return o.length >= 2 ? o : zayifDugumler(ustalik, hatalar, 3).map((z) => z.d.id);
  }, [hatalar, ustalik]);

  async function uret() {
    setYuklu(true); setHataM(null); setRapor(null); setCevap("");
    try {
      const detay = hedefIdler.map((id) => { const d = dugum(id); return d ? `${d.tr}: ${d.k || d.t || ""}` : id; }).join(" | ");
      const j = await sorJSON(`${ZEMIN}

Öğrencinin en sık yaptığı hata örüntüleri: ${detay}

Bu örüntülerin HEPSİNİ AYNI ANDA tetikleyecek TEK bir Türkçe cümle kur. Cümle doğal Türkçe olmalı, zorlama görünmemeli; ama İngilizceye çevrilirken bu hataların her birine düşme fırsatı barındırmalı. Uluslararası ilişkiler, tarih veya siyaset bağlamında olsun. 12-22 sözcük.

Sonra o cümlenin doğru İngilizce çevirisini ve her tuzağın nerede kurulduğunu belirt.

YALNIZCA şu JSON'u döndür:
{"turkce":"...","modelCeviri":"...","tuzaklar":[{"ad":"kısa Türkçe tuzak adı","nerede":"cümlenin hangi kısmında","neden":"öğrenci burada ne yapmaya meyilli, tek cümle","dogruParca":"doğru çeviride bu tuzağa denk gelen parça"}]}`, 1200);
      setGorev(j);
    } catch { setHataM("Tuzak kurulamadı. Tekrar dene."); }
    setYuklu(false);
  }

  async function degerlendir() {
    if (!cevap.trim()) return;
    setDeg(true);
    try {
      const j = await sorJSON(`${ZEMIN}

Türkçe cümle: ${gorev.turkce}
Model çeviri: ${gorev.modelCeviri}
Kurulan tuzaklar: ${JSON.stringify(gorev.tuzaklar.map((t) => ({ ad: t.ad, dogruParca: t.dogruParca })))}
Öğrencinin çevirisi: ${cevap}

Her tuzak için öğrencinin düşüp düşmediğini belirle. Anlamı koruyan farklı bir doğru çeviri kullanmışsa düşmemiş sayılır.
Ayrıca tuzak dışında kalan hataları da çıkar.

YALNIZCA şu JSON'u döndür:
{"tuzakSonuc":[{"ad":"...","dustu":true,"ogrenciParca":"öğrencinin yazdığı ilgili parça veya null","aciklama":"tek cümle"}],
"ekHatalar":[{"parca":"...","duzeltme":"...","sebep":"tek cümle","l1":true,"maliyet":3}],
"not":"tek cümle, doğrudan"}`, 1400);
      setRapor(j);
      const dusen = (j.tuzakSonuc || []).filter((t) => t.dustu);
      dusen.forEach((t, i) => hataEkle({
        hataliMetin: t.ogrenciParca || cevap.slice(0, 80), dogruMetin: (gorev.tuzaklar[i] || {}).dogruParca || gorev.modelCeviri,
        dugumId: hedefIdler[i] || null, dugumAdi: t.ad, aile: hedefIdler[i] ? (dugum(hedefIdler[i]) || {}).a : null,
        hataTuru: "yanlis-secim", l1Kaynakli: true, l1Aciklama: (gorev.tuzaklar[i] || {}).neden || null,
        maliyet: 4, kaynak: "tuzak", baglam: "Tuzak cümle", aciklama: t.aciklama
      }));
      (j.ekHatalar || []).forEach((h) => hataEkle({
        hataliMetin: h.parca, dogruMetin: h.duzeltme, dugumId: null, aile: null, hataTuru: "yanlis-secim",
        l1Kaynakli: !!h.l1, maliyet: h.maliyet || 3, kaynak: "tuzak", baglam: "Tuzak cümle", aciklama: h.sebep
      }));
      hedefIdler.forEach((id, i) => { if (id) kaydet(id, !(j.tuzakSonuc || [])[i]?.dustu, 4); });
      oturumBitir({ tur: "tuzak", dogru: (j.tuzakSonuc || []).filter((t) => !t.dustu).length, toplam: (j.tuzakSonuc || []).length, saniye: 180 });
    } catch { setHataM("Değerlendirme alınamadı."); }
    setDeg(false);
  }

  if (!gorev) {
    return (
      <div>
        <Levha style={{ marginBottom: S.lg }}>
          <Etiket renk={C.lal}>Bu turda kurulacak tuzaklar</Etiket>
          <div style={{ display: "grid", gap: 6 }}>
            {hedefler.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: S.sm, ...T.s, color: C.murekkep }}>
                <span style={{ fontFamily: T.hat, color: C.lal, width: 16, ...T.rakam }}>{i + 1}</span>{h}
              </div>
            ))}
          </div>
          <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: S.md }}>
            Tek bir Türkçe cümle kurulacak ve bu hataların hepsini aynı anda davet edecek. Çevirirken nereye basacağını bilmiyorsun — mesele de bu.
          </div>
        </Levha>
        {yuklu ? <Bekle asamalar={["Hata örüntülerin okunuyor…", "Cümle kuruluyor…", "Tuzaklar yerleştiriliyor…"]} />
               : <Dugme tur="altin" tikla={uret}><Crosshair size={13} /> Tuzağı kur</Dugme>}
        {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: S.md }}>
      <Dugme tur="sessiz" kucuk tikla={() => { setGorev(null); setRapor(null); }} style={{ alignSelf: "flex-start" }}>
        <ChevronLeft size={13} /> Yeni tuzak
      </Dugme>
      <Cetvel>
        <Etiket renk={C.altin}>Bu cümleyi İngilizceye çevir</Etiket>
        <div style={{ fontFamily: T.govde, fontSize: 19, lineHeight: 1.6, color: C.murekkep }}>{gorev.turkce}</div>
      </Cetvel>

      {!rapor && (
        <>
          <Alan deger={cevap} degistir={setCevap} satir={4} ipucu="İngilizce çevirini yaz…" />
          {degerlen ? <Bekle asamalar={["Tuzaklar kontrol ediliyor…"]} />
            : <Dugme tikla={degerlendir} pasif={!cevap.trim()} tam>Gönder</Dugme>}
        </>
      )}

      {rapor && (
        <>
          <Levha>
            <Etiket>Senin çevirin</Etiket>
            <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.8, color: C.murekkep }}>{cevap}</div>
          </Levha>

          <div style={{ display: "grid", gap: S.sm }}>
            {(rapor.tuzakSonuc || []).map((t, i) => (
              <Levha key={i} renk={t.dustu ? C.lal : C.zumrut} ic={S.md}>
                <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: 5 }}>
                  {t.dustu ? <XCircle size={15} style={{ color: C.lal }} /> : <CheckCircle size={15} style={{ color: C.zumrut }} />}
                  <span style={{ fontFamily: T.govde, fontSize: 16, color: C.murekkep, flex: 1 }}>{t.ad}</span>
                  <Nisan kucuk renk={t.dustu ? C.lal : C.zumrut} dolu={t.dustu}>{t.dustu ? "düştün" : "kaçındın"}</Nisan>
                </div>
                <div style={{ ...T.s, color: C.murekkepAlt }}>{t.aciklama}</div>
                {(gorev.tuzaklar[i] || {}).neden && (
                  <div style={{ ...T.xs, color: C.lal, marginTop: 4 }}>↳ {gorev.tuzaklar[i].neden}</div>
                )}
              </Levha>
            ))}
          </div>

          {(rapor.ekHatalar || []).length > 0 && (
            <Levha>
              <Etiket renk={C.lal}>Tuzak dışı hatalar</Etiket>
              {rapor.ekHatalar.map((h, i) => (
                <div key={i} style={{ marginBottom: S.sm }}>
                  <div style={{ fontFamily: T.kalem, fontSize: 14.5 }}>
                    <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.parca}</span>
                    <ArrowRight size={11} style={{ margin: "0 6px", verticalAlign: -1, color: C.murekkepSis }} />
                    <span style={{ color: C.zumrut }}>{h.duzeltme}</span>
                  </div>
                  <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 2 }}>{h.sebep}</div>
                </div>
              ))}
            </Levha>
          )}

          <Levha style={{ background: C.kagitAlt }}>
            <Etiket renk={C.zumrut}>Model çeviri</Etiket>
            <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.8, color: C.zumrut }}>{gorev.modelCeviri}</div>
          </Levha>

          {rapor.not && <Haber tur="bilgi">{rapor.not}</Haber>}
          <Dugme tur="altin" tikla={() => { setGorev(null); setRapor(null); }} tam>Yeni tuzak kur</Dugme>
        </>
      )}
    </div>
  );
}

/* ── Kur: rol değişimi ── */
export function tokenle(metin) {
  const parcalar = String(metin).split(/(\s+)/);
  let konum = 0;
  return parcalar.map((m, i) => { const t = { m, i, bas: konum, son: konum + m.length, bosluk: /^\s*$/.test(m) }; konum += m.length; return t; });
}

export function KurModu({ hatalar, ustalik, hataEkle, oturumBitir }) {
  const [oyun, setOyun] = useState(null);
  const [secilen, setSecilen] = useState([]);
  const [bitti, setBitti] = useState(false);
  const [yuklu, setYuklu] = useState(false);
  const [hataM, setHataM] = useState(null);

  const kaynaklar = useMemo(() => {
    const o = hataOrguleri(hatalar, 5);
    return o.length ? o.map((g) => g.dugumId ? (dugum(g.dugumId) || {}).tr || g.dugumAdi : g.dugumAdi || aileAd(g.aile))
                    : zayifDugumler(ustalik, hatalar, 5).map((z) => z.d.tr);
  }, [hatalar, ustalik]);

  async function uret() {
    setYuklu(true); setHataM(null); setSecilen([]); setBitti(false);
    try {
      const j = await sorJSON(`${ZEMIN}

Öğrencinin kendi hata örüntüleri: ${kaynaklar.join(", ")}

Uluslararası ilişkiler veya tarih konulu, 90-130 sözcüklük akıcı bir İngilizce paragraf yaz.
İçine TAM OLARAK 5 dilbilgisi hatası yerleştir ve bu hatalar yukarıdaki örüntülerden seçilsin — yani öğrencinin kendi tipik hatalarını taklit etsin.
Hatalar göze batmasın, metnin geri kalanı kusursuz ve doğal olsun.
"parca" alanı metinde GEÇTİĞİ GİBİ birebir kopyalanmalı ve metinde yalnızca bir kez geçmeli.

YALNIZCA şu JSON'u döndür:
{"metin":"paragraf","hatalar":[{"parca":"metinden birebir","duzeltme":"...","dugumAdi":"kısa Türkçe konu adı","aciklama":"tek cümle"}]}`, 2000);
      const tk = tokenle(j.metin);
      const isaretli = (j.hatalar || []).map((h) => {
        const idx = j.metin.indexOf(h.parca);
        if (idx === -1) return null;
        const ids = tk.filter((t) => !t.bosluk && t.son > idx && t.bas < idx + h.parca.length).map((t) => t.i);
        return { ...h, tokenlar: ids };
      }).filter(Boolean);
      setOyun({ metin: j.metin, tokenlar: tk, hatalar: isaretli });
    } catch { setHataM("Metin üretilemedi. Tekrar dene."); }
    setYuklu(false);
  }

  const sonuc = useMemo(() => {
    if (!bitti || !oyun) return null;
    const sec = new Set(secilen);
    const yakalanan = oyun.hatalar.filter((h) => h.tokenlar.some((t) => sec.has(t)));
    const hataTokenlari = new Set(oyun.hatalar.flatMap((h) => h.tokenlar));
    const yanlisAlarm = secilen.filter((t) => !hataTokenlari.has(t));
    return { yakalanan, kacan: oyun.hatalar.filter((h) => !yakalanan.includes(h)), yanlisAlarm };
  }, [bitti, oyun, secilen]);

  useEffect(() => {
    if (!sonuc || !oyun) return;
    sonuc.kacan.forEach((h) => hataEkle({
      hataliMetin: h.parca, dogruMetin: h.duzeltme, dugumId: null, dugumAdi: h.dugumAdi, aile: null,
      hataTuru: "yanlis-secim", l1Kaynakli: true, maliyet: 3, kaynak: "kur",
      baglam: "Kur · gözden kaçan", aciklama: h.aciklama
    }));
    oturumBitir({ tur: "kur", dogru: sonuc.yakalanan.length, toplam: oyun.hatalar.length, saniye: 240 });
  }, [sonuc]);

  if (!oyun) {
    return (
      <div>
        <Levha style={{ marginBottom: S.lg }}>
          <Etiket renk={C.lacivert}>Rol değişimi</Etiket>
          <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.md }}>
            Metni ben yazacağım ve içine senin kendi hata örüntülerinden beş tane serpiştireceğim.
            Sen bulacaksın. Kendi hatanı başkasının metninde görmek, kendi metninde görmekten kolaydır —
            bu kolaylık bir kez kurulduğunda kendi metnine de taşınır.
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {kaynaklar.map((k, i) => <Nisan key={i} kucuk renk={C.lal} zemin={C.lalSis}>{k}</Nisan>)}
          </div>
        </Levha>
        {yuklu ? <Bekle asamalar={["Örüntülerin okunuyor…", "Metin yazılıyor…", "Hatalar gizleniyor…"]} />
               : <Dugme tur="altin" tikla={uret}><Swords size={13} /> Kura başla</Dugme>}
        {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}
      </div>
    );
  }

  const sec = new Set(secilen);
  const hataTokenlari = new Set(oyun.hatalar.flatMap((h) => h.tokenlar));

  return (
    <div style={{ display: "grid", gap: S.md }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: S.md, flexWrap: "wrap" }}>
        <Dugme tur="sessiz" kucuk tikla={() => setOyun(null)}><ChevronLeft size={13} /> Yeni kur</Dugme>
        <div style={{ display: "flex", gap: S.sm, alignItems: "center" }}>
          <Nisan renk={C.lacivert}>{secilen.length} işaret</Nisan>
          <Nisan>5 hata var</Nisan>
        </div>
      </div>

      <Cetvel>
        <Etiket renk={C.altin}>{bitti ? "Sonuç" : "Hatalı gördüğün sözcüklere tıkla"}</Etiket>
        <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 2.2, color: C.murekkep }}>
          {oyun.tokenlar.map((t) => {
            if (t.bosluk) return <span key={t.i}>{t.m}</span>;
            const secili = sec.has(t.i);
            const hataliMi = hataTokenlari.has(t.i);
            let stil = { cursor: bitti ? "default" : "pointer", padding: "1px 1px", borderRadius: 10, transition: "background .12s" };
            if (!bitti && secili) stil = { ...stil, background: C.laciSis, borderBottom: `2px solid ${C.lacivert}` };
            if (bitti) {
              if (hataliMi && secili) stil = { ...stil, background: C.zumSis, borderBottom: `2px solid ${C.zumrut}`, color: C.zumrut, fontWeight: 600 };
              else if (hataliMi && !secili) stil = { ...stil, background: C.lalSis, borderBottom: `2px solid ${C.lal}`, color: C.lal, fontWeight: 600 };
              else if (secili) stil = { ...stil, textDecoration: "line-through", textDecorationColor: C.murekkepSis, color: C.murekkepSis };
            }
            return (
              <span key={t.i} style={stil}
                onClick={() => { if (bitti) return; setSecilen((s) => s.includes(t.i) ? s.filter((x) => x !== t.i) : [...s, t.i]); }}>
                {t.m}
              </span>
            );
          })}
        </div>
      </Cetvel>

      {!bitti && <Dugme tur="altin" tikla={() => setBitti(true)} tam>Bitir ve göster</Dugme>}

      {bitti && sonuc && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: S.sm }}>
            <Olcu sayi={sonuc.yakalanan.length} ad="yakaladın" renk={C.zumrut} />
            <Olcu sayi={sonuc.kacan.length} ad="kaçırdın" renk={C.lal} />
            <Olcu sayi={sonuc.yanlisAlarm.length} ad="yanlış alarm" renk={C.murekkepAlt} />
          </div>

          {sonuc.kacan.length > 0 && (
            <Levha renk={C.lal}>
              <Etiket renk={C.lal}>Kaçırdıkların — deftere işlendi</Etiket>
              {sonuc.kacan.map((h, i) => (
                <div key={i} style={{ marginBottom: S.md }}>
                  <div style={{ fontFamily: T.kalem, fontSize: 15 }}>
                    <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.parca}</span>
                    <ArrowRight size={11} style={{ margin: "0 6px", verticalAlign: -1, color: C.murekkepSis }} />
                    <span style={{ color: C.zumrut }}>{h.duzeltme}</span>
                  </div>
                  <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 3 }}>{h.dugumAdi} · {h.aciklama}</div>
                </div>
              ))}
            </Levha>
          )}

          {sonuc.yakalanan.length > 0 && (
            <Levha renk={C.zumrut}>
              <Etiket renk={C.zumrut}>Yakaladıkların</Etiket>
              {sonuc.yakalanan.map((h, i) => (
                <div key={i} style={{ ...T.s, color: C.murekkep, marginBottom: 5 }}>
                  <span style={{ fontFamily: T.kalem, fontSize: 14.5 }}>{h.parca}</span>
                  <span style={{ color: C.murekkepSis }}> · {h.dugumAdi}</span>
                </div>
              ))}
            </Levha>
          )}

          <Haber tur={sonuc.yakalanan.length >= 4 ? "iyi" : "bilgi"}>
            {sonuc.yakalanan.length >= 4
              ? "Bu örüntüleri artık başkasının metninde tanıyorsun. Sıradaki iş, kendi metninde de aynı hızla tanımak — Yazıhane'de canlı tashihi aç ve yazarken izle."
              : `${sonuc.kacan.length} hata gözünden kaçtı. Bunlar senin kendi tipik hataların; başkasının metninde bile fark edemiyorsan kendi metninde hiç fark edemezsin. Kaçırdıklarını Sokrates'in Karşılaştır modunda çalış.`}
          </Haber>
          <Dugme tur="altin" tikla={() => setOyun(null)} tam>Yeni kur</Dugme>
        </>
      )}
    </div>
  );
}

/* ── Eşdizim ── */
export function EsdizimModu({ durum, guncelle, hataEkle, oturumBitir }) {
  const [kuyruk, setKuyruk] = useState(() => esdizimKuyrugu(durum).sort(() => Math.random() - 0.5).slice(0, 12));
  const [i, setI] = useState(0);
  const [cevap, setCevap] = useState("");
  const [sonuc, setSonuc] = useState(null);
  const [skor, setSkor] = useState({ d: 0, y: 0 });

  const kart = kuyruk[i];
  const bosluklu = kart ? kart.c.replace(new RegExp(`\\b${kart.p || "__NOPE__"}\\b`), "___") : "";

  function gonder() {
    const verilen = norm(cevap);
    const beklenen = norm(kart.p || "—");
    const dogru = kart.p ? verilen === beklenen : (verilen === "" || verilen === "-" || verilen === "—" || verilen === "yok");
    guncelle(esdizimAnahtar(kart), srsGuncelle(durum[esdizimAnahtar(kart)] || {}, dogru ? 5 : 1));
    if (!dogru) hataEkle({
      hataliMetin: kart.c.replace(new RegExp(`\\b${kart.p || "__NOPE__"}\\b`), cevap || "∅"),
      dogruMetin: kart.c, dugumId: kart.tip === "sifat" ? "edat.sifat-bagimli" : kart.tip === "ad" ? "edat.ad-bagimli" : kart.p ? "edat.fiil-bagimli" : "edat.edat-yok",
      dugumAdi: `${kart.e} ${kart.p || "(edatsız)"}`, aile: "edat", hataTuru: kart.p ? "yanlis-secim" : "fazlalik",
      l1Kaynakli: true, l1Aciklama: kart.tuzak, maliyet: 4, kaynak: "esdizim", baglam: "Eşdizim turu", aciklama: kart.tuzak
    });
    setSkor((s) => ({ d: s.d + (dogru ? 1 : 0), y: s.y + (dogru ? 0 : 1) }));
    setSonuc({ dogru });
  }

  function ileri() {
    if (i + 1 < kuyruk.length) { setI(i + 1); setCevap(""); setSonuc(null); }
    else { oturumBitir({ tur: "esdizim", dogru: skor.d, toplam: kuyruk.length, saniye: kuyruk.length * 12 }); setKuyruk([]); }
  }

  if (!kart) {
    return (
      <Bos baslik={skor.d + skor.y > 0 ? "Tur bitti" : "Kuyruk boş"}
        aciklama={skor.d + skor.y > 0
          ? `${skor.d} doğru, ${skor.y} yanlış. Yanlışlar hata defterine işlendi ve yarın geri gelecek.`
          : "Bugün için bekleyen eşdizim yok. Yarın yeniden gel."}
        eylem={() => { setKuyruk(esdizimKuyrugu(durum).sort(() => Math.random() - 0.5).slice(0, 12)); setI(0); setSkor({ d: 0, y: 0 }); setSonuc(null); setCevap(""); }}
        eylemAd="Yeniden karıştır" />
    );
  }

  return (
    <div style={{ display: "grid", gap: S.md }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...T.cap, color: C.murekkepSis }}>
        <span>{i + 1} / {kuyruk.length}</span>
        <span style={{ display: "flex", gap: S.md }}>
          <span style={{ color: C.zumrut }}>{skor.d} doğru</span>
          <span style={{ color: C.lal }}>{skor.y} yanlış</span>
        </span>
      </div>
      <Cubuk deger={(i / kuyruk.length) * 100} boy={3} />

      <Cetvel>
        <Etiket renk={C.altin}>{kart.e} · {kart.t}</Etiket>
        <div style={{ fontFamily: T.kalem, fontSize: 18, lineHeight: 1.8, color: C.murekkep }}>{bosluklu}</div>
      </Cetvel>

      {!sonuc ? (
        <>
          <Satir deger={cevap} degistir={setCevap} gonder={gonder}
            ipucu="Edatı yaz — edat almıyorsa boş bırak veya — yaz"
            style={{ fontFamily: T.kalem, fontSize: 17, textAlign: "center" }} />
          <Dugme tikla={gonder} tam>Gönder</Dugme>
        </>
      ) : (
        <>
          <Levha renk={sonuc.dogru ? C.zumrut : C.lal}>
            <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.sm }}>
              {sonuc.dogru ? <CheckCircle size={16} style={{ color: C.zumrut }} /> : <XCircle size={16} style={{ color: C.lal }} />}
              <span style={{ fontFamily: T.hat, ...T.d3, color: sonuc.dogru ? C.zumrut : C.lal }}>
                {sonuc.dogru ? "Doğru" : "Yanlış"}
              </span>
            </div>
            <div style={{ fontFamily: T.kalem, fontSize: 16, color: C.murekkep, marginBottom: S.sm }}>
              <strong style={{ color: C.zumrut }}>{kart.e} {kart.p || "(edat almaz)"}</strong>
            </div>
            <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.murekkepAlt }}>{kart.c}</div>
            {kart.tuzak && <div style={{ ...T.xs, color: C.lal, marginTop: S.sm }}>↳ {kart.tuzak}</div>}
          </Levha>
          <Dugme tikla={ileri} tam>{i + 1 < kuyruk.length ? "Sonraki" : "Turu bitir"}</Dugme>
        </>
      )}
    </div>
  );
}

/* ── Merdiven ── */
export function MerdivenModu({ ustalik, hatalar, hedef, setHedef, kaydet, hataEkle, oturumBitir }) {
  const [sorular, setSorular] = useState(null);
  const [i, setI] = useState(0);
  const [cevap, setCevap] = useState("");
  const [secim, setSecim] = useState(null);
  const [sonuc, setSonuc] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const [hataM, setHataM] = useState(null);
  const [degerlen, setDeg] = useState(false);
  const [sayac, setSayac] = useState(null);
  const [tur, setTur] = useState({ dogru: 0, toplam: 0, bas: Date.now() });

  const d = hedef ? dugum(hedef) : null;
  const basamak = d ? (ustalik[d.id] || {}).basamak || 1 : 1;
  const oneriler = useMemo(() => zayifDugumler(ustalik, hatalar, 6), [ustalik, hatalar]);

  useEffect(() => {
    if (basamak !== 5 || !sorular || sonuc) { setSayac(null); return; }
    setSayac(90);
    const t = setInterval(() => setSayac((s) => (s == null ? null : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [i, sorular, basamak, sonuc]);

  async function uret() {
    if (!d) return;
    setYuklu(true); setHataM(null); setSorular(null); setSonuc(null); setI(0); setCevap(""); setSecim(null);
    const gecmis = (hatalar || []).filter((h) => h.dugumId === d.id).slice(-4)
      .map((h) => `"${h.hataliMetin}" → "${h.dogruMetin}"`).join(" | ") || "kayıt yok";
    try {
      const j = await sorJSON(`${ZEMIN}

Hedef düğüm: ${d.tr} (${d.en}). Aile: ${aileAd(d.a)}.
Kural: ${d.k || "-"} | Türkçe tuzağı: ${d.t || "-"}
Öğrencinin bu düğümdeki geçmiş hataları: ${gecmis}

Merdiven basamağı ${basamak} — ${BASAMAK[basamak].ad}.
Basamaklar: 1 çoktan seçmeli tanıma, 2 boşluk doldurma, 3 dönüştürme, 4 Türkçeden İngilizceye çeviri, 5 verilen bağlamda 2-3 cümlelik serbest üretim.
Bu basamağa uygun ${basamak === 5 ? 1 : 4} soru üret. Geçmiş hataları doğrudan hedefle.

YALNIZCA şu JSON'u döndür:
{"sorular":[{"soru":"basamak 1-3 için İngilizce soru (boşluk ___), basamak 4 için çevrilecek TÜRKÇE cümle, basamak 5 için Türkçe görev tarifi","secenekler":["yalnızca basamak 1'de 4 seçenek, diğerlerinde boş dizi"],"dogruCevap":"...","kabul":["kabul edilebilir diğer cevaplar"],"gerekce":"tek cümle","karsit":{"d":"doğru","y":"yanlış","f":"fark"},"tuzak":"Türkçe girişimi varsa tek cümle, yoksa null"}]}`, 1900);
      if (!j.sorular || !j.sorular.length) throw new Error();
      setSorular(j.sorular); setTur({ dogru: 0, toplam: 0, bas: Date.now() });
    } catch { setHataM("Alıştırma üretilemedi. Tekrar dene."); }
    setYuklu(false);
  }

  function bitirSoru(dogruMu, tekHata, ayrinti) {
    kaydet(d.id, dogruMu, basamak);
    const yaz = (h) => hataEkle({
      hataliMetin: h.hataliMetin, dogruMetin: h.dogruMetin, dugumId: d.id, dugumAdi: d.tr, aile: d.a,
      hataTuru: "yanlis-secim", l1Kaynakli: !!h.l1, l1Aciklama: h.l1Aciklama || null,
      maliyet: h.maliyet || 3, kaynak: "merdiven", baglam: `Basamak ${basamak}`, aciklama: h.aciklama
    });
    if (tekHata) yaz(tekHata);
    if (ayrinti && ayrinti.hatalar) ayrinti.hatalar.forEach((h) =>
      yaz({ hataliMetin: h.parca, dogruMetin: h.duzeltme, aciklama: h.sebep, maliyet: h.maliyet || 3, l1: h.l1, l1Aciklama: h.l1Aciklama }));
    setTur((t) => ({ ...t, dogru: t.dogru + (dogruMu ? 1 : 0), toplam: t.toplam + 1 }));
    setSonuc({ dogruMu, s: sorular[i], ayrinti });
  }

  async function gonder() {
    const s = sorular[i];
    const verilen = basamak === 1 ? (s.secenekler || [])[secim] : cevap;
    if (!verilen || !String(verilen).trim()) return;
    if (basamak <= 2) {
      const kabuller = [s.dogruCevap, ...(s.kabul || [])].map(norm);
      const dogru = kabuller.includes(norm(verilen));
      bitirSoru(dogru, dogru ? null : { hataliMetin: String(verilen), dogruMetin: s.dogruCevap, aciklama: s.gerekce, maliyet: 3, l1: !!s.tuzak, l1Aciklama: s.tuzak });
      return;
    }
    setDeg(true);
    try {
      const j = await sorJSON(`${ZEMIN}

Hedef yapı: ${d.tr} (${d.en}). Kural: ${d.k || "-"}
Görev: ${s.soru} | Beklenen: ${s.dogruCevap} | Öğrencinin cevabı: ${verilen}
Anlamı koruyan birden fazla doğru cevap olabilir; doğal ve dilbilgisel olarak doğruysa hedef yapıyı kullanmasa bile kabul et ve belirt. Üslup tercihini hata sayma.

YALNIZCA şu JSON'u döndür:
{"kabul":true,"hatalar":[{"parca":"...","duzeltme":"...","sebep":"tek cümle","l1":true,"l1Aciklama":"veya null","maliyet":3}],"modelCevap":"...","not":"tek cümle"}`, 1100);
      bitirSoru(!!j.kabul && (j.hatalar || []).length === 0, null, j);
    } catch { setSonuc({ hataMesaji: "Değerlendirme alınamadı. Tekrar dene." }); }
    setDeg(false);
  }

  function ileri() {
    if (i + 1 < sorular.length) { setI(i + 1); setCevap(""); setSecim(null); setSonuc(null); }
    else {
      oturumBitir({ tur: "merdiven", dugumId: d.id, dogru: tur.dogru, toplam: tur.toplam, saniye: Math.round((Date.now() - tur.bas) / 1000) });
      setSorular(null); setSonuc(null);
    }
  }

  if (!d) {
    return (
      <div>
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.lg }}>
          Sıralama ustalık puanına, Türkçe girişim şiddetine ve senin kayıtlı hatalarına göre yapıldı. Önkoşulu açılmamış düğümler listeye girmez.
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          {oneriler.map(({ d: dd, p }) => (
            <Levha key={dd.id} tikla={() => setHedef(dd.id)} ic={S.md} renk={seviyeBul(p).renk}>
              <div style={{ display: "flex", alignItems: "center", gap: S.md }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.govde, fontSize: 16.5, color: C.murekkep }}>{dd.tr}</div>
                  <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 2 }}>
                    {aileAd(dd.a)} · Basamak {(ustalik[dd.id] || {}).basamak || 1}/5
                  </div>
                </div>
                {dd.l1 === 3 && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>L1 yüksek</Nisan>}
                <div style={{ width: 44 }}><Cubuk deger={p} renk={seviyeBul(p).renk} boy={4} /></div>
                <Play size={14} style={{ color: C.altin }} />
              </div>
            </Levha>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: S.md, marginBottom: S.md }}>
        <div style={{ minWidth: 0 }}>
          <Dugme tur="sessiz" kucuk tikla={() => { setHedef(null); setSorular(null); setSonuc(null); }}>
            <ChevronLeft size={13} /> Düğüm değiştir
          </Dugme>
          <div style={{ fontFamily: T.hat, ...T.d2, color: C.murekkep, marginTop: 6 }}>{d.tr}</div>
        </div>
        {sayac != null && (
          <Nisan renk={sayac < 20 ? C.lal : C.murekkepAlt} zemin={sayac < 20 ? C.lalSis : undefined}>
            <Clock size={11} /> {sayac}s
          </Nisan>
        )}
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: S.sm }}>
        {[1, 2, 3, 4, 5].map((b) => (
          <div key={b} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 99, background: b < basamak ? C.zumrut : b === basamak ? C.altin : C.kagitDerin }} />
            <div style={{ fontSize: 9, marginTop: 4, letterSpacing: "0.04em", color: b === basamak ? C.altin : C.murekkepSis, fontWeight: b === basamak ? 700 : 400 }}>
              {BASAMAK[b].ad}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...T.xs, color: C.murekkepAlt, marginBottom: S.lg }}>{BASAMAK[basamak].ac}</div>

      {!sorular && !yuklu && (
        <div style={{ textAlign: "center", padding: S.xl }}>
          <Dugme tur="altin" tikla={uret}><Zap size={13} /> Alıştırma üret</Dugme>
          {hataM && <div style={{ ...T.s, color: C.lal, marginTop: S.md }}>{hataM}</div>}
        </div>
      )}
      {yuklu && <Bekle asamalar={["Zayıf noktan okunuyor…", "Geçmiş hataların taranıyor…", "Sorular üretiliyor…"]} />}

      {sorular && (
        <div style={{ display: "grid", gap: S.md }}>
          <div style={{ ...T.cap, color: C.murekkepSis }}>Soru {i + 1} / {sorular.length}</div>
          <Cetvel>
            <div style={{ fontFamily: basamak >= 4 ? T.govde : T.kalem, fontSize: basamak >= 4 ? 18.5 : 16.5, lineHeight: 1.7, color: C.murekkep }}>
              {sorular[i].soru}
            </div>
          </Cetvel>

          {basamak === 1 ? (
            <div style={{ display: "grid", gap: 6 }}>
              {(sorular[i].secenekler || []).map((o, k) => {
                const secildi = secim === k;
                const dogruSec = sonuc && norm(o) === norm(sonuc.s.dogruCevap);
                const renk = sonuc ? (dogruSec ? C.zumrut : secildi ? C.lal : C.cizgi) : secildi ? C.altin : C.cizgi;
                return (
                  <div key={k} onClick={() => !sonuc && setSecim(k)}
                    style={{ border: `1px solid ${renk}`, background: sonuc && dogruSec ? C.zumSis : secildi && !sonuc ? C.altinSis : C.muhre,
                      borderRadius: 14, padding: `${S.md}px`, cursor: sonuc ? "default" : "pointer",
                      fontFamily: T.kalem, fontSize: 15.5, color: C.murekkep, display: "flex", gap: S.sm }}>
                    <span style={{ color: C.murekkepSis }}>{"ABCD"[k]}</span><span>{o}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alan deger={cevap} degistir={setCevap} pasif={!!sonuc} satir={basamak === 5 ? 5 : 3}
              ipucu={basamak >= 4 ? "İngilizce cevabını yaz…" : "Cevabını yaz…"} />
          )}

          {!sonuc && (degerlen
            ? <Bekle asamalar={["Cevabın ayrıştırılıyor…", "Girişim kontrol ediliyor…"]} />
            : <Dugme tikla={gonder} pasif={basamak === 1 ? secim == null : !cevap.trim()} tam>Gönder</Dugme>)}

          {sonuc && sonuc.hataMesaji && <Haber tur="hata">{sonuc.hataMesaji}</Haber>}

          {sonuc && !sonuc.hataMesaji && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: S.sm, fontFamily: T.hat, ...T.d3, color: sonuc.dogruMu ? C.zumrut : C.lal }}>
                {sonuc.dogruMu ? <CheckCircle size={18} /> : <XCircle size={18} />}
                {sonuc.dogruMu ? "Doğru" : "Yanlış"}
              </div>
              {!sonuc.dogruMu && (
                <Levha style={{ background: C.kagitAlt }}>
                  <Etiket renk={C.zumrut}>Beklenen</Etiket>
                  <div style={{ fontFamily: T.kalem, fontSize: 16, color: C.zumrut }}>{sonuc.s.dogruCevap}</div>
                </Levha>
              )}
              {sonuc.ayrinti && (sonuc.ayrinti.hatalar || []).length > 0 && (
                <Levha renk={C.lal}>
                  <Etiket renk={C.lal}>Hatalar</Etiket>
                  {sonuc.ayrinti.hatalar.map((h, k) => (
                    <div key={k} style={{ marginBottom: S.sm }}>
                      <div style={{ fontFamily: T.kalem, fontSize: 15 }}>
                        <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.parca}</span>
                        <ArrowRight size={11} style={{ margin: "0 6px", verticalAlign: -1, color: C.murekkepSis }} />
                        <span style={{ color: C.zumrut }}>{h.duzeltme}</span>
                      </div>
                      <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 3 }}>{h.sebep}</div>
                      {h.l1 && h.l1Aciklama && <div style={{ ...T.xs, color: C.lal, marginTop: 2 }}>↳ {h.l1Aciklama}</div>}
                    </div>
                  ))}
                </Levha>
              )}
              {sonuc.ayrinti && sonuc.ayrinti.not && <Haber tur={sonuc.dogruMu ? "iyi" : "bilgi"}>{sonuc.ayrinti.not}</Haber>}
              {sonuc.s.gerekce && !sonuc.ayrinti && <Haber tur="bilgi">{sonuc.s.gerekce}</Haber>}
              {sonuc.s.karsit && (
                <Levha>
                  <Etiket>Karşıt çift</Etiket>
                  <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.zumrut }}>✓ {sonuc.s.karsit.d}</div>
                  <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.lal, marginTop: 4 }}>✗ {sonuc.s.karsit.y}</div>
                  <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: S.sm }}>{sonuc.s.karsit.f}</div>
                </Levha>
              )}
              {sonuc.s.tuzak && (
                <div style={{ background: C.lalSis, borderLeft: `2.5px solid ${C.lal}`, padding: S.md, borderRadius: 10, ...T.s }}>
                  <strong style={{ color: C.lal }}>Türkçe tuzağı · </strong>{sonuc.s.tuzak}
                </div>
              )}
              <Dugme tikla={ileri} tam>{i + 1 < sorular.length ? "Sonraki soru" : "Turu bitir"}</Dugme>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function Talimhane(p) {
  const [mod, setMod] = useState("merdiven");
  const aktif = TALIM_MODLARI.find((m) => m.id === mod);
  return (
    <div>
      <Baslik ust="Alıştırma" ad="Talimhane" alt={aktif.ac} />
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: S.xl }}>
        {TALIM_MODLARI.map((m) => {
          const I = m.ikon;
          return (
            <Dugme key={m.id} tur={mod === m.id ? "ikincil" : "sessiz"} kucuk tikla={() => setMod(m.id)}>
              <I size={12} /> {m.ad}
            </Dugme>
          );
        })}
      </div>
      {mod === "merdiven" && <MerdivenModu ustalik={p.ustalik} hatalar={p.hatalar} hedef={p.hedef} setHedef={p.setHedef}
        kaydet={p.kaydet} hataEkle={p.hataEkle} oturumBitir={p.oturumBitir} />}
      {mod === "tuzak" && <TuzakModu hatalar={p.hatalar} ustalik={p.ustalik} hataEkle={p.hataEkle} kaydet={p.kaydet} oturumBitir={p.oturumBitir} />}
      {mod === "kur" && <KurModu hatalar={p.hatalar} ustalik={p.ustalik} hataEkle={p.hataEkle} oturumBitir={p.oturumBitir} />}
      {mod === "esdizim" && <EsdizimModu durum={p.esdizim} guncelle={p.esdizimGuncelle} hataEkle={p.hataEkle} oturumBitir={p.oturumBitir} />}
    </div>
  );
}

/* ══════════════════════ YAZIHANE ══════════════════════ */

export const AILE_LISTE = "iskelet, ad-obegi, zaman, kip, cati, fiil-oruntu, yan-cumle, kosul, soylem, edat, nitel, vurgu, kayit, mekanik";

export async function tashihEt(metin, baglam) {
  return sorJSON(`${ZEMIN}

Aşağıdaki metni cümle cümle analiz et. Bağlam: ${baglam || "belirtilmedi"}
Her dilbilgisi, kayıt ve mekanik hatası için bir kayıt üret. Üslup tercihini hata sayma.
Her hata için Türkçe girişimi olup olmadığını değerlendir: öğrenci bunu Türkçenin yapısını aktardığı için mi yaptı? Öyleyse hangi Türkçe yapının aktarıldığını yaz.
"hataliParca" metinde GEÇTİĞİ GİBİ birebir kopyalanmalı.
"aile" şunlardan biri: ${AILE_LISTE}

METİN:
${metin}

YALNIZCA şu JSON'u döndür:
{"hatalar":[{"hataliParca":"birebir","duzeltme":"...","aile":"...","dugumAdi":"kısa Türkçe konu adı","hataTuru":"eksiltme|fazlalik|yanlis-secim|bicim|siralama|kayit-uyumsuzlugu","l1Kaynakli":true,"l1Aciklama":"Türkçede ... olduğu için ... (yoksa null)","maliyet":3,"aciklama":"tek cümle, doğrudan"}],
"baskinOruntuler":["...","...","..."],"ozet":"iki cümlelik teşhis","sonrakiAdim":"tek somut eylem",
"yukseltilmisMetin":"metnin hatasız ve akademik kayıtta yeniden yazılmış hali"}`, 3200);
}

export const HATA_TUR_AD = { eksiltme: "eksiltme", fazlalik: "fazlalık", "yanlis-secim": "yanlış seçim", bicim: "biçim", siralama: "sıralama", "kayit-uyumsuzlugu": "kayıt uyumsuzluğu" };

/* ── Serbest: canlı tashih ── */
export function SerbestModu({ hatalar, hataEkle, metinEkle, oturumBitir, taslak, taslakKaydet }) {
  const [metin, setMetin] = useState(taslak || "");
  const [baglam, setBaglam] = useState("");
  const [canli, setCanli] = useState(true);
  const [rapor, setRapor] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const [secili, setSecili] = useState(null);
  const [gorunum, setGorunum] = useState("yaz");
  const [hataM, setHataM] = useState(null);
  const [kehanet, setKehanet] = useState(null);
  const [isabet, setIsabet] = useState(null);
  const zaman = useRef(null);
  const sonAnaliz = useRef("");

  const kelime = kelimeSay(metin);

  useEffect(() => { taslakKaydet(metin); }, [metin]);

  useEffect(() => {
    if (!canli) return;
    if (zaman.current) clearTimeout(zaman.current);
    if (kelime < 25 || metin === sonAnaliz.current) return;
    zaman.current = setTimeout(() => { calistir(true); }, 3200);
    return () => { if (zaman.current) clearTimeout(zaman.current); };
  }, [metin, canli]);

  async function calistir(sessiz) {
    if (kelime < 20) { if (!sessiz) setHataM("Anlamlı bir teşhis için en az 20 sözcük gerekiyor."); return; }
    if (yuklu) return;
    setYuklu(true); if (!sessiz) setHataM(null);
    sonAnaliz.current = metin;
    try {
      const j = await tashihEt(metin, baglam);
      setRapor(j);
      if (kehanet) setIsabet(kehanetDegerlendir(kehanet, (j.hatalar || []).map((h) => ({ dugumAdi: h.dugumAdi, aile: h.aile }))));
    } catch { if (!sessiz) setHataM("Analiz alınamadı. Metni kısaltıp tekrar dene."); }
    setYuklu(false);
  }

  function isle() {
    if (!rapor) return;
    (rapor.hatalar || []).forEach((h) => hataEkle({
      hataliMetin: h.hataliParca, dogruMetin: h.duzeltme, dugumId: null, dugumAdi: h.dugumAdi, aile: h.aile,
      hataTuru: h.hataTuru, l1Kaynakli: !!h.l1Kaynakli, l1Aciklama: h.l1Aciklama || null,
      maliyet: h.maliyet || 3, kaynak: "yazihane", baglam: baglam || "serbest metin", aciklama: h.aciklama
    }));
    metinEkle({ id: yeniId("m"), tarih: new Date().toISOString(), baglam: baglam || "serbest metin",
      kelimeSayisi: kelime, hataSayisi: (rapor.hatalar || []).length, ozet: rapor.ozet, tur: "serbest", tamMetin: metin });
    oturumBitir({ tur: "yazihane", saniye: 420, kelime, hata: (rapor.hatalar || []).length });
    setMetin(""); setRapor(null); setKehanet(null); setIsabet(null); sonAnaliz.current = "";
  }

  const yogun = rapor && kelime ? Math.round(((rapor.hatalar || []).length / kelime) * 1000) : null;
  const aileGrup = useMemo(() => {
    if (!rapor) return [];
    const g = {};
    (rapor.hatalar || []).forEach((h, i) => { (g[h.aile] = g[h.aile] || []).push({ h, i }); });
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length);
  }, [rapor]);

  return (
    <div>
      {!kehanet && !rapor && (
        <Levha style={{ marginBottom: S.md, background: C.laciSis, borderColor: C.lacivert + "44" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: S.md }}>
            <Gul boy={20} renk={C.lacivert} />
            <div style={{ flex: 1 }}>
              <div style={{ ...T.cap, color: C.lacivert, marginBottom: 5 }}>Kehanet</div>
              <div style={{ ...T.s, color: C.murekkep, marginBottom: S.sm }}>
                Yazmaya başlamadan önce hangi hataları yapacağını tahmin edebilirim. Sonra tahminimi tutup tutmadığını ölçeriz.
                Amaç şu: bir gün bu tahmin tutmasın.
              </div>
              <Dugme tur="lacivert" kucuk tikla={() => setKehanet(kehanetUret(hatalar, {}, 4))}>
                <Gauge size={12} /> Tahminini gör
              </Dugme>
            </div>
          </div>
        </Levha>
      )}

      {kehanet && (
        <Levha style={{ marginBottom: S.md }} renk={C.lacivert}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: S.sm }}>
            <Etiket renk={C.lacivert} style={{ margin: 0 }}>Kehanet · bu metinde yapmanı beklediğim hatalar</Etiket>
            {isabet && <Nisan renk={isabet.isabet > 50 ? C.lal : C.zumrut} dolu>%{isabet.isabet} isabet</Nisan>}
          </div>
          <div style={{ display: "grid", gap: 5 }}>
            {kehanet.map((k, i) => {
              const tuttu = isabet && isabet.tutanlar.includes(k.anahtar);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: S.sm, ...T.s }}>
                  <span style={{ width: 42, ...T.rakam, fontFamily: T.hat, color: C.lacivert }}>%{Math.round(k.olasilik * 100)}</span>
                  <span style={{ flex: 1, color: C.murekkep, textDecoration: isabet && !tuttu ? "line-through" : "none", opacity: isabet && !tuttu ? 0.5 : 1 }}>
                    {k.dugumId ? (dugum(k.dugumId) || {}).tr : k.dugumAdi || aileAd(k.aile)}
                  </span>
                  {isabet && (tuttu ? <XCircle size={14} style={{ color: C.lal }} /> : <CheckCircle size={14} style={{ color: C.zumrut }} />)}
                </div>
              );
            })}
          </div>
          {isabet && (
            <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: S.md, paddingTop: S.sm, borderTop: `1px dashed ${C.cizgi}` }}>
              {isabet.isabet >= 75 ? "Model seni fazla iyi tanıyor. Bu iyi bir haber değil — örüntülerin hâlâ sabit."
                : isabet.isabet >= 40 ? "Model seni kısmen tanıyor. Bazı örüntülerden çıkmaya başlamışsın."
                : "Model seni ıskaladı. Eski örüntülerinin dışına çıkıyorsun — asıl aradığımız buydu."}
            </div>
          )}
        </Levha>
      )}

      <div style={{ display: "flex", gap: S.sm, alignItems: "center", marginBottom: S.sm, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Satir deger={baglam} degistir={setBaglam} ipucu="Bağlam — IB Paper 1 blog, resmî e-posta, deneme…" />
        </div>
        <Dugme tur={canli ? "lacivert" : "sessiz"} kucuk tikla={() => setCanli(!canli)}>
          <Radio size={12} /> Canlı tashih {canli ? "açık" : "kapalı"}
        </Dugme>
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: S.sm }}>
        <Dugme tur={gorunum === "yaz" ? "ikincil" : "sessiz"} kucuk tikla={() => setGorunum("yaz")}><PenLine size={11} /> Yaz</Dugme>
        <Dugme tur={gorunum === "tashih" ? "ikincil" : "sessiz"} kucuk tikla={() => setGorunum("tashih")} pasif={!rapor}><Feather size={11} /> Tashihli</Dugme>
        <Dugme tur={gorunum === "yukselt" ? "ikincil" : "sessiz"} kucuk tikla={() => setGorunum("yukselt")} pasif={!rapor}><Sparkles size={11} /> Yükseltilmiş</Dugme>
        <span style={{ flex: 1 }} />
        <span style={{ ...T.cap, color: C.murekkepSis, alignSelf: "center" }}>{kelime} sözcük</span>
        {yogun != null && <Nisan kucuk renk={yogun > 25 ? C.lal : yogun > 12 ? C.altin : C.zumrut} dolu>{yogun}/1000</Nisan>}
        {yuklu && <Loader2 size={13} style={{ color: C.altin, animation: "nspin 1.1s linear infinite", alignSelf: "center" }} />}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: rapor ? "repeat(auto-fit, minmax(270px, 1fr))" : "1fr", gap: S.md, alignItems: "start" }}>
        <div>
          {gorunum === "yaz" && <Alan deger={metin} degistir={setMetin} satir={17} ipucu="Yazmaya başla. Yirmi sözcüğü geçtikten sonra üç saniyelik her duraklamada metnin sessizce taranır." />}
          {gorunum === "tashih" && rapor && (
            <Cetvel sikilik="dar"><TashihliMetin metin={metin} hatalar={rapor.hatalar} secili={secili} sec={setSecili} /></Cetvel>
          )}
          {gorunum === "yukselt" && rapor && (
            <Cetvel sikilik="dar">
              <Etiket renk={C.zumrut}>Hatasız, akademik kayıtta</Etiket>
              <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 2, whiteSpace: "pre-wrap", color: C.murekkep }}>{rapor.yukseltilmisMetin}</div>
            </Cetvel>
          )}
        </div>

        {rapor && (
          <Hasiye baslik={`Haşiye · ${(rapor.hatalar || []).length} hata`}>
            <div style={{ display: "grid", gap: 6, maxHeight: 520, overflowY: "auto" }}>
              {aileGrup.map(([aid, liste]) => (
                <div key={aid}>
                  <div style={{ ...T.xs, fontSize: 12.5, color: C.murekkepSis, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                    {aileKisa(aid)} · {liste.length}
                  </div>
                  {liste.map(({ h, i }) => (
                    <div key={i} onClick={() => setSecili(secili === i ? null : i)}
                      style={{ cursor: "pointer", padding: "5px 6px", marginBottom: 3, borderRadius: 10,
                        background: secili === i ? C.altinSis : "transparent", borderLeft: `2px solid ${h.l1Kaynakli ? C.lal : C.cizgi}` }}>
                      <div style={{ fontFamily: T.kalem, fontSize: 13.5, lineHeight: 1.45 }}>
                        <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.hataliParca}</span>
                        <span style={{ color: C.zumrut }}> → {h.duzeltme}</span>
                      </div>
                      {secili === i && (
                        <div style={{ ...T.xs, fontSize: 13, color: C.murekkepAlt, marginTop: 4 }}>
                          {h.aciklama}
                          {h.l1Kaynakli && h.l1Aciklama && <div style={{ color: C.lal, marginTop: 3 }}>↳ {h.l1Aciklama}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Hasiye>
        )}
      </div>

      <div style={{ display: "flex", gap: S.sm, marginTop: S.md, flexWrap: "wrap" }}>
        {!canli && <Dugme tur="altin" tikla={() => calistir(false)} pasif={yuklu}><Feather size={13} /> Tashih et</Dugme>}
        {rapor && <Dugme tikla={isle}><Check size={13} /> Hataları deftere işle ve bitir</Dugme>}
      </div>
      {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}

      {rapor && (
        <div style={{ marginTop: S.lg, display: "grid", gap: S.md }}>
          <Levha style={{ background: C.kagitAlt }}>
            <Etiket renk={C.altin}>Teşhis</Etiket>
            <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.md }}>{rapor.ozet}</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: S.md }}>
              {(rapor.baskinOruntuler || []).map((p, i) => <Nisan key={i} renk={C.lal} zemin={C.lalSis}>{p}</Nisan>)}
            </div>
            {rapor.sonrakiAdim && (
              <div style={{ ...T.s, color: C.murekkep, borderLeft: `2px solid ${C.altin}`, paddingLeft: S.sm }}>
                <strong>Sıradaki adım · </strong>{rapor.sonrakiAdim}
              </div>
            )}
          </Levha>
        </div>
      )}
    </div>
  );
}

/* ── Kalem: IB Paper 1 ── */
export const METIN_TURLERI = ["Blog yazısı", "Resmî e-posta", "Makale", "Konuşma metni", "Öneri raporu", "İnceleme", "Röportaj", "Günlük"];

export function KalemModu({ hataEkle, metinEkle, metinler, oturumBitir }) {
  const [gorev, setGorev] = useState(null);
  const [tur, setTur] = useState(METIN_TURLERI[0]);
  const [metin, setMetin] = useState("");
  const [uretiliyor, setUret] = useState(false);
  const [degerlen, setDeg] = useState(false);
  const [rapor, setRapor] = useState(null);
  const [hataM, setHataM] = useState(null);
  const [sure, setSure] = useState(null);
  const kelime = kelimeSay(metin);
  const gecmis = (metinler || []).filter((m) => m.tur === "kalem");

  useEffect(() => {
    if (sure == null) return;
    const t = setInterval(() => setSure((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [sure == null]);

  async function gorevUret() {
    setUret(true); setHataM(null); setRapor(null); setMetin("");
    try {
      const j = await sorJSON(`${ZEMIN}

IB English B HL Paper 1 formatında bir yazma görevi üret. Metin türü: ${tur}.
Uluslararası ilişkiler, tarih, siyaset, sinema veya toplumsal bir konuyla ilgili olsun.

YALNIZCA şu JSON'u döndür:
{"baglam":"2-3 cümlelik Türkçe durum tarifi","gorev":"İngilizce görev metni, IB üslubunda","metinTuru":"${tur}","hedefKitle":"kim okuyacak","kelimeAraligi":"örn. 450-600","kayitNotu":"bu tür hangi kaydı gerektiriyor, tek cümle Türkçe"}`, 900);
      setGorev(j); setSure(3600);
    } catch { setHataM("Görev üretilemedi."); }
    setUret(false);
  }

  async function degerlendir() {
    if (kelime < 60) { setHataM("Değerlendirme için en az 60 sözcük gerekiyor."); return; }
    setDeg(true); setHataM(null);
    try {
      const j = await sorJSON(`${ZEMIN}

Sen deneyimli bir IB English B HL sınav görevlisisin.
Görev: ${gorev.gorev} | Tür: ${gorev.metinTuru} | Kitle: ${gorev.hedefKitle}
Öğrenci metni:
${metin}

Üç ölçütü ayrı ayrı 1-12 bandında puanla: Dil, Mesaj, Kavramsal Anlayış. Nazik olma, doğru ol. Bandı somut kanıtla gerekçelendir.
Metindeki dilbilgisi hatalarını da çıkar; "hataliParca" birebir kopyalanmalı. "aile" şunlardan biri: ${AILE_LISTE}

YALNIZCA şu JSON'u döndür:
{"olcutler":[{"ad":"Dil","bant":0,"gerekce":"...","kanit":["..."]},{"ad":"Mesaj","bant":0,"gerekce":"...","kanit":["..."]},{"ad":"Kavramsal Anlayış","bant":0,"gerekce":"...","kanit":["..."]}],
"toplamIzlenim":"2-3 cümle","kritikUcDuzeltme":["...","...","..."],"birUstBantIcin":"...",
"hatalar":[{"hataliParca":"...","duzeltme":"...","aile":"...","dugumAdi":"...","hataTuru":"yanlis-secim","l1Kaynakli":true,"l1Aciklama":"veya null","maliyet":3,"aciklama":"tek cümle"}]}`, 3200);
      setRapor(j); setSure(null);
      (j.hatalar || []).forEach((h) => hataEkle({
        hataliMetin: h.hataliParca, dogruMetin: h.duzeltme, dugumId: null, dugumAdi: h.dugumAdi, aile: h.aile,
        hataTuru: h.hataTuru, l1Kaynakli: !!h.l1Kaynakli, l1Aciklama: h.l1Aciklama || null,
        maliyet: h.maliyet || 3, kaynak: "kalem", baglam: `Paper 1 — ${gorev.metinTuru}`, aciklama: h.aciklama
      }));
      const ort = Math.round(((j.olcutler || []).reduce((a, o) => a + (o.bant || 0), 0) / Math.max((j.olcutler || []).length, 1)) * 10) / 10;
      metinEkle({ id: yeniId("k"), tarih: new Date().toISOString(), baglam: `Paper 1 — ${gorev.metinTuru}`,
        kelimeSayisi: kelime, hataSayisi: (j.hatalar || []).length, bant: ort, tur: "kalem", tamMetin: metin, gorev });
      oturumBitir({ tur: "kalem", saniye: 3600 - (sure || 0), kelime, hata: (j.hatalar || []).length });
    } catch { setHataM("Değerlendirme alınamadı."); }
    setDeg(false);
  }

  if (rapor) {
    return (
      <div style={{ display: "grid", gap: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={() => { setRapor(null); setGorev(null); setMetin(""); }} style={{ alignSelf: "flex-start" }}>
          <ChevronLeft size={13} /> Yeni görev
        </Dugme>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: S.sm }}>
          {(rapor.olcutler || []).map((o, i) => (
            <Levha key={i} ic={S.md} style={{ textAlign: "center" }}>
              <div style={{ ...T.cap, fontSize: 11.5, color: C.murekkepAlt }}>{o.ad}</div>
              <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 2px" }}>
                <Halka deger={(o.bant / 12) * 100} boy={54} kalinlik={3.5}
                  renk={o.bant >= 9 ? C.zumrut : o.bant >= 6 ? C.altin : C.lal}
                  ic={<span style={{ fontFamily: T.hat, fontSize: 20, ...T.rakam, color: o.bant >= 9 ? C.zumrut : o.bant >= 6 ? C.altin : C.lal }}>{o.bant}</span>} />
              </div>
              <div style={{ ...T.xs, fontSize: 12, color: C.murekkepSis }}>/ 12</div>
            </Levha>
          ))}
        </div>
        {(rapor.olcutler || []).map((o, i) => (
          <Levha key={i}>
            <Etiket>{o.ad}</Etiket>
            <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep }}>{o.gerekce}</div>
            {(o.kanit || []).length > 0 && (
              <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}` }}>
                {o.kanit.map((k, j) => <div key={j} style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepAlt, marginBottom: 4 }}>· {k}</div>)}
              </div>
            )}
          </Levha>
        ))}
        <Levha style={{ background: C.kagitAlt }}>
          <Etiket renk={C.altin}>Toplam izlenim</Etiket>
          <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.md }}>{rapor.toplamIzlenim}</div>
          <Etiket renk={C.lal}>Kritik üç düzeltme</Etiket>
          <ol style={{ margin: 0, paddingLeft: 20, ...T.m, fontFamily: T.govde, color: C.murekkep }}>
            {(rapor.kritikUcDuzeltme || []).map((k, i) => <li key={i} style={{ marginBottom: 4 }}>{k}</li>)}
          </ol>
        </Levha>
        {rapor.birUstBantIcin && <Haber tur="bilgi" basli="Bir üst bant için">{rapor.birUstBantIcin}</Haber>}
        {(rapor.hatalar || []).length > 0 && (
          <Cetvel sikilik="dar">
            <Etiket renk={C.lal}>{rapor.hatalar.length} hata deftere işlendi</Etiket>
            <TashihliMetin metin={metin} hatalar={rapor.hatalar} kompakt />
          </Cetvel>
        )}
      </div>
    );
  }

  if (!gorev) {
    return (
      <div>
        <Etiket>Metin türü</Etiket>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: S.lg }}>
          {METIN_TURLERI.map((t) => <Dugme key={t} tur={tur === t ? "ikincil" : "sessiz"} kucuk tikla={() => setTur(t)}>{t}</Dugme>)}
        </div>
        {uretiliyor ? <Bekle asamalar={["Görev bağlamı kuruluyor…", "Hedef kitle belirleniyor…"]} />
          : <Dugme tur="altin" tikla={gorevUret}><PenLine size={13} /> Görev üret</Dugme>}
        {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}
        {gecmis.length > 0 && (
          <>
            <Fasil ad="Geçmiş teslimler" />
            <div style={{ display: "grid", gap: 4 }}>
              {gecmis.slice(-8).reverse().map((m) => (
                <Levha key={m.id} ic={S.md}>
                  <div style={{ display: "flex", gap: S.md, alignItems: "center", ...T.s }}>
                    <span style={{ flex: 1, color: C.murekkep }}>{m.baglam}</span>
                    <Nisan kucuk>{m.kelimeSayisi} söz.</Nisan>
                    {m.bant != null && <Nisan kucuk renk={C.altin} dolu>bant {m.bant}</Nisan>}
                    <span style={{ color: C.murekkepSis, ...T.xs }}>{trTarih(m.tarih)}</span>
                  </div>
                </Levha>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: S.md }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={() => { setGorev(null); setSure(null); }}><ChevronLeft size={13} /> Vazgeç</Dugme>
        {sure != null && (
          <Nisan renk={sure < 300 ? C.lal : C.murekkepAlt} zemin={sure < 300 ? C.lalSis : undefined}>
            <Clock size={11} /> {Math.floor(sure / 60)}:{String(sure % 60).padStart(2, "0")}
          </Nisan>
        )}
      </div>
      <Cetvel>
        <Etiket renk={C.altin}>{gorev.metinTuru} · {gorev.kelimeAraligi} sözcük</Etiket>
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>{gorev.baglam}</div>
        <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.8, color: C.murekkep }}>{gorev.gorev}</div>
        <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}`, ...T.xs, color: C.murekkepAlt }}>
          <strong>Kayıt · </strong>{gorev.kayitNotu} &nbsp;·&nbsp; <strong>Kitle · </strong>{gorev.hedefKitle}
        </div>
      </Cetvel>
      <Alan deger={metin} degistir={setMetin} satir={16} ipucu="Metnini buraya yaz…" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.cap, color: C.murekkepSis }}>{kelime} sözcük</span>
        {degerlen ? <Bekle asamalar={["Ölçütlere göre okunuyor…", "Bantlar gerekçelendiriliyor…", "Hatalar çıkarılıyor…"]} />
          : <Dugme tur="altin" tikla={degerlendir}>Teslim et ve değerlendir</Dugme>}
      </div>
      {hataM && <Haber tur="hata">{hataM}</Haber>}
    </div>
  );
}

/* ── Palimpsest ── */
export function PalimpsestModu({ metinler, hataEkle, metinEkle, oturumBitir }) {
  const [secili, setSecili] = useState(null);
  const [metin, setMetin] = useState("");
  const [rapor, setRapor] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const adaylar = useMemo(() => palimpsestAdaylari(metinler), [metinler]);
  const kelime = kelimeSay(metin);

  async function calistir() {
    if (kelime < 60) return;
    setYuklu(true);
    try {
      const j = await tashihEt(metin, secili.baglam);
      setRapor(j);
      (j.hatalar || []).forEach((h) => hataEkle({
        hataliMetin: h.hataliParca, dogruMetin: h.duzeltme, dugumId: null, dugumAdi: h.dugumAdi, aile: h.aile,
        hataTuru: h.hataTuru, l1Kaynakli: !!h.l1Kaynakli, l1Aciklama: h.l1Aciklama || null,
        maliyet: h.maliyet || 3, kaynak: "palimpsest", baglam: secili.baglam, aciklama: h.aciklama
      }));
      metinEkle({ id: yeniId("p"), tarih: new Date().toISOString(), baglam: secili.baglam + " · palimpsest",
        kelimeSayisi: kelime, hataSayisi: (j.hatalar || []).length, tur: "palimpsest", tamMetin: metin, palimpsestId: secili.id });
      oturumBitir({ tur: "palimpsest", saniye: 1800, kelime, hata: (j.hatalar || []).length });
    } catch {}
    setYuklu(false);
  }

  if (!adaylar.length && !secili) {
    return <Bos baslik="Henüz kazınacak bir sayfa yok"
      aciklama="Palimpsest, üzerine yeniden yazmak için kazınmış bir parşömendir. Kalem'de bir Paper 1 görevi tamamla; yirmi bir gün sonra aynı görev burada, eski metnin gizlenmiş olarak karşına çıkacak. Aynı görevi yeniden yazacak ve iki hâlini yan yana göreceksin." />;
  }

  if (!secili) {
    return (
      <div>
        <Haber tur="bilgi" basli="Palimpsest">
          Eski bir görevi seç. Kendi eski metnini görmeden yeniden yazacaksın. Sonra iki hâli yan yana koyup ne kadar yol aldığını ölçeceğiz.
          Kendi geçmiş hâline karşı yazmak, herhangi bir puandan daha net bir ölçüdür.
        </Haber>
        <Fasil ad="Kazınmaya hazır sayfalar" />
        <div style={{ display: "grid", gap: 5 }}>
          {adaylar.map((m) => (
            <Levha key={m.id} tikla={() => { setSecili(m); setMetin(""); setRapor(null); }} ic={S.md}>
              <div style={{ display: "flex", alignItems: "center", gap: S.md }}>
                <History size={16} style={{ color: C.altin }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...T.s, color: C.murekkep }}>{m.baglam}</div>
                  <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 2 }}>
                    {trTarih(m.tarih)} · {gunFarki(m.tarih.slice(0, 10), bugun())} gün önce · {m.kelimeSayisi} sözcük · {m.hataSayisi} hata
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: C.murekkepSis }} />
              </div>
            </Levha>
          ))}
        </div>
      </div>
    );
  }

  const eskiYogun = secili.kelimeSayisi ? Math.round((secili.hataSayisi / secili.kelimeSayisi) * 1000) : 0;
  const yeniYogun = rapor && kelime ? Math.round(((rapor.hatalar || []).length / kelime) * 1000) : null;

  return (
    <div style={{ display: "grid", gap: S.md }}>
      <Dugme tur="sessiz" kucuk tikla={() => { setSecili(null); setRapor(null); }} style={{ alignSelf: "flex-start" }}>
        <ChevronLeft size={13} /> Başka sayfa
      </Dugme>
      <Cetvel>
        <Etiket renk={C.altin}>{gunFarki(secili.tarih.slice(0, 10), bugun())} gün önceki görev</Etiket>
        <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.8, color: C.murekkep }}>
          {secili.gorev ? secili.gorev.gorev : secili.baglam}
        </div>
      </Cetvel>

      {!rapor ? (
        <>
          <Haber tur="altin">Eski metnini şu an göremiyorsun — kasıtlı. Görevi sıfırdan yeniden yaz.</Haber>
          <Alan deger={metin} degistir={setMetin} satir={15} ipucu="Yeniden yaz…" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...T.cap, color: C.murekkepSis }}>{kelime} sözcük · eskisi {secili.kelimeSayisi}</span>
            {yuklu ? <Bekle asamalar={["Yeni metin taranıyor…", "İki hâl karşılaştırılıyor…"]} />
              : <Dugme tur="altin" tikla={calistir} pasif={kelime < 60}>Karşılaştır</Dugme>}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: S.sm }}>
            <Olcu sayi={eskiYogun} ad="eski · hata/1000" renk={C.murekkepAlt} />
            <Olcu sayi={yeniYogun} ad="yeni · hata/1000" renk={yeniYogun < eskiYogun ? C.zumrut : C.lal} />
            <Olcu sayi={`${yeniYogun < eskiYogun ? "−" : "+"}${Math.abs(eskiYogun - yeniYogun)}`}
              ad="fark" renk={yeniYogun < eskiYogun ? C.zumrut : C.lal} />
          </div>
          <Haber tur={yeniYogun < eskiYogun ? "iyi" : "hata"}>
            {yeniYogun < eskiYogun
              ? `Aynı görevde hata yoğunluğun bin sözcükte ${eskiYogun}'den ${yeniYogun}'e düştü. Bu, ustalık puanından çok daha güvenilir bir ölçüdür: aynı zorlukta, aynı görevde, daha az hata.`
              : `Hata yoğunluğun düşmemiş. Bu mutlaka gerileme demek değil — daha karmaşık yapılara giriştiğinde hata sayısı geçici olarak artar. Aşağıdaki iki metni karşılaştır: yeni metin daha mı iddialı?`}
          </Haber>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: S.md }}>
            <div>
              <Etiket>Eski · {trTarih(secili.tarih)}</Etiket>
              <Levha ic={S.md} style={{ maxHeight: 340, overflowY: "auto" }}>
                <div style={{ fontFamily: T.kalem, fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-wrap", color: C.murekkepAlt }}>{secili.tamMetin}</div>
              </Levha>
            </div>
            <div>
              <Etiket renk={C.altin}>Yeni · bugün</Etiket>
              <Levha ic={S.md} style={{ maxHeight: 340, overflowY: "auto" }}>
                <TashihliMetin metin={metin} hatalar={rapor.hatalar} kompakt />
              </Levha>
            </div>
          </div>
          <Levha style={{ background: C.kagitAlt }}>
            <Etiket renk={C.altin}>Teşhis</Etiket>
            <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep }}>{rapor.ozet}</div>
          </Levha>
        </>
      )}
    </div>
  );
}

/* ── Maden: özgün metinden yapı çıkarma ── */
export function MadenModu({ ustalik, hatalar, derinlestir }) {
  const [kaynak, setKaynak] = useState("");
  const [sonuc, setSonuc] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const [hataM, setHataM] = useState(null);
  const [hepsi, setHepsi] = useState(true);
  const zayif = useMemo(() => zayifDugumler(ustalik, hatalar, 6, false), [ustalik, hatalar]);

  async function kaz() {
    if (kelimeSay(kaynak) < 40) { setHataM("En az 40 sözcüklük özgün bir metin yapıştır."); return; }
    setYuklu(true); setHataM(null);
    try {
      const hedefler = zayif.map((z) => `${z.d.tr} (${z.d.en})`).join("; ");
      const j = await sorJSON(`${ZEMIN}

Aşağıda öğrencinin okuduğu ÖZGÜN bir İngilizce metin var. Bu metin düzeltilecek değil, madenlenecek: içinden öğrencinin ZAYIF olduğu yapıların anadili konuşuru tarafından DOĞRU kullanıldığı cümleleri çıkar.

Öğrencinin zayıf olduğu yapılar: ${hedefler}

Metinde bu yapılardan hangileri geçiyorsa, o cümleleri seç (en fazla 6). Her biri için satır arası tercüme verisi üret:
- "en": cümle, hedef yapıyı taşıyan parça [[çift köşeli parantez]] içinde
- "tr": Türkçe karşılığı, karşılık gelen parça [[çift köşeli parantez]] içinde; İngilizcedeki parçanın Türkçede karşılığı yoksa Türkçede işaretleme
- "f": iki dil arasındaki yapısal fark, tek cümle
Cümleyi metinden birebir al, değiştirme.

METİN:
${kaynak}

YALNIZCA şu JSON'u döndür:
{"bulgular":[{"yapi":"Türkçe yapı adı","en":"...","tr":"...","f":"...","not":"bu kullanımın neden iyi bir örnek olduğu, tek cümle"}],
"ozet":"metnin dil düzeyi ve öğrencinin buradan ne alabileceği, iki cümle",
"kacirilan":["metinde geçmeyen ama öğrencinin ihtiyacı olan yapılar, en fazla 3"]}`, 2600);
      setSonuc(j);
    } catch { setHataM("Maden çıkarılamadı. Metni kısaltıp tekrar dene."); }
    setYuklu(false);
  }

  return (
    <div>
      <Haber tur="bilgi" basli="Maden">
        Buraya okuduğun özgün bir İngilizce metni yapıştır — bir UİT makalesi, bir kitap paragrafı, bir konuşma metni.
        Düzeltilmeyecek. İçinden senin zayıf olduğun yapıların doğru kullanıldığı cümleler çıkarılıp satır arası tercümeyle önüne konacak.
        Hata düzeltmek girdinin yarısıdır; diğer yarısı doğru kullanımı görmektir.
      </Haber>

      <Fasil ad="Bu turda aranacak yapılar" />
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: S.lg }}>
        {zayif.map((z) => <Nisan key={z.d.id} kucuk renk={C.altin} zemin={C.altinSis}>{z.d.tr}</Nisan>)}
      </div>

      <Alan deger={kaynak} degistir={setKaynak} satir={10} ipucu="Özgün İngilizce metni buraya yapıştır…" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: S.md }}>
        <span style={{ ...T.cap, color: C.murekkepSis }}>{kelimeSay(kaynak)} sözcük</span>
        {yuklu ? <Bekle asamalar={["Metin taranıyor…", "Zayıf yapıların aranıyor…", "Aralık hizalanıyor…"]} />
          : <Dugme tur="altin" tikla={kaz}><Pickaxe size={13} /> Kaz</Dugme>}
      </div>
      {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}

      {sonuc && (
        <div style={{ marginTop: S.lg }}>
          <Levha style={{ background: C.kagitAlt, marginBottom: S.md }}>
            <Etiket renk={C.altin}>Bulgular</Etiket>
            <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep }}>{sonuc.ozet}</div>
          </Levha>

          <Fasil ad={`${(sonuc.bulgular || []).length} damar bulundu`}
            sag={<Dugme tur="sessiz" kucuk tikla={() => setHepsi(!hepsi)}>{hepsi ? "kapat" : "hepsini aç"}</Dugme>} />
          <div style={{ display: "grid", gap: S.sm }}>
            {(sonuc.bulgular || []).map((b, i) => (
              <div key={i}>
                <div style={{ ...T.cap, fontSize: 11.5, color: C.altin, marginBottom: 4 }}>{b.yapi}</div>
                <Aralik en={b.en} tr={b.tr} fark={b.f} acikBasla={hepsi} />
                {b.not && <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 4, paddingLeft: S.sm }}>{b.not}</div>}
              </div>
            ))}
          </div>

          {(sonuc.kacirilan || []).length > 0 && (
            <div style={{ marginTop: S.lg }}>
              <Haber tur="altin" basli="Bu metinde bulunmayan">
                {sonuc.kacirilan.join(" · ")} — bu yapılar için başka bir kaynak metin ara.
              </Haber>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const YAZI_MODLARI = [
  { id: "serbest",    ad: "Serbest",    ikon: PenLine,     ac: "Canlı tashih. Yazarken üç saniyelik her duraklamada metnin sessizce taranır." },
  { id: "kalem",      ad: "Paper 1",    ikon: ScrollText,  ac: "Tam IB simülasyonu. Görev, süre, üç ölçüt üzerinden bantlama." },
  { id: "palimpsest", ad: "Palimpsest", ikon: History,     ac: "Eski bir görevi, eski metnini görmeden yeniden yaz. Kendi geçmiş hâline karşı ölçül." },
  { id: "maden",      ad: "Maden",      ikon: Pickaxe,     ac: "Okuduğun özgün metinden zayıf yapılarının doğru kullanımlarını çıkar." }
];

export function Yazihane(p) {
  const [mod, setMod] = useState("serbest");
  const aktif = YAZI_MODLARI.find((m) => m.id === mod);
  return (
    <div>
      <Baslik ust="Yazma" ad="Yazıhane" alt={aktif.ac} />
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: S.xl }}>
        {YAZI_MODLARI.map((m) => {
          const I = m.ikon;
          return <Dugme key={m.id} tur={mod === m.id ? "ikincil" : "sessiz"} kucuk tikla={() => setMod(m.id)}><I size={12} /> {m.ad}</Dugme>;
        })}
      </div>
      {mod === "serbest" && <SerbestModu hatalar={p.hatalar} hataEkle={p.hataEkle} metinEkle={p.metinEkle}
        oturumBitir={p.oturumBitir} taslak={p.taslak} taslakKaydet={p.taslakKaydet} />}
      {mod === "kalem" && <KalemModu hataEkle={p.hataEkle} metinEkle={p.metinEkle} metinler={p.metinler} oturumBitir={p.oturumBitir} />}
      {mod === "palimpsest" && <PalimpsestModu metinler={p.metinler} hataEkle={p.hataEkle} metinEkle={p.metinEkle} oturumBitir={p.oturumBitir} />}
      {mod === "maden" && <MadenModu ustalik={p.ustalik} hatalar={p.hatalar} derinlestir={p.derinlestir} />}
    </div>
  );
}

/* ══════════════════════ SESLİ ══════════════════════
   MUN'da konuşurken yaptığın hatalar şimdiye kadar
   görünmezdi. Tarayıcının kendi tanıma motoruyla
   konuşmanı yazıya döküp aynı tashihten geçiriyoruz. ══ */

export function Sesli({ hataEkle, metinEkle, oturumBitir, hatalar, ustalik }) {
  const [destek, setDestek] = useState(null);
  const [dinliyor, setDinliyor] = useState(false);
  const [metin, setMetin] = useState("");
  const [gecici, setGecici] = useState("");
  const [gorev, setGorev] = useState(null);
  const [rapor, setRapor] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const [sure, setSure] = useState(0);
  const [hataM, setHataM] = useState(null);
  const tanima = useRef(null);
  const sayacRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setDestek(!!SR);
    if (!SR) return;
    const t = new SR();
    t.lang = "en-US"; t.continuous = true; t.interimResults = true;
    t.onresult = (e) => {
      let kesin = "", ara = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const m = e.results[i][0].transcript;
        if (e.results[i].isFinal) kesin += m + " "; else ara += m;
      }
      if (kesin) setMetin((x) => x + kesin);
      setGecici(ara);
    };
    t.onerror = (e) => { setHataM(e.error === "not-allowed" ? "Mikrofon izni verilmedi." : "Tanıma hatası: " + e.error); setDinliyor(false); };
    t.onend = () => setDinliyor(false);
    tanima.current = t;
    return () => { try { t.stop(); } catch {} };
  }, []);

  useEffect(() => {
    if (dinliyor) sayacRef.current = setInterval(() => setSure((s) => s + 1), 1000);
    else if (sayacRef.current) clearInterval(sayacRef.current);
    return () => { if (sayacRef.current) clearInterval(sayacRef.current); };
  }, [dinliyor]);

  function basla() {
    setHataM(null); setRapor(null); setMetin(""); setGecici(""); setSure(0);
    try { tanima.current.start(); setDinliyor(true); } catch { setHataM("Başlatılamadı."); }
  }
  function dur() { try { tanima.current.stop(); } catch {} setDinliyor(false); }

  async function gorevUret() {
    setYuklu(true); setHataM(null);
    try {
      const j = await sorJSON(`${ZEMIN}

Öğrenci MUN delegesi ve İngilizce sözlü üretim çalışıyor. 60-90 saniyede sözlü olarak yanıtlayacağı bir görev üret.
Uluslararası ilişkiler, tarih veya siyaset konulu olsun.

YALNIZCA şu JSON'u döndür:
{"gorev":"İngilizce görev/soru metni","baglam":"Türkçe kısa durum tarifi","ipuclari":["konuşurken değinilecek 3 nokta, İngilizce"],"beklenenYapilar":["bu görevde doğal olarak kullanılması gereken 2-3 gramer yapısı, Türkçe adlarıyla"]}`, 900);
      setGorev(j);
    } catch { setHataM("Görev üretilemedi."); }
    setYuklu(false);
  }

  async function coz() {
    const tam = (metin + " " + gecici).trim();
    if (kelimeSay(tam) < 20) { setHataM("Çözümleme için en az 20 sözcük gerekiyor."); return; }
    setYuklu(true); setHataM(null);
    try {
      const j = await sorJSON(`${ZEMIN}

Aşağıdaki metin KONUŞMA çözümüdür — otomatik tanımayla yazıya dökülmüştür, noktalama güvenilmez.
Bu yüzden noktalama ve büyük harf hatalarını YOKSAY. Yalnızca dilbilgisi, sözcük seçimi ve kayıt hatalarına bak.
Konuşma dilinde doğal olan duraksama, tekrar ve kendini düzeltme hata değildir; bunları da yoksay.
"hataliParca" metinde birebir geçmeli. "aile" şunlardan biri: ${AILE_LISTE}
${gorev ? `Görev: ${gorev.gorev}` : ""}

ÇÖZÜM:
${tam}

YALNIZCA şu JSON'u döndür:
{"hatalar":[{"hataliParca":"...","duzeltme":"...","aile":"...","dugumAdi":"...","hataTuru":"yanlis-secim","l1Kaynakli":true,"l1Aciklama":"veya null","maliyet":3,"aciklama":"tek cümle"}],
"akicilik":{"puan":0,"not":"akıcılık, tekrar, duraksama üzerine iki cümle"},
"yazilidanFarki":"bu kişinin yazılı üretimiyle karşılaştırıldığında sözlü üretiminde öne çıkan fark, iki cümle",
"ozet":"iki cümlelik teşhis","sonrakiAdim":"tek somut eylem"}`, 2600);
      setRapor(j);
      (j.hatalar || []).forEach((h) => hataEkle({
        hataliMetin: h.hataliParca, dogruMetin: h.duzeltme, dugumId: null, dugumAdi: h.dugumAdi, aile: h.aile,
        hataTuru: h.hataTuru, l1Kaynakli: !!h.l1Kaynakli, l1Aciklama: h.l1Aciklama || null,
        maliyet: h.maliyet || 3, kaynak: "sesli", baglam: "Sözlü üretim", aciklama: h.aciklama
      }));
      metinEkle({ id: yeniId("s"), tarih: new Date().toISOString(), baglam: "Sözlü üretim",
        kelimeSayisi: kelimeSay(tam), hataSayisi: (j.hatalar || []).length, tur: "sesli", tamMetin: tam });
      oturumBitir({ tur: "sesli", saniye: Math.max(sure, 60), kelime: kelimeSay(tam), hata: (j.hatalar || []).length });
    } catch { setHataM("Çözümleme alınamadı."); }
    setYuklu(false);
  }

  const tam = (metin + " " + gecici).trim();
  const hiz = sure > 3 ? Math.round((kelimeSay(tam) / sure) * 60) : null;

  return (
    <div>
      <Baslik ust="Sözlü üretim" ad="Sesli"
        alt="Konuşurken yaptığın hatalar şimdiye kadar hiç kaydedilmiyordu. MUN'da asıl orada üretiyorsun. Tarayıcının tanıma motoru konuşmanı yazıya döküyor, sonra aynı tashihten geçiyor — noktalama yoksayılarak." />

      {destek === false && (
        <Haber tur="hata" basli="Tarayıcı desteklemiyor">
          Bu tarayıcı konuşma tanımayı desteklemiyor. Chrome veya Edge'de dene. Alternatif olarak aşağıya konuşmanın metnini elle yazıp çözümleyebilirsin.
        </Haber>
      )}

      {!gorev && (
        <div style={{ marginBottom: S.lg }}>
          {yuklu && !dinliyor ? <Bekle asamalar={["Görev hazırlanıyor…"]} />
            : <Dugme tur="ikincil" tikla={gorevUret}><ScrollText size={13} /> Bana bir konuşma görevi ver</Dugme>}
        </div>
      )}

      {gorev && (
        <Cetvel style={{ marginBottom: S.md }}>
          <Etiket renk={C.altin}>Görev · 60-90 saniye</Etiket>
          <div style={{ ...T.xs, color: C.murekkepAlt, marginBottom: S.sm }}>{gorev.baglam}</div>
          <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.8, color: C.murekkep, marginBottom: S.md }}>{gorev.gorev}</div>
          <div style={{ display: "grid", gap: 4 }}>
            {(gorev.ipuclari || []).map((x, i) => (
              <div key={i} style={{ ...T.xs, color: C.murekkepAlt, fontFamily: T.kalem }}>· {x}</div>
            ))}
          </div>
          {(gorev.beklenenYapilar || []).length > 0 && (
            <div style={{ marginTop: S.md, paddingTop: S.sm, borderTop: `1px dashed ${C.cizgi}`, display: "flex", gap: 5, flexWrap: "wrap" }}>
              {gorev.beklenenYapilar.map((y, i) => <Nisan key={i} kucuk renk={C.altin} zemin={C.altinSis}>{y}</Nisan>)}
            </div>
          )}
        </Cetvel>
      )}

      <Cetvel sikilik="dar" style={{ marginBottom: S.md }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.md, marginBottom: S.md }}>
          {destek && (dinliyor
            ? <Dugme tur="tehlike" tikla={dur}><Square size={12} /> Durdur</Dugme>
            : <Dugme tur="altin" tikla={basla}><Mic size={13} /> Konuşmaya başla</Dugme>)}
          {dinliyor && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.lal, ...T.s }}>
              <CircleDot size={12} style={{ animation: "nyanip 1.4s ease-in-out infinite" }} /> kaydediliyor
            </span>
          )}
          <span style={{ flex: 1 }} />
          <Nisan kucuk><Clock size={10} /> {Math.floor(sure / 60)}:{String(sure % 60).padStart(2, "0")}</Nisan>
          <Nisan kucuk>{kelimeSay(tam)} sözcük</Nisan>
          {hiz && <Nisan kucuk renk={hiz > 90 ? C.zumrut : hiz > 60 ? C.altin : C.murekkepAlt}>{hiz} sz/dk</Nisan>}
        </div>
        {rapor ? (
          <TashihliMetin metin={tam} hatalar={rapor.hatalar} />
        ) : (
          <Alan deger={metin} degistir={setMetin} satir={8} kalem
            ipucu={destek ? "Konuşmanın çözümü buraya düşecek. Elle de yazabilirsin." : "Konuşmanın metnini buraya yaz…"}
            style={{ border: "none", padding: 0, background: "transparent" }} />
        )}
        {gecici && <span style={{ fontFamily: T.kalem, fontSize: 16, color: C.murekkepSis }}>{gecici}</span>}
      </Cetvel>

      {!rapor && (yuklu && !dinliyor ? <Bekle asamalar={["Çözüm okunuyor…", "Konuşma dili filtreleniyor…", "Hatalar çıkarılıyor…"]} />
        : <Dugme tur="altin" tikla={coz} pasif={dinliyor || kelimeSay(tam) < 20}><Volume2 size={13} /> Çözümle</Dugme>)}
      {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}

      {rapor && (
        <div style={{ display: "grid", gap: S.md, marginTop: S.md }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: S.sm }}>
            <Olcu sayi={(rapor.hatalar || []).length} ad="hata" renk={C.lal} />
            <Olcu sayi={Math.round(((rapor.hatalar || []).length / Math.max(kelimeSay(tam), 1)) * 1000)} ad="hata / 1000" renk={C.altin} />
            <Olcu sayi={(rapor.akicilik || {}).puan ?? "—"} ad="akıcılık" renk={C.lacivert} alt="/ 10" />
          </div>
          {rapor.yazilidanFarki && <Haber tur="bilgi" basli="Yazılı üretiminden farkı">{rapor.yazilidanFarki}</Haber>}
          {(rapor.akicilik || {}).not && <Haber tur="altin" basli="Akıcılık">{rapor.akicilik.not}</Haber>}
          <Levha style={{ background: C.kagitAlt }}>
            <Etiket renk={C.altin}>Teşhis</Etiket>
            <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.md }}>{rapor.ozet}</div>
            {rapor.sonrakiAdim && (
              <div style={{ ...T.s, borderLeft: `2px solid ${C.altin}`, paddingLeft: S.sm }}>
                <strong>Sıradaki adım · </strong>{rapor.sonrakiAdim}
              </div>
            )}
          </Levha>
          <Dugme tikla={() => { setRapor(null); setMetin(""); setGecici(""); setSure(0); setGorev(null); }} tam>Yeni konuşma</Dugme>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ DEFTER ══════════════════════ */

export function Defter({ hatalar, guncelle, sil, git, ustalik }) {
  const [mod, setMod] = useState("liste");
  const [filtre, setFiltre] = useState({ aile: null, l1: false, musallat: false, cozulmus: false, kaynak: null });
  const [tamamlanan, setTamamlanan] = useState(0);
  const [acik, setAcik] = useState(false);
  const [secili, setSecili] = useState(null);

  const kuyruk = useMemo(() => bekleyenTekrarlar(hatalar), [hatalar]);
  const musallat = useMemo(() => musallatHatalar(hatalar), [hatalar]);
  const kaynaklar = useMemo(() => [...new Set((hatalar || []).map((h) => h.kaynak).filter(Boolean))], [hatalar]);

  const liste = useMemo(() => (hatalar || []).filter((h) => {
    if (filtre.cozulmus ? !h.cozuldu : h.cozuldu) return false;
    if (filtre.aile && h.aile !== filtre.aile) return false;
    if (filtre.kaynak && h.kaynak !== filtre.kaynak) return false;
    if (filtre.l1 && !h.l1Kaynakli) return false;
    if (filtre.musallat && (h.tekrarSayisi || 1) < 3) return false;
    return true;
  }).sort((a, b) => (b.maliyet || 2) * (b.tekrarSayisi || 1) - (a.maliyet || 2) * (a.tekrarSayisi || 1)), [hatalar, filtre]);

  function degerle(h, kalite) {
    const srs = srsGuncelle(h.srs || {}, kalite);
    guncelle(h.id, { srs, cozuldu: kalite >= 4 && (srs.tekrar || 0) >= 3, tekrarSayisi: kalite < 3 ? (h.tekrarSayisi || 1) + 1 : (h.tekrarSayisi || 1) });
    setAcik(false); setTamamlanan((x) => x + 1);
  }

  if (mod === "tekrar") {
    const kart = kuyruk[0];
    return (
      <div>
        <Baslik ust="Aralıklı tekrar" ad="Kendi cümlelerin" />
        <Dugme tur="sessiz" kucuk tikla={() => { setMod("liste"); setTamamlanan(0); setAcik(false); }} style={{ marginBottom: S.lg }}>
          <ChevronLeft size={13} /> Deftere dön
        </Dugme>
        {!kart ? (
          <Bos baslik={tamamlanan > 0 ? "Tur bitti" : "Kuyruk boş"}
            aciklama={tamamlanan > 0
              ? `${tamamlanan} kart gözden geçirildi. Yanlış bildiklerin yarın, doğru bildiklerin giderek uzayan aralıklarla geri gelecek.`
              : "Bugün için bekleyen tekrar kalmadı. Yazıhane'ye bir metin ver veya Talimhane'de çalış."}
            eylem={() => { setMod("liste"); setTamamlanan(0); }} eylemAd="Deftere dön" />
        ) : (
          <div>
            <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 6 }}>{tamamlanan + 1} / {tamamlanan + kuyruk.length}</div>
            <div style={{ marginBottom: S.md }}><Cubuk deger={(tamamlanan / (tamamlanan + kuyruk.length)) * 100} boy={3} /></div>
            <Cetvel sikilik="genis" style={{ minHeight: 180 }}>
              <Etiket renk={C.lal}>Senin yazdığın</Etiket>
              <div style={{ fontFamily: T.kalem, fontSize: 18, lineHeight: 1.85, color: C.murekkep }}>{kart.hataliMetin}</div>
              {!acik && <div style={{ marginTop: S.xl }}><Dugme tikla={() => setAcik(true)} tam>Düzeltmeyi göster</Dugme></div>}
              {acik && (
                <div style={{ marginTop: S.lg, paddingTop: S.lg, borderTop: `1px dashed ${C.cizgi}` }}>
                  <Etiket renk={C.zumrut}>Doğrusu</Etiket>
                  <div style={{ fontFamily: T.kalem, fontSize: 18, lineHeight: 1.85, color: C.zumrut }}>{kart.dogruMetin}</div>
                  {kart.aciklama && <div style={{ ...T.s, color: C.murekkepAlt, marginTop: S.md }}>{kart.aciklama}</div>}
                  {kart.l1Kaynakli && kart.l1Aciklama && <div style={{ ...T.s, color: C.lal, marginTop: S.sm }}>↳ {kart.l1Aciklama}</div>}
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: S.md }}>
                    {kart.dugumAdi && <Nisan kucuk>{kart.dugumAdi}</Nisan>}
                    {kart.aile && <Nisan kucuk>{aileKisa(kart.aile)}</Nisan>}
                    <Nisan kucuk>{kart.kaynak}</Nisan>
                    {(kart.tekrarSayisi || 1) >= 3 && <Nisan kucuk renk={C.lal} dolu>×{kart.tekrarSayisi}</Nisan>}
                  </div>
                </div>
              )}
            </Cetvel>
            {acik && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: S.sm, marginTop: S.md }}>
                <Dugme tur="tehlike" tikla={() => degerle(kart, 1)}>Hâlâ yapıyorum</Dugme>
                <Dugme tur="ikincil" tikla={() => degerle(kart, 3)}>Zorlandım</Dugme>
                <Dugme tur="altin" tikla={() => degerle(kart, 5)}>Artık net</Dugme>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Baslik ust="Kişisel külliyat" ad="Hata Defteri"
        alt="Buradaki her cümle senin. Tekrar kartlarının ön yüzü genel bir kural değil, senin kendi yazdığın hatalı cümle."
        sag={<div style={{ display: "flex", gap: S.sm }}>
          <Olcu sayi={kuyruk.length} ad="bugün" renk={kuyruk.length ? C.altin : C.murekkepSis} tikla={() => { setMod("tekrar"); setTamamlanan(0); }} vurgu={kuyruk.length > 0} />
          <Olcu sayi={musallat.length} ad="musallat" renk={musallat.length ? C.lal : C.murekkepSis} tikla={() => setFiltre({ ...filtre, musallat: !filtre.musallat })} />
        </div>} />

      {musallat.length > 0 && !filtre.musallat && (
        <div style={{ marginBottom: S.lg }}>
          <Haber tur="hata" basli="Musallat hata protokolü">
            {musallat.length} hata üç kezden fazla tekrarlandı ve hâlâ çözülmedi. Bunlar açıklamayla kırılmıyor —
            Sokrates'in <strong>Karşılaştır</strong> modunda kaynak Türkçe yapıyı görmen, sonra Talimhane'de <strong>Tuzak</strong> kurdurman gerekiyor.
          </Haber>
        </div>
      )}

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: S.md, alignItems: "center" }}>
        <Filter size={13} style={{ color: C.murekkepSis }} />
        <Dugme tur={filtre.l1 ? "ikincil" : "sessiz"} kucuk tikla={() => setFiltre({ ...filtre, l1: !filtre.l1 })}>Türkçe girişimi</Dugme>
        <Dugme tur={filtre.musallat ? "ikincil" : "sessiz"} kucuk tikla={() => setFiltre({ ...filtre, musallat: !filtre.musallat })}>Musallat</Dugme>
        <Dugme tur={filtre.cozulmus ? "ikincil" : "sessiz"} kucuk tikla={() => setFiltre({ ...filtre, cozulmus: !filtre.cozulmus })}>Çözülmüş</Dugme>
        <select value={filtre.aile || ""} onChange={(e) => setFiltre({ ...filtre, aile: e.target.value || null })}
          style={{ fontFamily: T.govde, fontSize: 14.5, padding: "4px 8px", border: `1px solid ${C.cizgi}`, borderRadius: 10, background: C.muhre, color: C.murekkep, outline: "none" }}>
          <option value="">Tüm aileler</option>
          {AILELER.map((a) => <option key={a.id} value={a.id}>{a.ad}</option>)}
        </select>
        <select value={filtre.kaynak || ""} onChange={(e) => setFiltre({ ...filtre, kaynak: e.target.value || null })}
          style={{ fontFamily: T.govde, fontSize: 14.5, padding: "4px 8px", border: `1px solid ${C.cizgi}`, borderRadius: 10, background: C.muhre, color: C.murekkep, outline: "none" }}>
          <option value="">Tüm kaynaklar</option>
          {kaynaklar.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {liste.length === 0 ? (
        <Bos baslik="Defter boş"
          aciklama="Yazıhane'ye bir metin ver, Sesli'de konuş veya Talimhane'de çalış. Yaptığın her hata buraya kendi cümlenle işlenir ve tekrar kartına dönüşür." />
      ) : (
        <div style={{ display: "grid", gap: 5 }}>
          <div style={{ ...T.cap, color: C.murekkepSis }}>{liste.length} kayıt</div>
          {liste.map((h) => (
            <Levha key={h.id} ic={S.md} renk={h.cozuldu ? C.zumrut : h.l1Kaynakli ? C.lal : C.cizgi}
              tikla={() => setSecili(secili === h.id ? null : h.id)}>
              <div style={{ fontFamily: T.kalem, fontSize: 15, marginBottom: S.sm, lineHeight: 1.6 }}>
                <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.hataliMetin}</span>
                <ArrowRight size={11} style={{ margin: "0 6px", verticalAlign: -1, color: C.murekkepSis }} />
                <span style={{ color: C.zumrut }}>{h.dogruMetin}</span>
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                {h.aile && <Nisan kucuk>{aileKisa(h.aile)}</Nisan>}
                {h.dugumAdi && <Nisan kucuk>{h.dugumAdi}</Nisan>}
                <Nisan kucuk renk={(h.maliyet || 2) >= 4 ? C.lal : C.murekkepAlt}>maliyet {h.maliyet || 2}</Nisan>
                {h.l1Kaynakli && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>L1</Nisan>}
                {(h.tekrarSayisi || 1) >= 3 && <Nisan kucuk renk={C.lal} dolu>×{h.tekrarSayisi}</Nisan>}
                <Nisan kucuk renk={C.murekkepSis}>{h.kaynak}</Nisan>
                <span style={{ flex: 1 }} />
                <span style={{ ...T.xs, fontSize: 13, color: C.murekkepSis }}>{trTarih(h.tarih)}</span>
                <Trash2 size={13} style={{ color: C.murekkepSis, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); sil(h.id); }} />
              </div>
              {secili === h.id && (
                <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}`, ...T.s, color: C.murekkepAlt }}>
                  {h.aciklama}
                  {h.l1Kaynakli && h.l1Aciklama && <div style={{ color: C.lal, marginTop: 5 }}>↳ {h.l1Aciklama}</div>}
                  {h.dugumId && (
                    <div style={{ marginTop: S.sm }}>
                      <Dugme tur="ikincil" kucuk tikla={(e) => git(h.dugumId)}>Düğüme git</Dugme>
                    </div>
                  )}
                </div>
              )}
            </Levha>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════ SOKRATES ══════════════════════ */

export const MODLAR = [
  { id: "anlat",       ad: "Anlat",       ac: "Düğümü sıfırdan, Baranca Protokolü'yle öğretir." },
  { id: "sorgula",     ad: "Sorgula",     ac: "Cevap vermez. Soru sorar, kuralı sen bulursun." },
  { id: "karsilastir", ad: "Karşılaştır", ac: "Türkçe ↔ İngilizce karşıtsal analiz. Girişimin kaynağını açar." },
  { id: "sina",        ad: "Sına",        ac: "Konuştuklarınızın üzerine anlık mini sınav." }
];
export const MOD_TALIMAT = {
  anlat: `Mod: ANLAT. Düğümü sıfırdan öğret. ${BARANCA}`,
  sorgula: `Mod: SORGULA. Sokratik yöntem. Kuralı ASLA doğrudan söyleme. Her yanıtın bir veya iki sorudan oluşsun. Yanlış cevap verirse doğruyu söyleme, daha dar bir soru sor.`,
  karsilastir: `Mod: KARŞILAŞTIR. Karşıtsal analiz yap: önce Türkçenin bu işi nasıl yaptığını göster, sonra İngilizcenin neden başka bir yol seçtiğini açıkla, sonra girişimin tam olarak nerede doğduğunu işaretle. En az üç Türkçe-İngilizce cümle çifti ver.`,
  sina: `Mod: SINA. Konuşmanın üzerine 4 soruluk kısa sınav. Soruları tek tek sor, cevabı bekle, doğrudan değerlendir. Övgü yok.`
};

export function Sokrates({ dugumId, setDugumId, gecmisler, gecmisKaydet, hatalar }) {
  const [mod, setMod] = useState("anlat");
  const [mesajlar, setMesajlar] = useState([]);
  const [giris, setGiris] = useState("");
  const [yuklu, setYuklu] = useState(false);
  const [ara, setAra] = useState("");
  const kaydir = useRef(null);
  const d = dugumId ? dugum(dugumId) : null;

  useEffect(() => { setMesajlar((gecmisler || {})[`${dugumId}:${mod}`] || []); }, [dugumId, mod, gecmisler]);
  useEffect(() => { if (kaydir.current) kaydir.current.scrollTop = kaydir.current.scrollHeight; }, [mesajlar, yuklu]);

  async function gonder(metin) {
    if (!d || !metin.trim()) return;
    const yeni = [...mesajlar, { rol: "sen", m: metin }];
    setMesajlar(yeni); setGiris(""); setYuklu(true);
    try {
      const kendi = (hatalar || []).filter((h) => h.dugumId === d.id).slice(-3).map((h) => `"${h.hataliMetin}" → "${h.dogruMetin}"`).join(" | ");
      const c = await sor(`${ZEMIN}

${MOD_TALIMAT[mod]}

Çalışılan düğüm: ${d.tr} (${d.en}) — ${aileAd(d.a)}
Kural: ${d.k || "-"} | Türkçe tuzağı: ${d.t || "-"}
${kendi ? `Öğrencinin bu düğümdeki kendi hataları: ${kendi}` : ""}

Konuşma:
${yeni.map((x) => `${x.rol === "sen" ? "Öğrenci" : "Sokrates"}: ${x.m}`).join("\n\n")}

Sokrates olarak yanıt ver. En fazla 200 sözcük. Markdown başlığı kullanma; düz paragraf ve gerekiyorsa numaralı liste yaz.`, 1200);
      const son = [...yeni, { rol: "sokrates", m: c.trim() }];
      setMesajlar(son); gecmisKaydet(`${dugumId}:${mod}`, son);
    } catch { setMesajlar([...yeni, { rol: "sokrates", m: "Yanıt alınamadı. Tekrar dene." }]); }
    setYuklu(false);
  }

  if (!d) {
    const liste = DUGUMLER.filter((x) => !ara.trim() || (x.tr + x.en).toLocaleLowerCase("tr").includes(ara.toLocaleLowerCase("tr"))).slice(0, 40);
    return (
      <div>
        <Baslik ust="Öğretmen" ad="Sokrates" alt="Dört mod: anlatır, sorgular, karşılaştırır, sınar. Hangi düğümü konuşacağız?" />
        <div style={{ display: "flex", alignItems: "center", gap: S.sm, border: `1px solid ${C.cizgi}`, borderRadius: 14,
          padding: `${S.sm}px ${S.md}px`, background: C.muhre, marginBottom: S.md }}>
          <Search size={14} style={{ color: C.murekkepSis }} />
          <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Düğüm ara…"
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: T.govde, fontSize: 16, color: C.murekkep }} />
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          {liste.map((x) => (
            <Levha key={x.id} tikla={() => setDugumId(x.id)} ic={S.md}>
              <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
                <span style={{ flex: 1, fontFamily: T.govde, fontSize: 16, color: C.murekkep }}>{x.tr}</span>
                {x.l1 === 3 && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>L1</Nisan>}
                <span style={{ ...T.cap, fontSize: 11.5, color: C.murekkepSis }}>{aileKisa(x.a)}</span>
              </div>
            </Levha>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Baslik ust={aileAd(d.a)} ad={d.tr} alt={(MODLAR.find((m) => m.id === mod) || {}).ac} />
      <div style={{ display: "flex", gap: 4, marginBottom: S.md, flexWrap: "wrap", alignItems: "center" }}>
        <Dugme tur="sessiz" kucuk tikla={() => setDugumId(null)}><ChevronLeft size={12} /> Değiştir</Dugme>
        <span style={{ width: 1, height: 16, background: C.cizgi, margin: "0 4px" }} />
        {MODLAR.map((m) => <Dugme key={m.id} tur={mod === m.id ? "ikincil" : "sessiz"} kucuk tikla={() => setMod(m.id)}>{m.ad}</Dugme>)}
      </div>

      <Cetvel sikilik="dar" style={{ marginBottom: S.md }}>
        <div ref={kaydir} style={{ minHeight: 260, maxHeight: 470, overflowY: "auto" }}>
          {mesajlar.length === 0 && !yuklu && (
            <div style={{ textAlign: "center", padding: S.xl }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: S.md }}><Gul boy={22} opak={0.45} /></div>
              <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>Bir soru sor, ya da:</div>
              <Dugme tur="altin" kucuk tikla={() => gonder(mod === "sina" ? "Beni sına." : mod === "karsilastir" ? `"${d.tr}" konusunda Türkçe ile İngilizceyi karşılaştır.` : `"${d.tr}" konusunu anlat.`)}>
                <MessageSquare size={12} /> {mod === "sina" ? "Sınava başla" : mod === "karsilastir" ? "Karşılaştır" : "Sıfırdan anlat"}
              </Dugme>
            </div>
          )}
          {mesajlar.map((m, i) => (
            <div key={i} style={{ marginBottom: S.lg }}>
              <div style={{ ...T.cap, fontSize: 11.5, color: m.rol === "sen" ? C.murekkepSis : C.lacivert, marginBottom: 5 }}>
                {m.rol === "sen" ? "Sen" : "Sokrates"}
              </div>
              <div style={{ fontFamily: T.govde, ...T.m, color: C.murekkep, whiteSpace: "pre-wrap",
                borderLeft: m.rol === "sokrates" ? `2px solid ${C.lacivert}` : "none",
                paddingLeft: m.rol === "sokrates" ? S.md : 0 }}>{m.m}</div>
            </div>
          ))}
          {yuklu && <Bekle asamalar={["Düşünülüyor…"]} />}
        </div>
      </Cetvel>

      <div style={{ display: "flex", gap: S.sm }}>
        <textarea value={giris} onChange={(e) => setGiris(e.target.value)} rows={2}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) gonder(giris); }}
          placeholder="Sorunu yaz… (⌘+Enter gönderir)"
          style={{ flex: 1, fontFamily: T.govde, fontSize: 16, padding: S.sm, border: `1px solid ${C.cizgi}`,
            borderRadius: 14, background: C.muhre, color: C.murekkep, outline: "none", resize: "none" }} />
        <Dugme tikla={() => gonder(giris)} pasif={yuklu || !giris.trim()}><Send size={14} /></Dugme>
      </div>
    </div>
  );
}

/* ══════════════════════ DİVAN ══════════════════════ */

export function Divan({ profil, ustalik, hatalar, metinler, oturumlar, esdizim, git, gitDugum, calis, sonDisa, tasindi, dag }) {
  const radar = useMemo(() => AILELER.map((a) => ({ aile: a.kisa, puan: aileOrtalamasi(ustalik, a.id) })), [ustalik]);
  const orgu = useMemo(() => hataOrguleri(hatalar, 5), [hatalar]);
  const kuyruk = bekleyenTekrarlar(hatalar).length;
  const musallat = musallatHatalar(hatalar).length;
  const yogun = hataYogunlugu(metinler);
  const oncekiYogun = useMemo(() => {
    const m = (metinler || []).filter((x) => x.kelimeSayisi);
    return m.length > 6 ? hataYogunlugu(m.slice(0, -5), 5) : null;
  }, [metinler]);
  const l1 = l1Payi(hatalar);
  const seri = useMemo(() => seriHesapla(oturumlar), [oturumlar]);
  const ocak = useMemo(() => ocakKur(ustalik, hatalar, esdizim, dag), [ustalik, hatalar, esdizim, dag]);
  const genel = genelUstalik(ustalik);
  const buHafta = useMemo(() => {
    const s = gunEkle(bugun(), -6);
    return Math.round((oturumlar || []).filter((o) => (o.tarih || "").slice(0, 10) >= s).reduce((a, o) => a + (o.saniye || 0), 0) / 60);
  }, [oturumlar]);
  const bugunCalisti = (oturumlar || []).some((o) => (o.tarih || "").slice(0, 10) === bugun());

  const saat = new Date().getHours();
  const selam = saat < 6 ? "Gecenin bu saatinde" : saat < 12 ? "Günaydın" : saat < 18 ? "İyi günler" : "İyi akşamlar";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: S.lg, marginBottom: S.xl, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <h1 style={{ fontFamily: T.hat, ...T.d0, margin: 0 }}>Gramer</h1>
          <div style={{ ...T.m, color: C.murekkepAlt, marginTop: 8, maxWidth: 600 }}>Bugünün planı {ocak.toplamDk} dakika. Adımları sırayla yürü; her biri bir öncekinin üstüne kurulur.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {seri > 0 && <span className="nv-oturum-cip"><Flame size={16} style={{ color: C.lal }} /> {seri} günlük seri</span>}
            {bugunCalisti && <span className="nv-oturum-cip dogru"><Check size={16} /> bugün çalıştın</span>}
          </div>
        </div>
        <Halka deger={genel} boy={112} kalinlik={12} renk={C.altin}
          ic={<div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.hat, fontSize: 32, fontWeight: 800, ...T.rakam, color: C.murekkep, lineHeight: 1 }}>{genel}</div>
            <div style={{ fontSize: 12.5, color: C.murekkepSis, marginTop: 3 }}>gramer puanı</div>
          </div>} />
      </div>

      <div className="nv-adimlar" style={{ marginBottom: S.xl }}>
        {ocak.adimlar.map((a, i) => (
          <button key={i} onClick={() => a.dugumId ? calis(a.dugumId) : git(a.hedef)} className="nv-adim"
            style={{ animationDelay: `${120 + i * 90}ms`, "--r": [C.altin, C.lacivert, C.erguvan, C.zumrut, C.mor][i % 5] }}>
            <span className="nv-adim-no">{i + 1}</span>
            <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <span style={{ display: "block", fontFamily: T.hat, fontSize: 19, fontWeight: 760, lineHeight: 1.25, color: C.murekkep }}>{a.ad}</span>
              <span style={{ display: "block", fontSize: 14.5, color: C.murekkepAlt, marginTop: 4 }}>{a.dk} dakika</span>
            </span>
            <span className="nv-adim-ok"><Play size={16} fill="currentColor" /></span>
          </button>
        ))}
      </div>

      {/* Ölçüler */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: S.sm, marginBottom: S.lg }}>
        <Olcu sayi={yogun == null ? "—" : yogun} ad="hata / 1000 sözcük"
          renk={yogun == null ? C.murekkepSis : yogun > 25 ? C.lal : yogun > 12 ? C.altin : C.zumrut}
          alt={oncekiYogun != null && yogun != null ? `önce ${oncekiYogun}` : null} />
        <Olcu sayi={l1 == null ? "—" : `%${l1}`} ad="Türkçe girişimi payı" renk={l1 == null ? C.murekkepSis : C.lal} />
        <Olcu sayi={kuyruk} ad="bugün tekrar" renk={kuyruk ? C.altin : C.murekkepSis} tikla={() => git("defter")} vurgu={kuyruk > 0} />
        <Olcu sayi={buHafta} ad="bu hafta · dakika" renk={C.lacivert} />
      </div>

      {tasindi && (
        <div style={{ marginBottom: S.lg }}>
          <Haber tur="iyi" basli="Eski veri kurtarıldı">{tasindi}</Haber>
        </div>
      )}

      {(hatalar || []).length >= 10 && (!sonDisa || gunFarki(sonDisa, bugun()) >= 14) && (
        <div style={{ marginBottom: S.lg, cursor: "pointer" }} onClick={() => git("sandik")}>
          <Haber tur="altin" basli="Yedeğin yok">
            {sonDisa ? `Son yedeğin ${gunFarki(sonDisa, bugun())} gün önce alındı.` : "Verini hiç dışa aktarmadın."}{" "}
            {(hatalar || []).length} hata kaydın ve {Object.keys(ustalik).length} düğüm ilerlemen var; hepsi tarayıcı belleğinde duruyor
            ve tarayıcı temizlenirse gider. Sandık'a git, tek tıkla dosya olarak indir.
          </Haber>
        </div>
      )}

      {musallat > 0 && (
        <div style={{ marginBottom: S.lg, cursor: "pointer" }} onClick={() => git("defter")}>
          <Haber tur="hata" basli="Musallat">
            {musallat} hata üç kezden fazla tekrarlandı ve hâlâ çözülmedi. Açıklamayla kırılmıyorlar; kaynak Türkçe yapıyı görmen gerekiyor.
          </Haber>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: S.md }}>
        <Levha>
          <Etiket>Ustalık haritası</Etiket>
          <div style={{ height: 250, margin: `0 -${S.md}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="74%">
                <PolarGrid stroke={C.cizgi} />
                <PolarAngleAxis dataKey="aile" tick={{ fill: C.murekkepAlt, fontSize: 11.5, fontFamily: T.govde }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="puan" stroke={C.altin} fill={C.altin} fillOpacity={0.2} strokeWidth={1.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Levha>

        <div>
          <Etiket>En pahalı hataların · maliyet × sıklık</Etiket>
          {orgu.length === 0 ? (
            <Levha style={{ borderStyle: "dashed" }}>
              <div style={{ ...T.s, color: C.murekkepAlt }}>
                Henüz kayıtlı hata yok. Yazıhane'ye yazdığın bir metin ver; müfredatın oradan şekillenecek.
              </div>
            </Levha>
          ) : (
            <div style={{ display: "grid", gap: 4 }}>
              {orgu.map((g, i) => (
                <Levha key={i} ic={S.md} renk={C.lal} tikla={g.dugumId ? () => gitDugum(g.dugumId) : undefined}>
                  <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
                    <span style={{ fontFamily: T.hat, fontSize: 18, color: C.lal, width: 18, ...T.rakam }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.govde, fontSize: 15.5, color: C.murekkep }}>
                        {g.dugumId ? (dugum(g.dugumId) || {}).tr : g.dugumAdi || aileAd(g.aile)}
                      </div>
                      <div style={{ fontFamily: T.kalem, fontSize: 12.5, color: C.murekkepSis, marginTop: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.ornek.hataliMetin}</div>
                    </div>
                    <Nisan kucuk>×{g.sayi}</Nisan>
                    {g.l1 > 0 && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>L1</Nisan>}
                  </div>
                </Levha>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ SEYİR ══════════════════════ */

export function Seyir({ ustalik, hatalar, metinler, oturumlar }) {
  const tik = { fill: C.murekkepAlt, fontSize: 12.5, fontFamily: T.govde };
  const kutu = { background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 10, fontFamily: T.govde, fontSize: 14.5 };

  const yogunSeri = useMemo(() => (metinler || []).filter((m) => m.kelimeSayisi).slice(-14)
    .map((m, i) => ({ ad: `${i + 1}`, deger: Math.round((m.hataSayisi / m.kelimeSayisi) * 1000), tur: m.tur })), [metinler]);

  const kanalSeri = useMemo(() => {
    const g = {};
    (metinler || []).filter((m) => m.kelimeSayisi).forEach((m) => {
      const k = m.tur === "sesli" ? "sözlü" : "yazılı";
      g[k] = g[k] || { k: 0, h: 0 };
      g[k].k += m.kelimeSayisi; g[k].h += m.hataSayisi || 0;
    });
    return Object.entries(g).map(([ad, v]) => ({ ad, deger: Math.round((v.h / v.k) * 1000) }));
  }, [metinler]);

  const l1Seri = useMemo(() => {
    const ay = {};
    (hatalar || []).forEach((h) => {
      const a = (h.tarih || "").slice(0, 7); if (!a) return;
      ay[a] = ay[a] || { t: 0, l1: 0 }; ay[a].t += 1; if (h.l1Kaynakli) ay[a].l1 += 1;
    });
    return Object.entries(ay).sort().map(([a, v]) => ({ ad: `${AYLAR[parseInt(a.slice(5)) - 1]}`, pay: Math.round((v.l1 / v.t) * 100) }));
  }, [hatalar]);

  const bantSeri = useMemo(() => (metinler || []).filter((m) => m.bant != null).slice(-10).map((m, i) => ({ ad: `${i + 1}`, bant: m.bant })), [metinler]);
  const aileSeri = useMemo(() => AILELER.map((a) => ({ aile: a.kisa, puan: aileOrtalamasi(ustalik, a.id) })).sort((a, b) => a.puan - b.puan), [ustalik]);
  const kaynakSeri = useMemo(() => {
    const g = {};
    (hatalar || []).forEach((h) => { g[h.kaynak || "?"] = (g[h.kaynak || "?"] || 0) + 1; });
    return Object.entries(g).map(([ad, n]) => ({ ad, n })).sort((a, b) => b.n - a.n);
  }, [hatalar]);

  const isi = useMemo(() => {
    const m = {};
    (oturumlar || []).forEach((o) => { const g = (o.tarih || "").slice(0, 10); m[g] = (m[g] || 0) + (o.saniye || 0); });
    return Array.from({ length: 70 }, (_, i) => { const g = gunEkle(bugun(), -(69 - i)); return { g, dk: Math.round((m[g] || 0) / 60) }; });
  }, [oturumlar]);

  const cozulen = (hatalar || []).filter((h) => h.cozuldu).length;
  const acik = (hatalar || []).filter((h) => !h.cozuldu).length;

  return (
    <div>
      <Baslik ust="Ölçüm" ad="Seyir"
        alt="Ustalık puanları motivasyon içindir. Gerçek ilerleme aşağıdaki iki eğridedir: hata yoğunluğunun ve Türkçe girişimi payının düşmesi." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: S.sm, marginBottom: S.lg }}>
        <Olcu sayi={hataYogunlugu(metinler) ?? "—"} ad="hata / 1000" renk={C.lal} />
        <Olcu sayi={l1Payi(hatalar) != null ? `%${l1Payi(hatalar)}` : "—"} ad="L1 payı" renk={C.lacivert} />
        <Olcu sayi={cozulen} ad="çözülmüş hata" renk={C.zumrut} />
        <Olcu sayi={acik} ad="açık hata" renk={C.altin} />
      </div>

      <div style={{ display: "grid", gap: S.md }}>
        <Levha>
          <Etiket>Hata yoğunluğu · bin sözcükte hata</Etiket>
          <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>
            Zaman içinde düşmesi gereken tek sayı. Ustalık puanları değil, bu eğri gerçek ilerlemedir.
          </div>
          {yogunSeri.length < 2 ? (
            <div style={{ ...T.s, color: C.murekkepSis, padding: S.lg, textAlign: "center" }}>
              En az iki metin gerekiyor. Yazıhane veya Sesli'de üretim yap.
            </div>
          ) : (
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yogunSeri}>
                  <defs>
                    <linearGradient id="gy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.lal} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={C.lal} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={C.cizgi} strokeDasharray="2 5" vertical={false} />
                  <XAxis dataKey="ad" tick={tik} axisLine={{ stroke: C.cizgi }} tickLine={false} />
                  <YAxis tick={tik} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={kutu} />
                  <Area type="monotone" dataKey="deger" stroke={C.lal} strokeWidth={1.8} fill="url(#gy)" dot={{ r: 2.5, fill: C.lal }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Levha>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: S.md }}>
          <Levha>
            <Etiket>Türkçe girişimi payı · %</Etiket>
            <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>
              Bu oranın düşmesi, dilin artık Türkçe üzerinden değil kendi mantığıyla üretildiği anlamına gelir.
            </div>
            {l1Seri.length < 2 ? (
              <div style={{ ...T.s, color: C.murekkepSis, padding: S.lg, textAlign: "center" }}>En az iki aylık veri gerekiyor.</div>
            ) : (
              <div style={{ height: 175 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={l1Seri}>
                    <CartesianGrid stroke={C.cizgi} strokeDasharray="2 5" vertical={false} />
                    <XAxis dataKey="ad" tick={tik} axisLine={{ stroke: C.cizgi }} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={tik} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={kutu} />
                    <Line type="monotone" dataKey="pay" stroke={C.lacivert} strokeWidth={2} dot={{ r: 3, fill: C.lacivert }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Levha>

          <Levha>
            <Etiket>Yazılı ile sözlü karşılaştırması</Etiket>
            <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>
              Konuşurken düzeltme fırsatın yok. İki kanal arasındaki fark, otomatikleşmiş bilginin gerçek payını gösterir.
            </div>
            {kanalSeri.length < 2 ? (
              <div style={{ ...T.s, color: C.murekkepSis, padding: S.lg, textAlign: "center" }}>
                Sesli sekmesinde bir konuşma çözümle; karşılaştırma burada belirir.
              </div>
            ) : (
              <div style={{ height: 175 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kanalSeri}>
                    <CartesianGrid stroke={C.cizgi} strokeDasharray="2 5" vertical={false} />
                    <XAxis dataKey="ad" tick={tik} axisLine={{ stroke: C.cizgi }} tickLine={false} />
                    <YAxis tick={tik} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={kutu} />
                    <Bar dataKey="deger" fill={C.altin} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Levha>
        </div>

        {bantSeri.length > 1 && (
          <Levha>
            <Etiket>IB bant ortalaması</Etiket>
            <div style={{ height: 175 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bantSeri}>
                  <CartesianGrid stroke={C.cizgi} strokeDasharray="2 5" vertical={false} />
                  <XAxis dataKey="ad" tick={tik} axisLine={{ stroke: C.cizgi }} tickLine={false} />
                  <YAxis domain={[0, 12]} tick={tik} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={kutu} />
                  <Line type="monotone" dataKey="bant" stroke={C.altin} strokeWidth={2} dot={{ r: 3, fill: C.altin }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Levha>
        )}

        <Levha>
          <Etiket>Aileye göre ustalık · en zayıftan</Etiket>
          <div style={{ height: 330 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aileSeri} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke={C.cizgi} strokeDasharray="2 5" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={tik} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="aile" tick={tik} axisLine={false} tickLine={false} width={62} />
                <Tooltip contentStyle={kutu} />
                <Bar dataKey="puan" fill={C.altin} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Levha>

        {kaynakSeri.length > 0 && (
          <Levha>
            <Etiket>Hataların nereden çıktığı</Etiket>
            <div style={{ display: "grid", gap: 6 }}>
              {kaynakSeri.map((k) => (
                <div key={k.ad} style={{ display: "flex", alignItems: "center", gap: S.md }}>
                  <span style={{ ...T.s, width: 88, color: C.murekkep }}>{k.ad}</span>
                  <div style={{ flex: 1 }}><Cubuk deger={(k.n / kaynakSeri[0].n) * 100} boy={7} /></div>
                  <span style={{ ...T.xs, color: C.murekkepSis, width: 26, textAlign: "right", ...T.rakam }}>{k.n}</span>
                </div>
              ))}
            </div>
          </Levha>
        )}

        <Levha>
          <Etiket>Son on hafta</Etiket>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 3 }}>
            {isi.map((x, i) => (
              <div key={i} title={`${trTarih(x.g)} · ${x.dk} dk`}
                style={{ aspectRatio: "1", borderRadius: 10, border: `1px solid ${C.cizgi}`,
                  background: x.dk === 0 ? C.kagit : x.dk < 12 ? C.altinSis : x.dk < 30 ? C.altinAcik : C.altin }} />
            ))}
          </div>
        </Levha>
      </div>
    </div>
  );
}

/* ─── TANI SINAVI ──────────────────────────────────────────────── */

export const TANI = [
  { d: "ad.artikel-the", s: `___ government must protect its citizens.`, o: ["The", "A", "—", "Its"], c: 0 },
  { d: "ad.artikel-sifir", s: `___ wars are rarely caused by a single factor.`, o: ["The", "—", "A", "Some of the"], c: 1 },
  { d: "zaman.pp-vs-past", s: `The Cold War ___ in 1991.`, o: ["has ended", "ended", "had ended", "was ending"], c: 1 },
  { d: "zaman.present-perfect-cont", s: `Turkey ___ a NATO member since 1952.`, o: ["is", "was", "has been", "is being"], c: 2 },
  { d: "zaman.durum-fiilleri", s: `I ___ exactly what the author means.`, o: ["am understanding", "understand", "am understand", "understands"], c: 1 },
  { d: "zaman.present-simple", s: `The state ___ its own interests above all.`, o: ["protect", "protects", "is protecting", "protecting"], c: 1 },
  { d: "edat.fiil-bagimli", s: `The outcome depends ___ several variables.`, o: ["to", "of", "on", "from"], c: 2 },
  { d: "edat.edat-yok", s: `The committee will discuss ___ the proposal tomorrow.`, o: ["about", "on", "—", "over"], c: 2 },
  { d: "edat.zaman", s: `The vote will be held ___ Monday.`, o: ["in", "at", "on", "—"], c: 2 },
  { d: "yc.ilgi-tanimlayan", s: `The candidate ___ won the election resigned.`, o: ["which", "who", "whom", "what"], c: 1 },
  { d: "yc.zaman-uyumu", s: `He said that he ___ ready to negotiate.`, o: ["is", "was", "will be", "has been"], c: 1 },
  { d: "yc.gomulu-soru", s: `It is unclear ___.`, o: ["why did the policy fail", "why the policy failed", "why failed the policy", "the policy why failed"], c: 1 },
  { d: "kosul.tip3", s: `If the alliance ___ earlier, the war would have been shorter.`, o: ["intervened", "had intervened", "would intervene", "has intervened"], c: 1 },
  { d: "kosul.wish", s: `I wish I ___ more time to revise the draft.`, o: ["have", "had", "will have", "would have"], c: 1 },
  { d: "iskelet.ozne-zorunlulugu", s: `___ is difficult to predict the outcome.`, o: ["—", "There", "It", "That"], c: 2 },
  { d: "iskelet.there-is", s: `___ several reasons for this outcome.`, o: ["It is", "There is", "There are", "They are"], c: 2 },
  { d: "iskelet.ozne-yuklem", s: `The impact of these policies ___ severe.`, o: ["are", "is", "were", "have been"], c: 1 },
  { d: "mek.comma-splice", s: `Hangisi doğru noktalanmış?`, o: [`Realism explains conflict, it ignores cooperation.`, `Realism explains conflict, but it ignores cooperation.`, `Realism explains conflict, however it ignores cooperation.`, `Realism explains conflict it ignores cooperation.`], c: 1 },
  { d: "mek.kesme", s: `The state defended ___ interests.`, o: ["it's", "its", "its'", "it is"], c: 1 },
  { d: "nitel.ing-ed-sifat", s: `I was ___ by the length of the debate.`, o: ["boring", "bored", "bore", "to bore"], c: 1 },
  { d: "nitel.zarf-bicim", s: `He explained the theory very ___.`, o: ["clear", "clearly", "clearer", "clarity"], c: 1 },
  { d: "nitel.karsilastirma", s: `This model is more persuasive ___ the classical one.`, o: ["from", "than", "then", "of"], c: 1 },
  { d: "ad.sayilabilir", s: `The report contains a great deal of ___.`, o: ["informations", "information", "an information", "informations of"], c: 1 },
  { d: "fiil.gerund-mastar", s: `I suggest ___ the defence budget.`, o: ["to increase", "increasing", "increase", "to increasing"], c: 1 },
  { d: "fiil.edatli-gerund", s: `I look forward to ___ from you.`, o: ["hear", "hearing", "be heard", "have heard"], c: 1 },
  { d: "kip.gecmis-kip", s: `The alliance ___ earlier; the delay was fatal.`, o: ["should act", "should have acted", "should have act", "must act"], c: 1 },
  { d: "kip.olumsuz-zorunluluk", s: `"Katılmak zorunda değilsin." karşılığı hangisi?`, o: ["You mustn't attend.", "You don't have to attend.", "You can't attend.", "You shouldn't attend."], c: 1 },
  { d: "cati.kisisiz-edilgen", s: `It ___ that institutions mitigate anarchy.`, o: ["is widely argued", "widely argues", "is widely arguing", "has widely argued"], c: 0 },
  { d: "cati.ettirgen", s: `The ministry ___ overnight.`, o: ["had translated the report", "had the report translated", "made translate the report", "has the report translate"], c: 1 },
  { d: "soylem.although-despite", s: `___ the failure of the talks, the ceasefire held.`, o: ["Although", "Despite", "However", "Even though"], c: 1 },
  { d: "soylem.kosutluk", s: `Hangisi koşut yapıda?`, o: [`The policy aims to reduce inflation, stabilising the currency and growth.`, `The policy aims to reduce inflation, stabilise the currency and restore confidence.`, `The policy aims reducing inflation, to stabilise the currency and growth.`, `The policy aims at reduce inflation and stabilising currency.`], c: 1 },
  { d: "kayit.oznellik", s: `Akademik denemede hangisi daha uygun?`, o: [`I think institutions constrain states.`, `It could be argued that institutions constrain states.`, `Everybody knows institutions constrain states.`, `In my opinion institutions constrain states, I believe.`], c: 1 },
  { d: "vurgu.devrik", s: `Never before ___ such a crisis.`, o: ["the region faced", "had the region faced", "the region had faced", "did the region faced"], c: 1 },
  { d: "kip.zorunluluk", s: `Akademik analizde hangisi daha ölçülü?`, o: [`The analysis must account for domestic factors.`, `The analysis should account for domestic factors.`, `The analysis has to account for domestic factors.`, `The analysis will account for domestic factors.`], c: 1 }
];



/* ══════════════════════════════════════════════════════════════════════
   O N A L T I   Ç A L I Ş M A   Y O L U
   Beş öbek: tanışma, üretim, sınav, oyun, derinlik.
   Her yolun kendi mini devinimi ve "neden" cümlesi var. ════════════════ */

export const YOL_OBEK = [
  { id: "tan", ad: "Tanışma", renk: C.lacivert, ac: "Kelimeyi ilk kez karşıla" },
  { id: "ure", ad: "Üretim",  renk: C.zumrut,   ac: "Kendin yaz, kendin kur" },
  { id: "snv", ad: "Sınav",   renk: C.lal,      ac: "IB'nin sorduğu biçimler" },
  { id: "oyn", ad: "Oyun",    renk: C.altin,    ac: "Baskı altında, hızlı" },
  { id: "der", ad: "Derinlik",renk: "#6A3BD6",  ac: "Kelimeyi kendine bağla" }
];

/* Mini devinim — her yol kartının üstünde çalışan küçük görsel */
export function YolDevinim({ tip, renk }) {
  const s = { position: "absolute", inset: 0, overflow: "hidden", borderRadius: 14, pointerEvents: "none" };
  const g = { position: "absolute", background: renk, borderRadius: 10 };
  const P = {
    kart:   <><i style={{ ...g, width: 17, height: 23, left: 12, top: 9, opacity: .32, animation: "nvKart1 3.2s ease-in-out infinite" }} />
               <i style={{ ...g, width: 17, height: 23, left: 19, top: 9, opacity: .72, animation: "nvKart2 3.2s ease-in-out infinite" }} /></>,
    basamak:<>{[0, 1, 2].map((i) => <i key={i} style={{ ...g, width: 7, height: 7 + i * 7, left: 12 + i * 11, bottom: 10, opacity: .35 + i * .22, animation: `nvYuk 2.4s ${i * .25}s ease-in-out infinite` }} />)}</>,
    yaz:    <><i style={{ ...g, width: 26, height: 2, left: 11, bottom: 14, opacity: .4 }} />
               <i style={{ ...g, width: 2, height: 13, left: 11, bottom: 16, animation: "nvImlec 1.3s steps(2) infinite" }} /></>,
    bosluk: <><i style={{ ...g, width: 11, height: 3, left: 8, top: 18, opacity: .4 }} />
               <i style={{ ...g, width: 11, height: 3, left: 29, top: 18, opacity: .4 }} />
               <i style={{ ...g, width: 9, height: 12, left: 20, top: 13, opacity: .25, borderRadius: 14, animation: "nvNefes 2s ease-in-out infinite" }} /></>,
    harf:   <>{["e", "d", "u"].map((t, i) => <i key={i} style={{ position: "absolute", left: 9 + i * 13, top: 14, width: 11, height: 13, border: `1px solid ${renk}`, borderRadius: 10, color: renk, fontSize: 8, fontFamily: T.kalem, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "normal", animation: `nvZipla 2.6s ${i * .18}s ease-in-out infinite` }}>{t}</i>)}</>,
    dalga:  <>{[0, 1, 2, 3].map((i) => <i key={i} style={{ ...g, width: 3, height: 6 + (i % 2) * 11, left: 12 + i * 8, top: 15, borderRadius: 14, animation: `nvDalga 1.1s ${i * .13}s ease-in-out infinite` }} />)}</>,
    isaret: <><i style={{ ...g, width: 28, height: 2.4, left: 10, top: 15, opacity: .35 }} />
               <i style={{ ...g, width: 28, height: 2.4, left: 10, top: 24, opacity: .35 }} />
               <i style={{ ...g, width: 13, height: 8, left: 15, top: 12, opacity: .45, animation: "nvKaydir 3s ease-in-out infinite" }} /></>,
    esit:   <><i style={{ ...g, width: 10, height: 10, left: 8, top: 15, borderRadius: 14, opacity: .55 }} />
               <i style={{ position: "absolute", left: 22, top: 13, color: renk, fontSize: 13.5, fontStyle: "normal", fontWeight: 700 }}>=</i>
               <i style={{ ...g, width: 10, height: 10, left: 33, top: 15, borderRadius: 14, opacity: .55, animation: "nvNefes 2.2s .4s ease-in-out infinite" }} /></>,
    test:   <>{[0, 1, 2].map((i) => <i key={i} style={{ ...g, width: 24, height: 3, left: 13, top: 12 + i * 8, opacity: i === 1 ? .8 : .3, animation: i === 1 ? "nvNefes 2s ease-in-out infinite" : "none" }} />)}</>,
    simsek: <><i style={{ position: "absolute", left: 17, top: 10, width: 0, height: 0, borderLeft: `7px solid transparent`, borderRight: `7px solid transparent`, borderBottom: `11px solid ${renk}`, opacity: .8, animation: "nvCakan 1.6s ease-in-out infinite" }} />
               <i style={{ position: "absolute", left: 17, top: 19, width: 0, height: 0, borderLeft: `7px solid transparent`, borderRight: `7px solid transparent`, borderTop: `11px solid ${renk}`, opacity: .8, animation: "nvCakan 1.6s .15s ease-in-out infinite" }} /></>,
    eslestir:<><i style={{ ...g, width: 11, height: 11, left: 9, top: 14, animation: "nvSagaSola 2.4s ease-in-out infinite" }} />
               <i style={{ ...g, width: 11, height: 11, left: 30, top: 14, opacity: .5, animation: "nvSagaSola 2.4s .3s ease-in-out infinite reverse" }} /></>,
    izgara: <>{[0, 1, 2, 3].map((i) => <i key={i} style={{ ...g, width: 10, height: 10, left: 12 + (i % 2) * 13, top: 11 + Math.floor(i / 2) * 13, opacity: .3 + (i === 1 ? .5 : 0), animation: `nvCevir 3s ${i * .35}s ease-in-out infinite` }} />)}</>,
    vapur:  <><i style={{ ...g, width: 34, height: 2, left: 8, bottom: 12, opacity: .3 }} />
               <i style={{ ...g, width: 13, height: 7, left: 8, bottom: 14, borderRadius: "2px 5px 0 0", animation: "nvVapur 3.4s linear infinite" }} /></>,
    ampul:  <><i style={{ ...g, width: 12, height: 12, left: 18, top: 13, borderRadius: 14, animation: "nvParla 2.6s ease-in-out infinite" }} />
               {[0, 1, 2].map((i) => <i key={i} style={{ ...g, width: 2, height: 5, left: 23, top: 4, transformOrigin: "50% 16px", transform: `rotate(${-40 + i * 40}deg)`, opacity: .5, animation: `nvParla 2.6s ${.2 + i * .1}s ease-in-out infinite` }} />)}</>,
    mikrofon:<><i style={{ ...g, width: 8, height: 14, left: 20, top: 9, borderRadius: 12 }} />
               <i style={{ position: "absolute", left: 14, top: 22, width: 20, height: 10, border: `2px solid ${renk}`, borderTop: "none", borderRadius: "0 0 10px 10px", opacity: .6, animation: "nvNefes 1.8s ease-in-out infinite" }} /></>,
    zincir: <><i style={{ position: "absolute", left: 10, top: 15, width: 13, height: 9, border: `2px solid ${renk}`, borderRadius: 12, opacity: .7 }} />
               <i style={{ position: "absolute", left: 20, top: 15, width: 13, height: 9, border: `2px solid ${renk}`, borderRadius: 12, opacity: .7, animation: "nvNefes 2.2s .3s ease-in-out infinite" }} /></>,
    kok:    <><i style={{ ...g, width: 2, height: 14, left: 24, top: 8, opacity: .7 }} />
               <i style={{ ...g, width: 11, height: 2, left: 14, top: 21, opacity: .45, transform: "rotate(28deg)" }} />
               <i style={{ ...g, width: 11, height: 2, left: 26, top: 21, opacity: .45, transform: "rotate(-28deg)", animation: "nvNefes 2.4s ease-in-out infinite" }} /></>
  };
  return <span style={s} aria-hidden="true">{P[tip] || null}</span>;
}

export const YOLLAR = [
  { id: "kesif", ad: "Keşif", obek: "tan", dev: "kart",
    neden: "Kelimeyi örnek cümlesiyle gör, bildiğine ya da öğreneceğine karar ver. Bildim dersen uygulama seni hemen sınar; kendini kandıramazsın." },
  { id: "ogren", ad: "Öğren", obek: "tan", dev: "basamak",
    neden: "Her kelime üç basamaktan geçer: tanı, seç, yaz. Üçünü de geçen kelime aralıklı tekrara girer." },
  { id: "yaz", ad: "Yaz", obek: "ure", dev: "yaz",
    neden: "Türkçesini görüp İngilizcesini kendin yaz. Üretmek, seçenekten tanımaktan çok daha kalıcıdır." },
  { id: "bosluk", ad: "Boşluk", obek: "ure", dev: "bosluk",
    neden: "Kelimeyi cümlenin içinde, doğru çekimiyle yerleştir. Paper 1'de tam olarak bu istenir." },
  { id: "harf", ad: "Harf harf", obek: "ure", dev: "harf",
    neden: "Karışık harflerden kelimeyi kur. Yazımı gözle değil elle öğrenirsin." },
  { id: "dikte", ad: "Dikte", obek: "ure", dev: "dalga",
    neden: "Duy ve yaz. Sesi yazıya bağlamak, dinleme ile yazmayı aynı anda çalıştırır.", gerek: "ses" },
  { id: "tanim", ad: "Tanımdan bul", obek: "snv", dev: "isaret",
    neden: "Anlamı verilen kelimeyi bul. Paper 2 okuma bölümünün temel soru tipi." },
  { id: "esanlam", ad: "Eş anlam", obek: "snv", dev: "esit",
    neden: "Aynı anlama gelen kelimeyi seç. Sınavda eş anlamlı eşleştirme olarak çıkar." },
  { id: "kontrol", ad: "Kontrol", obek: "snv", dev: "test",
    neden: "Geri bildirimsiz sınav provası. Sonunda puanın ve cevap anahtarın." },
  { id: "parafraz", ad: "Parafraz", obek: "snv", dev: "isaret",
    neden: "Cümleyi hedef kelimeyle yeniden kur. IO ve Paper 1'de kelime çeşitliliği buradan gelir.", yapay: true },
  { id: "simsek", ad: "Şimşek", obek: "oyn", dev: "simsek",
    neden: "Altmış saniye: eşleşme doğru mu, yanlış mı? Üst üste doğrular puanı katlar." },
  { id: "eslestir", ad: "Eşleştir", obek: "oyn", dev: "eslestir",
    neden: "Altı çift, olabildiğince hızlı. Zaman baskısı tanımayı otomatikleştirir." },
  { id: "hafiza", ad: "Hafıza", obek: "oyn", dev: "izgara",
    neden: "Kartları çevir, eşleri bul. Yeri ve anlamı birlikte tutmak dikkati diri tutar." },
  { id: "vapur", ad: "Son vapur", obek: "oyn", dev: "vapur",
    neden: "Doğru kelimeyi taşıyan vapuru kaçırma. Vapurlar giderek hızlanır." },
  { id: "baglam", ad: "Bağ kur", obek: "der", dev: "ampul",
    neden: "Kendi cümleni yaz. Kendi kurduğun bağ, ezberden çok daha uzun yaşar.", yapay: true },
  { id: "telaffuz", ad: "Telaffuz", obek: "der", dev: "mikrofon",
    neden: "Sesli söyle, cihaz ne duyduğunu yazsın. Sesli üretim IO'da doğrudan puandır.", gerek: "tanima" },
  { id: "esdizim", ad: "Eşdizim", obek: "der", dev: "zincir",
    neden: "Kelimenin yanında hangi sözcüklerin yürüdüğünü öğren. Doğallık buradan gelir." },
  { id: "koken", ad: "Kökten dal", obek: "der", dev: "kok",
    neden: "Bir kökten türeyen bütün biçimleri birlikte öğren: analyse, analysis, analytical.", yapay: true }
];

export const YOL_HARITA = Object.fromEntries(YOLLAR.map((y) => [y.id, y]));

/* ─── Soru üreteçleri ─────────────────────────────────────────────── */

/* Bir kelimenin ya da deyimin metin içindeki geçtiği parçayı bulur.
   Deyimlerde ilk sözcük çoğu kez "a", "the", "in" olduğundan ilk sözcüğe
   bakmak yetmez: önce bütün kalıp, sonra en uzun anlamlı sözcüğün kökü aranır. */
const BOS_SOZ = new Set(["a","an","the","to","of","in","on","at","for","sb","sth","sb's","one's","your","yourself","oneself","and","or","as","be","is","it","with","by","from","that","not","no","up","out","off","than","you","its"]);
const reKac = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function parcaBul(w, metin) {
  if (!w || !metin) return null;
  let m = metin.match(new RegExp("(?<![A-Za-z])" + w.trim().split(/\s+/).map(reKac).join("\\s+") + "[a-z]*", "i"));
  if (m) return m[0];
  const parcalar = w.toLowerCase().split(/[\s-]+/).map((p) => p.replace(/[^a-z']/g, "")).filter((p) => p.length > 2 && !BOS_SOZ.has(p)).sort((a, b) => b.length - a.length);
  for (const p of parcalar) {
    const kok = p.length > 6 ? p.slice(0, p.length - 3) : p.length > 4 ? p.slice(0, p.length - 1) : p;
    m = metin.match(new RegExp("(?<![A-Za-z])" + reKac(kok) + "[a-z']*", "i"));
    if (m) return m[0];
  }
  return null;
}
export function gizle(w, metin) {
  const p = parcaBul(w, metin);
  return p ? { metin: metin.replace(p, "______"), cevap: p } : null;
}
export function vurgula(w, metin) {
  const p = parcaBul(w, metin);
  return p ? metin.replace(p, "[[" + p + "]]") : metin;
}

export function soruKur(tip, hedef, havuz) {
  const c = celdiriciler(hedef, havuz, 3);
  if (tip === "trBul") {
    return { tip: "secim", metin: hedef.w, altMetin: turYaz(hedef.pos), soru: "Türkçe karşılığı hangisi?",
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.tr }))), dogruId: hedef.id };
  }
  if (tip === "enBul") {
    return { tip: "secim", metin: hedef.tr, soru: "İngilizcesi hangisi?",
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  if (tip === "ornekBul") {
    const g = gizle(hedef.w, hedef.ornek); const gizli = g ? g.metin : hedef.ornek.replace(hedef.w, "______");
    return { tip: "secim", metin: gizli, soru: "Boşluğa hangi kelime gelir?",
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  if (tip === "tanimBul") {
    return { tip: "secim", metin: hedef.tr, altMetin: DURAK_META[hedef.durak].ad,
      soru: "Bu anlama gelen kelime hangisi?",
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  if (tip === "esdizimBul") {
    return { tip: "secim", metin: (gizle(hedef.w, hedef.esdizim) || { metin: hedef.esdizim }).metin,
      soru: "Bu eşdizimde boşluğa ne gelir?", altMetin: hedef.tr,
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  return null;
}

export function yazSoru(tip, hedef) {
  if (tip === "bosluk") {
    const g = gizle(hedef.w, hedef.ornek);
    if (!g) return null;
    return { tip: "metin", metin: g.metin, soru: "Boşluğu doldur",
      ipucu: hedef.tr, cevap: g.cevap, tamCevap: hedef.ornek };
  }
  if (tip === "dikte") {
    return { tip: "metin", metin: null, seslendir: hedef.w, soru: "Duyduğunu yaz",
      ipucu: hedef.tr, cevap: hedef.w, tamCevap: hedef.ornek };
  }
  return { tip: "metin", metin: hedef.tr, altMetin: turYaz(hedef.pos), soru: "İngilizcesini yaz",
    ipucu: (gizle(hedef.w, hedef.ornek) || { metin: "" }).metin, cevap: hedef.w, tamCevap: hedef.ornek };
}

/* Harf harf: karışık harflerden kelime kurma */
export function harfKur(k) {
  const hedef = k.w;
  const harfler = hedef.split("").map((h, i) => ({ h, i, kullanildi: false }));
  const bosluklar = hedef.split("").map((h) => (h === " " || h === "-" ? h : null));
  return { hedef, havuz: karistir(harfler.filter((x) => x.h !== " " && x.h !== "-")), bosluklar, yerlesim: [] };
}

/* ─── Seslendirme ─────────────────────────────────────────────────── */
export const sesVar = () => typeof window !== "undefined" && "speechSynthesis" in window;
export function seslendir(metin, hiz) {
  if (!sesVar()) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = "en-GB"; u.rate = hiz || 0.9;
    const sesler = window.speechSynthesis.getVoices();
    const ing = sesler.find((s) => /en-GB/i.test(s.lang)) || sesler.find((s) => /^en/i.test(s.lang));
    if (ing) u.voice = ing;
    window.speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}

/* ─── Ortak oturum parçaları ──────────────────────────────────────── */

export function OturumUst({ i, n, skor, baslik, cik, sayac }) {
  const oran = n > 0 ? Math.min(100, (i / n) * 100) : 0;
  return (
    <div className="nv-oturum">
      <button onClick={cik} aria-label="Oturumdan çık" className="nv-oturum-cik"><X size={22} /></button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: T.hat, fontSize: 19, fontWeight: 780, letterSpacing: "-0.01em", color: C.murekkep, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{baslik}</span>
          {n > 0 && <span style={{ fontSize: 15, fontWeight: 750, color: C.murekkepAlt, ...T.rakam }}>{Math.min(i + 1, n)} / {n}</span>}
        </div>
        {n > 0 && <div className="nv-ilerleme"><span style={{ width: `${Math.max(3, oran)}%` }} /></div>}
      </div>
      {sayac != null && <span className={`nv-oturum-cip${sayac < 11 ? " acil" : ""}`}><Clock size={17} /> {sayac}</span>}
      {skor != null && <span key={skor} className="nv-oturum-cip dogru"><Check size={17} /> {skor}</span>}
    </div>
  );
}

export function KelimeBasligi({ k, buyuk, sesli }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, flexWrap: "wrap" }}>
        <span style={{ fontFamily: T.kalem, fontSize: buyuk ? 30 : 22, fontWeight: 500, color: C.murekkep, letterSpacing: "-0.01em" }}>{k.w}</span>
        {sesli && sesVar() && (
          <button onClick={() => seslendir(k.w)} aria-label="Seslendir"
            style={{ border: "none", background: "transparent", cursor: "pointer", color: C.altin, padding: 2 }}>
            <Volume2 size={17} />
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
        <Nisan kucuk renk={SEVIYE_RENK[k.lv]} zemin={SEVIYE_RENK[k.lv] + "14"}>{k.lv}</Nisan>
        <Nisan kucuk renk={C.murekkepSis}>{turYaz(k.pos)}</Nisan>
        <Nisan kucuk renk={DURAK_META[k.durak].renk}>{DURAK_META[k.durak].ad}</Nisan>
      </div>
    </div>
  );
}

export function KelimeAyrinti({ k, acikBasla }) {
  return (
    <div style={{ display: "grid", gap: S.sm }}>
      <div style={{ fontFamily: T.govde, fontSize: 18, color: C.altin, fontWeight: 600 }}>{k.tr}</div>
      <Aralik en={vurgula(k.w, k.ornek)}
        tr={""} fark={null} acikBasla={false} kompakt />
      <div style={{ display: "flex", alignItems: "center", gap: 6, ...T.xs, color: C.murekkepAlt }}>
        <Layers size={11} style={{ color: C.altin }} />
        <span style={{ fontFamily: T.kalem }}>{k.esdizim}</span>
      </div>
      {k.ekAnlam && k.ekAnlam.length > 0 && (
        <div style={{ ...T.xs, color: C.murekkepSis, borderTop: `1px dashed ${C.cizgi}`, paddingTop: 6 }}>
          Başka duraklarda: {k.ekAnlam.map((e) => `${DURAK_META[e.durak].ad} — ${e.tr}`).join(" · ")}
        </div>
      )}
    </div>
  );
}

export function SonucEkrani({ dogru, toplam, sure, enIyi, yeniRekor, yanlislar, tekrar, cik, ek }) {
  const oran = toplam ? Math.round((dogru / toplam) * 100) : 0;
  const n = useSayac(oran, 1300);
  const yildiz = oran >= 90 ? 3 : oran >= 65 ? 2 : oran >= 35 ? 1 : 0;
  const renk = oran >= 80 ? C.zumrut : oran >= 50 ? C.altin : C.erguvan;
  const soz = oran === 100 ? "Kusursuz sefer" : oran >= 80 ? "Harika gidiyorsun" : oran >= 50 ? "İyi bir tur" : toplam ? "Bu kelimeler yeniden gelecek" : "Tur bitti";
  useEffect(() => {
    if (oran >= 80) { konfeti(oran === 100 ? 170 : 110); titre(oran === 100 ? 26 : 14); }
  }, []);
  const cevre = 2 * Math.PI * 84;
  return (
    <div style={{ display: "grid", gap: S.md }}>
      <div className="nv-sonuc" style={{ "--r": renk }}>
        <div className="nv-yildizlar">
          {[0, 1, 2].map((y) => <Star key={y} size={y === 1 ? 52 : 40} className={y < yildiz ? "dolu" : ""} style={{ animationDelay: `${700 + y * 220}ms` }} />)}
        </div>
        <div style={{ position: "relative", width: 200, height: 200, margin: "6px auto 0" }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(15,27,51,.08)" strokeWidth="16" />
            <circle cx="100" cy="100" r="84" fill="none" stroke={renk} strokeWidth="16" strokeLinecap="round" transform="rotate(-90 100 100)"
              strokeDasharray={`${(cevre * n) / 100} ${cevre}`} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: T.hat, fontSize: 54, fontWeight: 800, letterSpacing: "-0.04em", color: C.murekkep, lineHeight: 1, ...T.rakam }}>%{n}</div>
            <div style={{ fontSize: 15, color: C.murekkepAlt, marginTop: 4 }}>{dogru} / {toplam} doğru</div>
          </div>
        </div>
        <div className="nv-sonuc-soz" style={{ fontFamily: T.hat, fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em", marginTop: 12 }}>{soz}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
          {sure != null && <span className="nv-oturum-cip"><Clock size={16} /> {Math.floor(sure / 60)} dk {sure % 60} sn</span>}
          {yeniRekor && <span className="nv-oturum-cip dogru"><Star size={16} /> Yeni rekor</span>}
          {enIyi != null && !yeniRekor && <span className="nv-oturum-cip">En iyin: {enIyi}</span>}
        </div>
      </div>
      {ek}
      {yanlislar && yanlislar.length > 0 && (
        <div style={{ background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 24, padding: S.lg }}>
          <div style={{ fontFamily: T.hat, fontSize: 20, fontWeight: 780, marginBottom: 12 }}>Seni zorlayanlar <span style={{ color: C.murekkepSis, fontWeight: 600 }}>{yanlislar.length}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {yanlislar.map((k, i) => (
              <div key={k.id + i} className="nv-zor" style={{ animationDelay: `${900 + i * 50}ms` }}>
                <span style={{ fontFamily: T.kalem, fontSize: 17, fontWeight: 700, color: C.murekkep }}>{k.w}</span>
                <span style={{ fontSize: 15, color: C.murekkepAlt }}>{k.tr}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: S.sm }}>
        {tekrar && <Dugme tur="altin" tikla={tekrar} tam><RotateCcw size={16} /> Bir tur daha</Dugme>}
        <Dugme tur={tekrar ? "ikincil" : "altin"} tikla={cik} tam>Bitir</Dugme>
      </div>
    </div>
  );
}

/* ─── 1. Keşif ────────────────────────────────────────────────────── */

export function KesifYolu({ kelimeler, dag, kaydet, cik }) {
  const [liste] = useState(() => karistir(kelimeler).slice(0, 24));
  const [i, setI] = useState(0);
  const [acik, setAcik] = useState(false);
  const [dogrula, setDogrula] = useState(null);
  const [sonuc, setSonuc] = useState(null);
  const [sayim, setSayim] = useState({ bildim: 0, ogrenecegim: 0 });
  const [yanlislar, setYanlislar] = useState([]);
  const k = liste[i];

  function ilerle() {
    if (i + 1 < liste.length) { setI(i + 1); setAcik(false); setDogrula(null); }
    else setSonuc(true);
  }

  function karar(biliyorum) {
    if (!biliyorum) {
      kaydet(k.id, false);
      setSayim((s) => ({ ...s, ogrenecegim: s.ogrenecegim + 1 }));
      setAcik(true);
      return;
    }
    const soru = soruKur("trBul", k, kelimeler);
    setDogrula({ soru, secim: null });
  }

  function dogrulaCevap(sid) {
    const ok = sid === dogrula.soru.dogruId;
    kaydet(k.id, ok);
    if (ok) { setSayim((s) => ({ ...s, bildim: s.bildim + 1 })); titre(10); }
    else { setSayim((s) => ({ ...s, ogrenecegim: s.ogrenecegim + 1 })); setYanlislar((y) => [...y, k]); }
    setDogrula({ ...dogrula, secim: sid, ok });
    setAcik(true);
  }

  if (sonuc) return <SonucEkrani dogru={sayim.bildim} toplam={liste.length} yanlislar={yanlislar} cik={cik}
    ek={<Haber tur="bilgi">{sayim.ogrenecegim} kelime öğrenme listene girdi. Yarın, üç gün sonra, bir hafta sonra karşına çıkacaklar.</Haber>} />;

  return (
    <div>
      <OturumUst i={i} n={liste.length} baslik="Keşif" cik={cik} />
      <Cetvel sikilik="genis" style={{ minHeight: 230 }}>
        <KelimeBasligi k={k} buyuk sesli />
        <div style={{ marginTop: S.lg, fontFamily: T.kalem, fontSize: 16, lineHeight: 1.9, color: C.murekkepAlt }}>
          {k.ornek}
        </div>
        {acik && (
          <div style={{ marginTop: S.lg, paddingTop: S.lg, borderTop: `1px dashed ${C.cizgi}` }}>
            <KelimeAyrinti k={k} />
          </div>
        )}
      </Cetvel>

      {!acik && !dogrula && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.sm, marginTop: S.md }}>
          <Dugme tur="ikincil" tikla={() => karar(false)}>Öğrenmeliyim</Dugme>
          <Dugme tur="altin" tikla={() => karar(true)}>Biliyorum</Dugme>
        </div>
      )}

      {dogrula && dogrula.secim == null && (
        <div style={{ marginTop: S.md }}>
          <Haber tur="altin">Biliyorsan göster: {dogrula.soru.soru}</Haber>
          <div style={{ display: "grid", gap: 6, marginTop: S.sm }}>
            {dogrula.soru.secenekler.map((o) => (
              <div key={o.id} onClick={() => dogrulaCevap(o.id)}
                style={{ border: `1px solid ${C.cizgi}`, background: C.muhre, borderRadius: 14, padding: S.md,
                  cursor: "pointer", fontFamily: T.govde, fontSize: 16, color: C.murekkep }}>{o.t}</div>
            ))}
          </div>
        </div>
      )}

      {acik && (
        <div style={{ marginTop: S.md }}>
          {dogrula && <div style={{ marginBottom: S.sm }}>
            <Haber tur={dogrula.ok ? "iyi" : "hata"}>
              {dogrula.ok ? "Doğru bildin — kutu bir yukarı çıktı." : "Bilmiyormuşsun. Öğrenme listesine aldım."}
            </Haber>
          </div>}
          <Dugme tikla={ilerle} tam>{i + 1 < liste.length ? "Sonraki kelime" : "Turu bitir"}</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 2. Öğren (üç basamak) ───────────────────────────────────────── */

export function OgrenYolu({ kelimeler, dag, kaydet, cik }) {
  const [liste] = useState(() => karistir(kelimeler).slice(0, 12));
  const [sev, setSev] = useState(() => Object.fromEntries(karistir(kelimeler).slice(0, 12).map((k) => [k.id, 0])));
  const [sira, setSira] = useState(() => karistir(kelimeler).slice(0, 12).map((k) => k.id));
  const [cevap, setCevap] = useState("");
  const [secim, setSecim] = useState(null);
  const [geri, setGeri] = useState(null);
  const [sonuc, setSonuc] = useState(false);
  const [yanlislar, setYanlislar] = useState([]);
  const [sayim, setSayim] = useState(0);

  const akt = sira.length ? kelime(sira[0]) : null;
  const basamak = akt ? sev[akt.id] : 0;
  const soru = useMemo(() => {
    if (!akt) return null;
    if (basamak === 0) return soruKur("trBul", akt, kelimeler);
    if (basamak === 1) return soruKur("ornekBul", akt, kelimeler);
    return yazSoru("yaz", akt);
  }, [akt && akt.id, basamak]);

  function sonrakiAdim(ok) {
    kaydet(akt.id, ok);
    if (ok) titre(9); else { if (!yanlislar.some((x) => x.id === akt.id)) setYanlislar((y) => [...y, akt]); }
    const yeniSev = { ...sev, [akt.id]: ok ? basamak + 1 : Math.max(0, basamak - 1) };
    setSev(yeniSev);
    const kalan = sira.slice(1);
    if (ok && yeniSev[akt.id] >= 3) { setSayim((s) => s + 1); setSira(kalan); }
    else setSira([...kalan.slice(0, 2), akt.id, ...kalan.slice(2)]);
    setCevap(""); setSecim(null); setGeri(null);
    if (ok && yeniSev[akt.id] >= 3 && kalan.length === 0) setSonuc(true);
    if (!kalan.length && !(ok && yeniSev[akt.id] >= 3)) { /* tek kelime kaldı, döngü sürer */ }
  }

  if (sonuc || !akt) return <SonucEkrani dogru={sayim} toplam={liste.length} yanlislar={yanlislar} cik={cik}
    ek={<Haber tur="iyi">Üç basamağı geçen {sayim} kelime aralıklı tekrar listene girdi.</Haber>} />;

  const bitti = liste.length - sira.length;

  return (
    <div>
      <OturumUst i={bitti} n={liste.length} baslik="Öğren" cik={cik} />
      <div style={{ display: "flex", gap: 4, marginBottom: S.md }}>
        {["Tanı", "Seç", "Yaz"].map((b, bi) => (
          <div key={b} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 14, background: bi < basamak ? C.zumrut : bi === basamak ? C.altin : C.kagitDerin }} />
            <div style={{ fontSize: 11.5, marginTop: 4, color: bi === basamak ? C.altin : C.murekkepSis, fontWeight: bi === basamak ? 700 : 400 }}>{b}</div>
          </div>
        ))}
      </div>

      <Cetvel>
        <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: S.sm }}>{soru.soru}</div>
        <div style={{ fontFamily: basamak === 1 ? T.kalem : T.govde, fontSize: basamak === 2 ? 22 : 18, lineHeight: 1.7, color: C.murekkep }}>
          {soru.metin}
        </div>
        {soru.altMetin && <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 5 }}>{soru.altMetin}</div>}
      </Cetvel>

      {soru.tip === "secim" ? (
        <div style={{ display: "grid", gap: 6, marginTop: S.md }}>
          {soru.secenekler.map((o) => {
            const secildi = secim === o.id, dogruSec = geri && o.id === soru.dogruId;
            return (
              <div key={o.id} onClick={() => { if (geri) return; setSecim(o.id); setGeri({ ok: o.id === soru.dogruId }); }}
                style={{ border: `1px solid ${geri ? (dogruSec ? C.zumrut : secildi ? C.lal : C.cizgi) : C.cizgi}`,
                  background: geri && dogruSec ? C.zumSis : geri && secildi ? C.lalSis : C.muhre,
                  borderRadius: 14, padding: S.md, cursor: geri ? "default" : "pointer",
                  fontFamily: basamak === 0 ? T.govde : T.kalem, fontSize: 16, color: C.murekkep }}>{o.t}</div>
            );
          })}
        </div>
      ) : (
        <div style={{ marginTop: S.md }}>
          {!geri && <>
            <Satir deger={cevap} degistir={setCevap} ipucu="İngilizcesini yaz…"
              gonder={() => { const r = kelimeEsit(cevap, soru.cevap); setGeri({ ok: r.ok, yakin: r.yakin }); }}
              style={{ fontFamily: T.kalem, fontSize: 18, textAlign: "center" }} />
            <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 6, fontFamily: T.kalem }}>{soru.ipucu}</div>
          </>}
          {geri && <Levha style={{ background: C.kagitAlt }}>
            <div style={{ fontFamily: T.kalem, fontSize: 18, color: geri.ok ? C.zumrut : C.lal }}>{soru.cevap}</div>
          </Levha>}
        </div>
      )}

      {geri && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Haber tur={geri.ok ? "iyi" : "hata"}>
            {geri.ok ? (geri.yakin ? "Doğru — ufak bir yazım kayması vardı, doğrusu yukarıda." : "Doğru.") : `Doğrusu: ${akt.w} — ${akt.tr}`}
          </Haber>
          <Dugme tikla={() => sonrakiAdim(geri.ok)} tam>Devam</Dugme>
        </div>
      )}
      {!geri && soru.tip === "metin" && (
        <div style={{ marginTop: S.sm }}>
          <Dugme tikla={() => { const r = kelimeEsit(cevap, soru.cevap); setGeri({ ok: r.ok, yakin: r.yakin }); }} pasif={!cevap.trim()} tam>Gönder</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 3-4-6. Yaz · Boşluk · Dikte ─────────────────────────────────── */

export function YazYolu({ yol, kelimeler, kaydet, cik }) {
  const uygun = useMemo(() => {
    if (yol === "bosluk") return kelimeler.filter((k) => yazSoru("bosluk", k));
    return kelimeler;
  }, [yol, kelimeler]);
  const [liste] = useState(() => karistir(uygun).slice(0, 16));
  const [i, setI] = useState(0);
  const [cevap, setCevap] = useState("");
  const [geri, setGeri] = useState(null);
  const [ipucu, setIpucu] = useState(false);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [sonuc, setSonuc] = useState(false);
  const k = liste[i];
  const soru = useMemo(() => (k ? yazSoru(yol, k) : null), [k && k.id, yol]);

  useEffect(() => { if (yol === "dikte" && soru && soru.seslendir) seslendir(soru.seslendir); }, [i, yol]);

  if (!liste.length) return <Bos baslik="Bu yol için uygun kelime yok"
    aciklama="Boşluk doldurma, örnek cümlesinde kelimenin kendisi geçen kelimelerle çalışır. Başka bir durak ya da başka bir yol seç." eylem={cik} eylemAd="Geri dön" />;

  if (sonuc) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function gonder() {
    const r = kelimeEsit(cevap, soru.cevap);
    kaydet(k.id, r.ok && !ipucu);
    if (r.ok) { setDogru((d) => d + 1); titre(10); kivilcim(innerWidth / 2, innerHeight * 0.42, C.zumrut, 14); }
    else setYanlislar((y) => [...y, k]);
    setGeri({ ok: r.ok, yakin: r.yakin });
  }
  function ilerle() {
    if (i + 1 < liste.length) { setI(i + 1); setCevap(""); setGeri(null); setIpucu(false); }
    else setSonuc(true);
  }

  const baslik = yol === "bosluk" ? "Boşluk" : yol === "dikte" ? "Dikte" : "Yaz";

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik={baslik} cik={cik} />
      <Cetvel sikilik="genis">
        <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: S.sm }}>{soru.soru}</div>
        {yol === "dikte" ? (
          <div style={{ textAlign: "center", padding: `${S.md}px 0` }}>
            <Dugme tur="lacivert" tikla={() => seslendir(soru.seslendir)}><Volume2 size={15} /> Tekrar dinle</Dugme>
            <div style={{ marginTop: S.sm }}>
              <Dugme tur="sessiz" kucuk tikla={() => seslendir(soru.seslendir, 0.55)}>yavaş</Dugme>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: yol === "bosluk" ? T.kalem : T.govde, fontSize: yol === "bosluk" ? 17.5 : 22,
            lineHeight: 1.85, color: C.murekkep }}>{soru.metin}</div>
        )}
        {soru.altMetin && <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 6 }}>{soru.altMetin}</div>}
      </Cetvel>

      {!geri ? (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Satir deger={cevap} degistir={setCevap} ipucu="Cevabını yaz…" gonder={gonder}
            style={{ fontFamily: T.kalem, fontSize: 18, textAlign: "center" }} />
          {ipucu && <Haber tur="altin">{yol === "yaz" ? soru.ipucu : `${k.tr} · ${k.w.length} harf`}</Haber>}
          <div style={{ display: "flex", gap: S.sm }}>
            {!ipucu && <Dugme tur="sessiz" kucuk tikla={() => setIpucu(true)}>İpucu</Dugme>}
            <span style={{ flex: 1 }} />
            <Dugme tikla={gonder} pasif={!cevap.trim()}>Gönder</Dugme>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha renk={geri.ok ? C.zumrut : C.lal}>
            <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.sm }}>
              {geri.ok ? <CheckCircle size={17} style={{ color: C.zumrut }} /> : <XCircle size={17} style={{ color: C.lal }} />}
              <span style={{ fontFamily: T.kalem, fontSize: 19, color: geri.ok ? C.zumrut : C.lal }}>{soru.cevap}</span>
              {sesVar() && <button onClick={() => seslendir(k.w)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.altin }}><Volume2 size={15} /></button>}
            </div>
            {!geri.ok && cevap && <div style={{ ...T.xs, color: C.murekkepSis, marginBottom: S.sm }}>Senin yazdığın: {cevap}</div>}
            {geri.yakin && geri.ok && <div style={{ ...T.xs, color: C.altin, marginBottom: S.sm }}>Ufak bir yazım kayması — doğru kabul ettim.</div>}
            <div style={{ fontFamily: T.govde, fontSize: 17, color: C.altin, marginBottom: 6 }}>{k.tr}</div>
            <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.murekkepAlt, lineHeight: 1.75 }}>{soru.tamCevap}</div>
          </Levha>
          <Dugme tikla={ilerle} tam>{i + 1 < liste.length ? "Sonraki" : "Turu bitir"}</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 5. Harf harf ────────────────────────────────────────────────── */

export function HarfYolu({ kelimeler, kaydet, cik }) {
  const uygun = useMemo(() => kelimeler.filter((k) => k.w.replace(/[^a-zA-Z]/g, "").length >= 3 && k.w.length <= 16), [kelimeler]);
  const [liste] = useState(() => karistir(uygun).slice(0, 14));
  const [i, setI] = useState(0);
  const [yerlesim, setYerlesim] = useState([]);
  const [geri, setGeri] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [sonuc, setSonuc] = useState(false);
  const k = liste[i];
  const oyun = useMemo(() => (k ? harfKur(k) : null), [k && k.id]);

  useEffect(() => { setYerlesim([]); setGeri(null); }, [i]);

  if (!liste.length) return <Bos baslik="Uygun kelime yok" aciklama="Bu durakta harf harf kurulabilecek kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (sonuc) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  const hedefHarfler = k.w.split("");
  const yazilan = (() => {
    let j = 0;
    return hedefHarfler.map((h) => (h === " " || h === "-" ? h : (yerlesim[j++] !== undefined ? yerlesim[j - 1].h : null)));
  })();
  const tamam = yerlesim.length === oyun.havuz.length;

  function koy(idx) {
    if (geri || yerlesim.some((y) => y.i === oyun.havuz[idx].i)) return;
    const yeni = [...yerlesim, oyun.havuz[idx]];
    setYerlesim(yeni);
    titre(6);
    if (yeni.length === oyun.havuz.length) {
      const kurulan = (() => { let j = 0; return hedefHarfler.map((h) => (h === " " || h === "-" ? h : yeni[j++].h)).join(""); })();
      const ok = kurulan.toLowerCase() === k.w.toLowerCase();
      kaydet(k.id, ok);
      if (ok) { setDogru((d) => d + 1); titre(14); kivilcim(innerWidth / 2, innerHeight * 0.4, C.altin, 18); }
      else setYanlislar((y) => [...y, k]);
      setGeri({ ok, kurulan });
    }
  }
  function geriAl() { if (!geri) setYerlesim(yerlesim.slice(0, -1)); }

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Harf harf" cik={cik} />
      <Cetvel sikilik="genis">
        <div style={{ fontFamily: T.govde, fontSize: 19, color: C.altin, marginBottom: 6 }}>{k.tr}</div>
        <div style={{ ...T.xs, color: C.murekkepSis, marginBottom: S.lg }}>{turYaz(k.pos)} · {k.lv}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", minHeight: 46 }}>
          {yazilan.map((h, j) => (h === " " || h === "-")
            ? <span key={j} style={{ width: 12, display: "inline-block", textAlign: "center", color: C.murekkepSis, fontFamily: T.kalem, lineHeight: "38px" }}>{h}</span>
            : <span key={j} style={{ width: 28, height: 38, border: `1px solid ${h ? (geri ? (geri.ok ? C.zumrut : C.lal) : C.altin) : C.cizgi}`,
                background: h ? (geri ? (geri.ok ? C.zumSis : C.lalSis) : C.altinSis) : C.muhre, borderRadius: 14,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.kalem, fontSize: 18, color: C.murekkep }}>{h || ""}</span>)}
        </div>
      </Cetvel>

      {!geri && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: S.lg }}>
            {oyun.havuz.map((x, idx) => {
              const kul = yerlesim.some((y) => y.i === x.i);
              return (
                <button key={idx} onClick={() => koy(idx)} disabled={kul}
                  style={{ width: 36, height: 42, border: `1px solid ${kul ? C.cizgi : C.cetvel}`,
                    background: kul ? C.kagitAlt : C.muhre, borderRadius: 14, cursor: kul ? "default" : "pointer",
                    fontFamily: T.kalem, fontSize: 18, color: kul ? C.murekkepSis : C.murekkep, opacity: kul ? 0.3 : 1 }}>
                  {x.h}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: S.sm, marginTop: S.md }}>
            <Dugme tur="sessiz" kucuk tikla={geriAl} pasif={!yerlesim.length}>Geri al</Dugme>
            <Dugme tur="sessiz" kucuk tikla={() => seslendir(k.w)} pasif={!sesVar()}><Volume2 size={12} /> Dinle</Dugme>
          </div>
        </>
      )}

      {geri && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Haber tur={geri.ok ? "iyi" : "hata"}>
            {geri.ok ? `${k.w} — doğru kurdun.` : `Doğrusu: ${k.w}. Sen ${geri.kurulan} kurdun.`}
          </Haber>
          <Levha style={{ background: C.kagitAlt }}>
            <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.murekkepAlt, lineHeight: 1.75 }}>{k.ornek}</div>
          </Levha>
          <Dugme tikla={() => { if (i + 1 < liste.length) setI(i + 1); else setSonuc(true); }} tam>
            {i + 1 < liste.length ? "Sonraki" : "Turu bitir"}
          </Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 7-8. Tanımdan bul · Eş anlam ────────────────────────────────── */

export function SecimYolu({ yol, kelimeler, kaydet, cik }) {
  const tip = yol === "tanim" ? "tanimBul" : "esdizimBul";
  const uygun = useMemo(() => (yol === "esanlam" ? kelimeler.filter((k) => k.esdizim && k.esdizim.length > 4) : kelimeler), [yol, kelimeler]);
  const [liste] = useState(() => karistir(uygun).slice(0, 16));
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [sonuc, setSonuc] = useState(false);
  const k = liste[i];
  const soru = useMemo(() => (k ? soruKur(tip, k, kelimeler) : null), [k && k.id, tip]);

  if (!liste.length || !soru) return <Bos baslik="Uygun kelime yok" aciklama="Bu yol için bu durakta yeterli kelime yok." eylem={cik} eylemAd="Geri dön" />;
  if (sonuc) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function sec(id) {
    if (secim) return;
    const ok = id === soru.dogruId;
    kaydet(k.id, ok);
    if (ok) { setDogru((d) => d + 1); titre(9); } else setYanlislar((y) => [...y, k]);
    setSecim(id);
  }

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik={yol === "tanim" ? "Tanımdan bul" : "Eş anlam"} cik={cik} />
      <Cetvel sikilik="genis">
        <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: S.sm }}>{soru.soru}</div>
        <div style={{ fontFamily: yol === "esanlam" ? T.kalem : T.govde, fontSize: 19, lineHeight: 1.7, color: C.murekkep }}>{soru.metin}</div>
        {soru.altMetin && <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 7 }}>{soru.altMetin}</div>}
      </Cetvel>
      <div style={{ display: "grid", gap: 6, marginTop: S.md }}>
        {soru.secenekler.map((o) => {
          const secildi = secim === o.id, dogruSec = secim && o.id === soru.dogruId;
          return (
            <div key={o.id} onClick={() => sec(o.id)}
              style={{ border: `1px solid ${secim ? (dogruSec ? C.zumrut : secildi ? C.lal : C.cizgi) : C.cizgi}`,
                background: secim && dogruSec ? C.zumSis : secim && secildi ? C.lalSis : C.muhre,
                borderRadius: 14, padding: S.md, cursor: secim ? "default" : "pointer",
                fontFamily: T.kalem, fontSize: 16.5, color: C.murekkep, display: "flex", justifyContent: "space-between", gap: S.sm }}>
              <span>{o.t}</span>
              {secim && dogruSec && <span style={{ ...T.xs, color: C.zumrut, fontFamily: T.govde }}>{kelime(o.id) ? kelime(o.id).tr : ""}</span>}
              {secim && secildi && !dogruSec && <span style={{ ...T.xs, color: C.lal, fontFamily: T.govde }}>{kelime(o.id) ? kelime(o.id).tr : ""}</span>}
            </div>
          );
        })}
      </div>
      {secim && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha style={{ background: C.kagitAlt }}>
            <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.murekkepAlt, lineHeight: 1.8 }}>{k.ornek}</div>
            <div style={{ ...T.xs, color: C.altin, marginTop: 6, fontFamily: T.kalem }}>{k.esdizim}</div>
          </Levha>
          <Dugme tikla={() => { if (i + 1 < liste.length) { setI(i + 1); setSecim(null); } else setSonuc(true); }} tam>
            {i + 1 < liste.length ? "Sonraki" : "Turu bitir"}
          </Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 9. Kontrol (sınav provası) ──────────────────────────────────── */

export function KontrolYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
  const [asama, setAsama] = useState("kur");
  const [adet, setAdet] = useState(20);
  const [sorular, setSorular] = useState([]);
  const [i, setI] = useState(0);
  const [cevaplar, setCevaplar] = useState([]);
  const [girdi, setGirdi] = useState("");
  const [bas, setBas] = useState(0);

  function basla() {
    const n = Math.min(adet, kelimeler.length);
    const sec = karistir(kelimeler).slice(0, n);
    const tipler = ["trBul", "enBul", "ornekBul", "yaz"];
    setSorular(sec.map((k, j) => {
      const t = tipler[j % tipler.length];
      return t === "yaz" ? { k, tip: "yaz", s: yazSoru("yaz", k) } : { k, tip: "secim", s: soruKur(t, k, kelimeler) };
    }));
    setAsama("sinav"); setBas(Date.now()); setI(0); setCevaplar([]); setGirdi("");
  }

  function cevapla(deger) {
    const q = sorular[i];
    const ok = q.tip === "secim" ? deger === q.s.dogruId : kelimeEsit(deger, q.s.cevap).ok;
    kaydet(q.k.id, ok);
    const yeni = [...cevaplar, { k: q.k, ok, verilen: deger, tip: q.tip, q }];
    setCevaplar(yeni); setGirdi("");
    if (i + 1 < sorular.length) setI(i + 1);
    else {
      const d = yeni.filter((x) => x.ok).length;
      const yuzde = Math.round((d / yeni.length) * 100);
      if (rekorKaydet && (enIyi == null || yuzde > enIyi)) rekorKaydet(yuzde);
      setAsama("sonuc");
    }
  }

  if (asama === "kur") {
    return (
      <div>
        <OturumUst i={0} n={0} baslik="Kontrol" cik={cik} />
        <Cetvel sikilik="genis">
          <Etiket renk={C.lal}>Sınav provası</Etiket>
          <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.lg }}>
            Soru başına geri bildirim yok. Hepsini bitirince puanını ve cevap anahtarını birlikte görürsün —
            tıpkı sınavda olduğu gibi.
          </div>
          <Etiket>Kaç soru</Etiket>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: S.lg }}>
            {[10, 20, 30, 50].map((n) => (
              <Dugme key={n} tur={adet === n ? "ikincil" : "sessiz"} kucuk tikla={() => setAdet(n)} pasif={n > kelimeler.length}>{n}</Dugme>
            ))}
          </div>
          {enIyi != null && <div style={{ ...T.xs, color: C.murekkepSis, marginBottom: S.md }}>En iyi sonucun: %{enIyi}</div>}
          <Dugme tur="lal" tikla={basla} tam style={{ background: C.lal, borderColor: C.lal, color: C.muhre }}>Sınavı başlat</Dugme>
        </Cetvel>
      </div>
    );
  }

  if (asama === "sonuc") {
    const d = cevaplar.filter((x) => x.ok).length;
    const sure = Math.round((Date.now() - bas) / 1000);
    const yuzde = Math.round((d / cevaplar.length) * 100);
    return <SonucEkrani dogru={d} toplam={cevaplar.length} sure={sure} enIyi={enIyi}
      yeniRekor={enIyi == null || yuzde > enIyi} yanlislar={cevaplar.filter((x) => !x.ok).map((x) => x.k)}
      tekrar={() => setAsama("kur")} cik={cik}
      ek={<Levha><Etiket>Cevap anahtarı</Etiket>
        <div style={{ display: "grid", gap: 7 }}>
          {cevaplar.map((c, j) => (
            <div key={j} style={{ display: "flex", gap: S.sm, alignItems: "baseline", ...T.xs,
              paddingBottom: 6, borderBottom: j < cevaplar.length - 1 ? `1px dashed ${C.cizgi}` : "none" }}>
              {c.ok ? <Check size={12} style={{ color: C.zumrut, flexShrink: 0 }} /> : <X size={12} style={{ color: C.lal, flexShrink: 0 }} />}
              <span style={{ fontFamily: T.kalem, color: C.murekkep, minWidth: 100 }}>{c.k.w}</span>
              <span style={{ color: C.murekkepAlt, flex: 1 }}>{c.k.tr}</span>
            </div>
          ))}
        </div></Levha>} />;
  }

  const q = sorular[i];
  return (
    <div>
      <OturumUst i={i} n={sorular.length} baslik="Kontrol · geri bildirim yok" cik={cik} />
      <Cetvel sikilik="genis">
        <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: S.sm }}>{q.s.soru}</div>
        <div style={{ fontFamily: T.govde, fontSize: 19, lineHeight: 1.7, color: C.murekkep }}>{q.s.metin}</div>
      </Cetvel>
      {q.tip === "secim" ? (
        <div style={{ display: "grid", gap: 6, marginTop: S.md }}>
          {q.s.secenekler.map((o) => (
            <div key={o.id} onClick={() => cevapla(o.id)}
              style={{ border: `1px solid ${C.cizgi}`, background: C.muhre, borderRadius: 14, padding: S.md,
                cursor: "pointer", fontFamily: T.kalem, fontSize: 16.5, color: C.murekkep }}>{o.t}</div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Satir deger={girdi} degistir={setGirdi} ipucu="Cevabını yaz…" gonder={() => cevapla(girdi)}
            style={{ fontFamily: T.kalem, fontSize: 18, textAlign: "center" }} />
          <Dugme tikla={() => cevapla(girdi)} pasif={!girdi.trim()} tam>Gönder</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 11. Şimşek ──────────────────────────────────────────────────── */

export function SimsekYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
  const [durum, setDurum] = useState("hazir");
  const [kalan, setKalan] = useState(60);
  const [puan, setPuan] = useState(0);
  const [kat, setKat] = useState(1);
  const [cift, setCift] = useState(null);
  const [flas, setFlas] = useState(null);
  const [yanlislar, setYanlislar] = useState([]);
  const [sayim, setSayim] = useState({ d: 0, t: 0 });

  const yeniCift = useCallback(() => {
    const a = rastgele(kelimeler);
    const dogruMu = Math.random() < 0.5;
    const b = dogruMu ? a : rastgele(celdiriciler(a, kelimeler, 3));
    setCift({ k: a, gosterilenTr: b.tr, dogruMu, esId: b.id });
  }, [kelimeler]);

  useEffect(() => {
    if (durum !== "oyun") return;
    const t = setInterval(() => setKalan((s) => {
      if (s <= 1) { clearInterval(t); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [durum]);

  useEffect(() => {
    if (durum === "oyun" && kalan === 0) {
      if (rekorKaydet && (enIyi == null || puan > enIyi)) rekorKaydet(puan);
      setDurum("bitti");
    }
  }, [kalan, durum]);

  function basla() { setPuan(0); setKat(1); setKalan(60); setYanlislar([]); setSayim({ d: 0, t: 0 }); setDurum("oyun"); yeniCift(); }

  function karar(dedi) {
    if (!cift || durum !== "oyun") return;
    const ok = dedi === cift.dogruMu;
    kaydet(cift.k.id, ok);
    setSayim((s) => ({ d: s.d + (ok ? 1 : 0), t: s.t + 1 }));
    if (ok) {
      const k2 = Math.min(5, kat + 0.5);
      setPuan((p) => p + Math.round(10 * kat)); setKat(k2); titre(8);
      setFlas("ok");
    } else {
      setKat(1); setYanlislar((y) => (y.some((x) => x.id === cift.k.id) ? y : [...y, cift.k])); titre(22);
      setFlas("hata");
    }
    setTimeout(() => setFlas(null), 260);
    yeniCift();
  }

  if (durum === "hazir") return (
    <div>
      <OturumUst i={0} n={0} baslik="Şimşek" cik={cik} />
      <Cetvel sikilik="genis" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: S.md }}><Zap size={34} style={{ color: C.altin }} /></div>
        <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.lg }}>
          Altmış saniye. Ekranda bir İngilizce kelime ve bir Türkçe karşılık görürsün: eşleşiyor mu, eşleşmiyor mu?
          Üst üste doğru bildikçe çarpan büyür.
        </div>
        {enIyi != null && <div style={{ ...T.xs, color: C.murekkepSis, marginBottom: S.md }}>Rekorun: {enIyi} puan</div>}
        <Dugme tur="altin" tikla={basla} tam>Başla</Dugme>
      </Cetvel>
    </div>
  );

  if (durum === "bitti") return <SonucEkrani dogru={sayim.d} toplam={sayim.t} yanlislar={yanlislar}
    enIyi={enIyi} yeniRekor={enIyi == null || puan > enIyi} tekrar={basla} cik={cik}
    ek={<Cetvel style={{ textAlign: "center" }}><Etiket renk={C.altin}>Puan</Etiket>
      <div style={{ fontFamily: T.hat, fontSize: 40, color: C.altin, ...T.rakam }}>{puan}</div></Cetvel>} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={13} /> Çık</Dugme>
        <span style={{ flex: 1 }} />
        <Nisan renk={kat > 1 ? C.altin : C.murekkepSis} dolu={kat > 2}>×{kat.toFixed(1)}</Nisan>
        <Nisan renk={C.zumrut}>{puan}</Nisan>
        <Nisan renk={kalan < 11 ? C.lal : C.murekkepAlt} zemin={kalan < 11 ? C.lalSis : undefined}><Clock size={10} /> {kalan}</Nisan>
      </div>
      <Cubuk deger={(kalan / 60) * 100} boy={3} renk={kalan < 11 ? C.lal : C.altin} />
      <Cetvel sikilik="genis" style={{ marginTop: S.md, minHeight: 190,
        background: flas === "ok" ? C.zumSis : flas === "hata" ? C.lalSis : C.muhre,
        transition: "background .18s" }}>
        <div style={{ textAlign: "center", padding: `${S.lg}px 0` }}>
          <div style={{ fontFamily: T.kalem, fontSize: 27, color: C.murekkep, marginBottom: S.md }}>{cift.k.w}</div>
          <div style={{ width: 34, height: 1, background: C.cizgi, margin: "0 auto", marginBottom: S.md }} />
          <div style={{ fontFamily: T.govde, fontSize: 21, color: C.altin }}>{cift.gosterilenTr}</div>
        </div>
      </Cetvel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.sm, marginTop: S.md }}>
        <Dugme tur="tehlike" tikla={() => karar(false)} style={{ padding: "16px 18px", fontSize: 18 }}>Eşleşmiyor</Dugme>
        <Dugme tur="altin" tikla={() => karar(true)} style={{ padding: "16px 18px", fontSize: 18 }}>Eşleşiyor</Dugme>
      </div>
    </div>
  );
}

/* ─── 12. Eşleştir ────────────────────────────────────────────────── */

export function EslestirYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
  const [tur, setTur] = useState(0);
  const [kart, setKart] = useState([]);
  const [secili, setSecili] = useState(null);
  const [gitti, setGitti] = useState(new Set());
  const [hata, setHata] = useState(null);
  const [bas, setBas] = useState(0);
  const [bitti, setBitti] = useState(false);
  const [sure, setSure] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);

  const dagit = useCallback(() => {
    const sec = karistir(kelimeler).slice(0, 6);
    setKart(karistir(sec.flatMap((k) => [{ uid: k.id + "_w", id: k.id, t: k.w, yon: "w" }, { uid: k.id + "_t", id: k.id, t: k.tr, yon: "t" }])));
    setGitti(new Set()); setSecili(null); setHata(null); setBas(Date.now()); setBitti(false); setYanlislar([]);
  }, [kelimeler]);

  useEffect(() => { dagit(); }, []);
  useEffect(() => {
    if (bitti || !bas) return;
    const t = setInterval(() => setSure(Math.round((Date.now() - bas) / 1000)), 500);
    return () => clearInterval(t);
  }, [bas, bitti]);

  function dokun(k) {
    if (gitti.has(k.id) || hata) return;
    if (!secili) { setSecili(k); titre(5); return; }
    if (secili.uid === k.uid) { setSecili(null); return; }
    if (secili.id === k.id && secili.yon !== k.yon) {
      const y = new Set(gitti); y.add(k.id); setGitti(y); setSecili(null);
      kaydet(k.id, true); titre(10);
      kivilcim(innerWidth / 2, innerHeight * 0.45, C.zumrut, 12);
      if (y.size === 6) {
        const s = Math.round((Date.now() - bas) / 1000);
        setSure(s); setBitti(true);
        if (rekorKaydet && (enIyi == null || s < enIyi)) rekorKaydet(s);
        konfeti(120);
      }
    } else {
      setHata([secili.uid, k.uid]); titre(20);
      const kl = kelime(k.id); if (kl && !yanlislar.some((x) => x.id === kl.id)) setYanlislar((w) => [...w, kl]);
      kaydet(secili.id, false);
      setTimeout(() => { setHata(null); setSecili(null); }, 520);
    }
  }

  if (kelimeler.length < 6) return <Bos baslik="En az altı kelime gerek" aciklama="Bu durakta yeterli kelime yok. Bütün hattı ya da başka bir durağı seç." eylem={cik} eylemAd="Geri dön" />;

  if (bitti) return <SonucEkrani dogru={6} toplam={6} sure={sure} enIyi={enIyi}
    yeniRekor={enIyi == null || sure < enIyi} yanlislar={yanlislar}
    tekrar={() => { setTur(tur + 1); dagit(); }} cik={cik}
    ek={<Cetvel style={{ textAlign: "center" }}><Etiket renk={C.altin}>Süre</Etiket>
      <div style={{ fontFamily: T.hat, fontSize: 38, color: C.altin, ...T.rakam }}>{sure} sn</div>
      {enIyi != null && <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 5 }}>En iyin {enIyi} sn</div>}</Cetvel>} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={13} /> Çık</Dugme>
        <span style={{ ...T.cap, color: C.murekkepSis }}>Eşleştir</span>
        <span style={{ flex: 1 }} />
        <Nisan kucuk>{gitti.size} / 6</Nisan>
        <Nisan kucuk renk={C.murekkepAlt}><Clock size={10} /> {sure} sn</Nisan>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {kart.map((k) => {
          const yok = gitti.has(k.id);
          const sec = secili && secili.uid === k.uid;
          const hat = hata && hata.includes(k.uid);
          return (
            <button key={k.uid} onClick={() => dokun(k)} disabled={yok}
              style={{ minHeight: 64, padding: S.sm, borderRadius: 14, cursor: yok ? "default" : "pointer",
                border: `1px solid ${hat ? C.lal : sec ? C.altin : yok ? C.zumrut : C.cizgi}`,
                background: hat ? C.lalSis : sec ? C.altinSis : yok ? C.zumSis : C.muhre,
                opacity: yok ? 0.32 : 1, transition: "all .18s",
                transform: hat ? "translateX(-3px)" : "none",
                fontFamily: k.yon === "w" ? T.kalem : T.govde, fontSize: 16,
                color: C.murekkep, lineHeight: 1.4 }}>
              {k.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 13. Hafıza ──────────────────────────────────────────────────── */

export function HafizaYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
  const [kart, setKart] = useState([]);
  const [acik, setAcik] = useState([]);
  const [gitti, setGitti] = useState(new Set());
  const [hamle, setHamle] = useState(0);
  const [kilit, setKilit] = useState(false);
  const [bitti, setBitti] = useState(false);

  const dagit = useCallback(() => {
    const sec = karistir(kelimeler).slice(0, 6);
    setKart(karistir(sec.flatMap((k) => [{ uid: k.id + "_w", id: k.id, t: k.w, yon: "w" }, { uid: k.id + "_t", id: k.id, t: k.tr, yon: "t" }])));
    setAcik([]); setGitti(new Set()); setHamle(0); setKilit(false); setBitti(false);
  }, [kelimeler]);
  useEffect(() => { dagit(); }, []);

  function cevir(k) {
    if (kilit || gitti.has(k.id) || acik.some((a) => a.uid === k.uid)) return;
    const yeni = [...acik, k];
    setAcik(yeni); titre(6);
    if (yeni.length === 2) {
      setHamle((h) => h + 1); setKilit(true);
      if (yeni[0].id === yeni[1].id) {
        setTimeout(() => {
          const g = new Set(gitti); g.add(k.id); setGitti(g); setAcik([]); setKilit(false);
          kaydet(k.id, true); titre(12);
          if (g.size === 6) {
            setBitti(true);
            if (rekorKaydet && (enIyi == null || hamle + 1 < enIyi)) rekorKaydet(hamle + 1);
            konfeti(110);
          }
        }, 420);
      } else {
        kaydet(yeni[0].id, false);
        setTimeout(() => { setAcik([]); setKilit(false); }, 850);
      }
    }
  }

  if (kelimeler.length < 6) return <Bos baslik="En az altı kelime gerek" aciklama="Bu durakta yeterli kelime yok." eylem={cik} eylemAd="Geri dön" />;
  if (bitti) return <SonucEkrani dogru={6} toplam={6} enIyi={enIyi} yeniRekor={enIyi == null || hamle < enIyi}
    tekrar={dagit} cik={cik}
    ek={<Cetvel style={{ textAlign: "center" }}><Etiket renk={C.altin}>Hamle</Etiket>
      <div style={{ fontFamily: T.hat, fontSize: 38, color: C.altin, ...T.rakam }}>{hamle}</div>
      <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 5 }}>En az 6 hamleyle bitirilebilir{enIyi != null ? ` · en iyin ${enIyi}` : ""}</div></Cetvel>} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={13} /> Çık</Dugme>
        <span style={{ ...T.cap, color: C.murekkepSis }}>Hafıza</span>
        <span style={{ flex: 1 }} />
        <Nisan kucuk>{gitti.size} / 6 çift</Nisan>
        <Nisan kucuk renk={C.murekkepAlt}>{hamle} hamle</Nisan>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
        {kart.map((k) => {
          const yok = gitti.has(k.id);
          const ac = yok || acik.some((a) => a.uid === k.uid);
          return (
            <button key={k.uid} onClick={() => cevir(k)} disabled={yok}
              style={{ aspectRatio: "3/4", padding: 6, borderRadius: 14, cursor: yok ? "default" : "pointer",
                border: `1px solid ${yok ? C.zumrut : ac ? C.altin : C.cetvel}`,
                background: yok ? C.zumSis : ac ? C.muhre : C.kagitAlt,
                opacity: yok ? 0.36 : 1, transition: "all .25s",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: k.yon === "w" ? T.kalem : T.govde, fontSize: 14,
                color: C.murekkep, lineHeight: 1.35, textAlign: "center" }}>
              {ac ? k.t : <Gul boy={20} renk={C.cetvel} opak={0.45} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 14. Son vapur ───────────────────────────────────────────────── */

export function VapurYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
  const [durum, setDurum] = useState("hazir");
  const [can, setCan] = useState(3);
  const [puan, setPuan] = useState(0);
  const [seviye, setSeviye] = useState(1);
  const [dalga, setDalga] = useState(null);
  const [konum, setKonum] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [sayim, setSayim] = useState({ d: 0, t: 0 });
  const ref = useRef(null);

  const yeniDalga = useCallback(() => {
    const hedef = rastgele(kelimeler);
    const c = celdiriciler(hedef, kelimeler, 2);
    setDalga({ hedef, vapurlar: karistir([hedef, ...c]) });
    setKonum(0);
  }, [kelimeler]);

  useEffect(() => {
    if (durum !== "oyun" || !dalga) return;
    const hiz = 0.42 + seviye * 0.16;
    ref.current = setInterval(() => {
      setKonum((k) => {
        if (k >= 100) { kacirdi(); return 0; }
        return k + hiz;
      });
    }, 30);
    return () => clearInterval(ref.current);
  }, [durum, dalga, seviye]);

  function kacirdi() {
    clearInterval(ref.current);
    const yeniCan = can - 1;
    setCan(yeniCan); titre(28);
    setSayim((s) => ({ ...s, t: s.t + 1 }));
    if (dalga) {
      kaydet(dalga.hedef.id, false);
      setYanlislar((y) => (y.some((x) => x.id === dalga.hedef.id) ? y : [...y, dalga.hedef]));
    }
    if (yeniCan <= 0) { bitir(); } else yeniDalga();
  }

  function bitir() {
    clearInterval(ref.current);
    if (rekorKaydet && (enIyi == null || puan > enIyi)) rekorKaydet(puan);
    setDurum("bitti");
  }

  function bin(k) {
    if (durum !== "oyun" || !dalga) return;
    clearInterval(ref.current);
    const ok = k.id === dalga.hedef.id;
    kaydet(dalga.hedef.id, ok);
    setSayim((s) => ({ d: s.d + (ok ? 1 : 0), t: s.t + 1 }));
    if (ok) {
      const kazanc = Math.round(10 + (100 - konum) / 6);
      setPuan((p) => p + kazanc); titre(10);
      kivilcim(innerWidth / 2, innerHeight * 0.4, C.zumrut, 14);
      if ((sayim.d + 1) % 5 === 0) setSeviye((s) => Math.min(8, s + 1));
      yeniDalga();
    } else {
      const yeniCan = can - 1; setCan(yeniCan); titre(28);
      setYanlislar((y) => (y.some((x) => x.id === dalga.hedef.id) ? y : [...y, dalga.hedef]));
      if (yeniCan <= 0) bitir(); else yeniDalga();
    }
  }

  function basla() { setCan(3); setPuan(0); setSeviye(1); setYanlislar([]); setSayim({ d: 0, t: 0 }); setDurum("oyun"); yeniDalga(); }

  if (durum === "hazir") return (
    <div>
      <OturumUst i={0} n={0} baslik="Son vapur" cik={cik} />
      <Cetvel sikilik="genis" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 34, marginBottom: S.sm }}>⛴</div>
        <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep, marginBottom: S.lg }}>
          Türkçe karşılığı ekranda. Doğru İngilizce kelimeyi taşıyan vapuru, iskeleden ayrılmadan yakala.
          Üç hakkın var ve vapurlar giderek hızlanır.
        </div>
        {enIyi != null && <div style={{ ...T.xs, color: C.murekkepSis, marginBottom: S.md }}>Rekorun: {enIyi} puan</div>}
        <Dugme tur="altin" tikla={basla} tam>Başla</Dugme>
      </Cetvel>
    </div>
  );

  if (durum === "bitti") return <SonucEkrani dogru={sayim.d} toplam={sayim.t} yanlislar={yanlislar}
    enIyi={enIyi} yeniRekor={enIyi == null || puan > enIyi} tekrar={basla} cik={cik}
    ek={<Cetvel style={{ textAlign: "center" }}><Etiket renk={C.altin}>Puan</Etiket>
      <div style={{ fontFamily: T.hat, fontSize: 40, color: C.altin, ...T.rakam }}>{puan}</div>
      <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 5 }}>{seviye}. seviyeye ulaştın</div></Cetvel>} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={13} /> Çık</Dugme>
        <span style={{ flex: 1 }} />
        <span style={{ letterSpacing: 2, fontSize: 15.5 }}>{"♥".repeat(can)}<span style={{ opacity: .22 }}>{"♥".repeat(3 - can)}</span></span>
        <Nisan kucuk renk={C.zumrut}>{puan}</Nisan>
        <Nisan kucuk renk={C.murekkepAlt}>sv {seviye}</Nisan>
      </div>
      <Cetvel sikilik="dar">
        <div style={{ textAlign: "center", padding: `${S.md}px 0 ${S.lg}px` }}>
          <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 7 }}>Hangi vapur?</div>
          <div style={{ fontFamily: T.govde, fontSize: 23, color: C.altin }}>{dalga.hedef.tr}</div>
        </div>
        <div style={{ position: "relative", height: 5, background: C.kagitDerin, borderRadius: 14, overflow: "hidden", marginBottom: S.md }}>
          <div style={{ width: `${100 - konum}%`, height: "100%", background: konum > 72 ? C.lal : C.zumrut, transition: "width .04s linear" }} />
        </div>
        <div style={{ display: "grid", gap: 7 }}>
          {dalga.vapurlar.map((v) => (
            <button key={v.id} onClick={() => bin(v)}
              style={{ padding: `${S.md}px ${S.md}px`, border: `1px solid ${C.cetvel}`, background: C.muhre,
                borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: S.sm,
                fontFamily: T.kalem, fontSize: 17, color: C.murekkep,
                transform: `translateX(${(konum / 100) * 7}px)`, transition: "transform .05s linear" }}>
              <span style={{ fontSize: 16, opacity: .55 }}>⛴</span>{v.w}
            </button>
          ))}
        </div>
      </Cetvel>
    </div>
  );
}

/* ─── 16. Telaffuz ────────────────────────────────────────────────── */

export function TelaffuzYolu({ kelimeler, kaydet, cik }) {
  const [destek, setDestek] = useState(null);
  const [liste] = useState(() => karistir(kelimeler).slice(0, 12));
  const [i, setI] = useState(0);
  const [durum, setDurum] = useState("bekle");
  const [duyulan, setDuyulan] = useState("");
  const [geri, setGeri] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [sonuc, setSonuc] = useState(false);
  const tanima = useRef(null);
  const k = liste[i];

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setDestek(!!SR);
    if (!SR) return;
    const t = new SR();
    t.lang = "en-GB"; t.continuous = false; t.interimResults = false; t.maxAlternatives = 3;
    t.onresult = (e) => {
      const se = [...e.results[0]].map((r) => r.transcript);
      setDuyulan(se[0] || "");
      const ok = se.some((s) => kelimeEsit(s, k.w).ok);
      kaydet(k.id, ok);
      if (ok) { setDogru((d) => d + 1); titre(12); } else setYanlislar((y) => [...y, k]);
      setGeri({ ok, se });
      setDurum("bekle");
    };
    t.onerror = (e) => { setDurum("bekle"); setGeri({ hata: e.error === "not-allowed" ? "Mikrofon izni verilmedi." : "Duyamadım, tekrar dene." }); };
    t.onend = () => setDurum((d) => (d === "dinle" ? "bekle" : d));
    tanima.current = t;
    return () => { try { t.stop(); } catch {} };
  }, [i, k && k.id]);

  if (destek === false) return <Bos baslik="Tarayıcı desteklemiyor"
    aciklama="Konuşma tanıma bu tarayıcıda yok. Chrome ya da Edge'de dene; başka yollar çalışmaya devam ediyor." eylem={cik} eylemAd="Geri dön" />;
  if (sonuc) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function dinle() {
    setGeri(null); setDuyulan("");
    try { tanima.current.start(); setDurum("dinle"); } catch { setDurum("bekle"); }
  }

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Telaffuz" cik={cik} />
      <Cetvel sikilik="genis" style={{ textAlign: "center" }}>
        <div style={{ fontFamily: T.kalem, fontSize: 30, color: C.murekkep, marginBottom: 7 }}>{k.w}</div>
        <div style={{ ...T.s, color: C.altin, marginBottom: S.md }}>{k.tr}</div>
        <Dugme tur="sessiz" kucuk tikla={() => seslendir(k.w, 0.8)} pasif={!sesVar()}>
          <Volume2 size={13} /> Önce dinle
        </Dugme>
        <div style={{ marginTop: S.lg }}>
          {durum === "dinle" ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 46 }}>
              {[0, 1, 2, 3, 4].map((j) => (
                <span key={j} style={{ width: 4, height: 12, background: C.lal, borderRadius: 14,
                  animation: `nvDalga 0.9s ${j * 0.12}s ease-in-out infinite` }} />
              ))}
            </div>
          ) : (
            <Dugme tur="altin" tikla={dinle} style={{ padding: "14px 28px" }}><Mic size={16} /> Söyle</Dugme>
          )}
        </div>
      </Cetvel>

      {geri && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          {geri.hata ? <Haber tur="hata">{geri.hata}</Haber> : (
            <Levha renk={geri.ok ? C.zumrut : C.lal}>
              <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 6 }}>Duyduğum</div>
              <div style={{ fontFamily: T.kalem, fontSize: 18, color: geri.ok ? C.zumrut : C.lal }}>{duyulan || "—"}</div>
              {!geri.ok && <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 7 }}>
                Hedef: {k.w}. Tanıma motoru aksanı her zaman doğru çözmez; bir kez daha dene.
              </div>}
            </Levha>
          )}
          <div style={{ display: "flex", gap: S.sm }}>
            <Dugme tur="ikincil" tikla={dinle} tam>Tekrar söyle</Dugme>
            <Dugme tikla={() => { if (i + 1 < liste.length) { setI(i + 1); setGeri(null); } else setSonuc(true); }} tam>
              {i + 1 < liste.length ? "Sonraki" : "Bitir"}
            </Dugme>
          </div>
        </div>
      )}
      <div style={{ marginTop: S.md, textAlign: "center" }}>
        <Dugme tur="sessiz" kucuk tikla={() => { if (i + 1 < liste.length) { setI(i + 1); setGeri(null); } else setSonuc(true); }}>Atla</Dugme>
      </div>
    </div>
  );
}

/* ─── 17. Eşdizim ─────────────────────────────────────────────────── */

export function EsdizimYolu({ kelimeler, kaydet, cik }) {
  const uygun = useMemo(() => kelimeler.filter((k) => k.esdizim && k.esdizim.split(" ").length >= 2), [kelimeler]);
  const [liste] = useState(() => karistir(uygun).slice(0, 16));
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [yanlislar, setYanlislar] = useState([]);
  const [sonuc, setSonuc] = useState(false);
  const k = liste[i];

  const soru = useMemo(() => {
    if (!k) return null;
    const c = celdiriciler(k, uygun.length > 4 ? uygun : KELIMELER, 3);
    return { metin: (gizle(k.w, k.esdizim) || { metin: k.esdizim }).metin,
      secenekler: karistir([k, ...c].map((x) => ({ id: x.id, t: x.w }))), dogruId: k.id };
  }, [k && k.id]);

  if (!liste.length) return <Bos baslik="Uygun eşdizim yok" aciklama="Bu durakta eşdizim çalışacak kelime bulunmuyor." eylem={cik} eylemAd="Geri dön" />;
  if (sonuc) return <SonucEkrani dogru={dogru} toplam={liste.length} yanlislar={yanlislar} cik={cik} />;

  function sec(id) {
    if (secim) return;
    const ok = id === soru.dogruId;
    kaydet(k.id, ok);
    if (ok) { setDogru((d) => d + 1); titre(9); } else setYanlislar((y) => [...y, k]);
    setSecim(id);
  }

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={dogru} baslik="Eşdizim" cik={cik} />
      <Cetvel sikilik="genis">
        <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: S.sm }}>Bu kalıpta boşluğa ne gelir?</div>
        <div style={{ fontFamily: T.kalem, fontSize: 21, lineHeight: 1.7, color: C.murekkep }}>{soru.metin}</div>
        <div style={{ ...T.xs, color: C.altin, marginTop: 9 }}>{k.tr}</div>
      </Cetvel>
      <div style={{ display: "grid", gap: 6, marginTop: S.md }}>
        {soru.secenekler.map((o) => {
          const secildi = secim === o.id, dogruSec = secim && o.id === soru.dogruId;
          return (
            <div key={o.id} onClick={() => sec(o.id)}
              style={{ border: `1px solid ${secim ? (dogruSec ? C.zumrut : secildi ? C.lal : C.cizgi) : C.cizgi}`,
                background: secim && dogruSec ? C.zumSis : secim && secildi ? C.lalSis : C.muhre,
                borderRadius: 14, padding: S.md, cursor: secim ? "default" : "pointer",
                fontFamily: T.kalem, fontSize: 16.5, color: C.murekkep }}>{o.t}</div>
          );
        })}
      </div>
      {secim && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha style={{ background: C.kagitAlt }}>
            <div style={{ fontFamily: T.kalem, fontSize: 17, color: C.zumrut, marginBottom: 7 }}>{k.esdizim}</div>
            <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.murekkepAlt, lineHeight: 1.8 }}>{k.ornek}</div>
          </Levha>
          <Dugme tikla={() => { if (i + 1 < liste.length) { setI(i + 1); setSecim(null); } else setSonuc(true); }} tam>
            {i + 1 < liste.length ? "Sonraki" : "Turu bitir"}
          </Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 10-15-18. Yapay zekâ destekli yollar ────────────────────────── */

export function YapayYolu({ yol, kelimeler, kaydet, cik, hataEkle }) {
  const [liste] = useState(() => karistir(kelimeler).slice(0, 10));
  const [i, setI] = useState(0);
  const [cevap, setCevap] = useState("");
  const [rapor, setRapor] = useState(null);
  const [yuklu, setYuklu] = useState(false);
  const [hataM, setHataM] = useState(null);
  const [dogru, setDogru] = useState(0);
  const [sonuc, setSonuc] = useState(false);
  const [kokVeri, setKokVeri] = useState(null);
  const k = liste[i];

  const baslik = yol === "parafraz" ? "Parafraz" : yol === "baglam" ? "Bağ kur" : "Kökten dal";

  useEffect(() => { setKokVeri(null); setRapor(null); setCevap(""); setHataM(null); }, [i, yol]);

  useEffect(() => {
    if (yol !== "koken" || !k || kokVeri || yuklu) return;
    (async () => {
      setYuklu(true);
      try {
        const j = await sorJSON(`${ZEMIN}

"${k.w}" (${k.tr}) kelimesinin aynı kökten türeyen biçimlerini çıkar.

YALNIZCA şu JSON'u döndür:
{"kok":"ortak kök","dallar":[{"w":"biçim","pos":"n|v|adj|adv","tr":"Türkçe karşılığı","ornek":"kısa İngilizce örnek cümle"}],"not":"bu kök ailesinde IB yazımında en işe yarayan biçim hangisi ve neden, tek cümle"}
dallar dizisinde 3-5 biçim olsun; verilen kelimenin kendisi de dahil.`, 1100);
        setKokVeri(j);
      } catch { setHataM("Kök ailesi getirilemedi."); }
      setYuklu(false);
    })();
  }, [yol, k && k.id, kokVeri]);

  async function gonder() {
    if (!cevap.trim()) return;
    setYuklu(true); setHataM(null);
    try {
      const istek = yol === "parafraz"
        ? `Öğrenci bir cümleyi hedef kelimeyi kullanarak yeniden kurmalıydı.
Özgün cümle: ${k.ornek}
Hedef kelime: ${k.w} (${k.tr})
Öğrencinin parafrazı: ${cevap}

Parafraz anlamı koruyor mu, hedef kelimeyi doğru kullanmış mı, dilbilgisi doğru mu? Üslup tercihini hata sayma.`
        : `Öğrenci yeni öğrendiği bir kelimeyle kendi cümlesini kurdu.
Kelime: ${k.w} (${k.tr}) — ${turYaz(k.pos)}
Eşdizim: ${k.esdizim}
Öğrencinin cümlesi: ${cevap}

Kelime doğru anlamda ve doğru dilbilgisiyle mi kullanılmış? Cümle doğal mı?`;
      const j = await sorJSON(`${ZEMIN}

${istek}

YALNIZCA şu JSON'u döndür:
{"kabul":true,"hatalar":[{"parca":"...","duzeltme":"...","sebep":"tek cümle","l1":true,"maliyet":3}],"gelistirilmis":"öğrencinin cümlesinin daha doğal ve akademik hâli","not":"tek cümle, doğrudan değerlendirme"}`, 1200);
      const ok = !!j.kabul && (j.hatalar || []).length === 0;
      kaydet(k.id, ok);
      if (ok) { setDogru((d) => d + 1); titre(12); }
      (j.hatalar || []).forEach((h) => hataEkle && hataEkle({
        hataliMetin: h.parca, dogruMetin: h.duzeltme, dugumId: null, dugumAdi: k.w, aile: null,
        hataTuru: "yanlis-secim", l1Kaynakli: !!h.l1, maliyet: h.maliyet || 3,
        kaynak: "dagarcik", baglam: `${baslik} · ${k.w}`, aciklama: h.sebep
      }));
      setRapor(j);
    } catch { setHataM("Değerlendirme alınamadı. Tekrar dene."); }
    setYuklu(false);
  }

  if (sonuc) return <SonucEkrani dogru={dogru} toplam={liste.length} cik={cik} />;

  return (
    <div>
      <OturumUst i={i} n={liste.length} skor={yol === "koken" ? null : dogru} baslik={baslik} cik={cik} />

      {yol === "koken" ? (
        <>
          <Cetvel sikilik="genis">
            <KelimeBasligi k={k} sesli />
            <div style={{ marginTop: S.md, fontFamily: T.govde, fontSize: 18, color: C.altin }}>{k.tr}</div>
            {yuklu && <Bekle asamalar={["Kök aranıyor…", "Türevler çıkarılıyor…"]} />}
            {kokVeri && (
              <div style={{ marginTop: S.lg }}>
                <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md }}>
                  <Gul boy={14} />
                  <span style={{ ...T.cap, color: C.altin }}>kök · {kokVeri.kok}</span>
                </div>
                <div style={{ display: "grid", gap: S.sm }}>
                  {(kokVeri.dallar || []).map((d, j) => (
                    <Levha key={j} ic={S.md} renk={d.w.toLowerCase() === k.w.toLowerCase() ? C.altin : C.cizgi}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: T.kalem, fontSize: 17, color: C.murekkep }}>{d.w}</span>
                        <Nisan kucuk renk={C.murekkepSis}>{turYaz(d.pos)}</Nisan>
                        <span style={{ ...T.s, color: C.altin }}>{d.tr}</span>
                      </div>
                      <div style={{ fontFamily: T.kalem, fontSize: 14, color: C.murekkepAlt, marginTop: 6, lineHeight: 1.7 }}>{d.ornek}</div>
                    </Levha>
                  ))}
                </div>
                {kokVeri.not && <div style={{ marginTop: S.md }}><Haber tur="bilgi">{kokVeri.not}</Haber></div>}
              </div>
            )}
            {hataM && <div style={{ marginTop: S.md }}><Haber tur="hata">{hataM}</Haber></div>}
          </Cetvel>
          <div style={{ marginTop: S.md }}>
            <Dugme tikla={() => { kaydet(k.id, true); if (i + 1 < liste.length) setI(i + 1); else setSonuc(true); }} tam>
              {i + 1 < liste.length ? "Sonraki kök" : "Bitir"}
            </Dugme>
          </div>
        </>
      ) : (
        <>
          <Cetvel sikilik="genis">
            <KelimeBasligi k={k} sesli />
            <div style={{ marginTop: S.md, fontFamily: T.govde, fontSize: 18, color: C.altin }}>{k.tr}</div>
            <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}` }}>
              <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 6 }}>
                {yol === "parafraz" ? "Bu cümleyi aynı anlamda yeniden kur" : "Örnek"}
              </div>
              <div style={{ fontFamily: T.kalem, fontSize: 16, color: C.murekkepAlt, lineHeight: 1.8 }}>{k.ornek}</div>
              <div style={{ ...T.xs, color: C.altin, marginTop: 7, fontFamily: T.kalem }}>{k.esdizim}</div>
            </div>
          </Cetvel>

          {!rapor ? (
            <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
              <Alan deger={cevap} degistir={setCevap} satir={3}
                ipucu={yol === "parafraz" ? `"${k.w}" kelimesini kullanarak yeniden yaz…` : `"${k.w}" ile kendi cümleni kur…`} />
              {yuklu ? <Bekle asamalar={["Cümlen okunuyor…", "Kullanım kontrol ediliyor…"]} />
                : <Dugme tur="altin" tikla={gonder} pasif={!cevap.trim()} tam>Gönder</Dugme>}
              {hataM && <Haber tur="hata">{hataM}</Haber>}
            </div>
          ) : (
            <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
              <Haber tur={rapor.kabul && !(rapor.hatalar || []).length ? "iyi" : "bilgi"}>{rapor.not}</Haber>
              {(rapor.hatalar || []).length > 0 && (
                <Levha renk={C.lal}>
                  <Etiket renk={C.lal}>Düzeltmeler</Etiket>
                  {rapor.hatalar.map((h, j) => (
                    <div key={j} style={{ marginBottom: S.sm }}>
                      <div style={{ fontFamily: T.kalem, fontSize: 15 }}>
                        <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.parca}</span>
                        <ArrowRight size={11} style={{ margin: "0 6px", verticalAlign: -1, color: C.murekkepSis }} />
                        <span style={{ color: C.zumrut }}>{h.duzeltme}</span>
                      </div>
                      <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 3 }}>{h.sebep}</div>
                    </div>
                  ))}
                </Levha>
              )}
              {rapor.gelistirilmis && (
                <Levha style={{ background: C.kagitAlt }}>
                  <Etiket renk={C.zumrut}>Daha doğal hâli</Etiket>
                  <div style={{ fontFamily: T.kalem, fontSize: 16, color: C.murekkep, lineHeight: 1.8 }}>{rapor.gelistirilmis}</div>
                </Levha>
              )}
              <Dugme tikla={() => { if (i + 1 < liste.length) { setI(i + 1); } else setSonuc(true); }} tam>
                {i + 1 < liste.length ? "Sonraki" : "Bitir"}
              </Dugme>
            </div>
          )}
        </>
      )}
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════
   D A Ğ A R C I K   S E K M E S İ
   Beş tema beş hat; her konu bir durak. Durağı seç, yolu seç. ══════════ */

export function HatHaritasi({ dag, secili, sec, seciliDurak, secDurak }) {
  return (
    <div style={{ display: "grid", gap: S.sm }}>
      {HATLAR.map((h) => {
        const ilr = hatIlerleme(dag, h.id);
        const acik = secili === h.id;
        return (
          <div key={h.id} style={{ border: `1px solid ${acik ? h.renk : C.cizgi}`, borderRadius: 14,
            background: acik ? h.acik + "55" : C.muhre, overflow: "hidden", transition: "border-color .2s" }}>
            <div onClick={() => sec(acik ? null : h.id)}
              style={{ display: "flex", alignItems: "center", gap: S.md, padding: `${S.md}px ${S.md}px`, cursor: "pointer" }}>
              <span style={{ width: 30, height: 30, borderRadius: 99, background: h.renk, color: "#FFF9EC",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontFamily: T.hat, fontSize: 17, fontWeight: 720 }}>{h.no}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.govde, fontSize: 17.5, color: C.murekkep }}>{h.ad}</div>
                <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 2 }}>
                  {h.en} · {h.duraklar.length} durak · {ilr.toplam} kelime
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: T.hat, fontSize: 18, color: h.renk, ...T.rakam }}>%{ilr.oran}</div>
                <div style={{ ...T.xs, fontSize: 12, color: C.murekkepSis }}>{ilr.usta} usta</div>
              </div>
              <ChevronDown size={15} style={{ color: C.murekkepSis, flexShrink: 0,
                transform: acik ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </div>

            {acik && (
              <div style={{ borderTop: `1px dashed ${C.cizgi}`, padding: `${S.md}px ${S.md}px`, background: C.muhre }}>
                <div style={{ position: "relative", paddingLeft: 18 }}>
                  <div style={{ position: "absolute", left: 5, top: 10, bottom: 10, width: 2.5, background: h.renk, opacity: .32, borderRadius: 14 }} />
                  {h.duraklar.map(([did, dad]) => {
                    const p = durakIlerleme(dag, did);
                    const se = seciliDurak === did;
                    return (
                      <div key={did} onClick={() => secDurak(se ? null : did)}
                        style={{ position: "relative", display: "flex", alignItems: "center", gap: S.sm,
                          padding: "7px 8px", marginBottom: 3, borderRadius: 14, cursor: "pointer",
                          background: se ? h.acik : "transparent", border: `1px solid ${se ? h.renk : "transparent"}` }}>
                        <span style={{ position: "absolute", left: -16, width: 11, height: 11, borderRadius: 99,
                          background: p.usta === p.toplam && p.toplam ? h.renk : C.muhre,
                          border: `2.5px solid ${h.renk}`, boxSizing: "border-box" }} />
                        <span style={{ flex: 1, fontFamily: T.govde, fontSize: 16, color: C.murekkep }}>{dad}</span>
                        <span style={{ ...T.xs, fontSize: 12.5, color: C.murekkepSis, ...T.rakam }}>{p.usta}/{p.toplam}</span>
                        <span style={{ width: 34 }}><Cubuk deger={p.oran} renk={h.renk} boy={3.5} /></span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: S.sm }}>
                  <Dugme tur="sessiz" kucuk tikla={() => secDurak(seciliDurak === "HAT:" + h.id ? null : "HAT:" + h.id)}>
                    {seciliDurak === "HAT:" + h.id ? "✓ Bütün hat seçili" : "Bütün hattı çalış"}
                  </Dugme>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function YolSecimi({ sec, havuz, rekorlar }) {
  return (
    <div style={{ display: "grid", gap: S.lg }}>
      {YOL_OBEK.map((o) => {
        const yollar = YOLLAR.filter((y) => y.obek === o.id);
        return (
          <div key={o.id}>
            <Fasil ad={`${o.ad} · ${o.ac}`} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 7 }}>
              {yollar.map((y) => {
                const r = rekorlar[y.id];
                return (
                  <button key={y.id} onClick={() => sec(y.id)}
                    style={{ position: "relative", textAlign: "left", padding: `${S.md}px ${S.md}px 26px`, minHeight: 104,
                      fontFamily: T.govde, color: C.murekkep,
                      border: `1px solid ${C.cizgi}`, background: C.muhre, borderRadius: 14, cursor: "pointer",
                      overflow: "hidden", transition: "border-color .18s, box-shadow .18s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = o.renk; e.currentTarget.style.boxShadow = `0 2px 12px ${C.golge}55`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.cizgi; e.currentTarget.style.boxShadow = "none"; }}>
                    <span style={{ position: "absolute", right: 6, top: 6, width: 52, height: 42, opacity: .5 }}>
                      <YolDevinim tip={y.dev} renk={o.renk} />
                    </span>
                    <div style={{ fontFamily: T.govde, fontSize: 16.5, color: C.murekkep, marginBottom: 5, position: "relative" }}>{y.ad}</div>
                    <div style={{ ...T.xs, fontSize: 13, color: C.murekkepSis, lineHeight: 1.5, position: "relative", paddingRight: 44 }}>
                      {y.neden.split(".")[0]}.
                    </div>
                    {r != null && <div style={{ position: "absolute", left: S.md, bottom: 7, ...T.xs, fontSize: 12, color: o.renk }}>
                      en iyi {r}{y.id === "eslestir" ? " sn" : y.id === "hafiza" ? " hamle" : y.id === "kontrol" ? "%" : ""}
                    </div>}
                    {y.yapay && <span style={{ position: "absolute", right: S.md, bottom: 7, display: "inline-flex", alignItems: "center", gap: 3, ...T.xs, fontSize: 11.5, color: C.altin }}><Sparkles size={10} /> yapay zekâ</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Dagarcik({ dag, kelimeKaydet, rekorlar, rekorKaydet, hataEkle, oturumBitir, acilisDurak }) {
  const [hat, setHat] = useState(null);
  const [durak, setDurak] = useState(acilisDurak || null);
  const [yol, setYol] = useState(null);
  const [kapsam, setKapsam] = useState("durak");
  const [ara, setAra] = useState("");
  const [gorunum, setGorunum] = useState("hat");

  const vadesi = useMemo(() => vadesiGelenler(dag), [dag]);
  const zorlar = useMemo(() => zorKelimeler(dag), [dag]);
  const toplamUsta = useMemo(() => ustalasilanlar(dag).length, [dag]);
  const tahmin = useMemo(() => dagarcikTahmini(dag), [dag]);

  const havuz = useMemo(() => {
    if (kapsam === "vadesi") return vadesi;
    if (kapsam === "zor") return zorlar;
    if (kapsam === "hepsi") return KELIMELER;
    if (!durak) return [];
    if (String(durak).startsWith("HAT:")) return hattinKelimeleri(String(durak).slice(4));
    return duraginKelimeleri(durak);
  }, [kapsam, durak, dag, vadesi, zorlar]);

  const havuzAd = kapsam === "vadesi" ? "Bugünün tekrarları" : kapsam === "zor" ? "Zorlu kelimeler"
    : kapsam === "hepsi" ? "Bütün dağarcık"
    : durak ? (String(durak).startsWith("HAT:") ? (HATLAR.find((h) => h.id === String(durak).slice(4)) || {}).ad : DURAK_META[durak] && DURAK_META[durak].ad) : null;

  function kaydet(id, ok) {
    kelimeKaydet(id, ok);
  }
  function cik() {
    oturumBitir && oturumBitir({ tur: "dagarcik", yol, saniye: 420 });
    setYol(null);
  }

  /* Oturum açık */
  if (yol && havuz.length) {
    const ortak = { kelimeler: havuz, dag, kaydet, cik, hataEkle,
      enIyi: rekorlar[yol], rekorKaydet: (v) => rekorKaydet(yol, v) };
    const ekran =
      yol === "kesif" ? <KesifYolu {...ortak} /> :
      yol === "ogren" ? <OgrenYolu {...ortak} /> :
      (yol === "yaz" || yol === "bosluk" || yol === "dikte") ? <YazYolu yol={yol} {...ortak} /> :
      yol === "harf" ? <HarfYolu {...ortak} /> :
      (yol === "tanim" || yol === "esanlam") ? <SecimYolu yol={yol} {...ortak} /> :
      yol === "kontrol" ? <KontrolYolu {...ortak} /> :
      yol === "simsek" ? <SimsekYolu {...ortak} /> :
      yol === "eslestir" ? <EslestirYolu {...ortak} /> :
      yol === "hafiza" ? <HafizaYolu {...ortak} /> :
      yol === "vapur" ? <VapurYolu {...ortak} /> :
      yol === "telaffuz" ? <TelaffuzYolu {...ortak} /> :
      yol === "esdizim" ? <EsdizimYolu {...ortak} /> :
      <YapayYolu yol={yol} {...ortak} />;
    return <div>{ekran}</div>;
  }

  const aramaSonuc = ara.trim().length >= 2
    ? KELIMELER.filter((k) => (k.w + " " + k.tr).toLocaleLowerCase("tr").includes(ara.toLocaleLowerCase("tr"))).slice(0, 40)
    : null;

  return (
    <div>
      <Baslik ust="Kelime hazinesi" ad="Dağarcık"
        alt={`${KELIMELER.length} kelime, beş IB teması ve sınav dili. Her durak bir konu; on sekiz ayrı yoldan çalışılır.`}
        sag={<Halka deger={Math.min(100, Math.round((tahmin / KELIMELER.length) * 100))} boy={74} kalinlik={4} renk={C.altin}
          ic={<div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.hat, fontSize: 19, ...T.rakam, color: C.altin, lineHeight: 1 }}>{tahmin}</div>
            <div style={{ ...T.cap, fontSize: 7, color: C.murekkepSis, marginTop: 2 }}>kelime</div>
          </div>} />} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: S.sm, marginBottom: S.lg }}>
        <Olcu sayi={vadesi.length} ad="bugün tekrar" renk={vadesi.length ? C.altin : C.murekkepSis}
          tikla={() => { setKapsam("vadesi"); setGorunum("yol"); }} vurgu={vadesi.length > 0} />
        <Olcu sayi={toplamUsta} ad="ustalaşılan" renk={C.zumrut} />
        <Olcu sayi={ogrenilenler(dag).length} ad="öğrenmede" renk={C.lacivert} />
        <Olcu sayi={zorlar.length} ad="zorlu" renk={zorlar.length ? C.lal : C.murekkepSis}
          tikla={() => { if (zorlar.length) { setKapsam("zor"); setGorunum("yol"); } }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: S.sm, border: `1px solid ${C.cizgi}`,
        borderRadius: 14, padding: `${S.sm}px ${S.md}px`, background: C.muhre, marginBottom: S.md }}>
        <Search size={14} style={{ color: C.murekkepSis }} />
        <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Kelime ara — İngilizce ya da Türkçe…"
          style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: T.govde, fontSize: 16, color: C.murekkep }} />
        {ara && <X size={14} style={{ color: C.murekkepSis, cursor: "pointer" }} onClick={() => setAra("")} />}
      </div>

      {aramaSonuc ? (
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ ...T.cap, color: C.murekkepSis }}>{aramaSonuc.length} sonuç</div>
          {aramaSonuc.map((k) => {
            const s = dag[k.id];
            return (
              <Levha key={k.id} ic={S.md} renk={s && s.usta ? C.zumrut : s && s.kutu ? C.altin : C.cizgi}>
                <div style={{ display: "flex", alignItems: "baseline", gap: S.sm, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: T.kalem, fontSize: 17, color: C.murekkep }}>{k.w}</span>
                  <Nisan kucuk renk={SEVIYE_RENK[k.lv]}>{k.lv}</Nisan>
                  <span style={{ ...T.s, color: C.altin, flex: 1 }}>{k.tr}</span>
                  {sesVar() && <button onClick={() => seslendir(k.w)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.altin }}><Volume2 size={14} /></button>}
                </div>
                <div style={{ fontFamily: T.kalem, fontSize: 14, color: C.murekkepAlt, marginTop: 6, lineHeight: 1.7 }}>{k.ornek}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
                  <Nisan kucuk renk={DURAK_META[k.durak].renk}>{DURAK_META[k.durak].ad}</Nisan>
                  {s && s.kutu > 0 && <Nisan kucuk renk={C.murekkepSis}>kutu {s.kutu}/5</Nisan>}
                  {s && s.usta && <Nisan kucuk renk={C.zumrut} dolu>usta</Nisan>}
                </div>
              </Levha>
            );
          })}
        </div>
      ) : gorunum === "hat" ? (
        <>
          <Fasil ad="Hatlar ve duraklar" sag={havuz.length > 0 && durak
            ? <Dugme tur="altin" kucuk tikla={() => { setKapsam("durak"); setGorunum("yol"); }}>
                {havuz.length} kelime · Yol seç <ChevronRight size={12} />
              </Dugme> : null} />
          <HatHaritasi dag={dag} secili={hat} sec={setHat} seciliDurak={durak} secDurak={setDurak} />
          <div style={{ marginTop: S.lg, display: "flex", gap: S.sm, flexWrap: "wrap" }}>
            <Dugme tur="ikincil" kucuk tikla={() => { setKapsam("hepsi"); setGorunum("yol"); }}>Bütün dağarcıkla çalış</Dugme>
            {vadesi.length > 0 && <Dugme tur="altin" kucuk tikla={() => { setKapsam("vadesi"); setGorunum("yol"); }}>
              <RotateCcw size={12} /> {vadesi.length} tekrarı yap
            </Dugme>}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: S.md, flexWrap: "wrap" }}>
            <Dugme tur="sessiz" kucuk tikla={() => setGorunum("hat")}><ChevronLeft size={13} /> Hatlar</Dugme>
            <Nisan renk={C.altin} zemin={C.altinSis}>{havuzAd}</Nisan>
            <Nisan kucuk renk={C.murekkepSis}>{havuz.length} kelime</Nisan>
          </div>
          {havuz.length === 0
            ? <Bos baslik="Bu kapsamda kelime yok" aciklama="Başka bir durak ya da kapsam seç." eylem={() => setGorunum("hat")} eylemAd="Hatlara dön" />
            : <YolSecimi sec={setYol} havuz={havuz} rekorlar={rekorlar} />}
        </>
      )}
    </div>
  );
}

/* ══════════════════════ YAŞAYAN BAŞLIK ══════════════════════
   Gökyüzü günün saatine göre değişir, ay gerçek evresindedir,
   vapur geçer, pencereler akşam yanar. Açmanın kendisi bir şey
   olsun diye. ═══════════════════════════════════════════════ */

export function YasayanBaslik({ ad, dag, ustalik, hatalar, oturumlar, git }) {
  const [an, setAn] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAn(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const evre = gokEvresi(an);
  const G = GOKYUZU[evre];
  const acikMurekkep = G.murekkep === "light";
  const svg = useMemo(() => istanbulSVG(an), [evre, Math.floor(an.getHours())]);
  const saat = `${String(an.getHours()).padStart(2, "0")}:${String(an.getMinutes()).padStart(2, "0")}`;
  const vadesi = vadesiGelenler(dag).length;
  const tahmin = dagarcikTahmini(dag);
  const seri = seriHesapla(oturumlar);
  const n = useSayac(tahmin, 1200);

  return (
    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: S.lg,
      border: `1px solid ${C.cetvel}`, minHeight: 184 }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={{ position: "absolute", inset: 0, background: acikMurekkep
        ? "radial-gradient(ellipse 70% 60% at 18% 22%, rgba(8,14,34,.5), transparent 70%), radial-gradient(ellipse 40% 45% at 92% 18%, rgba(8,14,34,.38), transparent 70%), linear-gradient(180deg, rgba(8,14,34,.24) 0%, rgba(8,14,34,.04) 46%, rgba(8,14,34,.46) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,.3) 0%, rgba(255,255,255,0) 44%, rgba(20,31,42,.26) 100%)" }} />

      <div style={{ position: "relative", padding: `${S.lg}px ${S.lg}px`, display: "flex", flexDirection: "column", minHeight: 184 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: S.md }}>
          <div>
            <div style={{ fontFamily: T.hat, fontSize: "clamp(19px, 4.6vw, 25px)", fontWeight: 650, letterSpacing: "0.02em",
              color: acikMurekkep ? "#FDF8EC" : C.murekkep, textShadow: acikMurekkep ? "0 1px 10px rgba(0,0,0,.42)" : "0 1px 8px rgba(255,255,255,.6)" }}>
              {selamla(an, ad)}
            </div>
            <div style={{ ...T.xs, marginTop: 5, color: acikMurekkep ? "rgba(253,248,236,.82)" : C.murekkepAlt,
              textShadow: acikMurekkep ? "0 1px 7px rgba(0,0,0,.4)" : "none" }}>
              {trTarih(bugun())}{G.ay > 0 ? ` · ${ayAdi(an)}` : ""}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: T.hat, fontSize: "clamp(19px, 4.6vw, 25px)", ...T.rakam, letterSpacing: "-0.01em",
              color: acikMurekkep ? "#FDF8EC" : C.murekkep, textShadow: acikMurekkep ? "0 1px 10px rgba(0,0,0,.42)" : "none" }}>{saat}</div>
            {seri > 0 && (
              <div style={{ ...T.xs, fontSize: 13, marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4,
                color: acikMurekkep ? "#FFE0A0" : C.altin, textShadow: acikMurekkep ? "0 1px 7px rgba(0,0,0,.4)" : "none" }}>
                <Flame size={11} /> {seri} gün
              </div>
            )}
          </div>
        </div>

        <span style={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
          <div onClick={() => git && git("dagarcik")} style={{ cursor: "pointer",
            background: "rgba(253,248,236,.93)", border: `1px solid ${C.cetvel}`, borderRadius: 14,
            padding: "6px 11px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: T.hat, fontSize: 18, color: C.altin, ...T.rakam }}>{n}</span>
            <span style={{ ...T.cap, fontSize: 8.5, color: C.murekkepAlt }}>kelime</span>
          </div>
          {vadesi > 0 && (
            <div onClick={() => git && git("dagarcik")} style={{ cursor: "pointer",
              background: C.altin, borderRadius: 14, padding: "6px 11px", display: "flex", alignItems: "center", gap: 6,
              color: "#FFFBF0", ...T.xs, fontSize: 13.5, fontWeight: 600 }}>
              <RotateCcw size={11} /> {vadesi} tekrar bekliyor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ TANI SINAVI ══════════════════════ */

export function TaniSinavi({ bitir }) {
  const [adim, setAdim] = useState(0);
  const [ad, setAd] = useState("");
  const [i, setI] = useState(0);
  const [cevaplar, setCevaplar] = useState([]);
  const [secim, setSecim] = useState(null);

  if (adim === 0) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: `${S.xxxl}px ${S.lg}px` }}>
        <div style={{ textAlign: "center", marginBottom: S.xl }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: S.md }}><Gul boy={40} /></div>
          <div style={{ fontFamily: T.hat, ...T.d0, color: C.murekkep }}>NAHİV</div>
          <div style={{ ...T.cap, color: C.altin, marginTop: S.sm }}>sarf · nahiv</div>
        </div>
        <Serlevha />
        <div style={{ fontFamily: T.govde, ...T.m, color: C.murekkepAlt, margin: `${S.xl}px 0` }}>
          Bu bir İngilizce kursu değil. Türkçe konuşan birinin İngilizce üretirken yaptığı hataları
          teşhis eden, kaynağına kadar izleyen ve tekrarlanmasını engelleyen bir sistem.
          <br /><br />
          Senin hataların rastgele değil. Türkçede artikel yok, hâl ekleri edatların işini görüyor,
          ilgi cümlesi isimden önce geliyor. Bunlar öngörülebilir hatalar üretir — ve öngörülebilir olan
          şey avlanabilir.
          <br /><br />
          Önce otuz dört soruluk bir tanı sınavı. Amacı seni puanlamak değil, on dört gramer
          ailesindeki zayıf noktalarını haritalamak. Tahmin etme; bilmiyorsan bilmediğini göster,
          sistem daha isabetli kurulur.
        </div>
        <Satir deger={ad} degistir={setAd} ipucu="Adın" style={{ textAlign: "center", fontSize: 17, marginBottom: S.md }} />
        <Dugme tur="altin" tam tikla={() => setAdim(1)}>Tanı sınavına başla</Dugme>
        <div style={{ ...T.cap, color: C.murekkepSis, marginTop: S.md, textAlign: "center" }}>yaklaşık on iki dakika</div>
      </div>
    );
  }

  const s = TANI[i];
  if (i >= TANI.length) {
    const harita = {};
    cevaplar.forEach((c) => {
      const k = harita[c.d] || { dogru: 0, toplam: 0 };
      k.dogru += c.dogruMu ? 1 : 0; k.toplam += 1; harita[c.d] = k;
    });
    const ustalik = {};
    Object.entries(harita).forEach(([id, v]) => {
      ustalik[id] = { ...BOS_KAYIT, puan: Math.round((v.dogru / v.toplam) * 55), dogru: v.dogru,
        yanlis: v.toplam - v.dogru, basamak: v.dogru === v.toplam ? 2 : 1, sonGorulme: bugun(), gecmis: [] };
    });
    const yanlislar = cevaplar.filter((c) => !c.dogruMu);
    const zayifAileler = {};
    yanlislar.forEach((c) => { const d = dugum(c.d); if (d) zayifAileler[d.a] = (zayifAileler[d.a] || 0) + 1; });
    const sirali = Object.entries(zayifAileler).sort((a, b) => b[1] - a[1]).slice(0, 4);

    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: `${S.xl}px ${S.lg}px` }}>
        <Baslik ust="Tanı tamamlandı" ad="Haritan çıkarıldı" />
        <div style={{ fontFamily: T.govde, ...T.m, color: C.murekkepAlt, marginBottom: S.lg }}>
          {TANI.length} sorudan {cevaplar.filter((c) => c.dogruMu).length} doğru. Bu bir not değil, bir başlangıç haritası —
          sistem bundan sonra senin kendi hatalarına göre şekillenecek.
        </div>
        {sirali.length > 0 && (
          <Cetvel style={{ marginBottom: S.lg }}>
            <Etiket renk={C.lal}>En zayıf aileler</Etiket>
            <div style={{ display: "grid", gap: S.sm }}>
              {sirali.map(([aid, n]) => (
                <div key={aid} style={{ display: "flex", alignItems: "center", gap: S.md }}>
                  <span style={{ flex: 1, fontFamily: T.govde, fontSize: 16.5, color: C.murekkep }}>{aileAd(aid)}</span>
                  <Nisan kucuk renk={C.lal} zemin={C.lalSis}>{n} hata</Nisan>
                </div>
              ))}
            </div>
          </Cetvel>
        )}
        {yanlislar.length > 0 && (
          <Haber tur="bilgi">
            {yanlislar.length} hata, kendi cevabınla birlikte hata defterine ve tekrar kuyruğuna girdi.
            Yarın karşına ilk onlar çıkacak.
          </Haber>
        )}
        <div style={{ marginTop: S.lg }}>
          <Dugme tur="altin" tam tikla={() => bitir({ ad: ad.trim() || null, ustalik, yanlislar })}>Divan'a geç</Dugme>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: `${S.xl}px ${S.lg}px` }}>
      <div style={{ marginBottom: S.lg }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...T.cap, color: C.murekkepSis, marginBottom: 6 }}>
          <span>Soru {i + 1} / {TANI.length}</span>
          <span>{aileKisa((dugum(s.d) || {}).a)}</span>
        </div>
        <Cubuk deger={(i / TANI.length) * 100} boy={3} />
      </div>
      <Cetvel style={{ marginBottom: S.md }}>
        <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.8, color: C.murekkep }}>{s.s}</div>
      </Cetvel>
      <div style={{ display: "grid", gap: 6 }}>
        {s.o.map((o, k) => (
          <div key={k} onClick={() => setSecim(k)}
            style={{ border: `1px solid ${secim === k ? C.altin : C.cizgi}`, background: secim === k ? C.altinSis : C.muhre,
              borderRadius: 14, padding: S.md, cursor: "pointer", fontFamily: T.kalem, fontSize: 15.5,
              color: C.murekkep, display: "flex", gap: S.sm }}>
            <span style={{ color: C.murekkepSis }}>{"ABCD"[k]}</span><span>{o}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: S.lg }}>
        <Dugme tam pasif={secim == null} tikla={() => {
          setCevaplar([...cevaplar, { d: s.d, dogruMu: secim === s.c, verilen: s.o[secim], dogruCevap: s.o[s.c], soru: s.s }]);
          setSecim(null); setI(i + 1);
        }}>Sonraki</Dugme>
      </div>
    </div>
  );
}

/* ══════════════════════ KOMUT PALETİ ══════════════════════ */

export function KomutPaleti({ kapat, komutlar }) {
  const [q, setQ] = useState("");
  const [sec, setSec] = useState(0);
  const inp = useRef(null);
  useEffect(() => { if (inp.current) inp.current.focus(); }, []);
  const liste = useMemo(() => {
    const t = q.trim().toLocaleLowerCase("tr");
    if (!t) return komutlar.filter((k) => k.oncelik).slice(0, 12);
    return komutlar.filter((k) => k.ad.toLocaleLowerCase("tr").includes(t) || (k.grup || "").toLocaleLowerCase("tr").includes(t)).slice(0, 12);
  }, [q, komutlar]);
  useEffect(() => { setSec(0); }, [q]);

  return (
    <div onClick={kapat} style={{ position: "fixed", inset: 0, background: "rgba(20,31,42,.34)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "11vh", zIndex: 90 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: "min(580px, 92vw)", background: C.muhre, border: `1px solid ${C.cetvel}`, borderRadius: 14,
          boxShadow: "0 24px 64px rgba(20,31,42,.3)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.sm, padding: `${S.md}px ${S.lg}px`, borderBottom: `1px solid ${C.cizgi}` }}>
          <Command size={15} style={{ color: C.altin }} />
          <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSec((s) => Math.min(s + 1, liste.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSec((s) => Math.max(s - 1, 0)); }
              if (e.key === "Enter" && liste[sec]) { liste[sec].calistir(); kapat(); }
              if (e.key === "Escape") kapat();
            }}
            placeholder="Komut, sekme veya düğüm ara…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: T.govde, fontSize: 17, color: C.murekkep }} />
        </div>
        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {liste.length === 0 && <div style={{ padding: S.lg, ...T.s, color: C.murekkepSis, textAlign: "center" }}>Sonuç yok</div>}
          {liste.map((k, i) => (
            <div key={i} onMouseEnter={() => setSec(i)} onClick={() => { k.calistir(); kapat(); }}
              style={{ padding: `${S.sm + 2}px ${S.lg}px`, cursor: "pointer", background: sec === i ? C.altinSis : "transparent",
                display: "flex", alignItems: "center", gap: S.md }}>
              <span style={{ flex: 1, fontFamily: T.govde, fontSize: 16, color: C.murekkep }}>{k.ad}</span>
              {k.grup && <span style={{ ...T.cap, fontSize: 11.5, color: C.murekkepSis }}>{k.grup}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ SANDIK ══════════════════════ */

export function Sandik({ ozet, saglik, yenile }) {
  const [paket, setPaket] = useState(null);
  const [metin, setMetin] = useState("");
  const [gelen, setGelen] = useState(null);
  const [mod, setMod] = useState("birlestir");
  const [durum, setDurum] = useState(null);
  const [mesgul, setMesgul] = useState(false);
  const [eski, setEski] = useState(undefined);
  const [yedekVar, setYedekVar] = useState(undefined);
  const [onay, setOnay] = useState(false);
  const dosyaRef = useRef(null);

  useEffect(() => {
    (async () => {
      setEski(await eskiSurumTara());
      const y = await sGet(K.yedek, null);
      setYedekVar(y);
    })();
  }, []);

  async function disaAktar(indir) {
    setMesgul(true); setDurum(null);
    const p = await veriTopla();
    setPaket(p);
    if (indir) { const g = await sGet(K.gunluk, {}); await sSet(K.gunluk, { ...g, sonDisa: bugun() }); }
    if (indir) {
      const oldu = dosyaIndir(p);
      setDurum(oldu
        ? { tur: "iyi", m: `Dosya indirildi: nahiv-yedek-${bugun()}.json — bunu bir yere kaydet. Uygulama sıfırlanırsa tek kurtarma yolu bu dosya.` }
        : { tur: "hata", m: "İndirme engellendi. Aşağıdaki metni kopyalayıp bir dosyaya kaydet." });
    }
    setMesgul(false);
  }

  async function panoyaKopyala() {
    const p = paket || (await veriTopla());
    setPaket(p);
    try {
      await navigator.clipboard.writeText(JSON.stringify(p));
      const g = await sGet(K.gunluk, {}); await sSet(K.gunluk, { ...g, sonDisa: bugun() });
      setDurum({ tur: "iyi", m: "Yedek panoya kopyalandı. Bir not dosyasına yapıştırıp sakla." });
    } catch {
      setDurum({ tur: "hata", m: "Pano erişimi yok. Aşağıdaki kutudaki metni elle seçip kopyala." });
    }
  }

  function dosyaOku(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { setMetin(String(r.result || "")); coz(String(r.result || "")); };
    r.onerror = () => setDurum({ tur: "hata", m: "Dosya okunamadı." });
    r.readAsText(f);
  }

  function coz(ham) {
    setDurum(null);
    try {
      const p = JSON.parse(String(ham || metin).trim());
      if (p.uygulama !== "nahiv") throw new Error("Bu dosya bir NAHİV yedeği değil.");
      setGelen(p);
    } catch (e) { setGelen(null); setDurum({ tur: "hata", m: e.message || "Geçersiz JSON." }); }
  }

  async function uygula(p, secilenMod) {
    setMesgul(true); setDurum(null);
    try {
      await veriYaz(p, secilenMod || mod);
      await yenile();
      setDurum({ tur: "iyi", m: secilenMod === "degistir" || mod === "degistir"
        ? "Veri değiştirildi. Sayfayı yenilemene gerek yok."
        : "Veri birleştirildi. Aynı kimlikli kayıtlar için daha yeni olan tutuldu." });
      setGelen(null); setMetin("");
      setEski(await eskiSurumTara());
    } catch (e) { setDurum({ tur: "hata", m: e.message || "Yazılamadı." }); }
    setMesgul(false);
  }

  async function sifirla() {
    setMesgul(true);
    const p = await veriTopla();
    await sSet(K.yedek, p);
    for (const k of VERI_ANAHTARLARI) await sSil(k);
    await yenile();
    setOnay(false); setMesgul(false);
    setDurum({ tur: "iyi", m: "Her şey silindi. Silmeden önce otomatik bir yedek alındı; aşağıdan geri yükleyebilirsin." });
    setYedekVar(p);
  }

  const S1 = { iyi: { renk: C.zumrut, ad: "Depolama çalışıyor" },
               bozuk: { renk: C.lal, ad: "Depolama yazıyor ama geri okumuyor" },
               yok: { renk: C.lal, ad: "Depolamaya erişilemiyor" } }[saglik] || { renk: C.murekkepSis, ad: "Kontrol ediliyor" };

  return (
    <div>
      <Baslik ust="Yedekleme" ad="Sandık"
        alt="Uygulamanın belleği tarayıcıya bağlıdır ve tarayıcı temizlenirse, sürüm değişirse veya uygulama yeniden kurulursa kopabilir. Tek gerçek koruma dışa aktarılmış bir dosyadır. Bunu haftada bir yap." />

      {saglik !== "iyi" && saglik !== undefined && (
        <div style={{ marginBottom: S.lg }}>
          <Haber tur="hata" basli="Uyarı">
            Depolama sağlıklı görünmüyor ({S1.ad}). Bu durumda yazdıkların kalıcı olmayabilir.
            Şimdi bir yedek al ve çalışmaya devam etmeden önce sayfayı yeniden yükle.
          </Haber>
        </div>
      )}

      {eski && (
        <div style={{ marginBottom: S.lg }}>
          <Haber tur="altin" basli="Eski sürüm verisi bulundu">
            Bu tarayıcıda NAHİV'in ilk sürümünden kalma veri duruyor:{" "}
            {paketOzeti(eski).hatalar} hata, {paketOzeti(eski).dugumler} düğüm kaydı.
            Anahtar adları sürüm geçişinde değiştiği için bağı kopmuştu.
            <div style={{ marginTop: S.md, display: "flex", gap: S.sm, flexWrap: "wrap" }}>
              <Dugme tur="altin" kucuk tikla={() => uygula(eski, "birlestir")} pasif={mesgul}>Kurtar ve birleştir</Dugme>
              <Dugme tur="sessiz" kucuk tikla={() => setEski(null)}>Yoksay</Dugme>
            </div>
          </Haber>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: S.sm, marginBottom: S.lg }}>
        <Olcu sayi={ozet.hatalar} ad="hata" renk={C.lal} />
        <Olcu sayi={ozet.dugumler} ad="düğüm kaydı" renk={C.altin} />
        <Olcu sayi={ozet.metinler} ad="metin" renk={C.lacivert} />
        <Olcu sayi={ozet.oturumlar} ad="oturum" renk={C.zumrut} />
      </div>

      <Levha style={{ marginBottom: S.lg }} renk={S1.renk}>
        <div style={{ display: "flex", alignItems: "center", gap: S.sm, ...T.s }}>
          <CircleDot size={12} style={{ color: S1.renk }} />
          <span style={{ color: C.murekkep }}>{S1.ad}</span>
          {ozet.baslangic && <><span style={{ flex: 1 }} /><span style={{ ...T.xs, color: C.murekkepSis }}>başlangıç {trTarih(ozet.baslangic)}</span></>}
        </div>
      </Levha>

      <Fasil ad="Dışa aktar" />
      <Cetvel style={{ marginBottom: S.lg }}>
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>
          Bütün veri tek bir JSON dosyasına yazılır: hata defterin, ustalık haritan, metinlerin, oturumların,
          eşdizim ilerlemen ve Sokrates konuşmaların. Bu dosyayı sakladığın sürece hiçbir şey kaybolmaz.
        </div>
        <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap" }}>
          <Dugme tur="altin" tikla={() => disaAktar(true)} pasif={mesgul}><Bookmark size={13} /> Dosya olarak indir</Dugme>
          <Dugme tur="ikincil" tikla={panoyaKopyala} pasif={mesgul}><Copy size={13} /> Panoya kopyala</Dugme>
          {paket && <Dugme tur="sessiz" tikla={() => setPaket(null)}>Metni gizle</Dugme>}
        </div>
        {paket && (
          <div style={{ marginTop: S.md }}>
            <Etiket>Yedek metni — seçip kopyalayabilirsin</Etiket>
            <textarea readOnly value={JSON.stringify(paket)} rows={5} onFocus={(e) => e.target.select()}
              style={{ width: "100%", boxSizing: "border-box", fontFamily: T.kalem, fontSize: 13, lineHeight: 1.5,
                padding: S.sm, border: `1px solid ${C.cizgi}`, borderRadius: 14, background: C.kagitAlt, color: C.murekkepAlt, resize: "vertical" }} />
          </div>
        )}
      </Cetvel>

      <Fasil ad="İçe aktar" />
      <Cetvel style={{ marginBottom: S.lg }}>
        <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap", marginBottom: S.md }}>
          <Dugme tur="ikincil" tikla={() => dosyaRef.current && dosyaRef.current.click()}>Dosya seç</Dugme>
          <input ref={dosyaRef} type="file" accept=".json,application/json" onChange={dosyaOku} style={{ display: "none" }} />
          <span style={{ ...T.xs, color: C.murekkepSis, alignSelf: "center" }}>ya da yedek metnini aşağıya yapıştır</span>
        </div>
        <Alan deger={metin} degistir={(v) => { setMetin(v); setGelen(null); }} satir={4}
          ipucu='Yedek JSON metnini buraya yapıştır…' style={{ fontSize: 13.5 }} />
        {!gelen && metin.trim() && (
          <div style={{ marginTop: S.sm }}><Dugme tur="ikincil" kucuk tikla={() => coz()}>Çözümle</Dugme></div>
        )}

        {gelen && (() => {
          const o = paketOzeti(gelen);
          return (
            <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}` }}>
              <Etiket renk={C.zumrut}>Geçerli yedek</Etiket>
              <div style={{ ...T.s, color: C.murekkep, marginBottom: S.md }}>
                {o.ad ? `${o.ad} · ` : ""}{trTarih(gelen.tarih)} · sürüm {gelen.surum} —{" "}
                {o.hatalar} hata, {o.dugumler} düğüm kaydı, {o.metinler} metin, {o.oturumlar} oturum.
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: S.md, flexWrap: "wrap" }}>
                <Dugme tur={mod === "birlestir" ? "ikincil" : "sessiz"} kucuk tikla={() => setMod("birlestir")}>Birleştir</Dugme>
                <Dugme tur={mod === "degistir" ? "ikincil" : "sessiz"} kucuk tikla={() => setMod("degistir")}>Üzerine yaz</Dugme>
              </div>
              <div style={{ ...T.xs, color: C.murekkepAlt, marginBottom: S.md }}>
                {mod === "birlestir"
                  ? "Mevcut veriyle birleştirilir. Aynı kimlikli kayıtlarda daha yeni olan tutulur, ustalıkta en son görülen kayıt kazanır. Güvenli seçenek."
                  : "Mevcut veri tamamen silinir ve yedektekiyle değiştirilir. Yalnızca temiz bir cihaza taşıyorsan kullan."}
              </div>
              <Dugme tur="altin" tikla={() => uygula(gelen)} pasif={mesgul} tam>
                {mod === "birlestir" ? "Birleştir" : "Üzerine yaz"}
              </Dugme>
            </div>
          );
        })()}
      </Cetvel>

      {yedekVar && (
        <>
          <Fasil ad="Otomatik yedek" />
          <Levha style={{ marginBottom: S.lg }}>
            <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>
              Uygulama günde bir kez kendi içine sessiz bir kopya alır. Kazara silme veya bozulmaya karşı işe yarar,
              ama tarayıcı depolaması tümden giderse bu da gider — dosya yedeğinin yerini tutmaz.
            </div>
            <div style={{ display: "flex", gap: S.sm, alignItems: "center", flexWrap: "wrap" }}>
              <Nisan renk={C.murekkepAlt}>{trTarih(yedekVar.tarih)}</Nisan>
              <Nisan renk={C.murekkepAlt}>{paketOzeti(yedekVar).hatalar} hata</Nisan>
              <span style={{ flex: 1 }} />
              <Dugme tur="ikincil" kucuk tikla={() => uygula(yedekVar, "birlestir")} pasif={mesgul}>Geri yükle</Dugme>
            </div>
          </Levha>
        </>
      )}

      <Fasil ad="Sıfırla" />
      <Levha renk={C.lal}>
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md }}>
          Bütün veriyi siler ve tanı sınavına döner. Silmeden hemen önce otomatik yedek alınır.
        </div>
        {!onay
          ? <Dugme tur="tehlike" kucuk tikla={() => setOnay(true)}><Trash2 size={12} /> Her şeyi sil</Dugme>
          : <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ ...T.s, color: C.lal }}>Emin misin? Bu geri alınamaz.</span>
              <Dugme tur="tehlike" kucuk tikla={sifirla} pasif={mesgul}>Evet, sil</Dugme>
              <Dugme tur="sessiz" kucuk tikla={() => setOnay(false)}>Vazgeç</Dugme>
            </div>}
      </Levha>

      {durum && <div style={{ marginTop: S.lg }}><Haber tur={durum.tur}>{durum.m}</Haber></div>}
    </div>
  );
}

