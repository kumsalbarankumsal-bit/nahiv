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
  CircleDot, Radio, Volume2, Copy, Plus, Minus, Bookmark, GitCompare, Library
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════
   N A H İ V   ·   ikinci defter
   Türkçe konuşan birinin İngilizce üretirken yaptığı hataları teşhis eden,
   kaynağına kadar izleyen ve tekrarlanmasını engelleyen bir sistem.
   ══════════════════════════════════════════════════════════════════════ */

/* ─── RENK ─────────────────────────────────────────────────────────── */

const C = {
  kagit:       "#FAF5E9",
  muhre:       "#FEFCF6",
  kagitAlt:    "#F2E9D3",
  kagitDerin:  "#E7D9B9",
  golge:       "#DBCBA4",
  cizgi:       "#DCCFAE",
  cetvel:      "#C4A962",
  murekkep:    "#141F2A",
  murekkepAlt: "#4C5865",
  murekkepSis: "#8B939C",
  altin:       "#A87C1F",
  altinAcik:   "#DFB75A",
  altinSis:    "#F5E8C6",
  lal:         "#8E1B20",
  lalAcik:     "#B8474C",
  lalSis:      "#F4DEDD",
  lacivert:    "#1F3A6E",
  laciAcik:    "#4B6BA8",
  laciSis:     "#E1E7F2",
  zumrut:      "#1F6B5C",
  zumSis:      "#DAEAE5"
};

const YAZI_TIPLERI = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap');`;

const T = {
  hat:   "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif",
  govde: "'EB Garamond', Georgia, 'Times New Roman', serif",
  berrak:"'Atkinson Hyperlegible', 'EB Garamond', system-ui, sans-serif",
  kalem: "'IBM Plex Mono', 'SF Mono', Menlo, Consolas, monospace",

  d0: { fontSize: 46, fontWeight: 300, letterSpacing: "0.22em", lineHeight: 1.1 },
  d1: { fontSize: 31, fontWeight: 400, letterSpacing: "0.05em", lineHeight: 1.2 },
  d2: { fontSize: 23, fontWeight: 500, letterSpacing: "0.035em", lineHeight: 1.28 },
  d3: { fontSize: 17.5, fontWeight: 600, letterSpacing: "0.02em", lineHeight: 1.35 },
  m:  { fontSize: 16.5, lineHeight: 1.72 },
  s:  { fontSize: 14, lineHeight: 1.62 },
  xs: { fontSize: 12.5, lineHeight: 1.55 },
  cap:{ fontSize: 10.5, letterSpacing: "0.17em", textTransform: "uppercase", fontWeight: 600 },
  rakam: { fontVariantNumeric: "oldstyle-nums" }
};

const S = { xs: 4, sm: 8, md: 14, lg: 22, xl: 34, xxl: 54, xxxl: 78 };

/* Kâğıt dokusu — çok ince gren, mührelenmiş kâğıt izlenimi */
const DOKU = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

/* ─── DEPOLAMA ─────────────────────────────────────────────────────── */

/* ⚠ DEPOLAMA ANAHTARLARI ASLA YENİDEN ADLANDIRILMAZ.
   Sürüm değiştiğinde anahtar değiştirilirse eski verinin bağı kopar.
   Yeni alan gerekiyorsa yeni anahtar eklenir, eskisi bırakılır.        */
const SURUM = 2;

const K = {
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
  rekor:   "nahiv2:rekor"
};

/* Taşınacak veri anahtarları — yedek ve günlük dışarıda kalır */
const VERI_ANAHTARLARI = [K.profil, K.ustalik, K.hatalar, K.metinler, K.oturum, K.derin, K.sohbet, K.esdizim, K.taslak, K.dagarcik, K.rekor];

/* v1 → v2 eşlemesi. Eski sürümde adlandırma "nahiv:*" idi. */
const ESKI_ESLEME = {
  "nahiv:profil": K.profil, "nahiv:ustalik": K.ustalik, "nahiv:hatalar": K.hatalar,
  "nahiv:metinler": K.metinler, "nahiv:oturumlar": K.oturum, "nahiv:derin": K.derin
};

async function sGet(key, yedek) {
  try {
    const r = await window.storage.get(key);
    if (!r || r.value == null) return yedek;
    return JSON.parse(r.value);
  } catch { return yedek; }
}
async function sSet(key, deger) {
  try { await window.storage.set(key, JSON.stringify(deger)); return true; }
  catch (e) { console.error("kayıt", key, e); return false; }
}
async function sSil(key) { try { await window.storage.delete(key); return true; } catch { return false; } }

/* ─── SANDIK: yedekleme, taşıma, kurtarma ──────────────────────────
   window.storage kalıcıdır ama uygulamanın kimliği değişirse
   (yeni sürüm, yeni oturum, temizlenen tarayıcı) erişim kopabilir.
   Tek gerçek koruma dışa aktarılmış bir dosyadır. ───────────────── */

async function depoSagligi() {
  const t = "nahiv2:saglik";
  try {
    const damga = String(Date.now());
    await window.storage.set(t, JSON.stringify({ damga }));
    const geri = await window.storage.get(t);
    if (!geri || JSON.parse(geri.value).damga !== damga) return "bozuk";
    return "iyi";
  } catch { return "yok"; }
}

async function veriTopla() {
  const veri = {};
  for (const k of VERI_ANAHTARLARI) {
    const v = await sGet(k, undefined);
    if (v !== undefined) veri[k] = v;
  }
  return { uygulama: "nahiv", surum: SURUM, tarih: new Date().toISOString(), veri };
}

function paketOzeti(p) {
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

const idKume = (a) => new Map((a || []).filter((x) => x && x.id).map((x) => [x.id, x]));

function diziBirlestir(mevcut, gelen) {
  const m = idKume(mevcut);
  (gelen || []).forEach((x) => {
    if (!x || !x.id) return;
    const eski = m.get(x.id);
    if (!eski) m.set(x.id, x);
    else if (new Date(x.tarih || 0) > new Date(eski.tarih || 0)) m.set(x.id, { ...eski, ...x });
  });
  return [...m.values()].sort((a, b) => new Date(a.tarih || 0) - new Date(b.tarih || 0));
}

function ustalikBirlestir(mevcut, gelen) {
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

async function veriYaz(paket, mod) {
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
async function eskiSurumTara() {
  const bulunan = {};
  for (const [eski, yeni] of Object.entries(ESKI_ESLEME)) {
    const v = await sGet(eski, undefined);
    if (v !== undefined && v !== null) bulunan[yeni] = v;
  }
  return Object.keys(bulunan).length ? { uygulama: "nahiv", surum: 1, tarih: new Date().toISOString(), veri: bulunan } : null;
}

async function gunlukYedek() {
  const g = await sGet(K.gunluk, {});
  if (g.tarih === bugun()) return false;
  const paket = await veriTopla();
  const oz = paketOzeti(paket);
  if (!oz.hatalar && !oz.dugumler) return false;
  await sSet(K.yedek, paket);
  await sSet(K.gunluk, { tarih: bugun() });
  return true;
}

function dosyaIndir(paket) {
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

const bugun = () => new Date().toISOString().slice(0, 10);
const gunEkle = (iso, n) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const gunFarki = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);
const AYLAR = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const trTarih = (iso) => { if (!iso) return "—"; const [y,m,g] = iso.slice(0,10).split("-"); return `${parseInt(g)} ${AYLAR[parseInt(m)-1]} ${y}`; };
const yeniId = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
const sayiFmt = (n) => new Intl.NumberFormat("tr-TR").format(n);

/* ─── YAPAY ZEKÂ ───────────────────────────────────────────────────── */

async function sor(prompt, maxTokens = 1600) {
  const c = await fetch((typeof window !== "undefined" && window.NAHIV_AI_URL) || "https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] })
  });
  if (!c.ok) throw new Error(`sunucu ${c.status}`);
  const v = await c.json();
  return (v.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

async function sorJSON(prompt, maxTokens = 1600) {
  const ham = await sor(prompt, maxTokens);
  const t = ham.replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a === -1 || b === -1) throw new Error("JSON yok");
  return JSON.parse(t.slice(a, b + 1));
}

const ZEMIN = `Sen Türkçe anadilli ileri seviye İngilizce öğrencileri üzerine uzmanlaşmış bir uygulamalı dilbilimcisin.
Öğrenci: 18 yaşında, Türk, IB Diploma Programı, English B HL. Alıcı becerisi güçlü, üretici doğruluğu zayıf.
İlgi alanları: uluslararası ilişkiler, siyaset felsefesi, tarih, sinema, futbol. Tüm örnekleri bu alanlardan üret; genel veya çocuksu cümle kurma.
Türkçe açıklama yaz. İltifat etme, dolgu cümle kurma. Doğrudan ve klinik ol.`;

const BARANCA = `Baranca Öğrenme Protokolü:
1. Sıfırdan başla, ön bilgi varsayma. 2. Formülden önce mantık: bu kural hangi problemi çözüyor?
3. Gündelik hayattan analoji kur. 4. Kısa artımlı adımlar, her adımdan sonra anlama kontrolü.
5. Hatayı yumuşatmadan doğrudan düzelt. 6. Sonunda mini test.
Her açıklamayı Türkçe karşılaştırmasıyla bitir: Türkçe bunu nasıl yapıyor, İngilizce neden başka bir yol seçiyor?`;

/* ─── AİLELER ──────────────────────────────────────────────────────── */

const AILELER = [
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
const aileAd = (id) => (AILELER.find((a) => a.id === id) || {}).ad || id;
const aileKisa = (id) => (AILELER.find((a) => a.id === id) || {}).kisa || id;
/* ─── TÜRKÇE GİRİŞİM KATALOĞU ──────────────────────────────────── */

const L1 = [
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

const D_A = [

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

const D_B = [
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

const D_C = [
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

const D_D = [
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

const D_E = [
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

const DUGUMLER = [...D_A, ...D_B, ...D_C, ...D_D, ...D_E];
const DUGUM_HARITA = Object.fromEntries(DUGUMLER.map((d) => [d.id, d]));
const dugum = (id) => DUGUM_HARITA[id];
const aileninDugumleri = (aid) => DUGUMLER.filter((d) => d.a === aid);

/* ─── EŞDİZİM DAĞARCIĞI ─────────────────────────────────────────────
   Fiile/sıfata/ada bağımlı edatlar Türk öğrencinin en pahalı hata
   kaynağıdır. Ayrı bir aralıklı tekrar modülü hak eder. ─────────── */

const ESDIZIM = [
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

const SEVIYELER = [
  { esik: 0,  ad: "Tanışma",     renk: C.murekkepSis },
  { esik: 21, ad: "Tanıma",      renk: C.lacivert },
  { esik: 41, ad: "Uygulama",    renk: C.zumrut },
  { esik: 61, ad: "Üretim",      renk: C.altin },
  { esik: 81, ad: "Otomatiklik", renk: C.lal }
];
const seviyeBul = (p) => [...SEVIYELER].reverse().find((s) => p >= s.esik) || SEVIYELER[0];

const BOS_KAYIT = { puan: 0, dogru: 0, yanlis: 0, basamak: 1, sonGorulme: null, guven: 0, gecmis: [] };

function ustalikGuncelle(kayit, dogruMu, basamak) {
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

function sonumlenmisPuan(kayit) {
  if (!kayit || !kayit.sonGorulme) return kayit ? kayit.puan || 0 : 0;
  const gun = gunFarki(kayit.sonGorulme, bugun());
  if (gun < 21) return kayit.puan;
  return Math.max(0, Math.round(kayit.puan * Math.pow(0.9, Math.floor(gun / 21))));
}

function aileOrtalamasi(ustalik, aid) {
  const ds = aileninDugumleri(aid);
  if (!ds.length) return 0;
  return Math.round(ds.reduce((a, d) => a + sonumlenmisPuan(ustalik[d.id]), 0) / ds.length);
}

const genelUstalik = (ustalik) =>
  Math.round(DUGUMLER.reduce((a, d) => a + sonumlenmisPuan(ustalik[d.id]), 0) / DUGUMLER.length);

function kilitliMi(d, ustalik) {
  if (!d.on || !d.on.length) return false;
  return d.on.some((o) => sonumlenmisPuan(ustalik[o]) < 30);
}

function zayifDugumler(ustalik, hatalar, adet = 5, kilitSay = true) {
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

function srsGuncelle(kart, kalite) {
  let tekrar = kart.tekrar || 0, aralik = kart.aralik || 0, kolaylik = kart.kolaylik || 2.5;
  if (kalite < 3) { tekrar = 0; aralik = 1; }
  else { tekrar += 1; aralik = tekrar === 1 ? 1 : tekrar === 2 ? 4 : Math.max(1, Math.round(aralik * kolaylik)); }
  kolaylik = Math.max(1.3, Math.min(2.8, kolaylik + (0.1 - (5 - kalite) * (0.08 + (5 - kalite) * 0.02))));
  return { ...kart, tekrar, aralik, kolaylik, sonrakiTarih: gunEkle(bugun(), aralik), sonGorulme: bugun() };
}
const bekleyenTekrarlar = (hatalar) =>
  (hatalar || []).filter((h) => !h.cozuldu && (!h.srs || !h.srs.sonrakiTarih || h.srs.sonrakiTarih <= bugun()));
const musallatHatalar = (hatalar) =>
  (hatalar || []).filter((h) => !h.cozuldu && (h.tekrarSayisi || 1) >= 3);

/* ─── HATA ÇÖZÜMLEME ───────────────────────────────────────────────── */

function hataOrguleri(hatalar, adet = 5) {
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

function hataYogunlugu(metinler, kac = 5) {
  const son = (metinler || []).filter((m) => m.kelimeSayisi).slice(-kac);
  if (!son.length) return null;
  const k = son.reduce((a, m) => a + m.kelimeSayisi, 0);
  const h = son.reduce((a, m) => a + (m.hataSayisi || 0), 0);
  return k ? Math.round((h / k) * 1000) : null;
}

function l1Payi(hatalar) {
  const a = hatalar || [];
  return a.length ? Math.round((a.filter((h) => h.l1Kaynakli).length / a.length) * 100) : null;
}

/* ─── KEHANET: hata öngörü modeli ───────────────────────────────────
   Uygulama, sen yazmadan önce hangi hataları yapacağını tahmin eder.
   Tahmin isabeti yükseldikçe modelin seni tanıdığı, düştükçe senin
   modelden kaçtığın anlaşılır. Nihai hedef: isabetin çökmesi. ────── */

function kehanetUret(hatalar, ustalik, adet = 4) {
  const orgu = hataOrguleri(hatalar, 14);
  const puanlar = orgu.map((g) => {
    const d = g.dugumId ? dugum(g.dugumId) : null;
    const taze = g.ornek && g.ornek.tarih ? Math.max(0, 30 - gunFarki(g.ornek.tarih.slice(0, 10), bugun())) / 30 : 0.4;
    const ust = d ? sonumlenmisPuan(ustalik[d.id]) : 30;
    return { ...g, olasilik: Math.min(0.96, (g.sayi * 0.16 + taze * 0.3 + (100 - ust) / 210) * (g.l1 > 0 ? 1.18 : 1)) };
  });
  return puanlar.sort((a, b) => b.olasilik - a.olasilik).slice(0, adet);
}

function kehanetDegerlendir(tahminler, gercekHatalar) {
  if (!tahminler || !tahminler.length) return null;
  const gercek = new Set((gercekHatalar || []).map((h) => h.dugumId || h.dugumAdi || h.aile));
  const tutan = tahminler.filter((t) => gercek.has(t.anahtar) || gercek.has(t.dugumId) || gercek.has(t.aile));
  return { toplam: tahminler.length, tutan: tutan.length, isabet: Math.round((tutan.length / tahminler.length) * 100), tutanlar: tutan.map((t) => t.anahtar) };
}

/* ─── EŞDİZİM MOTORU ───────────────────────────────────────────────── */

const esdizimAnahtar = (x) => `${x.e}|${x.p || "-"}`;
function esdizimKuyrugu(durum) {
  return ESDIZIM.filter((x) => {
    const k = durum[esdizimAnahtar(x)];
    return !k || !k.sonrakiTarih || k.sonrakiTarih <= bugun();
  });
}

/* ─── PALİMPSEST: geçmiş metnin yeniden yazımı ─────────────────────── */

function palimpsestAdaylari(metinler) {
  return (metinler || [])
    .filter((m) => m.tamMetin && m.gorev && !m.palimpsestId && gunFarki(m.tarih.slice(0, 10), bugun()) >= 21)
    .sort((a, b) => new Date(a.tarih) - new Date(b.tarih));
}

/* ─── OCAK: günün on dakikası ──────────────────────────────────────── */

function ocakKur(ustalik, hatalar, esdizim, dag) {
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

function seriHesapla(oturumlar) {
  const gunler = [...new Set((oturumlar || []).map((o) => (o.tarih || "").slice(0, 10)))].sort().reverse();
  if (!gunler.length) return 0;
  let s = 0, g = bugun();
  if (gunler[0] !== bugun() && gunler[0] !== gunEkle(bugun(), -1)) return 0;
  if (gunler[0] === gunEkle(bugun(), -1)) g = gunEkle(bugun(), -1);
  for (const x of gunler) { if (x === g) { s += 1; g = gunEkle(g, -1); } else if (x < g) break; }
  return s;
}

const norm = (s) => String(s || "").toLocaleLowerCase("en").replace(/[.,;:!?—–"'`]/g, "").replace(/\s+/g, " ").trim();
const kelimeSay = (s) => (String(s || "").trim() ? String(s).trim().split(/\s+/).length : 0);


/* ══════════════════════════════════════════════════════════════════════
   D A Ğ A R C I K   —   IB English B HL kelime hazinesi
   1024 kelime · B1/B2/C1 · beş tema, kırk iki durak
   Her kelime: İngilizce · Türkçe · seviye · tür · durak · örnek · eşdizim
   ══════════════════════════════════════════════════════════════════════ */

const HAM = `
lifestyle|yaşam biçimi|B1|n|yas|Urban lifestyles have changed faster than rural ones.|a sedentary lifestyle
routine|rutin, alışılmış düzen|B1|n|yas|Breaking a morning routine takes about three weeks.|a daily routine
habit|alışkanlık|B1|n|yas|Reading before sleep became a habit he could not drop.|form a habit
pace|tempo, hız|B2|n|yas|The pace of life in Istanbul exhausts newcomers.|a hectic pace
sedentary|hareketsiz|C1|adj|yas|A sedentary lifestyle raises the risk of heart disease.|sedentary work
thrive|gelişip serpilmek|B2|v|yas|Some people thrive under pressure; others collapse.|thrive on sth
indulge|kendini bırakmak, düşkünlük göstermek|C1|v|yas|He indulges in long weekend films without guilt.|indulge in sth
moderation|ölçülülük|B2|n|yas|Everything in moderation, including moderation itself.|in moderation
self-discipline|öz disiplin|B2|n|yas|Self-discipline beats motivation on ordinary days.|exercise self-discipline
priority|öncelik|B1|n|yas|Study became his first priority after the mock exam.|set priorities
balance|denge, dengelemek|B1|n,v|yas|Balancing school and the club drained his evenings.|work-life balance
commute|işe gidip gelmek, yol|B2|v,n|yas|He commutes two hours a day across the Bosphorus.|a long commute
minimalist|sadelik yanlısı|B2|adj,n|yas|A minimalist room helps him concentrate.|a minimalist approach
consumerism|tüketimcilik|C1|n|yas|Consumerism turns identity into something you purchase.|rampant consumerism
affluent|varlıklı|C1|adj|yas|Affluent districts rarely host public housing.|an affluent neighbourhood
frugal|tutumlu|C1|adj|yas|Frugal habits learned early tend to last.|a frugal lifestyle
leisurely|aceleye getirmeden|B2|adj|yas|They took a leisurely walk along the shore.|a leisurely pace
hectic|telaşlı, yoğun|B2|adj|yas|Exam weeks make his schedule hectic.|a hectic schedule
unwind|gevşemek|B2|v|yas|He unwinds by watching a film with no subtitles.|unwind after work
nurture|beslemek, geliştirmek|B2|v|yas|Good schools nurture curiosity rather than obedience.|nurture a talent
well-being|esenlik, iyi olma hâli|B2|n|sag|Mental well-being is now part of the school curriculum.|promote well-being
resilience|dayanıklılık|C1|n|sag|Resilience is learned, not inherited.|build resilience
burnout|tükenmişlik|B2|n|sag|Burnout among students peaks in the final year.|suffer burnout
cope|baş etmek|B1|v|sag|She copes with stress by running at dawn.|cope with sth
stamina|dayanıklılık, soluk|B2|n|sag|Long essays demand stamina as much as knowledge.|build stamina
nutrition|beslenme|B1|n|sag|Poor nutrition affects concentration within days.|balanced nutrition
sleep deprivation|uyku yoksunluğu|B2|n|sag|Sleep deprivation damages memory more than caffeine helps.|chronic sleep deprivation
posture|duruş|B2|n|sag|Hours at a screen ruin a teenager's posture.|poor posture
therapy|terapi|B1|n|sag|Therapy is still stigmatised in many communities.|undergo therapy
stigma|damga, ayıplanma|C1|n|sag|The stigma around mental illness keeps people silent.|attach a stigma to sth
preventive|önleyici|B2|adj|sag|Preventive care costs less than emergency treatment.|preventive medicine
chronic|kronik, süreğen|B2|adj|sag|Chronic stress reshapes the brain over years.|a chronic condition
immunity|bağışıklık|B2|n|sag|Vaccination builds immunity across a whole population.|herd immunity
mindfulness|farkındalık|B2|n|sag|Mindfulness exercises take ten minutes a day.|practise mindfulness
sedative|yatıştırıcı|C1|n,adj|sag|Doctors prescribe sedatives far too readily.|a mild sedative
rehabilitation|rehabilitasyon|C1|n|sag|Rehabilitation after injury can take a full season.|undergo rehabilitation
epidemic|salgın|B2|n|sag|Loneliness has been called a modern epidemic.|a growing epidemic
sanitation|sağlık koşulları, temizlik altyapısı|B2|n|sag|Clean water and sanitation prevent more deaths than hospitals.|poor sanitation
life expectancy|yaşam beklentisi|B2|n|sag|Life expectancy rose by a decade in fifty years.|average life expectancy
holistic|bütüncül|C1|adj|sag|A holistic approach treats the person, not the symptom.|a holistic approach
belief|inanç|B1|n|inn|A belief held without evidence is still a belief.|a firmly held belief
value|değer|B1|n|inn|Values are revealed by choices, not by statements.|core values
faith|iman, güven|B1|n|inn|Faith and doubt are not opposites for many believers.|have faith in sb
secular|laik, dünyevi|C1|adj|inn|Secular states regulate religion without endorsing it.|a secular society
devout|dindar|C1|adj|inn|Her devout grandmother prayed five times a day.|a devout Muslim
ritual|ayin, ritüel|B2|n|inn|Rituals bind a community more tightly than doctrine.|a religious ritual
conviction|kanaat, güçlü inanç|C1|n|inn|He argued with the conviction of someone who had suffered.|a deep conviction
principle|ilke|B1|n|inn|He refused on principle, not out of fear.|a matter of principle
integrity|dürüstlük, bütünlük|B2|n|inn|Integrity costs most when nobody is watching.|personal integrity
hypocrisy|ikiyüzlülük|C1|n|inn|The hypocrisy of the speech was obvious to everyone.|sheer hypocrisy
tolerance|hoşgörü|B1|n|inn|Tolerance is not the same as agreement.|religious tolerance
dogma|dogma|C1|n|inn|Political dogma blinds analysts to new evidence.|rigid dogma
sacred|kutsal|B2|adj|inn|Some texts are sacred only to those who read them so.|a sacred text
worship|ibadet etmek, ibadet|B2|v,n|inn|Places of worship often outlive the states around them.|a place of worship
morality|ahlak|B2|n|inn|Morality cannot be reduced to obeying rules.|public morality
atheist|ateist|B2|n,adj|inn|An atheist can still value religious traditions.|a committed atheist
spirituality|maneviyat|B2|n|inn|Spirituality without institutions is increasingly common.|personal spirituality
pilgrimage|hac yolculuğu|B2|n|inn|The pilgrimage to Mecca unites millions each year.|go on a pilgrimage
taboo|tabu|B2|n,adj|inn|Discussing salary remains a taboo in many offices.|break a taboo
uphold|savunmak, sürdürmek|C1|v|inn|Courts exist to uphold rights, not popularity.|uphold a principle
subculture|alt kültür|B2|n|alt|Every subculture invents its own vocabulary.|a youth subculture
mainstream|ana akım|B2|adj,n|alt|What shocked the mainstream in 1990 now sells cars.|enter the mainstream
conform|uymak|B2|v|alt|Teenagers rebel against one group by conforming to another.|conform to norms
nonconformist|aykırı, uymayan|C1|n,adj|alt|Nonconformists rarely find the school system comfortable.|a nonconformist streak
peer|akran|B1|n|alt|Peer pressure shapes taste more than advertising does.|peer pressure
belong|ait olmak|B1|v|alt|Everyone needs somewhere to belong, however small.|belong to a group
outsider|dışarıdan biri|B1|n|alt|He wrote as an outsider who had once belonged.|feel like an outsider
identity|kimlik|B1|n|alt|Identity is negotiated, not simply inherited.|a sense of identity
affiliation|aidiyet, bağlılık|C1|n|alt|Club affiliation can outlast religious affiliation.|political affiliation
marginalise|dışlamak|C1|v|alt|Media coverage marginalised the group further.|marginalised communities
countercultural|karşı kültürel|C1|adj|alt|The magazine began as a countercultural pamphlet.|a countercultural movement
niche|niş, dar alan|B2|n,adj|alt|The band found a niche audience online.|a niche market
underground|yeraltı|B2|adj,n|alt|Underground music scenes resist commercial labels.|the underground scene
trendy|moda olan|B1|adj|alt|What is trendy in Kadıköy reaches Ankara two years later.|a trendy district
stereotype|kalıp yargı|B2|n,v|alt|Films stereotype entire neighbourhoods for convenience.|challenge a stereotype
label|etiket, etiketlemek|B1|n,v|alt|Being labelled early can become a life sentence.|put a label on sb
tribe|kabile, aşiret|B2|n|alt|Online fandoms behave like tribes with borders.|an urban tribe
initiation|kabul töreni|C1|n|alt|Initiation rituals make membership feel earned.|an initiation rite
authentic|özgün, sahici|B2|adj|alt|Audiences punish anything that feels less than authentic.|an authentic voice
appropriate|sahiplenmek, el koymak|C1|v|alt|Fashion houses appropriate styles without credit.|cultural appropriation
mother tongue|ana dil|B1|n|dil|Thinking in a mother tongue is faster, not better.|a mother tongue
bilingual|iki dilli|B1|adj,n|dil|Bilingual children switch codes without noticing.|a bilingual education
fluency|akıcılık|B2|n|dil|Fluency is confidence plus recovery from mistakes.|achieve fluency
accent|aksan|B1|n|dil|An accent carries a biography people hear instantly.|a strong accent
dialect|lehçe|B2|n|dil|A dialect is a language without an army, the joke goes.|a regional dialect
proficiency|yeterlilik|B2|n|dil|Proficiency exams rarely measure what speaking demands.|language proficiency
code-switching|diller arası geçiş|C1|n|dil|Code-switching signals which self is speaking.|constant code-switching
mother-tongue interference|ana dil girişimi|C1|n|dil|Mother-tongue interference explains most of his article errors.|reduce interference
articulate|düzgün ifade eden; ifade etmek|C1|adj,v|dil|She is articulate in three languages and shy in all of them.|an articulate speaker
nuance|nüans, ince ayrım|C1|n|dil|Translation loses nuance before it loses meaning.|a subtle nuance
idiom|deyim|B2|n|dil|Idioms resist translation and reveal a culture.|a common idiom
register|dil düzeyi, kayıt|C1|n|dil|Choosing the wrong register ruins an otherwise correct email.|a formal register
colloquial|günlük konuşma diline ait|C1|adj|dil|Colloquial phrasing weakens an academic essay.|colloquial speech
eloquent|belagatli|C1|adj|dil|His eloquent closing speech won the debate.|an eloquent defence
literacy|okuryazarlık|B2|n|dil|Digital literacy now matters as much as reading.|media literacy
endangered language|tehlikedeki dil|B2|n|dil|An endangered language dies with its last fluent speaker.|revive a language
heritage|miras|B2|n|dil|Language is the heritage children carry without luggage.|cultural heritage
assimilate|özümsemek, asimile olmak|C1|v|dil|Second-generation migrants assimilate faster than their parents.|assimilate into society
vernacular|yerel dil, halk dili|C1|n,adj|dil|Writers turned to the vernacular to reach ordinary readers.|the local vernacular
multilingual|çok dilli|B2|adj|dil|Multilingual classrooms need different teaching methods.|a multilingual society
aspire|özlem duymak, hedeflemek|B2|v|yas|He aspires to study politics abroad.|aspire to sth
fulfilment|doyum, tatmin|B2|n|yas|Fulfilment rarely arrives from a single achievement.|a sense of fulfilment
conscious|bilinçli|B1|adj|yas|Conscious consumers read labels before buying.|a conscious choice
deliberate|kasıtlı, bilinçli|B2|adj|yas|Living well requires deliberate choices, not luck.|a deliberate decision
restraint|kendini tutma|C1|n|yas|Financial restraint in your twenties pays later.|show restraint
excess|aşırılık|B2|n|yas|An excess of choice paralyses rather than liberates.|in excess
status symbol|statü göstergesi|B2|n|yas|A phone has become a status symbol in every classroom.|a status symbol
materialistic|maddiyatçı|B2|adj|yas|Materialistic values correlate with lower life satisfaction.|a materialistic culture
downsize|küçülmek, sadeleştirmek|C1|v|yas|The family downsized after the children left.|downsize a home
autonomy|özerklik|C1|n|yas|Teenagers demand autonomy before they can afford it.|personal autonomy
spontaneous|kendiliğinden, anlık|B2|adj|yas|Their best trips were entirely spontaneous.|a spontaneous decision
procrastinate|ertelemek|B2|v|yas|He procrastinates most when the task matters most.|stop procrastinating
discipline|disiplin|B1|n|yas|Discipline is doing it when the mood has gone.|self-discipline
well-rounded|çok yönlü|B2|adj|yas|Universities claim to want well-rounded applicants.|a well-rounded person
solitude|yalnızlık, tenhalık|C1|n|yas|Solitude is chosen; loneliness is suffered.|enjoy solitude
anxiety|kaygı|B1|n|sag|Exam anxiety peaks the night before, not during.|suffer from anxiety
coping mechanism|başa çıkma yöntemi|B2|n|sag|Humour is an underrated coping mechanism.|a healthy coping mechanism
sedentary behaviour|hareketsiz davranış|C1|n|sag|Sedentary behaviour starts in the classroom.|reduce sedentary behaviour
diagnosis|tanı|B2|n|sag|An early diagnosis changes the whole prognosis.|an accurate diagnosis
symptom|belirti|B1|n|sag|Fatigue is a symptom of almost everything.|show symptoms
remedy|çare, tedavi|B2|n,v|sag|Sleep is the cheapest remedy available.|a natural remedy
deteriorate|kötüleşmek|C1|v|sag|His vision deteriorated under constant screen use.|deteriorate rapidly
alleviate|hafifletmek|C1|v|sag|Exercise alleviates symptoms that medication cannot.|alleviate pain
healthcare|sağlık hizmeti|B1|n|sag|Universal healthcare is a political choice, not a luxury.|access to healthcare
addiction|bağımlılık|B2|n|sag|Screen addiction is measured in hours, not substances.|overcome addiction
sedate|sakin; yatıştırmak|C1|adj,v|sag|The patient remained sedate throughout the procedure.|a sedate pace
inoculate|aşılamak|C1|v|sag|Children are inoculated against measles before school.|inoculate against sth
obesity|obezite|B2|n|sag|Childhood obesity doubled within one generation.|tackle obesity
screening|tarama|B2|n|sag|Regular screening catches what symptoms hide.|cancer screening
longevity|uzun ömürlülük|C1|n|sag|Longevity runs in families and in postcodes.|increase longevity
ethics|etik, ahlak felsefesi|B2|n|inn|Ethics asks what we owe each other, not what we feel.|professional ethics
doctrine|öğreti|C1|n|inn|The doctrine was reinterpreted every century.|religious doctrine
heresy|sapkınlık|C1|n|inn|Yesterday's heresy becomes tomorrow's orthodoxy.|accused of heresy
orthodox|geleneksel, Ortodoks|B2|adj|inn|Orthodox interpretations resisted the reform.|orthodox views
reverence|saygı, hürmet|C1|n|inn|He spoke of his teacher with quiet reverence.|treat with reverence
blasphemy|küfür, kutsala hakaret|C1|n|inn|Blasphemy laws differ wildly between neighbours.|a charge of blasphemy
congregation|cemaat|B2|n|inn|The congregation shrank as the district changed.|a large congregation
clergy|din adamları|C1|n|inn|The clergy opposed the land reform.|members of the clergy
agnostic|agnostik|C1|n,adj|inn|He is agnostic about everything except football.|remain agnostic
virtue|erdem|B2|n|inn|Patience is a virtue no exam can measure.|a cardinal virtue
vice|kötü alışkanlık, kusur|B2|n|inn|Gambling was his only expensive vice.|a minor vice
compassion|merhamet|B2|n|inn|Compassion without action is sentimentality.|show compassion
humility|alçakgönüllülük|C1|n|inn|Intellectual humility is rarer than intelligence.|genuine humility
indoctrinate|beyin yıkamak, telkin etmek|C1|v|inn|States indoctrinate through textbooks, not speeches.|indoctrinate children
pious|dindar, sofu|C1|adj|inn|His pious grandfather never missed a dawn prayer.|a pious man
fandom|hayran topluluğu|B2|n|alt|Football fandom functions like a secular religion.|an online fandom
rebel|isyan etmek, asi|B1|v,n|alt|Every generation rebels against the previous one's taste.|rebel against sth
retro|retro, eskiyi anımsatan|B2|adj|alt|Retro fashion recycles what their parents discarded.|a retro style
avant-garde|avangart|C1|adj,n|alt|The avant-garde always becomes a museum eventually.|avant-garde art
cult|kült, tarikat|B2|n,adj|alt|The film flopped and then became a cult classic.|a cult following
ethos|ruh, anlayış|C1|n|alt|The club's ethos discouraged showing off.|a shared ethos
solidarity|dayanışma|B2|n|alt|Solidarity is cheap until it costs something.|show solidarity
exclusion|dışlanma|B2|n|alt|Exclusion from a group hurts like physical pain.|social exclusion
inclusive|kapsayıcı|B2|adj|alt|Inclusive language costs nothing and signals everything.|an inclusive community
norm|norm|B2|n|alt|Social norms change faster than laws do.|social norms
deviate|sapmak|C1|v|alt|Anyone who deviates from the dress code is noticed.|deviate from the norm
hierarchy|hiyerarşi|B2|n|alt|Even informal groups build a hierarchy within weeks.|a rigid hierarchy
initiate|başlatmak; yeni üye|B2|v,n|alt|New members are initiated through small humiliations.|initiate a process
collective|kolektif, ortak|B2|adj,n|alt|Collective memory is edited by whoever writes textbooks.|collective identity
alienation|yabancılaşma|C1|n|alt|Alienation grows where work has no visible purpose.|a sense of alienation
lingua franca|ortak dil|C1|n|dil|English became the lingua franca of diplomacy by accident.|serve as a lingua franca
coin|türetmek, uydurmak|C1|v|dil|Journalists coin a new term every election.|coin a phrase
borrow|ödünç almak|B1|v|dil|Turkish borrowed heavily from Arabic and then from French.|borrow a word
connotation|çağrışım|C1|n|dil|The word carries a connotation the dictionary omits.|a negative connotation
denotation|düz anlam|C1|n|dil|Denotation is what it means; connotation is what it does.|literal denotation
ambiguity|belirsizlik|C1|n|dil|Diplomatic texts protect ambiguity on purpose.|deliberate ambiguity
euphemism|örtmece|C1|n|dil|Every war produces a new euphemism for killing.|a polite euphemism
jargon|jargon, meslek dili|B2|n|dil|Jargon excludes outsiders more effectively than walls.|technical jargon
slang|argo|B2|n|dil|Slang ages faster than the people who invent it.|use slang
rhetoric|retorik, söz sanatı|C1|n|dil|Political rhetoric survives long after the policy dies.|empty rhetoric
persuasive|ikna edici|B2|adj|dil|A persuasive argument anticipates its own objections.|a persuasive case
concise|özlü|B2|adj|dil|Concise writing is harder than long writing.|be concise
coherent|tutarlı, bağlaşık|B2|adj|dil|A coherent paragraph has one idea and defends it.|a coherent argument
mispronounce|yanlış telaffuz etmek|B2|v|dil|He mispronounces words he has only ever read.|mispronounce a name
literacy rate|okuryazarlık oranı|B2|n|dil|The literacy rate rose fastest among rural women.|a high literacy rate
pastime|hobi, vakit geçirme|B2|n|bos|Chess was his father's only pastime.|a favourite pastime
recreation|dinlence|B2|n|bos|Public parks are the cheapest form of recreation.|outdoor recreation
amateur|amatör|B1|n,adj|bos|Amateur football teaches more than professional football.|an amateur player
enthusiast|meraklı, tutkun|B2|n|bos|Film enthusiasts argue about editing, not plot.|a keen enthusiast
immerse|kendini kaptırmak|C1|v|bos|He immerses himself in a novel for entire weekends.|immerse oneself in sth
absorbing|sürükleyici|B2|adj|bos|The documentary was absorbing from the first minute.|an absorbing read
tedious|sıkıcı, bıktırıcı|B2|adj|bos|Training becomes tedious before it becomes effective.|a tedious task
exhilarating|coşku verici|C1|adj|bos|The final minutes were exhilarating for both sides.|an exhilarating experience
spectator|seyirci|B2|n|bos|Spectators shape a match more than coaches admit.|a spectator sport
socialise|sosyalleşmek|B1|v|bos|He socialises more online than in person.|socialise with friends
binge-watch|arka arkaya izlemek|B2|v|bos|They binge-watched the whole series in two nights.|binge-watch a series
pursue|peşinden gitmek|B2|v|bos|She pursued photography without ever selling a print.|pursue an interest
knack|yetenek, el yatkınlığı|C1|n|bos|He has a knack for explaining difficult ideas.|have a knack for sth
leisure|boş zaman|B1|n|bos|Leisure time is unequally distributed by class.|leisure activities
indoor|kapalı mekânda|B1|adj|bos|Indoor hobbies grew during the lockdown years.|indoor activities
itinerary|gezi programı|B2|n|sey|Their itinerary collapsed on the second day.|a packed itinerary
destination|varış yeri|B1|n|sey|Istanbul is a destination and a transit point at once.|a popular destination
excursion|gezi|B2|n|sey|The school excursion lasted three exhausting days.|a day excursion
backpacking|sırt çantalı gezi|B2|n|sey|Backpacking teaches budgeting faster than any course.|go backpacking
accommodation|konaklama|B1|n|sey|Accommodation costs doubled during the festival.|book accommodation
sightseeing|gezip görme|B1|n|sey|They spent the morning sightseeing in the old city.|go sightseeing
landmark|simge yapı|B2|n|sey|Every landmark becomes invisible to those who live beside it.|a famous landmark
off the beaten track|turistik olmayan|C1|phr|sey|The village lies well off the beaten track.|go off the beaten track
ecotourism|ekoturizm|C1|n|sey|Ecotourism protects what mass tourism destroys.|promote ecotourism
overtourism|aşırı turizm|C1|n|sey|Overtourism has emptied Venice of its residents.|suffer from overtourism
authenticity|özgünlük|C1|n|sey|Tourists demand authenticity and destroy it by arriving.|search for authenticity
jet lag|saat farkı yorgunluğu|B2|n|sey|Jet lag ruined the first two days of the trip.|suffer from jet lag
hospitality|misafirperverlik|B2|n|sey|Turkish hospitality surprises visitors every time.|warm hospitality
souvenir|hatıra eşyası|B1|n|sey|He buys a single souvenir from each city.|a cheap souvenir
venture|girişmek, göze almak|C1|v|sey|Few tourists venture beyond the main square.|venture out
memoir|anı kitabı|B2|n|oyk|Her memoir covered only four years of her life.|write a memoir
biography|yaşam öyküsü|B1|n|oyk|A biography always reveals its author as well.|an official biography
milestone|dönüm noktası|B2|n|oyk|Graduation is a milestone, not a destination.|reach a milestone
turning point|dönüm noktası|B2|n|oyk|The move to Istanbul was the turning point.|a major turning point
upbringing|yetiştirilme tarzı|B2|n|oyk|His upbringing explains his discomfort with waste.|a strict upbringing
legacy|miras, bıraktığı iz|B2|n|oyk|Her legacy is a school that still runs.|leave a legacy
reminisce|anıları yâd etmek|C1|v|oyk|They reminisced about a neighbourhood that no longer exists.|reminisce about sth
nostalgia|nostalji|B2|n|oyk|Nostalgia edits the past into something bearable.|a wave of nostalgia
formative|biçimlendirici|C1|adj|oyk|Those two years were the most formative of his life.|a formative experience
adversity|zorluk, sıkıntı|C1|n|oyk|Adversity reveals character rather than building it.|face adversity
perseverance|azim|B2|n|oyk|Perseverance looks like stubbornness until it succeeds.|show perseverance
aspiration|özlem, hedef|B2|n|oyk|His aspirations were larger than his circumstances.|career aspirations
setback|aksilik|B2|n|oyk|The rejection was a setback, not a verdict.|suffer a setback
humble beginnings|mütevazı başlangıç|B2|n|oyk|From humble beginnings she reached the Senate.|rise from humble beginnings
chronicle|kayda geçirmek, vakayiname|C1|v,n|oyk|The diary chronicles a year of quiet collapse.|chronicle events
rite of passage|geçiş ritüeli|B2|n|ger|Military service remains a rite of passage for many.|a traditional rite of passage
ceremony|tören|B1|n|ger|The ceremony lasted longer than the marriage.|hold a ceremony
adolescence|ergenlik|B2|n|ger|Adolescence is a modern invention, historians argue.|during adolescence
graduation|mezuniyet|B1|n|ger|Graduation photographs outlive the diplomas.|a graduation ceremony
initiation rite|kabul töreni|C1|n|ger|The initiation rite marked entry into adulthood.|undergo an initiation rite
wedding|düğün|A2|n|ger|Weddings reveal family hierarchies within an hour.|a traditional wedding
funeral|cenaze|B1|n|ger|Funerals gather relatives that weddings cannot.|attend a funeral
mourning|yas|B2|n|ger|Mourning rituals differ more than beliefs about death.|a period of mourning
threshold|eşik|C1|n|ger|He stood at the threshold of a different life.|cross a threshold
mark|işaretlemek, anmak|B1|v|ger|The festival marks the end of the harvest.|mark an occasion
symbolic|simgesel|B2|adj|ger|The gesture was symbolic rather than practical.|a symbolic act
inherit|miras almak|B1|v|ger|He inherited the shop and the debts together.|inherit property
blessing|hayır dua, nimet|B2|n|ger|The elders gave their blessing before the journey.|give one's blessing
commemorate|anmak|C1|v|ger|The holiday commemorates a defeat, not a victory.|commemorate an event
custom|gelenek, âdet|B1|n|gel|The custom survived the empire that created it.|an ancient custom
tradition|gelenek|B1|n|gel|Tradition is a decision repeated until it feels natural.|a long-standing tradition
heritage site|miras alanı|B2|n|gel|The heritage site was restored with foreign funding.|a world heritage site
folklore|halk kültürü|B2|n|gel|Folklore preserves what official history deletes.|local folklore
superstition|batıl inanç|B2|n|gel|Superstitions survive in the most educated households.|a common superstition
hospitable|misafirperver|B2|adj|gel|Rural families remain more hospitable than urban ones.|a hospitable host
etiquette|görgü kuralları|C1|n|gel|Table etiquette differs sharply across the Mediterranean.|social etiquette
generation gap|kuşak farkı|B2|n|gel|The generation gap widened with the smartphone.|bridge the generation gap
ancestor|ata|B2|n|gel|His ancestors arrived from the Balkans in 1878.|distant ancestors
descendant|torun, soyundan gelen|B2|n|gel|Their descendants no longer speak the language.|direct descendants
preserve|korumak|B1|v|gel|Museums preserve objects and sometimes kill meaning.|preserve a tradition
revive|canlandırmak|B2|v|gel|The festival was revived after forty years.|revive a custom
obsolete|geçerliliğini yitirmiş|C1|adj|gel|The ritual became obsolete when the craft disappeared.|render sth obsolete
handed down|kuşaktan kuşağa aktarılan|B2|phr|gel|The recipe was handed down without ever being written.|handed down through generations
indigenous|yerli, özgün|C1|adj|gel|Indigenous knowledge is finally entering climate policy.|indigenous communities
migration|göç|B2|n|goc|Migration is as old as agriculture.|mass migration
refugee|mülteci|B1|n|goc|Refugee status is a legal category, not a condition.|a refugee camp
asylum|sığınma|B2|n|goc|They applied for asylum on arrival.|seek asylum
displacement|yerinden edilme|C1|n|goc|Climate displacement will exceed war displacement.|forced displacement
diaspora|diaspora|C1|n|goc|The diaspora funded the reconstruction of the village.|a large diaspora
integration|uyum, bütünleşme|B2|n|goc|Integration is a two-way process, not a demand.|social integration
assimilation|asimilasyon|C1|n|goc|Assimilation erases what integration preserves.|forced assimilation
remittance|yurt dışından gönderilen para|C1|n|goc|Remittances exceed foreign aid in many countries.|send remittances
brain drain|beyin göçü|B2|n|goc|Brain drain costs more than any visa policy saves.|suffer a brain drain
border|sınır|B1|n|goc|Borders are drawn by treaties and defended by maps.|cross a border
deport|sınır dışı etmek|C1|v|goc|Thousands were deported without a hearing.|deport migrants
smuggle|kaçakçılık yapmak|B2|v|goc|Traffickers smuggle people in refrigerated lorries.|smuggle sb across a border
settle|yerleşmek|B1|v|goc|The family settled in Germany in 1965.|settle in a country
host country|ev sahibi ülke|B2|n|goc|The host country rarely counts the benefits.|a host country
xenophobia|yabancı düşmanlığı|C1|n|goc|Xenophobia rises fastest where migrants are fewest.|combat xenophobia
entertainment|eğlence|B1|n|egl|Entertainment and art stopped being opposites long ago.|the entertainment industry
blockbuster|gişe rekortmeni|B2|n|egl|The blockbuster earned more abroad than at home.|a summer blockbuster
box office|gişe|B2|n|egl|The film failed at the box office and won every prize.|box office success
streaming|akış yayını|B2|n|egl|Streaming destroyed the cinema release window.|a streaming platform
audience|izleyici, dinleyici|B1|n|egl|The audience decides what survives, not the critics.|a mass audience
genre|tür|B2|n|egl|Every genre begins as a rebellion against another.|a film genre
plot|olay örgüsü|B1|n|egl|The plot collapses in the final twenty minutes.|a plot twist
subtitle|altyazı|B1|n|egl|He watches everything with English subtitles on.|read the subtitles
dubbing|dublaj|B2|n|egl|Dubbing changes a performance more than translation does.|poor dubbing
critically acclaimed|eleştirmenlerce övülen|C1|adj|egl|The series was critically acclaimed and barely watched.|a critically acclaimed film
escapism|kaçış, gerçeklerden kaçma|C1|n|egl|Escapism is not a flaw in art; it is a function.|pure escapism
immersive|sarıcı, içine çeken|C1|adj|egl|Immersive theatre removes the safety of the seat.|an immersive experience
celebrity|ünlü, şöhret|B1|n|egl|Celebrity has become a career rather than a consequence.|a celebrity culture
sequel|devam filmi|B2|n|egl|The sequel earned more and meant less.|release a sequel
mass appeal|geniş kitle çekiciliği|B2|n|egl|Mass appeal and artistic risk rarely coincide.|have mass appeal
aesthetic|estetik|C1|adj,n|san|The film's aesthetic owes everything to 1970s photography.|an aesthetic choice
composition|kompozisyon, düzenleme|B2|n|san|The composition draws the eye to the empty chair.|a careful composition
masterpiece|başyapıt|B2|n|san|Every masterpiece was once an experiment that worked.|an undisputed masterpiece
exhibition|sergi|B1|n|san|The exhibition toured four cities in a year.|hold an exhibition
sculpture|heykel|B1|n|san|The sculpture was removed after three days of protest.|a bronze sculpture
portray|betimlemek, canlandırmak|B2|v|san|The novel portrays bureaucracy as a weather system.|portray sb as sth
depict|resmetmek, tasvir etmek|B2|v|san|The mural depicts the strike of 1963.|depict a scene
evoke|çağrıştırmak|C1|v|san|The score evokes loss without naming it.|evoke a feeling
abstract|soyut|B2|adj|san|Abstract art demands a viewer willing to work.|abstract painting
figurative|betimleyici, mecazi|C1|adj|san|He returned to figurative painting after thirty years.|figurative art
craftsmanship|ustalık, işçilik|C1|n|san|The craftsmanship survives where the design has dated.|fine craftsmanship
patron|hami, destekçi|C1|n|san|Every great studio needed a patron with patience.|a wealthy patron
avant-garde|avangart|C1|adj|san|The avant-garde of one decade decorates the next.|avant-garde cinema
censorship|sansür|B2|n|san|Censorship makes mediocre work famous.|strict censorship
provocative|kışkırtıcı|B2|adj|san|The installation was deliberately provocative.|a provocative work
media|medya|B1|n|med|Media ownership explains more than media bias.|mass media
coverage|haber yapımı, kapsama|B2|n|med|Coverage of the protest varied by channel.|extensive coverage
bias|yanlılık|B2|n|med|Bias hides in what is omitted, not in what is said.|political bias
propaganda|propaganda|B2|n|med|Propaganda works best when it confirms existing fears.|state propaganda
misinformation|yanlış bilgi|C1|n|med|Misinformation travels six times faster than correction.|spread misinformation
disinformation|kasıtlı yanlış bilgi|C1|n|med|Disinformation is misinformation with a budget.|a disinformation campaign
censor|sansürlemek|B2|v|med|The broadcast was censored before it aired.|censor content
headline|manşet|B1|n|med|The headline contradicted the article beneath it.|make headlines
tabloid|magazin gazetesi|B2|n|med|Tabloid coverage turned a tragedy into entertainment.|the tabloid press
broadsheet|ciddi gazete|C1|n|med|Broadsheets lost readers faster than tabloids did.|a broadsheet newspaper
echo chamber|yankı odası|C1|n|med|An echo chamber feels like consensus from the inside.|live in an echo chamber
algorithm|algoritma|B2|n|med|The algorithm rewards outrage because outrage is measurable.|a recommendation algorithm
clickbait|tıklama tuzağı|B2|n|med|Clickbait headlines promise what the text cannot deliver.|avoid clickbait
influencer|etkileyici, fenomen|B2|n|med|Influencers sell trust before they sell products.|a social media influencer
fact-check|doğruluk kontrolü yapmak|B2|v|med|Few readers fact-check what confirms their view.|fact-check a claim
innovation|yenilik|B2|n|tek|Innovation is rarely invention; it is recombination.|technological innovation
device|cihaz|B1|n|tek|The average student carries three connected devices.|a mobile device
artificial intelligence|yapay zekâ|B2|n|tek|Artificial intelligence changed translation before it changed anything else.|advances in artificial intelligence
automation|otomasyon|B2|n|tek|Automation displaces tasks before it displaces jobs.|increasing automation
surveillance|gözetim|C1|n|tek|Surveillance is accepted when it is framed as convenience.|mass surveillance
privacy|mahremiyet|B1|n|tek|Privacy became a luxury good within a decade.|invade sb's privacy
encryption|şifreleme|C1|n|tek|Encryption protects dissidents and criminals equally.|end-to-end encryption
obsolete|demode, kullanılmaz|C1|adj|tek|Hardware becomes obsolete faster than it breaks.|technologically obsolete
cutting-edge|son teknoloji|B2|adj|tek|The lab works with cutting-edge sequencing equipment.|cutting-edge technology
digital divide|dijital uçurum|C1|n|tek|The digital divide widened during remote schooling.|bridge the digital divide
accessible|erişilebilir|B2|adj|tek|Good design makes technology accessible by default.|accessible to all
glitch|arıza, aksaklık|B2|n|tek|A single glitch delayed the launch by a month.|a minor glitch
prototype|prototip|B2|n|tek|The prototype worked once and never again.|build a prototype
user-friendly|kullanıcı dostu|B1|adj|tek|A user-friendly interface hides enormous complexity.|a user-friendly design
disrupt|altüst etmek, dönüştürmek|C1|v|tek|Streaming disrupted an industry that felt permanent.|disrupt an industry
breakthrough|çığır açan buluş|B2|n|bil|The breakthrough came from a failed experiment.|a major breakthrough
hypothesis|hipotez|B2|n|bil|A hypothesis that cannot fail explains nothing.|test a hypothesis
experiment|deney|B1|n,v|bil|The experiment was repeated eleven times before publication.|conduct an experiment
evidence|kanıt|B1|n|bil|Evidence persuades slowly and loses to stories.|conclusive evidence
peer review|hakem değerlendirmesi|C1|n|bil|Peer review is slow, flawed and still the best we have.|undergo peer review
replicate|yinelemek|C1|v|bil|Half the studies could not be replicated.|replicate a study
genome|genom|C1|n|bil|The human genome was mapped faster than predicted.|sequence a genome
vaccine|aşı|B1|n|bil|The vaccine was developed in under a year.|develop a vaccine
clinical trial|klinik deneme|B2|n|bil|The clinical trial was halted after six weeks.|run a clinical trial
ethical|etik, ahlaki|B2|adj|bil|Ethical limits on research vary by jurisdiction.|ethical concerns
sustainable|sürdürülebilir|B2|adj|bil|Sustainable energy is now cheaper than coal.|sustainable development
renewable|yenilenebilir|B2|adj|bil|Renewable capacity overtook coal in 2024.|renewable energy
findings|bulgular|B2|n|bil|The findings contradicted thirty years of assumptions.|publish findings
empirical|görgül, deneysel|C1|adj|bil|Empirical work beats elegant theory in the long run.|empirical evidence
pioneering|öncü|C1|adj|bil|Her pioneering work went uncited for a decade.|pioneering research
acquaintance|tanıdık|B2|n|ili|He has many acquaintances and three friends.|a casual acquaintance
mutual|karşılıklı|B2|adj|ili|Respect has to be mutual or it is obedience.|mutual respect
rapport|uyum, sıcak ilişki|C1|n|ili|She built rapport with the class in a week.|establish rapport
reciprocity|karşılıklılık|C1|n|ili|Reciprocity holds communities together more than law.|the norm of reciprocity
empathy|empati|B2|n|ili|Empathy is a skill, not a temperament.|show empathy
conflict|çatışma|B1|n,v|ili|Conflict avoided is rarely conflict resolved.|resolve a conflict
reconcile|barıştırmak, uzlaştırmak|C1|v|ili|They reconciled after two years of silence.|reconcile with sb
estranged|araları açılmış|C1|adj|ili|He remained estranged from his brother until the funeral.|become estranged
confide|sır vermek|C1|v|ili|She confides in nobody at school.|confide in sb
loyalty|sadakat|B2|n|ili|Loyalty is tested only when it costs something.|unwavering loyalty
betray|ihanet etmek|B2|v|ili|He betrayed the group by publishing the minutes.|betray a trust
intimacy|yakınlık|C1|n|ili|Intimacy requires time that modern schedules refuse.|emotional intimacy
dependable|güvenilir|B2|adj|ili|A dependable friend outranks an exciting one.|a dependable colleague
tension|gerginlik|B2|n|ili|Tension built across three silent dinners.|ease tension
compromise|uzlaşma|B2|n,v|ili|Compromise is how adults disagree successfully.|reach a compromise
community|topluluk|B1|n|cem|A community is defined by what it refuses to lose.|a close-knit community
neighbourhood|mahalle|B1|n|cem|The neighbourhood changed faster than its residents.|a working-class neighbourhood
grassroots|tabandan gelen|C1|adj,n|cem|The campaign began as a grassroots initiative.|a grassroots movement
cohesion|bütünlük, kaynaşma|C1|n|cem|Social cohesion weakens when housing becomes speculative.|social cohesion
belonging|aidiyet|B2|n|cem|A sense of belonging predicts school attendance.|a sense of belonging
voluntary|gönüllü|B2|adj|cem|Voluntary work carries the services the state abandoned.|voluntary organisations
charity|hayır kurumu, hayırseverlik|B1|n|cem|The charity ran the clinic for fifteen years.|a registered charity
donate|bağışlamak|B1|v|cem|Local shops donated everything the kitchen needed.|donate money
initiative|girişim|B2|n|cem|The initiative survived three changes of government.|launch an initiative
collective action|ortak eylem|C1|n|cem|Collective action succeeds where petitions fail.|take collective action
stakeholder|paydaş|C1|n|cem|Residents are stakeholders, not merely consumers.|key stakeholders
inclusive|kapsayıcı|B2|adj|cem|An inclusive plan survives the next election.|an inclusive process
isolation|yalıtılmışlık|B2|n|cem|Isolation among the elderly rose with the rents.|social isolation
public space|kamusal alan|B2|n|cem|Public space is the only thing everyone owns.|shared public space
mobilise|harekete geçirmek|C1|v|cem|The union mobilised twelve thousand members in a day.|mobilise support
activism|eylemcilik|B2|n|kat|Student activism built the universities it later criticised.|political activism
campaign|kampanya|B1|n,v|kat|The campaign changed the law within two years.|launch a campaign
petition|dilekçe, imza kampanyası|B2|n,v|kat|The petition gathered signatures and little else.|sign a petition
protest|protesto|B1|n,v|kat|Protest is speech that refuses to be scheduled.|stage a protest
demonstration|gösteri|B2|n|kat|The demonstration filled the square by noon.|hold a demonstration
advocacy|savunuculuk|C1|n|kat|Advocacy groups shaped the final wording.|advocacy work
boycott|boykot|B2|n,v|kat|The boycott cost the company a quarter of its revenue.|organise a boycott
lobby|lobi yapmak|C1|v,n|kat|Industry lobbied against every draft.|lobby for sth
turnout|katılım oranı|B2|n|kat|Low turnout favours the organised minority.|voter turnout
civic|yurttaşlık ile ilgili|C1|adj|kat|Civic education is the cheapest democratic investment.|civic duty
engagement|katılım|B2|n|kat|Engagement is measured in hours, not opinions.|civic engagement
apathy|kayıtsızlık|C1|n|kat|Apathy is a political position with no manifesto.|voter apathy
accountability|hesap verebilirlik|C1|n|kat|Accountability requires records somebody can read.|demand accountability
transparency|şeffaflık|B2|n|kat|Transparency is uncomfortable and necessary.|greater transparency
grass-roots mobilisation|tabandan örgütlenme|C1|n|kat|Grass-roots mobilisation beat a far larger budget.|grass-roots mobilisation
curriculum|müfredat|B2|n|egt|The curriculum changed four times in a decade.|the national curriculum
assessment|değerlendirme|B2|n|egt|Assessment shapes teaching more than any syllabus.|continuous assessment
literacy|okuryazarlık|B2|n|egt|Literacy is the gateway to everything else.|basic literacy
numeracy|sayısal okuryazarlık|C1|n|egt|Numeracy rates lag behind literacy almost everywhere.|improve numeracy
tuition|öğrenim ücreti, ders|B2|n|egt|Private tuition widens the gap it claims to close.|tuition fees
scholarship|burs|B1|n|egt|The scholarship covered fees but not living costs.|win a scholarship
vocational|mesleki|B2|adj|egt|Vocational training is undervalued and overdue.|vocational education
rote learning|ezberci öğrenme|C1|n|egt|Rote learning survives because it is easy to examine.|rely on rote learning
critical thinking|eleştirel düşünme|B2|n|egt|Critical thinking cannot be taught in a single term.|develop critical thinking
dropout|okulu bırakan|B2|n|egt|Dropout rates rise sharply after the first year.|the dropout rate
streaming|seviye gruplaması|C1|n|egt|Streaming by ability entrenches early disadvantage.|academic streaming
meritocracy|liyakat düzeni|C1|n|egt|Meritocracy assumes an equal starting line.|a true meritocracy
extracurricular|ders dışı|B2|adj|egt|Extracurricular activities decide admissions more than grades.|extracurricular activities
pedagogy|eğitim bilimi|C1|n|egt|Pedagogy changes slower than the children it serves.|modern pedagogy
qualification|yeterlilik belgesi|B1|n|egt|The qualification opened doors the knowledge did not.|a formal qualification
employment|istihdam|B1|n|cal|Employment figures hide the quality of the work.|full employment
unemployment|işsizlik|B1|n|cal|Youth unemployment doubles during every recession.|rising unemployment
workforce|işgücü|B2|n|cal|Women entered the workforce faster than policy adapted.|the labour workforce
recruitment|işe alım|B2|n|cal|Recruitment now begins on social media.|the recruitment process
promotion|terfi|B1|n|cal|Promotion rewarded loyalty rather than output.|get a promotion
redundancy|işten çıkarma|C1|n|cal|Redundancies were announced by email.|face redundancy
freelance|serbest çalışan|B2|adj,n|cal|Freelance work trades security for control.|work freelance
remote work|uzaktan çalışma|B2|n|cal|Remote work redistributed rent before it redistributed power.|shift to remote work
burn out|tükenmek|B2|v|cal|Half the team burned out before the deadline.|burn out at work
exploitation|sömürü|C1|n|cal|Exploitation hides behind the word internship.|labour exploitation
trade union|sendika|B2|n|cal|The trade union negotiated the first written contract.|join a trade union
minimum wage|asgari ücret|B2|n|cal|The minimum wage rose below the inflation rate.|raise the minimum wage
gig economy|esnek çalışma ekonomisi|C1|n|cal|The gig economy converted employees into invoices.|work in the gig economy
entrepreneur|girişimci|B2|n|cal|Every entrepreneur is a survivor of selection bias.|a young entrepreneur
glass ceiling|cam tavan|C1|n|cal|The glass ceiling is invisible until you hit it.|break the glass ceiling
legislation|yasa, mevzuat|B2|n|huk|The legislation passed without a single amendment.|pass legislation
judiciary|yargı|C1|n|huk|An independent judiciary is a constitutional load-bearing wall.|an independent judiciary
verdict|karar, hüküm|B2|n|huk|The verdict satisfied nobody and ended nothing.|reach a verdict
prosecute|kovuşturmak|C1|v|huk|The state declined to prosecute.|prosecute a case
defendant|sanık|B2|n|huk|The defendant appeared without legal representation.|the defendant pleaded
testimony|tanıklık|C1|n|huk|Her testimony lasted four hours.|give testimony
jurisdiction|yargı yetkisi|C1|n|huk|The court lacked jurisdiction over foreign nationals.|within its jurisdiction
constitution|anayasa|B2|n|huk|A constitution is a promise a state makes to itself.|amend the constitution
sovereignty|egemenlik|C1|n|huk|Sovereignty is claimed more often than exercised.|national sovereignty
impunity|cezasızlık|C1|n|huk|Impunity invites repetition.|act with impunity
deterrent|caydırıcı|C1|n,adj|huk|Longer sentences work poorly as a deterrent.|a strong deterrent
rehabilitate|topluma kazandırmak|C1|v|huk|Prisons rarely rehabilitate anyone.|rehabilitate offenders
corruption|yolsuzluk|B2|n|huk|Corruption is a tax collected privately.|tackle corruption
enforce|uygulamak, yürürlüğe koymak|B2|v|huk|The rule exists; nobody enforces it.|enforce a law
due process|hukuka uygun yargılama|C1|n|huk|Due process protects the guilty in order to protect everyone.|the right to due process
climate change|iklim değişikliği|B1|n|cev|Climate change is a political problem with a physical deadline.|combat climate change
emissions|salım, emisyon|B2|n|cev|Emissions fell during lockdown and rebounded within a year.|cut emissions
carbon footprint|karbon ayak izi|B2|n|cev|One long flight ruins a whole year of careful carbon footprint cuts.|reduce your carbon footprint
deforestation|ormansızlaşma|B2|n|cev|Deforestation accelerates in the years after a road is built.|halt deforestation
biodiversity|biyoçeşitlilik|B2|n|cev|Biodiversity collapses quietly, without a headline.|protect biodiversity
pollution|kirlilik|B1|n|cev|Air pollution kills more people than road accidents.|air pollution
conservation|koruma|B2|n|cev|Conservation works best when locals profit from it.|wildlife conservation
ecosystem|ekosistem|B2|n|cev|An ecosystem fails at its weakest link.|a fragile ecosystem
greenhouse gas|sera gazı|B2|n|cev|Methane is a greenhouse gas eighty times stronger than carbon dioxide.|greenhouse gas emissions
renewable|yenilenebilir|B2|adj|cev|Renewable capacity grew faster than any forecast.|renewable sources
depletion|tükenme|C1|n|cev|Groundwater depletion is irreversible on human timescales.|resource depletion
degradation|bozulma|C1|n|cev|Soil degradation threatens the next harvest, not the next century.|environmental degradation
mitigate|hafifletmek|C1|v|cev|Seawalls mitigate flooding without solving it.|mitigate the effects
offset|dengelemek, telafi etmek|C1|v,n|cev|Carbon offsets often move the problem rather than solve it.|carbon offset
landfill|çöp sahası|B2|n|cev|The landfill reached capacity a decade early.|send waste to landfill
human rights|insan hakları|B1|n|hak|Human rights are claims against power, not gifts from it.|violate human rights
dignity|onur, saygınlık|B2|n|hak|Dignity is the premise, not the conclusion, of rights law.|human dignity
violation|ihlal|B2|n|hak|The report documented four hundred violations.|a serious violation
oppression|baskı, zulüm|C1|n|hak|Oppression organises itself through paperwork.|political oppression
persecution|zulüm, kovuşturma|C1|n|hak|They fled religious persecution in 1938.|flee persecution
freedom of expression|ifade özgürlüğü|B2|n|hak|Freedom of expression protects speech we dislike.|defend freedom of expression
censor|sansürlemek|B2|v|hak|The book was censored and then became required reading.|censor the press
detain|gözaltına almak|C1|v|hak|He was detained without charge for eleven days.|detain sb without trial
torture|işkence|B2|n,v|hak|Torture produces confessions, not information.|ban torture
abolish|kaldırmak, ilga etmek|C1|v|hak|The death penalty was abolished in 2004.|abolish slavery
advocate|savunmak, savunucu|B2|v,n|hak|The organisation advocates for stateless children.|advocate for sth
entitlement|hak sahipliği|C1|n|hak|Healthcare is treated as an entitlement in most of Europe|a legal entitlement
discriminate|ayrımcılık yapmak|B2|v|hak|The policy discriminates in effect if not in wording.|discriminate against sb
redress|telafi, giderim|C1|n|hak|Victims sought redress through the European court.|seek redress
universal|evrensel|B2|adj|hak|Universal rights lose meaning when enforcement is selective.|universal suffrage
conflict|çatışma|B1|n|bar|The conflict outlasted every government that fuelled it.|an armed conflict
ceasefire|ateşkes|B2|n|bar|The ceasefire held for nine days.|declare a ceasefire
negotiation|müzakere|B2|n|bar|Negotiation starts when both sides stop expecting victory.|enter negotiations
mediation|arabuluculuk|C1|n|bar|Mediation succeeded where ultimatums had failed.|international mediation
diplomacy|diplomasi|B2|n|bar|Diplomacy is the management of disagreement.|quiet diplomacy
sanction|yaptırım|B2|n,v|bar|Sanctions rarely change a regime's behaviour.|impose sanctions
intervention|müdahale|B2|n|bar|Intervention without an exit plan becomes occupation.|military intervention
escalate|tırmandırmak|C1|v|bar|Both sides escalated after the first casualty.|escalate a conflict
de-escalate|gerilimi düşürmek|C1|v|bar|Back channels de-escalated the crisis within hours.|de-escalate tensions
atrocity|vahşet|C1|n|bar|The atrocity was documented and never prosecuted.|commit an atrocity
reconciliation|uzlaşma|C1|n|bar|Reconciliation requires truth before it requires forgiveness.|national reconciliation
deterrence|caydırıcılık|C1|n|bar|Deterrence works until the day it does not.|nuclear deterrence
treaty|antlaşma|B2|n|bar|The treaty was signed in 1919 and resented immediately.|sign a treaty
disarmament|silahsızlanma|C1|n|bar|Disarmament talks collapsed over verification.|nuclear disarmament
peacekeeping|barışı koruma|B2|n|bar|Peacekeeping forces cannot make a peace that does not exist.|a peacekeeping mission
equality|eşitlik|B1|n|esi|Equality of opportunity is not equality of outcome.|gender equality
inequality|eşitsizlik|B2|n|esi|Inequality is measured in postcodes as much as incomes.|rising inequality
discrimination|ayrımcılık|B2|n|esi|Discrimination survives by becoming indirect.|racial discrimination
prejudice|önyargı|B2|n|esi|Prejudice precedes the reasons invented to justify it.|overcome prejudice
bias|yanlılık, önyargı|B2|n|esi|Unconscious bias shapes hiring more than stated policy.|unconscious bias
marginalised|dışlanmış|C1|adj|esi|Marginalised groups are consulted after the decision.|marginalised communities
underrepresented|yeterince temsil edilmeyen|C1|adj|esi|Women remain underrepresented in senior positions.|underrepresented groups
affirmative action|pozitif ayrımcılık|C1|n|esi|Affirmative action remains contested in every country that uses it.|affirmative action policies
quota|kota|B2|n|esi|The quota changed the numbers and not the culture.|introduce a quota
empower|güçlendirmek|B2|v|esi|Microcredit empowered some and indebted others.|empower women
privilege|ayrıcalık|B2|n|esi|Privilege is invisible to those who hold it.|unearned privilege
accessible|erişilebilir|B2|adj|esi|Public buildings must be accessible by law.|accessible to disabled people
inclusion|kapsayıcılık|B2|n|esi|Inclusion means changing the room, not inviting guests.|social inclusion
disparity|eşitsizlik, fark|C1|n|esi|The disparity in school funding is deliberate.|a widening disparity
level the playing field|eşit şartlar sağlamak|C1|phr|esi|Free transport levels the playing field for rural students.|level the playing field
globalisation|küreselleşme|B2|n|kur|Globalisation moved jobs before it moved people.|economic globalisation
interdependence|karşılıklı bağımlılık|C1|n|kur|Interdependence raises the cost of war.|economic interdependence
multinational|çok uluslu|B2|adj,n|kur|Multinational firms outgrew the states that host them.|a multinational corporation
outsourcing|dış kaynak kullanımı|B2|n|kur|Outsourcing exported the work and imported the profits.|outsourcing production
supply chain|tedarik zinciri|B2|n|kur|One port closure exposed the whole supply chain.|a global supply chain
free trade|serbest ticaret|B2|n|kur|Free trade enriches nations and impoverishes regions.|a free trade agreement
protectionism|korumacılık|C1|n|kur|Protectionism returns whenever growth stops.|rising protectionism
homogenisation|tektipleşme|C1|n|kur|Cultural homogenisation is exaggerated and real at once.|cultural homogenisation
cultural imperialism|kültürel emperyalizm|C1|n|kur|Critics call the export of formats cultural imperialism.|accusations of cultural imperialism
sovereignty|egemenlik|C1|n|kur|Trade deals trade sovereignty for access.|surrender sovereignty
emerging economy|yükselen ekonomi|C1|n|kur|Emerging economies set the terms by 2040.|a fast-growing emerging economy
exploit|sömürmek|B2|v|kur|Supply chains exploit the countries that assemble them.|exploit cheap labour
integration|bütünleşme|B2|n|kur|European integration advanced through crises.|economic integration
standardisation|standartlaştırma|C1|n|kur|Standardisation made trade cheap and food identical.|global standardisation
interconnected|birbirine bağlı|B2|adj|kur|An interconnected world transmits panic as fast as goods.|an interconnected world
dilemma|ikilem|B2|n|eti|An ethical dilemma has no option without a cost.|face a dilemma
moral|ahlaki|B2|adj|eti|A moral argument must survive its own application.|a moral obligation
consent|rıza, onay|B2|n,v|eti|Consent buried in terms of service is not consent.|informed consent
accountable|hesap verebilir|B2|adj|eti|Someone must be accountable when the algorithm errs.|hold sb accountable
justify|haklı çıkarmak|B2|v|eti|The end justifies the means only in the short term.|justify a decision
conscience|vicdan|B2|n|eti|Conscience is an unreliable but necessary instrument.|a clear conscience
scruple|vicdani kaygı|C1|n|eti|He had no scruples about publishing the letters.|have no scruples
unethical|etik dışı|B2|adj|eti|The trial was unethical even where it was legal.|unethical behaviour
exploitative|sömürücü|C1|adj|eti|The contract was legal and plainly exploitative.|exploitative practices
integrity|dürüstlük|B2|n|eti|Academic integrity collapses quietly, one citation at a time.|academic integrity
plagiarism|intihal|B2|n|eti|Plagiarism is theft of credit, not of words.|commit plagiarism
whistleblower|ifşacı|C1|n|eti|The whistleblower lost her job and won the argument.|protect whistleblowers
vested interest|çıkar ilişkisi|C1|n|eti|Those with a vested interest funded the research.|a vested interest
transparent|şeffaf|B2|adj|eti|A transparent process survives scrutiny.|a transparent system
at stake|söz konusu, tehlikede|B2|phr|eti|What is at stake is trust, not profit.|be at stake
urbanisation|kentleşme|B2|n|ken|Urbanisation outpaced the infrastructure it required.|rapid urbanisation
infrastructure|altyapı|B2|n|ken|Infrastructure is invisible until it fails.|crumbling infrastructure
congestion|tıkanıklık|B2|n|ken|Congestion costs Istanbul a working week each year.|traffic congestion
gentrification|soylulaştırma|C1|n|ken|Gentrification restores buildings and removes residents.|resist gentrification
suburb|banliyö|B2|n|ken|The suburbs grew where the railway stopped.|an outer suburb
rural|kırsal|B1|adj|ken|Rural depopulation emptied three hundred villages.|rural areas
sprawl|çarpık yayılma|C1|n|ken|Urban sprawl consumed the farmland that fed the city.|urban sprawl
slum|gecekondu bölgesi|B2|n|ken|The slum was cleared and the people were not rehoused.|clear a slum
affordable housing|uygun fiyatlı konut|B2|n|ken|Affordable housing disappears whenever a district becomes fashionable.|build affordable housing
zoning|imar düzenlemesi|C1|n|ken|Zoning decides who lives where for fifty years.|zoning laws
amenity|kolaylık, olanak|C1|n|ken|Parks are an amenity and a public health measure.|local amenities
commuter|işe gidip gelen|B2|n|ken|Commuters lose two hours a day to the bridge.|a commuter town
density|yoğunluk|B2|n|ken|High density is efficient and politically unpopular.|population density
regeneration|yenileme, canlandırma|C1|n|ken|Urban regeneration rarely benefits the existing residents.|urban regeneration
rural exodus|kırdan göç|C1|n|ken|The rural exodus began with mechanised farming.|a mass rural exodus
narrator|anlatıcı|B2|n|edb|The narrator is unreliable from the second page onwards.|a first-person narrator
protagonist|başkişi|B2|n|edb|The protagonist never recognises his own cruelty.|the main protagonist
antagonist|karşıt kişi|B2|n|edb|The antagonist is the system rather than a person.|the chief antagonist
point of view|bakış açısı|B2|n|edb|Shifting the point of view changes who deserves sympathy.|a shifting point of view
first-person|birinci tekil anlatım|B2|adj|edb|The first-person voice traps us inside his justifications.|a first-person narrative
omniscient|her şeyi bilen|C1|adj|edb|An omniscient narrator knows what the characters conceal.|an omniscient narrator
imagery|imge, imgelem|B2|n|edb|The imagery of water runs through the whole chapter.|vivid imagery
metaphor|eğretileme|B2|n|edb|The city works as a metaphor for memory.|an extended metaphor
simile|benzetme|B2|n|edb|The simile compares the crowd to a slow river.|use a simile
symbolism|simgecilik|B2|n|edb|The symbolism of the closed window is unmistakable.|religious symbolism
motif|izlek, motif|C1|n|edb|The motif of the unanswered letter recurs four times.|a recurring motif
theme|tema, izlek|B1|n|edb|The central theme is exile rather than loss.|explore a theme
tone|ton|B2|n|edb|The tone shifts from irony to grief without warning.|a detached tone
mood|atmosfer, hava|B2|n|edb|The mood of the passage is oppressive and still.|create a mood
irony|ironi|B2|n|edb|The irony is that he achieves exactly what he feared.|dramatic irony
foreshadow|önceden sezdirmek|C1|v|edb|The broken clock foreshadows the ending.|foreshadow an event
flashback|geriye dönüş|B2|n|edb|The flashback explains a silence held for forty pages.|a brief flashback
juxtapose|yan yana koymak|C1|v|edb|The author juxtaposes the funeral and the wedding.|juxtapose two images
contrast|karşıtlık|B1|n,v|edb|The contrast between the two brothers carries the plot.|a stark contrast
characterisation|kişileştirme, karakter çizimi|C1|n|edb|Characterisation happens through objects, not description.|indirect characterisation
diction|söz seçimi|C1|n|edb|The formal diction distances us from the narrator.|elevated diction
syntax|söz dizimi|C1|n|edb|The fragmented syntax imitates his panic.|fragmented syntax
connotation|çağrışım|C1|n|edb|The connotations of the word are colder than its meaning.|negative connotations
allusion|gönderme|C1|n|edb|The allusion to Antigone frames the whole argument.|a classical allusion
personification|kişileştirme|B2|n|edb|The personification of the river makes it an actor.|use personification
repetition|yineleme|B1|n|edb|The repetition of one phrase marks his deterioration.|deliberate repetition
climax|doruk nokta|B2|n|edb|The climax arrives without any raised voice.|reach a climax
denouement|çözülme, sonuç|C1|n|edb|The denouement explains too much and resolves too little.|a neat denouement
setting|mekân ve zaman|B1|n|edb|The setting is a provincial town in the 1970s.|an urban setting
convey|aktarmak, iletmek|B2|v|edb|The passage conveys exhaustion through its rhythm.|convey a message
evoke|uyandırmak|C1|v|edb|The description evokes heat without naming it.|evoke an atmosphere
portray|betimlemek|B2|v|edb|The author portrays bureaucracy as a natural force.|portray sb as sth
underpin|temelini oluşturmak|C1|v|edb|Class anxiety underpins every conversation in the scene.|underpin an argument
reinforce|pekiştirmek|B2|v|edb|The imagery reinforces the theme of confinement.|reinforce a point
highlight|öne çıkarmak|B1|v|edb|The extract highlights the gap between intention and effect.|highlight a contrast
illustrate|örneklemek|B2|v|edb|This paragraph illustrates the narrator's self-deception.|illustrate a point
suggest|ima etmek, düşündürmek|B1|v|edb|The final line suggests she already knew.|the text suggests
imply|ima etmek|B2|v|edb|The silence implies more than the dialogue states.|imply a criticism
reveal|açığa çıkarmak|B1|v|edb|The letter reveals what the narrator refuses to say.|reveal a truth
emphasise|vurgulamak|B2|v|edb|The repetition emphasises how little has changed.|emphasise the importance
in my view|bana göre|B1|phr|tar|In my view, the extract criticises obedience rather than authority.|in my view
it could be argued that|savunulabilir ki|C1|phr|tar|It could be argued that the narrator is the real antagonist.|it could be argued that
to a certain extent|bir ölçüde|B2|phr|tar|To a certain extent, both readings are supported by the text.|to a certain extent
on the one hand|bir yandan|B1|phr|tar|On the one hand the policy reduced emissions.|on the one hand
on the other hand|öte yandan|B1|phr|tar|On the other hand it raised the cost of heating.|on the other hand
having said that|yine de|B2|phr|tar|Having said that, the evidence is far from conclusive.|having said that
as far as I am concerned|bana kalırsa|B2|phr|tar|As far as I am concerned, the question is badly framed.|as far as I am concerned
that is to say|yani|B2|phr|tar|That is to say, the problem is structural rather than personal.|that is to say
in other words|başka bir deyişle|B1|phr|tar|In other words, nobody was accountable.|in other words
to put it another way|başka türlü söylersek|B2|phr|tar|To put it another way, the reform failed by design.|to put it another way
what I mean is|demek istediğim|B1|phr|tar|What I mean is that the author withholds judgement.|what I mean is
I would say that|derim ki|B1|phr|tar|I would say that the setting does most of the work.|I would say that
it seems to me that|bana öyle geliyor ki|B2|phr|tar|It seems to me that the ending is deliberately unresolved.|it seems to me that
I take your point but|haklısınız ama|C1|phr|tar|I take your point, but the dates do not support it.|I take your point but
building on that|buna ekleyerek|C1|phr|tar|Building on that, the second extract reverses the image.|building on that
to be more precise|daha kesin söylemek gerekirse|B2|phr|tar|To be more precise, the shift happens in line twelve.|to be more precise
for instance|örneğin|B1|phr|tar|For instance, the window appears in every argument scene.|for instance
in particular|özellikle|B1|phr|tar|In particular, the final paragraph changes the tone.|in particular
above all|her şeyden önce|B2|phr|tar|Above all, the passage is about shame.|above all
admittedly|kabul etmek gerekir ki|C1|adv|tar|Admittedly, the evidence here is circumstantial.|admittedly
arguably|tartışmalı olarak, belki de|C1|adv|tar|Arguably, this is the novel's most important scene.|arguably
presumably|herhâlde, muhtemelen|B2|adv|tar|Presumably the narrator knows what he is omitting.|presumably
ultimately|nihayetinde|B2|adv|tar|Ultimately the question is who pays.|ultimately
nevertheless|yine de|B2|adv|tar|Nevertheless, the argument holds for the first half.|nevertheless
whereas|oysa, -iken|B2|conj|tar|The first brother acts, whereas the second explains.|whereas
bear in mind|göz önünde bulundurmak|B2|phr|tar|Bear in mind that the text was censored on publication.|bear in mind that
I am not entirely convinced|tam ikna olmuş değilim|C1|phr|tar|I am not entirely convinced by that reading.|not entirely convinced
that depends on|şuna bağlı|B1|phr|tar|That depends on which translation you read.|that depends on
let me rephrase that|şöyle düzelteyim|C1|phr|tar|Let me rephrase that more carefully.|let me rephrase that
if I understood correctly|doğru anladıysam|B2|phr|tar|If I understood correctly, you mean the second passage.|if I understood correctly
could you clarify|açar mısınız|B2|phr|tar|Could you clarify which theme you have in mind?|could you clarify
I had not considered that|bunu düşünmemiştim|B2|phr|tar|I had not considered that, and it changes my reading.|I had not considered that
to sum up|özetle|B1|phr|tar|To sum up, the extract resists a single interpretation.|to sum up
in conclusion|sonuç olarak|B1|phr|tar|In conclusion, the author refuses to take sides.|in conclusion
analyse|çözümlemek|B2|v|akd|The essay analyses causes rather than listing events.|analyse data
assess|değerlendirmek|B2|v|akd|Assess the extent to which the policy succeeded.|assess the impact
evaluate|değerlendirmek, tartmak|B2|v|akd|Evaluate both interpretations before choosing one.|evaluate evidence
interpret|yorumlamak|B2|v|akd|Two historians interpret the same letter differently.|interpret a result
establish|ortaya koymak, kurmak|B2|v|akd|The study establishes a link, not a cause.|establish a link
demonstrate|göstermek, kanıtlamak|B2|v|akd|The data demonstrate a steady decline.|demonstrate clearly
indicate|işaret etmek|B2|v|akd|The figures indicate a slowdown rather than a crisis.|indicate a trend
imply|ima etmek|B2|v|akd|The wording implies responsibility without admitting it.|imply causation
infer|çıkarımda bulunmak|C1|v|akd|We can infer intent from the sequence of orders.|infer from evidence
derive|türetmek, elde etmek|C1|v|akd|The term derives from nineteenth-century law.|derive from sth
contradict|çelişmek|B2|v|akd|The second source contradicts the first on dates.|contradict a claim
corroborate|doğrulamak|C1|v|akd|Three independent accounts corroborate the story.|corroborate evidence
refute|çürütmek|C1|v|akd|The data refute the simplest version of the theory.|refute an argument
substantiate|kanıtlarla desteklemek|C1|v|akd|He never substantiated the accusation.|substantiate a claim
undermine|zayıflatmak|C1|v|akd|One error undermines the entire chapter.|undermine credibility
constitute|oluşturmak|C1|v|akd|These three factors constitute the whole explanation.|constitute a majority
comprise|kapsamak, -den oluşmak|C1|v|akd|The council comprises fifteen elected members.|comprise several parts
encompass|kapsamak|C1|v|akd|The term encompasses far more than migration.|encompass a range
entail|gerektirmek|C1|v|akd|Membership entails obligations most states ignore.|entail consequences
attribute|atfetmek|C1|v|akd|Historians attribute the collapse to three decisions.|attribute sth to sth
account for|açıklamak, oranını oluşturmak|B2|phr|akd|Agriculture accounts for a quarter of emissions.|account for a proportion
contribute to|katkıda bulunmak|B2|phr|akd|Several factors contributed to the outcome.|contribute to a result
result in|yol açmak|B2|phr|akd|The reform resulted in higher inequality.|result in sth
stem from|kaynaklanmak|C1|phr|akd|The dispute stems from a colonial-era map.|stem from sth
give rise to|doğurmak|C1|phr|akd|Deregulation gave rise to the crisis of 2008.|give rise to sth
significant|anlamlı, önemli|B2|adj|akd|The difference is statistically significant.|a significant increase
substantial|hatırı sayılır|B2|adj|akd|Substantial funding arrived two years too late.|a substantial sum
considerable|epeyce, hayli|B2|adj|akd|Considerable evidence supports the second reading.|considerable influence
marginal|sınırda, önemsiz|C1|adj|akd|The effect was marginal and short-lived.|a marginal difference
negligible|ihmal edilebilir|C1|adj|akd|The cost was negligible compared with the benefit.|a negligible amount
prevalent|yaygın|C1|adj|akd|The practice is prevalent across the region.|widely prevalent
inherent|özünde var olan|C1|adj|akd|The risk is inherent in the design.|an inherent flaw
inevitable|kaçınılmaz|B2|adj|akd|Confrontation became inevitable after the ultimatum.|an inevitable consequence
viable|uygulanabilir|C1|adj|akd|No viable alternative was presented.|a viable option
plausible|akla yatkın|C1|adj|akd|The explanation is plausible but unverified.|a plausible account
ambiguous|belirsiz, çift anlamlı|C1|adj|akd|The clause is deliberately ambiguous.|deliberately ambiguous
contentious|tartışmalı|C1|adj|akd|The figure remains contentious among economists.|a contentious issue
compelling|ikna edici, sürükleyici|C1|adj|akd|She makes a compelling case for intervention.|a compelling argument
conclusive|kesin, bağlayıcı|C1|adj|akd|The evidence is suggestive rather than conclusive.|conclusive proof
unprecedented|eşi görülmemiş|C1|adj|akd|The scale of displacement was unprecedented.|an unprecedented crisis
acknowledge|kabul etmek, teslim etmek|B2|v|fii|He acknowledges the objection without answering it.|acknowledge a point
advocate|savunmak|B2|v|fii|Several delegates advocated an immediate ceasefire.|advocate reform
alleviate|hafifletmek|C1|v|fii|Subsidies alleviate the symptom and entrench the cause.|alleviate poverty
anticipate|öngörmek|B2|v|fii|The report anticipates a shortage by 2030.|anticipate problems
assert|ileri sürmek|C1|v|fii|He asserts, without evidence, that nobody objected.|assert a right
compel|zorlamak|C1|v|fii|The ruling compels the ministry to publish the data.|compel sb to do sth
condemn|kınamak|B2|v|fii|The assembly condemned the strike in careful language.|condemn an action
curb|dizginlemek|C1|v|fii|The law was designed to curb speculation.|curb inflation
deter|caydırmak|C1|v|fii|Higher fines did not deter repeat offenders.|deter sb from doing sth
devise|tasarlamak|C1|v|fii|They devised a system nobody could audit.|devise a plan
diminish|azaltmak, azalmak|B2|v|fii|Its influence diminished after the 1990s.|diminish rapidly
dismantle|sökmek, dağıtmak|C1|v|fii|The reforms dismantled the welfare system piece by piece.|dismantle an institution
dismiss|reddetmek, savuşturmak|B2|v|fii|He dismissed the criticism as nostalgia.|dismiss a claim
emerge|ortaya çıkmak|B2|v|fii|A pattern emerges only across several decades.|emerge from sth
endorse|desteklemek, onaylamak|C1|v|fii|The union endorsed the agreement reluctantly.|endorse a candidate
enhance|geliştirmek, artırmak|B2|v|fii|Subtitles enhance comprehension for every viewer.|enhance quality
exacerbate|kötüleştirmek|C1|v|fii|The curfew exacerbated the shortage.|exacerbate a problem
facilitate|kolaylaştırmak|C1|v|fii|The platform facilitates coordination between strangers.|facilitate change
foster|beslemek, teşvik etmek|C1|v|fii|Small classes foster participation.|foster cooperation
hinder|engellemek|C1|v|fii|Bureaucracy hinders exactly what it claims to protect.|hinder progress
impose|dayatmak|B2|v|fii|Sanctions were imposed within a week.|impose a ban
jeopardise|tehlikeye atmak|C1|v|fii|The leak jeopardised the entire negotiation.|jeopardise safety
mitigate|hafifletmek|C1|v|fii|Planting trees mitigates flooding only marginally.|mitigate risk
overlook|gözden kaçırmak|B2|v|fii|The analysis overlooks domestic politics entirely.|overlook a detail
perpetuate|sürdürmek, devam ettirmek|C1|v|fii|The textbook perpetuates a myth about the founding.|perpetuate inequality
prioritise|önceliklendirmek|B2|v|fii|Governments prioritise what can be measured.|prioritise spending
reinforce|pekiştirmek|B2|v|fii|Coverage reinforced the stereotype it set out to question.|reinforce a belief
reshape|yeniden biçimlendirmek|B2|v|fii|Migration reshaped the city within a generation.|reshape a society
scrutinise|dikkatle incelemek|C1|v|fii|Journalists scrutinised every line of the contract.|scrutinise closely
undermine|zayıflatmak, altını oymak|C1|v|fii|Selective enforcement undermines the law itself.|undermine trust
abundant|bol|B2|adj|sif|Evidence is abundant; agreement is not.|abundant resources
acute|keskin, şiddetli|C1|adj|sif|The shortage became acute within a fortnight.|an acute crisis
arbitrary|keyfi|C1|adj|sif|The deadline was arbitrary and therefore unfair.|an arbitrary decision
coherent|tutarlı|B2|adj|sif|No coherent strategy emerged from the summit.|a coherent policy
detrimental|zararlı|C1|adj|sif|The cuts were detrimental to rural schools.|detrimental to health
distinct|belirgin, ayrı|B2|adj|sif|Three distinct phases can be identified.|a distinct advantage
diverse|çeşitli|B2|adj|sif|A diverse jury reaches different conclusions.|a diverse population
feasible|yapılabilir|C1|adj|sif|The timetable is ambitious but feasible.|technically feasible
fragile|kırılgan|B2|adj|sif|The ceasefire remains fragile.|a fragile peace
fundamental|temel|B2|adj|sif|The disagreement is fundamental, not procedural.|a fundamental right
indispensable|vazgeçilmez|C1|adj|sif|Local knowledge proved indispensable.|an indispensable tool
intricate|karmaşık, ince işlenmiş|C1|adj|sif|The plot is intricate without being confusing.|an intricate design
profound|derin|C1|adj|sif|The decision had profound consequences for the region.|a profound effect
robust|sağlam, güçlü|C1|adj|sif|The findings are robust across all three samples.|robust evidence
scarce|kıt|B2|adj|sif|Clean water is scarce in the southern provinces.|scarce resources
stark|çarpıcı, keskin|C1|adj|sif|The contrast between the two districts is stark.|a stark difference
subtle|ince, sezilmesi güç|B2|adj|sif|The shift in tone is subtle and decisive.|a subtle change
vulnerable|kırılgan, savunmasız|B2|adj|sif|Vulnerable households were excluded from the scheme.|vulnerable groups
widespread|yaygın|B2|adj|sif|Protests were widespread but uncoordinated.|widespread support
ambivalent|kararsız, iki duygulu|C1|adj|sif|Public opinion remained ambivalent throughout.|ambivalent about sth
bring about|yol açmak|B2|phr|dey|The reform brought about changes nobody intended.|bring about change
carry out|yürütmek|B1|phr|dey|The ministry carried out an internal review.|carry out research
put forward|ileri sürmek|B2|phr|dey|She put forward a proposal the committee ignored.|put forward an idea
point out|dikkat çekmek|B1|phr|dey|Critics point out that the data end in 2019.|point out a flaw
rule out|dışlamak, elemek|B2|phr|dey|Investigators ruled out sabotage within a day.|rule out a possibility
break down|dökümünü vermek, bozulmak|B2|phr|dey|Let me break down the figures by region.|break down into parts
back up|desteklemek|B2|phr|dey|Nothing in the archive backs up that claim.|back up an argument
set out|ortaya koymak, yola çıkmak|B2|phr|dey|The paper sets out three competing models.|set out a case
turn out|ortaya çıkmak, sonuçlanmak|B1|phr|dey|It turned out that the figures had been revised.|turn out to be
come up with|bulmak, üretmek|B1|phr|dey|They came up with a workaround overnight.|come up with a solution
look into|araştırmak|B1|phr|dey|The committee agreed to look into the allegations.|look into a matter
draw on|yararlanmak|C1|phr|dey|The essay draws on three unpublished interviews.|draw on experience
stem the tide|akışı durdurmak|C1|phr|dey|No policy could stem the tide of departures.|stem the tide of sth
take its toll|yıpratmak|C1|phr|dey|The commute took its toll on his concentration.|take its toll on sb
a double-edged sword|iki ucu keskin bıçak|C1|phr|dey|Transparency is a double-edged sword for diplomats.|be a double-edged sword
the tip of the iceberg|buzdağının görünen kısmı|B2|phr|dey|The reported cases are the tip of the iceberg.|the tip of the iceberg
a vicious circle|kısır döngü|B2|phr|dey|Debt and low pay form a vicious circle.|break a vicious circle
pave the way|yolunu açmak|C1|phr|dey|The treaty paved the way for the single market.|pave the way for sth
turn a blind eye|görmezden gelmek|C1|phr|dey|Regulators turned a blind eye for a decade.|turn a blind eye to sth
in the long run|uzun vadede|B1|phr|dey|In the long run, prevention costs less.|in the long run
at the expense of|pahasına|B2|phr|dey|Growth came at the expense of the coastline.|at the expense of sth
on the grounds that|gerekçesiyle|C1|phr|dey|The appeal was rejected on the grounds that it was late.|on the grounds that
with regard to|-e ilişkin|C1|phr|dey|With regard to funding, nothing has been decided.|with regard to sth
in the light of|ışığında|C1|phr|dey|In the light of new evidence, the case was reopened.|in the light of sth
bear the brunt|en ağır yükü taşımak|C1|phr|dey|Coastal towns bear the brunt of the storms.|bear the brunt of sth
however|ancak|B1|adv|bag|The plan was approved; however, funding never arrived.|however
therefore|bu nedenle|B1|adv|bag|The samples were contaminated; therefore the results are void.|therefore
nevertheless|buna rağmen|B2|adv|bag|Nevertheless, attendance rose for the third year.|nevertheless
nonetheless|yine de|C1|adv|bag|The theory is incomplete; nonetheless it remains useful.|nonetheless
moreover|üstelik|B2|adv|bag|Moreover, the costs were underestimated from the start.|moreover
furthermore|ayrıca|B2|adv|bag|Furthermore, no independent audit was ever commissioned.|furthermore
consequently|dolayısıyla|B2|adv|bag|Consequently, the deadline was pushed back twice.|consequently
accordingly|buna uygun olarak|C1|adv|bag|The budget was cut; accordingly, two programmes closed.|accordingly
conversely|tersine|C1|adv|bag|Conversely, rural turnout fell by nine points.|conversely
by contrast|buna karşılık|B2|phr|bag|By contrast, the northern districts gained population.|by contrast
likewise|aynı şekilde|C1|adv|bag|Likewise, the second trial produced no effect.|likewise
in addition|ek olarak|B1|phr|bag|In addition, the scheme excluded part-time workers.|in addition to
despite|-e rağmen|B1|prep|bag|Despite the warnings, construction continued.|despite sth
although|-mesine rağmen|B1|conj|bag|Although the evidence is thin, the conclusion is plausible.|although
whereas|oysa|B2|conj|bag|The first study found an effect, whereas the second did not.|whereas
provided that|şartıyla|C1|conj|bag|Aid continues, provided that monitoring is allowed.|provided that
unless|-medikçe|B1|conj|bag|Unless funding is renewed, the clinic closes in June.|unless
hence|bu yüzden|C1|adv|bag|The samples were lost; hence the study cannot be replicated.|hence
thereby|böylece|C1|adv|bag|The law removed the exemption, thereby raising costs.|thereby
notably|özellikle|C1|adv|bag|Several states abstained, notably France.|notably
wellness|iyi yaşam|B2|n|yas|The wellness industry sells what sleep provides free.|the wellness industry
vegan|vegan|B1|adj,n|yas|Vegan menus appeared in every canteen within two years.|a vegan diet
nomadic|göçebe|C1|adj|yas|Digital nomadic work suits very few people in practice.|a nomadic lifestyle
urban|kentsel|B1|adj|yas|Urban loneliness is a design problem, not a mood.|urban living
rural|kırsal|B1|adj|yas|Rural life is slower and considerably less private.|rural living
work-life balance|iş yaşam dengesi|B2|n|yas|Work-life balance is a privilege disguised as a choice.|maintain a work-life balance
screen time|ekran süresi|B1|n|yas|His screen time exceeds his sleep on weekdays.|limit screen time
sustainable living|sürdürülebilir yaşam|B2|n|yas|Sustainable living costs more at the till and less overall.|practise sustainable living
metabolism|metabolizma|B2|n|sag|Metabolism slows long before anyone notices.|a slow metabolism
hydration|su alımı|B2|n|sag|Hydration affects concentration within two hours.|maintain hydration
fatigue|yorgunluk|B2|n|sag|Decision fatigue explains bad choices made late at night.|chronic fatigue
relapse|nüksetme|C1|n,v|sag|Relapse is part of recovery, not its failure.|suffer a relapse
prognosis|seyir, gidişat|C1|n|sag|The prognosis improved after the second scan.|a poor prognosis
contagious|bulaşıcı|B2|adj|sag|Panic is as contagious as any virus.|highly contagious
malnutrition|yetersiz beslenme|B2|n|sag|Malnutrition stunts growth irreversibly.|suffer from malnutrition
cardiovascular|kalp damar ile ilgili|C1|adj|sag|Cardiovascular disease remains the leading cause of death.|cardiovascular health
altruism|özgecilik|C1|n|inn|Altruism survives even where incentives punish it.|pure altruism
fatalism|kadercilik|C1|n|inn|Fatalism is a rational response to powerlessness.|a sense of fatalism
scepticism|kuşkuculuk|C1|n|inn|Healthy scepticism differs from reflexive denial.|widespread scepticism
dogmatic|bağnaz|C1|adj|inn|His dogmatic certainty closed every discussion.|a dogmatic approach
pluralism|çoğulculuk|C1|n|inn|Pluralism demands tolerance of what you find wrong.|religious pluralism
sanctity|kutsallık|C1|n|inn|The sanctity of the home is a legal fiction worth keeping.|the sanctity of life
martyr|şehit|C1|n|inn|Every movement needs a martyr it can name.|become a martyr
hipster|hipster|B2|n|alt|The hipster aesthetic colonised three districts in a decade.|hipster culture
graffiti|grafiti|B2|n|alt|Graffiti is vandalism until a gallery buys the wall.|cover in graffiti
anonymity|anonimlik|C1|n|alt|Anonymity enables both courage and cruelty.|preserve anonymity
conformity|uyma, benzeşme|C1|n|alt|Conformity is the price of belonging anywhere.|social conformity
provocation|kışkırtma|C1|n|alt|The haircut was a provocation and everyone understood it.|a deliberate provocation
underdog|ezilen taraf, zayıf olan|B2|n|alt|Crowds support the underdog until it starts winning.|back the underdog
semantics|anlam bilimi|C1|n|dil|The dispute is about semantics and therefore about power.|a question of semantics
etymology|köken bilimi|C1|n|dil|The etymology reveals an insult that became a compliment.|trace the etymology
loanword|ödünç sözcük|C1|n|dil|Half the vocabulary of science is a loanword.|a French loanword
intonation|tonlama|B2|n|dil|Intonation carries the meaning the words withhold.|rising intonation
paraphrase|başka sözcüklerle anlatmak|B2|v,n|dil|Paraphrase the passage without using its nouns.|paraphrase a text
bilingualism|iki dillilik|C1|n|dil|Bilingualism delays cognitive decline by several years.|childhood bilingualism
craft|el sanatı, zanaat|B2|n|bos|Crafts returned as a reaction to screens.|a traditional craft
collector|koleksiyoncu|B1|n|bos|Collectors preserve what museums refuse.|a keen collector
competitive|rekabetçi|B2|adj|bos|Amateur leagues are more competitive than professional ones.|highly competitive
wind down|yavaşlamak, sakinleşmek|B2|phr|bos|He winds down with a chapter and no phone.|wind down in the evening
visa|vize|B1|n|sey|The visa arrived after the conference ended.|apply for a visa
customs|gümrük|B2|n|sey|Customs held the equipment for three weeks.|clear customs
layover|aktarma beklemesi|B2|n|sey|The layover in Doha lasted nine hours.|a long layover
expatriate|gurbetçi, yurt dışında yaşayan|C1|n|sey|Expatriate communities recreate the country they left.|an expatriate community
wanderlust|gezi tutkusu|C1|n|sey|Wanderlust is cheaper to feel than to satisfy.|a sense of wanderlust
resilient|dayanıklı|B2|adj|oyk|Resilient people are not those who avoid damage.|a resilient character
hardship|zorluk, sıkıntı|B2|n|oyk|Hardship in childhood shows up decades later.|endure hardship
vocation|meslek tutkusu|C1|n|oyk|Teaching was a vocation rather than a job.|find one's vocation
anecdote|anekdot|B2|n|oyk|One anecdote is not evidence, however memorable.|tell an anecdote
milestone birthday|dönüm yaşı|B2|n|ger|Eighteen is a milestone birthday in law if not in feeling.|a milestone birthday
conscription|zorunlu askerlik|C1|n|ger|Conscription shaped a generation's sense of the state.|abolish conscription
coming-of-age|yetişkinliğe geçiş|B2|adj|ger|It is a coming-of-age film without any nostalgia.|a coming-of-age novel
ancestral|atalara ait|C1|adj|gel|They returned to the ancestral village every summer.|ancestral lands
ritualistic|törensel|C1|adj|gel|The ritualistic repetition gave the day its shape.|ritualistic behaviour
oral tradition|sözlü gelenek|B2|n|gel|Oral tradition preserved what no archive recorded.|an oral tradition
naturalisation|vatandaşlığa geçme|C1|n|goc|Naturalisation took eleven years and four appeals.|apply for naturalisation
repatriation|ülkesine geri gönderme|C1|n|goc|Repatriation was voluntary in name only.|forced repatriation
stateless|vatansız|C1|adj|goc|Stateless children inherit a problem they did not create.|a stateless person
influx|akın|C1|n|goc|The influx strained schools before it strained budgets.|a sudden influx
franchise|seri, marka|B2|n|egl|The franchise outlived every director who worked on it.|a film franchise
protagonist-driven|karakter odaklı|C1|adj|egl|The series is protagonist-driven and thin on plot.|protagonist-driven storytelling
cinematography|görüntü yönetmenliği|C1|n|egl|The cinematography does the work the script avoids.|striking cinematography
soundtrack|film müziği|B1|n|egl|The soundtrack carries scenes the dialogue cannot.|an original soundtrack
screenplay|senaryo|B2|n|egl|The screenplay was rewritten eleven times.|adapt a screenplay
adaptation|uyarlama|B2|n|egl|Every adaptation betrays the book in a useful way.|a film adaptation
curate|derlemek, seçip sunmak|C1|v|san|She curated the exhibition around a single colour.|curate a collection
installation|yerleştirme|C1|n|san|The installation occupied the entire ground floor.|an art installation
mural|duvar resmi|B2|n|san|The mural was painted over within a month.|paint a mural
restoration|restorasyon|B2|n|san|The restoration revealed a signature beneath the varnish.|careful restoration
commission|sipariş vermek, eser siparişi|C1|v,n|san|The mosque commissioned four calligraphers.|commission a work
calligraphy|hat sanatı|C1|n|san|Calligraphy treats writing as architecture.|Ottoman calligraphy
gatekeeper|eşik bekçisi|C1|n|med|Editors were gatekeepers; algorithms replaced them.|act as a gatekeeper
viral|viral, hızla yayılan|B2|adj|med|The clip went viral before anyone verified it.|go viral
sensationalism|magazinleştirme|C1|n|med|Sensationalism sells and informs nobody.|media sensationalism
anonymity|anonimlik|C1|n|med|Anonymity protects sources and shelters abuse.|online anonymity
polarisation|kutuplaşma|C1|n|med|Polarisation is profitable for everyone except citizens.|political polarisation
public opinion|kamuoyu|B2|n|med|Public opinion followed the coverage, not the facts.|shape public opinion
interface|arayüz|B2|n|tek|A good interface disappears while you use it.|a user interface
data breach|veri sızıntısı|C1|n|tek|The data breach exposed six million accounts.|suffer a data breach
cybersecurity|siber güvenlik|B2|n|tek|Cybersecurity is a budget line until it is a crisis.|invest in cybersecurity
digital footprint|dijital ayak izi|B2|n|tek|Your digital footprint outlives every account you delete.|leave a digital footprint
upgrade|yükseltmek|B1|v,n|tek|He upgrades only when the device refuses to charge.|upgrade a system
redundant|gereksiz, işlevsiz|C1|adj|tek|The skill became redundant within five years.|make sb redundant
variable|değişken|B2|n|bil|One uncontrolled variable invalidates the whole result.|a control variable
correlation|bağıntı|B2|n|bil|Correlation survives in headlines long after causation dies.|a strong correlation
causation|nedensellik|C1|n|bil|Establishing causation requires more than a graph.|prove causation
sample size|örneklem büyüklüğü|B2|n|bil|The sample size was too small to publish.|a large sample size
bias|yanlılık|B2|n|bil|Selection bias explains most surprising findings.|selection bias
cutting-edge research|öncü araştırma|C1|n|bil|Cutting-edge research is unreadable for a decade.|conduct cutting-edge research
companionship|arkadaşlık, yoldaşlık|C1|n|ili|Companionship matters more than advice in a crisis.|offer companionship
resentment|hınç, küskünlük|C1|n|ili|Resentment accumulates in silence and arrives all at once.|harbour resentment
obligation|yükümlülük|B2|n|ili|Family obligation outweighs preference in most households.|a moral obligation
boundary|sınır|B2|n|ili|Setting boundaries is mistaken for coldness.|set boundaries
civic pride|yurttaşlık gururu|C1|n|cem|Civic pride survives where services do.|a sense of civic pride
philanthropy|hayırseverlik|C1|n|cem|Philanthropy repairs what taxation could have prevented.|corporate philanthropy
outreach|topluma ulaşma|C1|n|cem|The outreach programme reached three hundred families.|community outreach
referendum|referandum|B2|n|kat|The referendum settled nothing and divided everything.|hold a referendum
suffrage|oy hakkı|C1|n|kat|Universal suffrage arrived in stages, never as a gift.|universal suffrage
constituency|seçim bölgesi|C1|n|kat|The constituency changed hands for the first time since 1977.|a marginal constituency
dissent|muhalefet, itiraz|C1|n|kat|Dissent is the immune system of a democracy.|suppress dissent
syllabus|izlence, ders programı|B2|n|egt|The syllabus promises more than any term allows.|cover the syllabus
plagiarism|intihal|B2|n|egt|Plagiarism software catches copying, not thinking.|detect plagiarism
mock exam|deneme sınavı|B2|n|egt|The mock exam is diagnostic, not predictive.|sit a mock exam
coursework|ders içi çalışma|B2|n|egt|Coursework rewards persistence over performance.|submit coursework
internship|staj|B2|n|cal|Unpaid internships filter by wealth, not talent.|do an internship
appraisal|performans değerlendirmesi|C1|n|cal|The annual appraisal measured attendance.|an annual appraisal
incentive|teşvik|B2|n|cal|Incentives explain behaviour better than intentions.|a financial incentive
outsource|dışarıdan hizmet almak|B2|v|cal|The company outsourced its entire support team.|outsource a service
precedent|emsal|C1|n|huk|The ruling set a precedent nobody wanted.|set a precedent
amnesty|af|C1|n|huk|The amnesty freed prisoners and settled no questions.|grant an amnesty
custody|gözaltı, velayet|B2|n|huk|He spent four months in custody awaiting trial.|be held in custody
arbitration|tahkim|C1|n|huk|The dispute went to international arbitration.|binding arbitration
drought|kuraklık|B2|n|cev|The drought lasted three growing seasons.|a severe drought
famine|kıtlık|B2|n|cev|Famine is almost always political, not agricultural.|cause a famine
erosion|erozyon|B2|n|cev|Erosion removed a metre of coastline each decade.|coastal erosion
habitat|yaşam alanı|B2|n|cev|Habitat loss outpaces every conservation budget.|destroy a habitat
extinction|yok oluş|B2|n|cev|Extinction is the only truly irreversible outcome.|face extinction
recycling|geri dönüşüm|B1|n|cev|Recycling is the least important of the three verbs.|a recycling scheme
single-use|tek kullanımlık|B2|adj|cev|Single-use plastics were banned and then re-permitted.|single-use plastic
fossil fuel|fosil yakıt|B2|n|cev|Fossil fuel subsidies exceed health budgets in some states.|burn fossil fuels
impunity|cezasızlık|C1|n|hak|Impunity for officials corrodes every other right.|end impunity
arbitrary detention|keyfi gözaltı|C1|n|hak|Arbitrary detention was documented in four provinces.|arbitrary detention
due diligence|gerekli özen|C1|n|hak|Companies now owe human rights due diligence.|exercise due diligence
inalienable|devredilemez|C1|adj|hak|Rights are described as inalienable and treated as negotiable.|inalienable rights
insurgency|ayaklanma|C1|n|bar|The insurgency outlasted three military strategies.|an armed insurgency
proxy war|vekâlet savaşı|C1|n|bar|The conflict became a proxy war within eighteen months.|fight a proxy war
armistice|mütareke|C1|n|bar|The armistice froze the front line for seventy years.|sign an armistice
casualty|zayiat, kayıp|B2|n|bar|Civilian casualties exceeded combatant deaths.|civilian casualties
gender pay gap|cinsiyete dayalı ücret farkı|B2|n|esi|The gender pay gap widens after the first child.|close the gender pay gap
social mobility|toplumsal hareketlilik|C1|n|esi|Social mobility stalled in the generation after 1980.|upward social mobility
segregation|ayrışma|C1|n|esi|Residential segregation produces educational segregation.|racial segregation
tariff|gümrük vergisi|B2|n|kur|Tariffs protect producers and tax consumers.|impose tariffs
deregulation|kuralsızlaştırma|C1|n|kur|Deregulation preceded every recent financial crisis.|financial deregulation
offshoring|üretimi yurt dışına taşıma|C1|n|kur|Offshoring hollowed out entire manufacturing towns.|offshoring jobs
greenwashing|yeşil aklama|C1|n|eti|Greenwashing costs less than changing the supply chain.|accused of greenwashing
conflict of interest|çıkar çatışması|C1|n|eti|He declared the conflict of interest after the vote.|declare a conflict of interest
pedestrianise|yayalaştırmak|C1|v|ken|The council pedestrianised the avenue and retail improved.|pedestrianise a street
green space|yeşil alan|B2|n|ken|Green space per resident fell by half since 1990.|public green space
assume|varsaymak|B1|v|gn1|We assume good faith and verify everything else.|assume responsibility
presume|farz etmek|C1|v|gn1|The law presumes innocence; the press does not.|presume innocence
reckon|sanmak, hesaplamak|B2|v|gn1|Analysts reckon the figure is understated.|reckon that
speculate|tahmin yürütmek|C1|v|gn1|It is pointless to speculate without the minutes.|speculate about sth
contemplate|düşünüp taşınmak|C1|v|gn1|He contemplated resigning for a full term.|contemplate doing sth
ponder|derin düşünmek|C1|v|gn1|She pondered the question for a week.|ponder a decision
grasp|kavramak|B2|v|gn1|He grasped the implication before the speaker finished.|grasp a concept
perceive|algılamak|B2|v|gn1|Voters perceive competence through confidence.|perceive sth as sth
regard|saymak, görmek|B2|v|gn1|The treaty is regarded as the founding document.|regard sth as sth
deem|saymak, addetmek|C1|v|gn1|The evidence was deemed inadmissible.|deem sth necessary
conceive|tasarlamak, kavramak|C1|v|gn1|The project was conceived during the strike.|conceive of sth
recall|anımsamak|B2|v|gn1|Witnesses recall the sequence differently.|recall an event
fluctuate|dalgalanmak|C1|v|gn2|Attendance fluctuates with the weather.|fluctuate wildly
soar|fırlamak|B2|v|gn2|Rents soared after the district was rebranded.|prices soar
plummet|dibe vurmak|C1|v|gn2|Turnout plummeted to nineteen per cent.|plummet sharply
surge|ani artış|B2|n,v|gn2|A surge in applications followed the scholarship announcement.|a sudden surge
decline|azalma, azalmak|B2|n,v|gn2|Industrial employment declined for thirty straight years.|a steady decline
steady|istikrarlı|B1|adj|gn2|Growth was steady rather than spectacular.|a steady increase
gradual|kademeli|B2|adj|gn2|The shift was gradual and therefore invisible.|a gradual change
drastic|köklü, sert|B2|adj|gn2|Drastic cuts produced predictable results.|drastic measures
proportion|oran|B2|n|gn2|A growing proportion of students work during term.|a large proportion
ratio|oran|B2|n|gn2|The student-teacher ratio worsened every year.|a high ratio
peak|zirve, zirveye ulaşmak|B2|n,v|gn2|Emissions peaked in 2019 and fell slowly.|reach a peak
threshold|eşik|C1|n|gn2|Inflation crossed the threshold in March.|cross a threshold
simultaneously|eşzamanlı olarak|B2|adv|gn3|Both reforms were introduced simultaneously.|occur simultaneously
subsequently|daha sonra|B2|adv|gn3|The clause was subsequently repealed.|subsequently amended
previously|daha önce|B1|adv|gn3|Previously unpublished letters changed the account.|previously unknown
eventually|sonunda|B1|adv|gn3|The appeal eventually succeeded.|eventually agree
temporarily|geçici olarak|B2|adv|gn3|The bridge was temporarily closed for repairs.|temporarily suspended
permanently|kalıcı olarak|B2|adv|gn3|The archive was permanently relocated.|permanently closed
intermittent|aralıklı|C1|adj|gn3|Intermittent power cuts disrupted the exams.|intermittent supply
ongoing|süregelen|B2|adj|gn3|The investigation is ongoing after four years.|an ongoing process
imminent|yakında olacak|C1|adj|gn3|Collapse looked imminent for several weeks.|an imminent threat
prolonged|uzun süreli|C1|adj|gn3|Prolonged exposure damages hearing permanently.|prolonged drought
prerequisite|önkoşul|C1|n|gn4|Literacy is a prerequisite for everything that follows.|a prerequisite for sth
catalyst|katalizör, tetikleyici|C1|n|gn4|The strike was the catalyst, not the cause.|act as a catalyst
trigger|tetiklemek|B2|v,n|gn4|The ruling triggered protests in six cities.|trigger a reaction
provoke|kışkırtmak|B2|v|gn4|The speech provoked an immediate walkout.|provoke a response
stem|kaynaklanmak|C1|v|gn4|The failure stems from an unrealistic timetable.|stem from sth
consequence|sonuç|B1|n|gn4|Every consequence was foreseen and ignored.|serious consequences
implication|çıkarım, sonuç|B2|n|gn4|The implications reach far beyond this sector.|wider implications
repercussion|yankı, sonuç|C1|n|gn4|The repercussions were felt for a decade.|serious repercussions
contingent|bağlı, koşullu|C1|adj|gn4|Funding is contingent on independent monitoring.|contingent on sth
inevitable|kaçınılmaz|B2|adj|gn4|Delay made confrontation inevitable.|an inevitable outcome
reluctant|isteksiz|B2|adj|gn5|Delegates were reluctant to commit in writing.|reluctant to do sth
indifferent|kayıtsız|B2|adj|gn5|The ministry remained indifferent to the petition.|indifferent to sth
sceptical|kuşkucu|B2|adj|gn5|Economists were sceptical of the forecast.|sceptical about sth
apprehensive|endişeli|C1|adj|gn5|Students were apprehensive about the new format.|apprehensive about sth
resentful|kırgın, hınç duyan|C1|adj|gn5|Staff were resentful but compliant.|resentful of sth
sympathetic|anlayışlı|B2|adj|gn5|The judge was sympathetic and still ruled against him.|sympathetic to sth
enthusiastic|hevesli|B1|adj|gn5|The response was enthusiastic and short-lived.|enthusiastic about sth
cautious|temkinli|B2|adj|gn5|The statement was deliberately cautious.|cautiously optimistic
defiant|meydan okuyan|C1|adj|gn5|He gave a defiant speech on the courthouse steps.|remain defiant
complacent|rehavete kapılmış|C1|adj|gn5|Success made the department complacent.|grow complacent
framework|çerçeve|B2|n|gn6|The legal framework predates the technology.|a regulatory framework
mechanism|mekanizma|B2|n|gn6|No enforcement mechanism was ever created.|a funding mechanism
criterion|ölçüt|C1|n|gn6|Only one criterion mattered in practice.|meet a criterion
dimension|boyut|B2|n|gn6|The crisis has a political dimension nobody discusses.|a new dimension
scope|kapsam|B2|n|gn6|The scope of the inquiry was narrowed twice.|broaden the scope
magnitude|büyüklük|C1|n|gn6|Nobody grasped the magnitude of the shortfall.|the sheer magnitude
constraint|kısıt|C1|n|gn6|Time was the binding constraint, not money.|a severe constraint
incentive|güdüleyici, teşvik|B2|n|gn6|The incentive structure rewarded exactly the wrong behaviour.|create an incentive
paradox|paradoks|C1|n|gn6|The paradox is that caution increased the risk.|an apparent paradox
discrepancy|tutarsızlık|C1|n|gn6|A discrepancy of four thousand remains unexplained.|a serious discrepancy
rationale|gerekçe|C1|n|gn6|The rationale was never published.|the rationale behind sth
trajectory|gidişat, yörünge|C1|n|gn6|The trajectory has not changed since 2015.|a worrying trajectory
sporadic|ara sıra olan|C1|adj|gn3|Sporadic clashes continued through the winter.|sporadic violence
perpetual|sürekli|C1|adj|gn3|The building is in a state of perpetual repair.|perpetual motion
transitional|geçiş dönemine ait|C1|adj|gn3|A transitional government held power for nine months.|a transitional period
outdated|modası geçmiş|B2|adj|gn3|The guidance was outdated before it was printed.|outdated information
contemporary|çağdaş|B2|adj|gn3|Contemporary readers miss the joke entirely.|contemporary society
preliminary|ön, başlangıç niteliğinde|C1|adj|gn3|Preliminary findings suggested the opposite.|preliminary results
underlying|altta yatan|C1|adj|gn4|The underlying cause was never addressed.|an underlying problem
root cause|kök neden|B2|n|gn4|Treating symptoms ignores the root cause.|address the root cause
knock-on effect|zincirleme etki|C1|n|gn4|The closure had knock-on effects across the region.|a knock-on effect
offset|dengelemek|C1|v|gn4|Gains in the east offset losses elsewhere.|offset a loss
hinge on|-e bağlı olmak|C1|phr|gn4|The whole argument hinges on one date.|hinge on sth
barring|olmazsa, dışında|C1|prep|gn4|Barring a major shock, the trend continues.|barring unforeseen events
dismissive|küçümseyen|C1|adj|gn5|His dismissive tone ended the discussion.|dismissive of sth
earnest|samimi, ciddi|C1|adj|gn5|The appeal was earnest and politically useless.|in earnest
candid|açık sözlü|C1|adj|gn5|She gave a candid account of the failure.|a candid admission
detached|mesafeli|C1|adj|gn5|The narrator remains detached throughout the massacre.|emotionally detached
nostalgic|nostaljik|B2|adj|gn5|The film is nostalgic about a decade it misremembers.|nostalgic for sth
apathetic|ilgisiz|C1|adj|gn5|Young voters were apathetic, not hostile.|apathetic about politics
precedent|emsal, önceki örnek|C1|n|gn6|There is no precedent for a vote of this kind.|without precedent
consensus|uzlaşı|B2|n|gn6|A fragile consensus held for two years.|reach a consensus
prospect|olasılık, beklenti|B2|n|gn6|The prospect of reform faded after the election.|the prospect of sth
initiative|inisiyatif, girişim|B2|n|gn6|He took the initiative when nobody else would.|take the initiative
pretext|bahane|C1|n|gn6|Security was the pretext; control was the purpose.|use sth as a pretext
backlash|tepki, geri tepme|C1|n|gn6|The backlash was louder than the original announcement.|provoke a backlash
spectator sport|seyirlik spor|B2|n|bos|Chess became a spectator sport online.|a popular spectator sport
leisure industry|eğlence sektörü|B2|n|bos|The leisure industry recovered faster than tourism.|the leisure industry
hobbyist|amatör meraklı|B2|n|bos|Hobbyists built the first personal computers.|a dedicated hobbyist
downtime|boş zaman, duraklama|B2|n|bos|Downtime is when the thinking actually happens.|valuable downtime
recreational|dinlence amaçlı|B2|adj|bos|Recreational reading collapsed after fifteen.|recreational activities
take up|başlamak|B1|phr|bos|He took up swimming after the injury.|take up a hobby
high-rise|çok katlı bina|B2|n,adj|ken|High-rise blocks replaced the old quarter.|a high-rise building
derelict|terk edilmiş, harap|C1|adj|ken|The derelict factory became a cultural centre.|a derelict building
pedestrian|yaya|B1|n,adj|ken|Pedestrian deaths fell when speeds were capped.|a pedestrian zone
overcrowding|aşırı kalabalık|B2|n|ken|Overcrowding in schools followed the housing boom.|severe overcrowding
displacement|yerinden edilme|C1|n|ken|Redevelopment caused displacement the plans never mentioned.|cause displacement
revitalise|canlandırmak|C1|v|ken|The waterfront was revitalised at enormous cost.|revitalise a district
bribery|rüşvet|B2|n|eti|Bribery was systemic rather than exceptional.|combat bribery
nepotism|kayırmacılık|C1|n|eti|Nepotism survives every reform that targets it.|accusations of nepotism
confidentiality|gizlilik|C1|n|eti|Confidentiality protected the institution, not the patient.|breach confidentiality
moral hazard|ahlaki tehlike|C1|n|eti|Bailouts create a moral hazard nobody prices in.|create a moral hazard
imperative|zorunlu, elzem|C1|adj|sif|It is imperative that the records be preserved.|absolutely imperative
tenuous|zayıf, belli belirsiz|C1|adj|sif|The connection between the two events is tenuous.|a tenuous link
pervasive|her yere sinmiş|C1|adj|sif|Corruption was pervasive and quietly accepted.|a pervasive influence
rigorous|titiz, sıkı|C1|adj|sif|The methodology is rigorous and the sample is tiny.|rigorous testing
redundant|gereksiz|C1|adj|sif|Half the clauses are legally redundant.|become redundant
ambitious|iddialı|B2|adj|sif|An ambitious timetable with no funding attached.|an ambitious target
modest|mütevazı, ölçülü|B2|adj|sif|The gains were modest but durable.|a modest increase
dramatic|çarpıcı|B1|adj|sif|A dramatic fall in applications followed the fee rise.|a dramatic shift
nominal|sözde, adı var|C1|adj|sif|He retained nominal control and no authority.|nominal independence
systematic|dizgeli, sistemli|B2|adj|sif|The exclusion was systematic, not accidental.|a systematic approach
allocate|tahsis etmek|B2|v|fii|Funds were allocated and never disbursed.|allocate resources
implement|uygulamaya koymak|B2|v|fii|The policy was announced but never implemented.|implement a plan
monitor|izlemek|B2|v|fii|Nobody monitored compliance after the first year.|monitor progress
restrict|kısıtlamak|B2|v|fii|Access was restricted to accredited journalists.|restrict access
abolish|kaldırmak|C1|v|fii|The exemption was abolished in 2011.|abolish a rule
sustain|sürdürmek|B2|v|fii|No economy can sustain that rate indefinitely.|sustain growth
withstand|dayanmak|C1|v|fii|The argument did not withstand scrutiny.|withstand pressure
yield|vermek, boyun eğmek|C1|v|fii|The talks yielded a communiqué and nothing else.|yield results
pledge|söz vermek|B2|v,n|fii|States pledged funds they never transferred.|pledge support
waive|feragat etmek|C1|v|fii|The university waived the fee for refugee students.|waive a requirement
in terms of|açısından|B2|phr|akd|In terms of cost, the second option is indefensible.|in terms of sth
with respect to|-e ilişkin olarak|C1|phr|akd|With respect to timing, the decision was premature.|with respect to sth
on the basis of|-e dayanarak|C1|phr|akd|He was excluded on the basis of a single report.|on the basis of sth
to what extent|ne ölçüde|B2|phr|akd|To what extent did the reform achieve its aims?|to what extent
by and large|genel olarak|C1|phr|akd|By and large the findings hold across countries.|by and large
account for|açıklamak|B2|phr|dey|Three factors account for most of the variation.|account for sth
cut back on|kısmak|B2|phr|dey|Households cut back on heating before food.|cut back on spending
phase out|aşamalı kaldırmak|C1|phr|dey|Coal plants will be phased out by 2035.|phase out sth
step down|görevden çekilmek|B2|phr|dey|The chair stepped down two days later.|step down from a post
call for|gerektirmek, çağrıda bulunmak|B2|phr|dey|The situation calls for restraint, not speeches.|call for action
single out|ayrı tutmak, hedef almak|C1|phr|dey|The report singled out one ministry.|single sb out
fall short of|yetersiz kalmak|C1|phr|dey|The result fell short of every forecast.|fall short of expectations
in the wake of|ardından|C1|phr|dey|In the wake of the scandal, two ministers resigned.|in the wake of sth
in contrast|buna karşılık|B2|phr|bag|In contrast, the southern region lost population.|in contrast to sth
similarly|benzer şekilde|B2|adv|bag|Similarly, the 1994 crisis followed a credit boom.|similarly
alternatively|bunun yerine|B2|adv|bag|Alternatively, the funds could be ring-fenced.|alternatively
specifically|özellikle, tam olarak|B2|adv|bag|Specifically, clause four creates the loophole.|more specifically
overall|genel olarak|B1|adv|bag|Overall, the evidence points one way.|overall
that is a fair point|haklı bir nokta|B2|phr|tar|That is a fair point, though the dates complicate it.|a fair point
if I may add|eklemek gerekirse|C1|phr|tar|If I may add, the second extract reverses this.|if I may add
I would go further|daha ileri giderim|C1|phr|tar|I would go further and call it deliberate.|I would go further
to be honest|doğrusunu söylemek gerekirse|B1|phr|tar|To be honest, I find the first reading stronger.|to be honest
as I see it|benim görüşüme göre|B2|phr|tar|As I see it, the silence is the key detail.|as I see it
ambivalence|kararsızlık, çift duygu|C1|n|edb|The ending preserves an ambivalence the film refuses to resolve.|moral ambivalence
unreliable narrator|güvenilmez anlatıcı|C1|n|edb|An unreliable narrator forces the reader to investigate.|an unreliable narrator
stream of consciousness|bilinç akışı|C1|n|edb|The stream of consciousness collapses time entirely.|stream of consciousness
pathos|duygusal etki|C1|n|edb|The scene achieves pathos without a single adjective.|a sense of pathos
satire|yergi, taşlama|B2|n|edb|The satire was mistaken for endorsement.|political satire
allegory|alegori|C1|n|edb|The whole novel works as an allegory of occupation.|a political allegory
paradox|çelişki|C1|n|edb|The paradox at the centre is never explained away.|a central paradox
understatement|küçümseme, az söyleme|C1|n|edb|The understatement makes the violence unbearable.|deliberate understatement
threshold of adulthood|yetişkinlik eşiği|C1|n|ger|He stood at the threshold of adulthood with no map.|cross into adulthood
apprenticeship|çıraklık|B2|n|cal|An apprenticeship teaches what no lecture can.|serve an apprenticeship
tenure|görev süresi, kadro|C1|n|cal|Her tenure as minister lasted eleven months.|during his tenure
severance|kıdem tazminatı|C1|n|cal|Severance payments were delayed for a year.|severance pay
bureaucracy|bürokrasi|B2|n|huk|Bureaucracy protects itself before it protects anyone else.|state bureaucracy
mandate|yetki, görev|C1|n|huk|The government claimed a mandate it had not won.|an electoral mandate
ratify|onaylamak|C1|v|huk|Parliament ratified the treaty without debate.|ratify an agreement
repeal|yürürlükten kaldırmak|C1|v|huk|The clause was repealed after three court rulings.|repeal a law
dissident|muhalif|C1|n|hak|The dissident wrote from a cell for nine years.|a political dissident
reparations|tazminat|C1|n|hak|Reparations were promised and never paid.|demand reparations
insomnia|uykusuzluk|B2|n|sag|Insomnia costs more working hours than any illness.|suffer from insomnia
sibling|kardeş|B1|n|ili|Sibling rivalry rarely survives adulthood intact.|a younger sibling
kinship|akrabalık|C1|n|ili|Kinship networks moved money before banks did.|kinship ties
courtesy|nezaket|B2|n|ili|Courtesy costs nothing and buys a surprising amount.|common courtesy
concede|kabul etmek, teslim olmak|C1|v|tar|I concede the point about timing.|concede a point
rebut|çürütmek|C1|v|tar|He rebutted the claim with three dates.|rebut an argument
reiterate|yinelemek|C1|v|tar|Let me reiterate the central objection.|reiterate a point
digress|konudan sapmak|C1|v|tar|I digress, but the comparison is useful.|if I may digress
cohesive|bağdaşık|C1|adj|edb|The paragraph is cohesive without being repetitive.|a cohesive structure
vivid|canlı, capcanlı|B2|adj|edb|The vivid opening image carries the whole chapter.|a vivid description
terse|kısa ve sert|C1|adj|edb|His terse replies tell us more than the monologue.|a terse answer
lyrical|lirik|C1|adj|edb|The lyrical passages slow the violence down.|a lyrical style
bleak|kasvetli|C1|adj|edb|The ending is bleak and entirely earned.|a bleak outlook
candour|açık sözlülük|C1|n|gn5|His candour cost him the appointment.|disarming candour
prudent|ihtiyatlı|C1|adj|gn5|A prudent government would have kept the reserve.|a prudent decision
resolute|kararlı|C1|adj|gn5|She remained resolute through four appeals.|a resolute stance
scrupulous|titiz, vicdanlı|C1|adj|sif|His scrupulous footnotes saved the thesis.|scrupulous attention
futile|beyhude|C1|adj|sif|Further negotiation looked futile by October.|a futile attempt
`;

/* ─── Hatlar ve duraklar ───────────────────────────────────────────
   Beş IB teması = beş hat. Her konu bir durak. Ek setler altıncı
   hatta toplanır: sınavın kendisi için gereken dil. ─────────────── */

const HATLAR = [
  { id: "kim", ad: "Kimlikler", en: "Identities", renk: "#B8862B", koyu: "#8A6218", acik: "#F5E8C6", no: 1,
    duraklar: [["yas","Yaşam biçimleri"],["sag","Sağlık ve esenlik"],["inn","İnançlar ve değerler"],["alt","Alt kültürler"],["dil","Dil ve kimlik"]] },
  { id: "den", ad: "Deneyimler", en: "Experiences", renk: "#1F6B5C", koyu: "#144A3F", acik: "#DAEAE5", no: 2,
    duraklar: [["bos","Boş zaman"],["sey","Tatil ve seyahat"],["oyk","Yaşam öyküleri"],["ger","Geçiş törenleri"],["gel","Gelenek ve görenek"],["goc","Göç"]] },
  { id: "yar", ad: "İnsan Yaratıcılığı", en: "Human ingenuity", renk: "#8E1B20", koyu: "#661317", acik: "#F4DEDD", no: 3,
    duraklar: [["egl","Eğlence"],["san","Sanatsal ifade"],["med","İletişim ve medya"],["tek","Teknoloji"],["bil","Bilimsel yenilik"]] },
  { id: "top", ad: "Toplumsal Düzen", en: "Social organization", renk: "#1F3A6E", koyu: "#142748", acik: "#E1E7F2", no: 4,
    duraklar: [["ili","Toplumsal ilişkiler"],["cem","Topluluk"],["kat","Toplumsal katılım"],["egt","Eğitim"],["cal","Çalışma dünyası"],["huk","Hukuk ve düzen"]] },
  { id: "gez", ad: "Gezegeni Paylaşmak", en: "Sharing the planet", renk: "#8A4A1E", koyu: "#5F3214", acik: "#F3E3D5", no: 5,
    duraklar: [["cev","Çevre"],["hak","İnsan hakları"],["bar","Barış ve çatışma"],["esi","Eşitlik"],["kur","Küreselleşme"],["eti","Etik"],["ken","Kent ve kır"]] },
  { id: "snv", ad: "Sınav Dili", en: "Exam language", renk: "#4A3B6B", koyu: "#332848", acik: "#E8E3F2", no: 6,
    duraklar: [["edb","Edebi çözümleme · IO"],["tar","Tartışma kalıpları · IO"],["akd","Akademik çekirdek"],["fii","Güçlü fiiller"],["sif","Güçlü sıfatlar"],["dey","Öbek fiil ve deyim"],["bag","Bağlaç ve geçiş"],["gn1","Düşünce ve görüş"],["gn2","Ölçü ve değişim"],["gn3","Zaman ve sıklık"],["gn4","Neden ve koşul"],["gn5","Duygu ve tutum"],["gn6","Sık isimler"]] }
];

const DURAK_META = {};
HATLAR.forEach((h) => h.duraklar.forEach(([id, ad], i) => { DURAK_META[id] = { id, ad, hat: h.id, hatAd: h.ad, renk: h.renk, koyu: h.koyu, acik: h.acik, sira: i + 1, hatNo: h.no }; }));

const TUR_AD = { n: "isim", v: "fiil", adj: "sıfat", adv: "zarf", phr: "kalıp", conj: "bağlaç", prep: "edat" };
const turYaz = (p) => String(p || "").split(",").map((x) => TUR_AD[x.trim()] || x.trim()).join(", ");

/* ─── Ayrıştırma ───────────────────────────────────────────────────
   Aynı kelime birden çok durakta geçebilir (bias: medya, eşitlik,
   bilim). Tek kart olarak birleştirilir, durakların hepsi saklanır,
   böylece tekrar kuyruğunda üç kez çıkmaz. ──────────────────────── */

const KELIMELER = (() => {
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

const KELIME_HARITA = Object.fromEntries(KELIMELER.map((k) => [k.id, k]));
const kelime = (id) => KELIME_HARITA[id];
const duraginKelimeleri = (d) => KELIMELER.filter((k) => k.duraklar.includes(d));
const hattinKelimeleri = (h) => KELIMELER.filter((k) => k.duraklar.some((d) => DURAK_META[d].hat === h));
const SEVIYE_RENK = { A2: "#8B939C", B1: "#1F6B5C", B2: "#B8862B", C1: "#8E1B20" };

/* ─── Leitner kutuları ─────────────────────────────────────────────
   Metro des Mots'taki beş kutu: 1 gün, 3 gün, 1 hafta, 2 hafta,
   1 ay. Beşini de geçen kelime ustalaşılmış sayılır. ────────────── */

const KUTULAR = [
  { no: 1, gun: 1,  ad: "ilk gün" },
  { no: 2, gun: 3,  ad: "üç gün" },
  { no: 3, gun: 7,  ad: "bir hafta" },
  { no: 4, gun: 14, ad: "iki hafta" },
  { no: 5, gun: 30, ad: "bir ay" }
];

const BOS_KELIME = { kutu: 0, dogru: 0, yanlis: 0, sonrakiTarih: null, sonGorulme: null, usta: false, zor: false, seri: 0 };

function kelimeGuncelle(kayit, dogruMu) {
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

const ogrenilenler = (dag) => KELIMELER.filter((k) => dag[k.id] && dag[k.id].kutu > 0);
const ustalasilanlar = (dag) => KELIMELER.filter((k) => dag[k.id] && dag[k.id].usta);
const zorKelimeler = (dag) => KELIMELER.filter((k) => dag[k.id] && dag[k.id].zor && !dag[k.id].usta);
const vadesiGelenler = (dag) => KELIMELER.filter((k) => {
  const s = dag[k.id];
  return s && s.kutu > 0 && !s.usta && (!s.sonrakiTarih || s.sonrakiTarih <= bugun());
});
const kesfedilmemis = (dag, liste) => (liste || KELIMELER).filter((k) => !dag[k.id] || !dag[k.id].kutu);

function durakIlerleme(dag, d) {
  const ks = duraginKelimeleri(d);
  if (!ks.length) return { toplam: 0, baslanan: 0, usta: 0, oran: 0 };
  const baslanan = ks.filter((k) => dag[k.id] && dag[k.id].kutu > 0).length;
  const usta = ks.filter((k) => dag[k.id] && dag[k.id].usta).length;
  return { toplam: ks.length, baslanan, usta, oran: Math.round((usta / ks.length) * 100) };
}

function hatIlerleme(dag, h) {
  const ks = hattinKelimeleri(h);
  if (!ks.length) return { toplam: 0, usta: 0, oran: 0 };
  const usta = ks.filter((k) => dag[k.id] && dag[k.id].usta).length;
  return { toplam: ks.length, usta, oran: Math.round((usta / ks.length) * 100) };
}

/* Kelime dağarcığı tahmini: ustalaşılan + kısmen bilinen */
function dagarcikTahmini(dag) {
  let t = 0;
  KELIMELER.forEach((k) => { const s = dag[k.id]; if (s && s.kutu) t += s.usta ? 1 : s.kutu / 6; });
  return Math.round(t);
}

const karistir = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const rastgele = (a) => a[Math.floor(Math.random() * a.length)];

/* Cevap karşılaştırma: aksan, noktalama ve ufak yazım hatası affedilir */
function kelimeEsit(verilen, hedef) {
  const sade = (x) => String(x || "").toLocaleLowerCase("en").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const a = sade(verilen), b = sade(hedef);
  if (!a) return { ok: false, yakin: false };
  if (a === b) return { ok: true, yakin: false };
  if (b.length > 4 && mesafe(a, b) <= 1) return { ok: true, yakin: true };
  return { ok: false, yakin: b.length > 5 && mesafe(a, b) <= 2 };
}

function mesafe(a, b) {
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
function celdiriciler(hedef, havuz, adet) {
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

const AZ_HAREKET = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } };

function titre(sure) { try { if (navigator.vibrate && !AZ_HAREKET()) navigator.vibrate(sure || 12); } catch {} }

/* ─── Parçacık motoru ─────────────────────────────────────────────── */
const PRC = { tuval: null, ctx: null, liste: [], calisiyor: false };

function prcCtx() {
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

function prcCalistir() {
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

const KONFETI_RENK = ["#B8862B", "#DFB75A", "#8E1B20", "#1F6B5C", "#1F3A6E", "#F5E8C6"];

function konfeti(n, opt) {
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

function kivilcim(x, y, renk, n) {
  if (AZ_HAREKET() || !prcCtx()) return;
  for (let i = 0; i < (n || 16); i++) {
    const a = (i / (n || 16)) * Math.PI * 2 + Math.random() * 0.5, h = 2 + Math.random() * 4.5;
    PRC.liste.push({ k: "p", x, y, vx: Math.cos(a) * h, vy: Math.sin(a) * h - 1,
      b: 1.8 + Math.random() * 2.4, c: renk || "#B8862B", omur: 34 + Math.random() * 20 });
  }
  prcCalistir();
}

function kivilcimOge(el, renk, n) {
  if (!el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect();
  kivilcim(r.left + r.width / 2, r.top + r.height / 2, renk, n);
}

/* ─── Sayı sayma animasyonu ───────────────────────────────────────── */
function useSayac(hedef, sure) {
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

function gunesSaatleri(d) {
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

const GOKYUZU = {
  gece:   { ust: "#07102E", orta: "#122250", alt: "#263B74", murekkep: "light", yildiz: 1,   ay: 1,   gunes: 0, pencere: .40, bulut: "#2A3A6E", bO: .34, uzak: "#1A2550", yuz: "#1E2A56", cati: "#131C3E", pKapali: "#26346A", pAcik: "#FFD27A", deniz1: "#0D1B48", deniz2: "#060D26", kule: "#FFE0A0", vapur: "#C4CBDA" },
  gecYari:{ ust: "#040A20", orta: "#0C1842", alt: "#1E3066", murekkep: "light", yildiz: 1,   ay: 1,   gunes: 0, pencere: .08, bulut: "#283464", bO: .3,  uzak: "#152048", yuz: "#1A254E", cati: "#101736", pKapali: "#23305C", pAcik: "#FFCF6E", deniz1: "#0A1536", deniz2: "#04091F", kule: "#E8C877", vapur: "#B8C0D2" },
  safak:  { ust: "#2A3C7E", orta: "#B87CA6", alt: "#FFC88E", murekkep: "light", yildiz: .32, ay: .65, gunes: 1, pencere: .18, bulut: "#F3BAB4", bO: .72, uzak: "#8E7FA6", yuz: "#C9A9A4", cati: "#6C6C92", pKapali: "#9E95B6", pAcik: "#FFD27A", deniz1: "#C5909F", deniz2: "#5C5C8C", kule: "#FFE4B0", vapur: "#EEF0F4" },
  gunduz: { ust: "#5E9BE8", orta: "#A6CFF5", alt: "#E6F3FF", murekkep: "dark",  yildiz: 0,   ay: 0,   gunes: 1, pencere: 0,   bulut: "#FFFFFF", bO: .9,  uzak: "#AEC2DC", yuz: "#EFE1C8", cati: "#73849F", pKapali: "#A1B6CE", pAcik: "#FFE6A3", deniz1: "#82B0DD", deniz2: "#4472AA", kule: "#D8C49A", vapur: "#F3F5F8" },
  altin:  { ust: "#4A62BA", orta: "#EFA080", alt: "#FFD890", murekkep: "light", yildiz: 0,   ay: 0,   gunes: 1, pencere: .14, bulut: "#FFDAC4", bO: .86, uzak: "#B791A2", yuz: "#E9C197", cati: "#706C91", pKapali: "#B99CA0", pAcik: "#FFD27A", deniz1: "#E69E85", deniz2: "#6E619C", kule: "#FFE0A0", vapur: "#F6EFE6" },
  mavi:   { ust: "#17276A", orta: "#4959A8", alt: "#E2917C", murekkep: "light", yildiz: .5,  ay: 1,   gunes: 0, pencere: .36, bulut: "#5C66A8", bO: .52, uzak: "#35427C", yuz: "#38437C", cati: "#252E5E", pKapali: "#404C88", pAcik: "#FFD27A", deniz1: "#3D4D94", deniz2: "#162054", kule: "#FFD890", vapur: "#D2D7E4" }
};

function gokEvresi(d) {
  d = d || new Date();
  const { dogus, batis } = gunesSaatleri(d);
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= dogus - 70 && m < dogus + 28) return "safak";
  if (m >= dogus + 28 && m < batis - 70) return "gunduz";
  if (m >= batis - 70 && m < batis + 14) return "altin";
  if (m >= batis + 14 && m < batis + 72) return "mavi";
  return (m >= 60 && m < dogus - 70) ? "gecYari" : "gece";
}

const AY_ADLARI = ["Yeni ay", "Hilal", "İlk dördün", "Şişkin ay", "Dolunay", "Solan şişkin ay", "Son dördün", "Solan hilal"];
function ayYasi(d) {
  const bilinen = Date.UTC(2000, 0, 6, 18, 14);
  const devir = 29.530588853 * 86400000;
  return (((d.getTime() - bilinen) % devir) + devir) % devir / devir;
}
const ayAdi = (d) => AY_ADLARI[Math.round(ayYasi(d) * 8) % 8];

/* ─── İstanbul silueti ────────────────────────────────────────────── */

function ayYolu(cx, cy, r, evre) {
  const aci = evre * Math.PI * 2;
  const k = Math.cos(aci) * r;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${Math.abs(k)} ${r} 0 0 ${k > 0 ? 1 : 0} ${cx} ${cy - r} Z`;
}

function istanbulSVG(d) {
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

function selamla(d, ad) {
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

function Gul({ boy = 16, renk = C.altin, opak = 1 }) {
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

function Serlevha({ genislik = 560, renk = C.altin, ikinci = C.lacivert }) {
  const birim = 46, adet = Math.max(3, Math.floor(genislik / birim));
  return (
    <svg width="100%" height="34" viewBox={`0 0 ${adet * birim} 34`} preserveAspectRatio="none"
      style={{ display: "block", overflow: "visible" }}>
      <line x1="0" y1="32" x2={adet * birim} y2="32" stroke={renk} strokeWidth="1.1" />
      <line x1="0" y1="29" x2={adet * birim} y2="29" stroke={renk} strokeWidth="0.5" opacity="0.5" />
      {Array.from({ length: adet }, (_, i) => {
        const x = i * birim, orta = i === Math.floor(adet / 2);
        return (
          <g key={i}>
            <path d={`M ${x + 3} 32 Q ${x + birim / 2} ${orta ? 2 : 12} ${x + birim - 3} 32`}
              fill="none" stroke={orta ? ikinci : renk} strokeWidth={orta ? 1.2 : 0.85}
              opacity={orta ? 0.95 : 0.62} />
            <circle cx={x + birim / 2} cy={orta ? 8 : 15} r={orta ? 2.6 : 1.5}
              fill={orta ? ikinci : renk} opacity={orta ? 1 : 0.65} />
            {orta && <>
              <path d={`M ${x + 11} 32 Q ${x + birim / 2} 12 ${x + birim - 11} 32`} fill="none" stroke={renk} strokeWidth="0.8" opacity="0.8" />
              <circle cx={x + birim / 2} cy="8" r="5.4" fill="none" stroke={renk} strokeWidth="0.6" opacity="0.7" />
            </>}
          </g>
        );
      })}
    </svg>
  );
}

function KoseSusu({ boy = 22, renk = C.cetvel, don = 0 }) {
  return (
    <svg width={boy} height={boy} viewBox="0 0 24 24" style={{ transform: `rotate(${don}deg)`, display: "block" }}>
      <path d="M1 1 L1 9 M1 1 L9 1" stroke={renk} strokeWidth="1.2" fill="none" />
      <path d="M4 4 Q4 12 12 12" stroke={renk} strokeWidth="0.7" fill="none" opacity="0.7" />
      <circle cx="4" cy="4" r="1.5" fill={renk} opacity="0.85" />
    </svg>
  );
}

/* Cetvel — çift hatlı çerçeve, dört köşesinde süs */
function Cetvel({ children, style, sikilik = "normal", renk = C.cetvel }) {
  const ic = sikilik === "genis" ? S.xl : sikilik === "dar" ? S.md : S.lg;
  return (
    <div style={{ position: "relative", border: `1px solid ${renk}55`, borderRadius: 2, padding: 3, ...style }}>
      <div style={{ border: `1px solid ${renk}`, borderRadius: 1, padding: ic, position: "relative", background: C.muhre }}>
        <div style={{ position: "absolute", top: -1, left: -1 }}><KoseSusu renk={renk} don={0} /></div>
        <div style={{ position: "absolute", top: -1, right: -1 }}><KoseSusu renk={renk} don={90} /></div>
        <div style={{ position: "absolute", bottom: -1, right: -1 }}><KoseSusu renk={renk} don={180} /></div>
        <div style={{ position: "absolute", bottom: -1, left: -1 }}><KoseSusu renk={renk} don={270} /></div>
        {children}
      </div>
    </div>
  );
}

function Baslik({ ust, ad, alt, sag }) {
  return (
    <div style={{ marginBottom: S.xl }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: S.lg, marginBottom: S.sm }}>
        <div style={{ minWidth: 0 }}>
          {ust && <div style={{ ...T.cap, color: C.altin, marginBottom: 6 }}>{ust}</div>}
          <div style={{ fontFamily: T.hat, ...T.d1, color: C.murekkep }}>{ad}</div>
        </div>
        {sag}
      </div>
      <Serlevha />
      {alt && <div style={{ ...T.s, color: C.murekkepAlt, marginTop: S.md, maxWidth: 620, fontStyle: "italic" }}>{alt}</div>}
    </div>
  );
}

function Fasil({ ad, sag, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: S.sm, margin: `${S.lg}px 0 ${S.md}px`, ...style }}>
      <Gul boy={13} />
      <div style={{ ...T.cap, color: C.murekkepAlt, whiteSpace: "nowrap" }}>{ad}</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.cizgi}, transparent)` }} />
      {sag}
    </div>
  );
}

/* ══════════ İMZA ÖĞE: ARALIK (satır arası tercüme) ══════════
   Klasik el yazmalarında tercüme satır aralarına, daha küçük
   ve eğik yazılırdı. Burada aynısını yapıyoruz: İngilizce üstte,
   Türkçe karşılığı tam altında. Türkçede karşılığı olmayan yere
   ∅ konur — artikelin yokluğu böylece görülür hale gelir. ════ */

function parcala(metin) {
  return String(metin || "").split(/(\[\[.*?\]\])/g).filter((x) => x !== "")
    .map((p) => p.startsWith("[[") && p.endsWith("]]")
      ? { v: true, m: p.slice(2, -2) } : { v: false, m: p });
}

function hizala(en, tr) {
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

function Aralik({ en, tr, fark, acikBasla, kompakt }) {
  const [acik, setAcik] = useState(!!acikBasla);
  useEffect(() => { setAcik(!!acikBasla); }, [acikBasla]);
  const parcalar = useMemo(() => hizala(en, tr), [en, tr]);
  const kayan = parcalar.some((p) => p.kaydi);
  const bosluk = parcalar.some((p) => p.yok);

  return (
    <div style={{ border: `1px solid ${C.cizgi}`, borderRadius: 2, background: C.muhre, overflow: "hidden" }}>
      <div onClick={() => setAcik(!acik)} style={{ cursor: "pointer", padding: `${kompakt ? S.sm + 2 : S.md}px ${S.md}px` }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", rowGap: acik ? 10 : 0 }}>
          {parcalar.map((p, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{
                fontFamily: T.kalem, fontSize: kompakt ? 13 : 14.5, lineHeight: 1.55, color: C.murekkep,
                whiteSpace: "pre-wrap",
                borderBottom: p.vurgu && acik ? `1.5px solid ${p.yok ? C.lal : C.altin}` : "none",
                background: p.vurgu && acik ? (p.yok ? C.lalSis : C.altinSis) : "transparent",
                padding: p.vurgu && acik ? "0 2px" : 0
              }}>{p.en}</span>
              {acik && p.vurgu && p.tr && (
                <span style={{
                  fontFamily: T.govde, fontStyle: "italic", fontSize: kompakt ? 11.5 : 13,
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
          <div style={{ fontFamily: T.govde, fontSize: kompakt ? 13 : 14, color: C.murekkepAlt, marginBottom: fark ? 6 : 0 }}>
            {parcala(tr).map((p, i) => (
              <span key={i} style={{ color: p.v ? C.altin : C.murekkepAlt, fontWeight: p.v ? 600 : 400 }}>{p.m}</span>
            ))}
          </div>
          {(bosluk || kayan) && (
            <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap", marginBottom: fark ? 6 : 0 }}>
              {bosluk && <span style={{ ...T.xs, fontSize: 11, color: C.lal }}>∅ · Türkçede karşılığı yok</span>}
              {kayan && <span style={{ ...T.xs, fontSize: 11, color: C.lacivert }}>⤺ · konumu değişti</span>}
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

function Levha({ children, style, vurgu, tikla, ic = S.lg, renk }) {
  const [uzeri, setUzeri] = useState(false);
  return (
    <div onClick={tikla}
      onMouseEnter={() => setUzeri(true)} onMouseLeave={() => setUzeri(false)}
      style={{
        background: C.muhre, border: `1px solid ${vurgu ? C.altin : uzeri && tikla ? C.golge : C.cizgi}`,
        borderLeft: renk ? `2.5px solid ${renk}` : undefined,
        borderRadius: 2, padding: ic, cursor: tikla ? "pointer" : "default",
        boxShadow: vurgu ? `0 0 0 3px ${C.altinSis}` : uzeri && tikla ? `0 2px 10px ${C.golge}55` : "none",
        transition: "box-shadow .18s, border-color .18s", ...style
      }}>{children}</div>
  );
}

function Etiket({ children, renk = C.murekkepAlt, style }) {
  return <div style={{ ...T.cap, color: renk, marginBottom: S.sm, ...style }}>{children}</div>;
}

function Nisan({ children, renk = C.murekkepAlt, zemin, kucuk, dolu }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: kucuk ? "1px 6px" : "3px 9px", fontFamily: T.govde,
      fontSize: kucuk ? 10.5 : 11.5, fontWeight: 600, letterSpacing: "0.05em",
      color: dolu ? C.muhre : renk, background: dolu ? renk : zemin || "transparent",
      border: `1px solid ${dolu ? renk : renk + "44"}`, borderRadius: 1, whiteSpace: "nowrap"
    }}>{children}</span>
  );
}

function Dugme({ children, tikla, tur = "birincil", kucuk, pasif, style, tam }) {
  const [uzeri, setUzeri] = useState(false);
  const s = {
    birincil: { bg: C.murekkep, fg: C.muhre, bd: C.murekkep },
    altin:    { bg: C.altin, fg: "#FFFBF0", bd: C.altin },
    lacivert: { bg: C.lacivert, fg: "#F5F7FC", bd: C.lacivert },
    ikincil:  { bg: "transparent", fg: C.murekkep, bd: C.golge },
    tehlike:  { bg: "transparent", fg: C.lal, bd: C.lal + "66" },
    sessiz:   { bg: "transparent", fg: C.murekkepAlt, bd: "transparent" }
  }[tur] || { bg: C.murekkep, fg: C.muhre, bd: C.murekkep };
  return (
    <button onClick={pasif ? undefined : tikla} disabled={pasif}
      onMouseEnter={() => setUzeri(true)} onMouseLeave={() => setUzeri(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        fontFamily: T.govde, fontSize: kucuk ? 13 : 14.5, letterSpacing: "0.03em",
        padding: kucuk ? "5px 11px" : "9px 18px", background: s.bg, color: s.fg,
        border: `1px solid ${s.bd}`, borderRadius: 1, cursor: pasif ? "not-allowed" : "pointer",
        opacity: pasif ? 0.4 : uzeri ? 0.87 : 1, width: tam ? "100%" : undefined,
        transition: "opacity .15s", ...style
      }}>{children}</button>
  );
}

function Cubuk({ deger, renk = C.altin, boy = 5, zemin }) {
  return (
    <div style={{ background: zemin || C.kagitDerin, height: boy, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, deger))}%`, height: "100%", background: renk, transition: "width .45s ease-out" }} />
    </div>
  );
}

function Halka({ deger, boy = 62, renk = C.altin, kalinlik = 4, ic }) {
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

function Bekle({ asamalar = ["Çalışılıyor…"] }) {
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

function Haber({ children, tur = "bilgi", basli }) {
  const r = { hata: C.lal, iyi: C.zumrut, bilgi: C.lacivert, altin: C.altin }[tur] || C.lacivert;
  const z = { hata: C.lalSis, iyi: C.zumSis, bilgi: C.laciSis, altin: C.altinSis }[tur] || C.laciSis;
  return (
    <div style={{ background: z, border: `1px solid ${r}33`, borderLeft: `2.5px solid ${r}`,
      padding: `${S.md}px ${S.lg}px`, borderRadius: 1, color: C.murekkep, ...T.s }}>
      {basli && <div style={{ ...T.cap, color: r, marginBottom: 5 }}>{basli}</div>}
      {children}
    </div>
  );
}

function Bos({ baslik, aciklama, eylem, eylemAd }) {
  return (
    <div style={{ textAlign: "center", padding: `${S.xxl}px ${S.lg}px`, color: C.murekkepAlt }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: S.md }}><Gul boy={26} opak={0.4} /></div>
      <div style={{ fontFamily: T.hat, ...T.d2, color: C.murekkep, marginBottom: S.sm }}>{baslik}</div>
      <div style={{ ...T.s, maxWidth: 430, margin: "0 auto", marginBottom: eylem ? S.lg : 0 }}>{aciklama}</div>
      {eylem && <Dugme tikla={eylem}>{eylemAd}</Dugme>}
    </div>
  );
}

function Olcu({ sayi, ad, renk = C.murekkep, alt, tikla, vurgu }) {
  return (
    <Levha tikla={tikla} vurgu={vurgu} ic={S.md} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: T.hat, fontSize: 27, fontWeight: 500, color: renk, ...T.rakam, lineHeight: 1.1 }}>{sayi}</div>
      <div style={{ ...T.cap, fontSize: 9.5, color: C.murekkepAlt, marginTop: 5 }}>{ad}</div>
      {alt && <div style={{ ...T.xs, fontSize: 11, color: C.murekkepSis, marginTop: 3 }}>{alt}</div>}
    </Levha>
  );
}

function Alan({ deger, degistir, satir = 4, ipucu, kalem = true, pasif, style }) {
  return (
    <textarea value={deger} onChange={(e) => degistir(e.target.value)} rows={satir} placeholder={ipucu} disabled={pasif}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: kalem ? T.kalem : T.govde,
        fontSize: kalem ? 14.5 : 15.5, lineHeight: 1.85, padding: S.md,
        border: `1px solid ${C.cizgi}`, borderRadius: 2, background: pasif ? C.kagitAlt : C.muhre,
        color: C.murekkep, outline: "none", resize: "vertical", ...style
      }} />
  );
}

function Satir({ deger, degistir, ipucu, style, gonder }) {
  return (
    <input value={deger} onChange={(e) => degistir(e.target.value)} placeholder={ipucu}
      onKeyDown={(e) => { if (e.key === "Enter" && gonder) gonder(); }}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: T.govde, fontSize: 15,
        padding: `${S.sm + 1}px ${S.md}px`, border: `1px solid ${C.cizgi}`, borderRadius: 2,
        background: C.muhre, color: C.murekkep, outline: "none", ...style
      }} />
  );
}

/* ─── TASHİHLİ METİN + HAŞİYE (kenar notu) ─────────────────────────── */

function TashihliMetin({ metin, hatalar, secili, sec, kompakt }) {
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
    <div style={{ fontFamily: T.kalem, fontSize: kompakt ? 13.5 : 14.5, lineHeight: 2.35, whiteSpace: "pre-wrap" }}>
      {parcalar.map((p, i) =>
        p.tip === "duz" ? <span key={i}>{p.m}</span> : (
          <span key={i} onClick={() => sec && sec(secili === p.i ? null : p.i)}
            style={{ cursor: sec ? "pointer" : "default", background: secili === p.i ? C.altinSis : "transparent", borderRadius: 1, padding: "1px 0" }}>
            <span style={{ textDecoration: "line-through", textDecorationColor: C.lal, textDecorationThickness: 1.5, color: C.lal, opacity: 0.72 }}>{p.m}</span>
            <sup style={{ color: C.lal, fontSize: 10.5, margin: "0 2px", fontWeight: 700 }}>∧</sup>
            <span style={{ color: C.zumrut, fontWeight: 500, borderBottom: `1px solid ${C.zumrut}66` }}>{p.h.duzeltme}</span>
          </span>
        )
      )}
    </div>
  );
}

/* Haşiye — kenar notu sütunu */
function Hasiye({ children, baslik }) {
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

const HARITA = (() => {
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

function Takimyildiz({ ustalik, hatalar, sec, seciliAile, setSeciliAile, ara }) {
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
                style={{ fontFamily: T.govde, fontSize: 13, fill: etkin ? C.murekkepAlt : C.murekkepSis,
                  letterSpacing: "0.05em", opacity: etkin ? 1 : 0.4 }}>{a.kisa}</text>
              <text x={x} y={y + 15} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: T.hat, fontSize: 12, fill: C.altin, opacity: etkin ? 0.85 : 0.25 }}>{ort}</text>
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
                    style={{ fontFamily: T.govde, fontSize: 12.5, fill: C.muhre }}>
                    {d.tr.length > 30 ? d.tr.slice(0, 29) + "…" : d.tr}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <circle cx="400" cy="400" r="26" fill={C.muhre} stroke={C.cetvel} strokeWidth="1" />
        <text x="400" y="396" textAnchor="middle" style={{ fontFamily: T.hat, fontSize: 19, fill: C.altin, letterSpacing: "0.1em" }}>
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

function DugumSayfa({ d, ustalik, hatalar, derin, derinlestir, git, calis, konus }) {
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
            <div style={{ fontFamily: T.hat, fontSize: 17, color: sv.renk, ...T.rakam }}>{puan}</div>
          </div>} />}
        alt={null} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: -S.lg, marginBottom: S.lg }}>
        <span style={{ fontFamily: T.kalem, fontSize: 12.5, color: C.murekkepSis }}>{d.en}</span>
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
                ...T.s, fontStyle: "italic", color: C.murekkepAlt }}>{d.an || ek.an}</div>
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
          <div style={{ border: `1px solid ${C.lal}44`, borderLeft: `3px solid ${C.lal}`, background: C.lalSis, borderRadius: 1, padding: S.lg }}>
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
              <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.zumrut, display: "flex", gap: S.sm }}>
                <Check size={14} style={{ flexShrink: 0, marginTop: 3 }} /><span>{kp.d}</span>
              </div>
              <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.lal, display: "flex", gap: S.sm }}>
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
                <div key={i} style={{ fontFamily: T.kalem, fontSize: 13.5 }}>
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
                <div style={{ fontFamily: T.kalem, fontSize: 13 }}>
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

function Harita({ ustalik, hatalar, derin, derinlestir, secili, setSecili, calis, konus }) {
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
          borderRadius: 2, padding: `${S.sm}px ${S.md}px`, background: C.muhre }}>
          <Search size={14} style={{ color: C.murekkepSis }} />
          <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Düğüm, kural veya tuzak ara…"
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: T.govde, fontSize: 15, color: C.murekkep }} />
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
                    <div style={{ fontFamily: T.govde, fontSize: 15.5, color: C.murekkep }}>{d.tr}</div>
                    <div style={{ fontFamily: T.kalem, fontSize: 11.5, color: C.murekkepSis, marginTop: 2 }}>{d.en}</div>
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

const BASAMAK = [null,
  { ad: "Tanıma",           ac: "Doğruyu seç. Henüz üretmiyorsun, tanıyorsun." },
  { ad: "Boşluk",           ac: "Kontrollü üretim. Yapı verilmiş, parçayı sen koyuyorsun." },
  { ad: "Dönüştürme",       ac: "Verilen cümleyi hedef yapıya çevir." },
  { ad: "Çeviri",           ac: "Girişimin açığa çıktığı yer. Zorunlu basamak." },
  { ad: "Serbest üretim",   ac: "Süre baskısı altında üret. Otomatikliğin tek gerçek testi." }
];

const TALIM_MODLARI = [
  { id: "merdiven", ad: "Merdiven", ikon: Target,    ac: "Tek düğüm, beş basamak. Tanımadan otomatikliğe." },
  { id: "tuzak",    ad: "Tuzak",    ikon: Crosshair, ac: "Senin en sık üç hatanı aynı anda tetiklemek için kurulmuş cümle." },
  { id: "kur",      ad: "Kur",      ikon: Swords,    ac: "Rol değişir. Metni ben yazarım, hataları sen bulursun." },
  { id: "esdizim",  ad: "Eşdizim",  ikon: Layers,    ac: "Fiil + edat. En pahalı hata kaynağının hızlı turu." }
];

/* ── Tuzak ── */
function TuzakModu({ hatalar, ustalik, hataEkle, kaydet, oturumBitir }) {
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
          <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: S.md, fontStyle: "italic" }}>
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
            <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 1.8, color: C.murekkep }}>{cevap}</div>
          </Levha>

          <div style={{ display: "grid", gap: S.sm }}>
            {(rapor.tuzakSonuc || []).map((t, i) => (
              <Levha key={i} renk={t.dustu ? C.lal : C.zumrut} ic={S.md}>
                <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: 5 }}>
                  {t.dustu ? <XCircle size={15} style={{ color: C.lal }} /> : <CheckCircle size={15} style={{ color: C.zumrut }} />}
                  <span style={{ fontFamily: T.govde, fontSize: 15, color: C.murekkep, flex: 1 }}>{t.ad}</span>
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
                  <div style={{ fontFamily: T.kalem, fontSize: 13 }}>
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
            <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 1.8, color: C.zumrut }}>{gorev.modelCeviri}</div>
          </Levha>

          {rapor.not && <Haber tur="bilgi">{rapor.not}</Haber>}
          <Dugme tur="altin" tikla={() => { setGorev(null); setRapor(null); }} tam>Yeni tuzak kur</Dugme>
        </>
      )}
    </div>
  );
}

/* ── Kur: rol değişimi ── */
function tokenle(metin) {
  const parcalar = String(metin).split(/(\s+)/);
  let konum = 0;
  return parcalar.map((m, i) => { const t = { m, i, bas: konum, son: konum + m.length, bosluk: /^\s*$/.test(m) }; konum += m.length; return t; });
}

function KurModu({ hatalar, ustalik, hataEkle, oturumBitir }) {
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
        <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 2.2, color: C.murekkep }}>
          {oyun.tokenlar.map((t) => {
            if (t.bosluk) return <span key={t.i}>{t.m}</span>;
            const secili = sec.has(t.i);
            const hataliMi = hataTokenlari.has(t.i);
            let stil = { cursor: bitti ? "default" : "pointer", padding: "1px 1px", borderRadius: 1, transition: "background .12s" };
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
                  <div style={{ fontFamily: T.kalem, fontSize: 13.5 }}>
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
                  <span style={{ fontFamily: T.kalem, fontSize: 13 }}>{h.parca}</span>
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
function EsdizimModu({ durum, guncelle, hataEkle, oturumBitir }) {
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
        <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.8, color: C.murekkep }}>{bosluklu}</div>
      </Cetvel>

      {!sonuc ? (
        <>
          <Satir deger={cevap} degistir={setCevap} gonder={gonder}
            ipucu="Edatı yaz — edat almıyorsa boş bırak veya — yaz"
            style={{ fontFamily: T.kalem, fontSize: 16, textAlign: "center" }} />
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
            <div style={{ fontFamily: T.kalem, fontSize: 15, color: C.murekkep, marginBottom: S.sm }}>
              <strong style={{ color: C.zumrut }}>{kart.e} {kart.p || "(edat almaz)"}</strong>
            </div>
            <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepAlt }}>{kart.c}</div>
            {kart.tuzak && <div style={{ ...T.xs, color: C.lal, marginTop: S.sm }}>↳ {kart.tuzak}</div>}
          </Levha>
          <Dugme tikla={ileri} tam>{i + 1 < kuyruk.length ? "Sonraki" : "Turu bitir"}</Dugme>
        </>
      )}
    </div>
  );
}

/* ── Merdiven ── */
function MerdivenModu({ ustalik, hatalar, hedef, setHedef, kaydet, hataEkle, oturumBitir }) {
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
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.lg, fontStyle: "italic" }}>
          Sıralama ustalık puanına, Türkçe girişim şiddetine ve senin kayıtlı hatalarına göre yapıldı. Önkoşulu açılmamış düğümler listeye girmez.
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          {oneriler.map(({ d: dd, p }) => (
            <Levha key={dd.id} tikla={() => setHedef(dd.id)} ic={S.md} renk={seviyeBul(p).renk}>
              <div style={{ display: "flex", alignItems: "center", gap: S.md }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.govde, fontSize: 15.5, color: C.murekkep }}>{dd.tr}</div>
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
      <div style={{ ...T.xs, color: C.murekkepAlt, fontStyle: "italic", marginBottom: S.lg }}>{BASAMAK[basamak].ac}</div>

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
            <div style={{ fontFamily: basamak >= 4 ? T.govde : T.kalem, fontSize: basamak >= 4 ? 17.5 : 15.5, lineHeight: 1.7, color: C.murekkep }}>
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
                      borderRadius: 2, padding: `${S.md}px`, cursor: sonuc ? "default" : "pointer",
                      fontFamily: T.kalem, fontSize: 14, color: C.murekkep, display: "flex", gap: S.sm }}>
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
                  <div style={{ fontFamily: T.kalem, fontSize: 14.5, color: C.zumrut }}>{sonuc.s.dogruCevap}</div>
                </Levha>
              )}
              {sonuc.ayrinti && (sonuc.ayrinti.hatalar || []).length > 0 && (
                <Levha renk={C.lal}>
                  <Etiket renk={C.lal}>Hatalar</Etiket>
                  {sonuc.ayrinti.hatalar.map((h, k) => (
                    <div key={k} style={{ marginBottom: S.sm }}>
                      <div style={{ fontFamily: T.kalem, fontSize: 13.5 }}>
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
                  <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.zumrut }}>✓ {sonuc.s.karsit.d}</div>
                  <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.lal, marginTop: 4 }}>✗ {sonuc.s.karsit.y}</div>
                  <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: S.sm }}>{sonuc.s.karsit.f}</div>
                </Levha>
              )}
              {sonuc.s.tuzak && (
                <div style={{ background: C.lalSis, borderLeft: `2.5px solid ${C.lal}`, padding: S.md, borderRadius: 1, ...T.s }}>
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

function Talimhane(p) {
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

const AILE_LISTE = "iskelet, ad-obegi, zaman, kip, cati, fiil-oruntu, yan-cumle, kosul, soylem, edat, nitel, vurgu, kayit, mekanik";

async function tashihEt(metin, baglam) {
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

const HATA_TUR_AD = { eksiltme: "eksiltme", fazlalik: "fazlalık", "yanlis-secim": "yanlış seçim", bicim: "biçim", siralama: "sıralama", "kayit-uyumsuzlugu": "kayıt uyumsuzluğu" };

/* ── Serbest: canlı tashih ── */
function SerbestModu({ hatalar, hataEkle, metinEkle, oturumBitir, taslak, taslakKaydet }) {
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
            <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: S.md, paddingTop: S.sm, borderTop: `1px dashed ${C.cizgi}`, fontStyle: "italic" }}>
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
              <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 2, whiteSpace: "pre-wrap", color: C.murekkep }}>{rapor.yukseltilmisMetin}</div>
            </Cetvel>
          )}
        </div>

        {rapor && (
          <Hasiye baslik={`Haşiye · ${(rapor.hatalar || []).length} hata`}>
            <div style={{ display: "grid", gap: 6, maxHeight: 520, overflowY: "auto" }}>
              {aileGrup.map(([aid, liste]) => (
                <div key={aid}>
                  <div style={{ ...T.xs, fontSize: 10.5, color: C.murekkepSis, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                    {aileKisa(aid)} · {liste.length}
                  </div>
                  {liste.map(({ h, i }) => (
                    <div key={i} onClick={() => setSecili(secili === i ? null : i)}
                      style={{ cursor: "pointer", padding: "5px 6px", marginBottom: 3, borderRadius: 1,
                        background: secili === i ? C.altinSis : "transparent", borderLeft: `2px solid ${h.l1Kaynakli ? C.lal : C.cizgi}` }}>
                      <div style={{ fontFamily: T.kalem, fontSize: 11.5, lineHeight: 1.45 }}>
                        <span style={{ color: C.lal, textDecoration: "line-through" }}>{h.hataliParca}</span>
                        <span style={{ color: C.zumrut }}> → {h.duzeltme}</span>
                      </div>
                      {secili === i && (
                        <div style={{ ...T.xs, fontSize: 11, color: C.murekkepAlt, marginTop: 4 }}>
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
const METIN_TURLERI = ["Blog yazısı", "Resmî e-posta", "Makale", "Konuşma metni", "Öneri raporu", "İnceleme", "Röportaj", "Günlük"];

function KalemModu({ hataEkle, metinEkle, metinler, oturumBitir }) {
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
              <div style={{ ...T.cap, fontSize: 9.5, color: C.murekkepAlt }}>{o.ad}</div>
              <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 2px" }}>
                <Halka deger={(o.bant / 12) * 100} boy={54} kalinlik={3.5}
                  renk={o.bant >= 9 ? C.zumrut : o.bant >= 6 ? C.altin : C.lal}
                  ic={<span style={{ fontFamily: T.hat, fontSize: 20, ...T.rakam, color: o.bant >= 9 ? C.zumrut : o.bant >= 6 ? C.altin : C.lal }}>{o.bant}</span>} />
              </div>
              <div style={{ ...T.xs, fontSize: 10, color: C.murekkepSis }}>/ 12</div>
            </Levha>
          ))}
        </div>
        {(rapor.olcutler || []).map((o, i) => (
          <Levha key={i}>
            <Etiket>{o.ad}</Etiket>
            <div style={{ ...T.m, fontFamily: T.govde, color: C.murekkep }}>{o.gerekce}</div>
            {(o.kanit || []).length > 0 && (
              <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}` }}>
                {o.kanit.map((k, j) => <div key={j} style={{ fontFamily: T.kalem, fontSize: 12, color: C.murekkepAlt, marginBottom: 4 }}>· {k}</div>)}
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
        <div style={{ ...T.s, color: C.murekkepAlt, marginBottom: S.md, fontStyle: "italic" }}>{gorev.baglam}</div>
        <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 1.8, color: C.murekkep }}>{gorev.gorev}</div>
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
function PalimpsestModu({ metinler, hataEkle, metinEkle, oturumBitir }) {
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
        <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 1.8, color: C.murekkep }}>
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
                <div style={{ fontFamily: T.kalem, fontSize: 12.5, lineHeight: 1.85, whiteSpace: "pre-wrap", color: C.murekkepAlt }}>{secili.tamMetin}</div>
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
function MadenModu({ ustalik, hatalar, derinlestir }) {
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
                <div style={{ ...T.cap, fontSize: 9.5, color: C.altin, marginBottom: 4 }}>{b.yapi}</div>
                <Aralik en={b.en} tr={b.tr} fark={b.f} acikBasla={hepsi} />
                {b.not && <div style={{ ...T.xs, color: C.murekkepAlt, marginTop: 4, paddingLeft: S.sm, fontStyle: "italic" }}>{b.not}</div>}
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

const YAZI_MODLARI = [
  { id: "serbest",    ad: "Serbest",    ikon: PenLine,     ac: "Canlı tashih. Yazarken üç saniyelik her duraklamada metnin sessizce taranır." },
  { id: "kalem",      ad: "Paper 1",    ikon: ScrollText,  ac: "Tam IB simülasyonu. Görev, süre, üç ölçüt üzerinden bantlama." },
  { id: "palimpsest", ad: "Palimpsest", ikon: History,     ac: "Eski bir görevi, eski metnini görmeden yeniden yaz. Kendi geçmiş hâline karşı ölçül." },
  { id: "maden",      ad: "Maden",      ikon: Pickaxe,     ac: "Okuduğun özgün metinden zayıf yapılarının doğru kullanımlarını çıkar." }
];

function Yazihane(p) {
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

function Sesli({ hataEkle, metinEkle, oturumBitir, hatalar, ustalik }) {
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
          <div style={{ ...T.xs, color: C.murekkepAlt, marginBottom: S.sm, fontStyle: "italic" }}>{gorev.baglam}</div>
          <div style={{ fontFamily: T.kalem, fontSize: 14.5, lineHeight: 1.8, color: C.murekkep, marginBottom: S.md }}>{gorev.gorev}</div>
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
        {gecici && <span style={{ fontFamily: T.kalem, fontSize: 14.5, color: C.murekkepSis, fontStyle: "italic" }}>{gecici}</span>}
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

function Defter({ hatalar, guncelle, sil, git, ustalik }) {
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
              <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.85, color: C.murekkep }}>{kart.hataliMetin}</div>
              {!acik && <div style={{ marginTop: S.xl }}><Dugme tikla={() => setAcik(true)} tam>Düzeltmeyi göster</Dugme></div>}
              {acik && (
                <div style={{ marginTop: S.lg, paddingTop: S.lg, borderTop: `1px dashed ${C.cizgi}` }}>
                  <Etiket renk={C.zumrut}>Doğrusu</Etiket>
                  <div style={{ fontFamily: T.kalem, fontSize: 17, lineHeight: 1.85, color: C.zumrut }}>{kart.dogruMetin}</div>
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
          style={{ fontFamily: T.govde, fontSize: 13, padding: "4px 8px", border: `1px solid ${C.cizgi}`, borderRadius: 1, background: C.muhre, color: C.murekkep, outline: "none" }}>
          <option value="">Tüm aileler</option>
          {AILELER.map((a) => <option key={a.id} value={a.id}>{a.ad}</option>)}
        </select>
        <select value={filtre.kaynak || ""} onChange={(e) => setFiltre({ ...filtre, kaynak: e.target.value || null })}
          style={{ fontFamily: T.govde, fontSize: 13, padding: "4px 8px", border: `1px solid ${C.cizgi}`, borderRadius: 1, background: C.muhre, color: C.murekkep, outline: "none" }}>
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
              <div style={{ fontFamily: T.kalem, fontSize: 13.5, marginBottom: S.sm, lineHeight: 1.6 }}>
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
                <span style={{ ...T.xs, fontSize: 11, color: C.murekkepSis }}>{trTarih(h.tarih)}</span>
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

const MODLAR = [
  { id: "anlat",       ad: "Anlat",       ac: "Düğümü sıfırdan, Baranca Protokolü'yle öğretir." },
  { id: "sorgula",     ad: "Sorgula",     ac: "Cevap vermez. Soru sorar, kuralı sen bulursun." },
  { id: "karsilastir", ad: "Karşılaştır", ac: "Türkçe ↔ İngilizce karşıtsal analiz. Girişimin kaynağını açar." },
  { id: "sina",        ad: "Sına",        ac: "Konuştuklarınızın üzerine anlık mini sınav." }
];
const MOD_TALIMAT = {
  anlat: `Mod: ANLAT. Düğümü sıfırdan öğret. ${BARANCA}`,
  sorgula: `Mod: SORGULA. Sokratik yöntem. Kuralı ASLA doğrudan söyleme. Her yanıtın bir veya iki sorudan oluşsun. Yanlış cevap verirse doğruyu söyleme, daha dar bir soru sor.`,
  karsilastir: `Mod: KARŞILAŞTIR. Karşıtsal analiz yap: önce Türkçenin bu işi nasıl yaptığını göster, sonra İngilizcenin neden başka bir yol seçtiğini açıkla, sonra girişimin tam olarak nerede doğduğunu işaretle. En az üç Türkçe-İngilizce cümle çifti ver.`,
  sina: `Mod: SINA. Konuşmanın üzerine 4 soruluk kısa sınav. Soruları tek tek sor, cevabı bekle, doğrudan değerlendir. Övgü yok.`
};

function Sokrates({ dugumId, setDugumId, gecmisler, gecmisKaydet, hatalar }) {
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
        <div style={{ display: "flex", alignItems: "center", gap: S.sm, border: `1px solid ${C.cizgi}`, borderRadius: 2,
          padding: `${S.sm}px ${S.md}px`, background: C.muhre, marginBottom: S.md }}>
          <Search size={14} style={{ color: C.murekkepSis }} />
          <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Düğüm ara…"
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: T.govde, fontSize: 15, color: C.murekkep }} />
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          {liste.map((x) => (
            <Levha key={x.id} tikla={() => setDugumId(x.id)} ic={S.md}>
              <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
                <span style={{ flex: 1, fontFamily: T.govde, fontSize: 15, color: C.murekkep }}>{x.tr}</span>
                {x.l1 === 3 && <Nisan kucuk renk={C.lal} zemin={C.lalSis}>L1</Nisan>}
                <span style={{ ...T.cap, fontSize: 9.5, color: C.murekkepSis }}>{aileKisa(x.a)}</span>
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
              <div style={{ ...T.cap, fontSize: 9.5, color: m.rol === "sen" ? C.murekkepSis : C.lacivert, marginBottom: 5 }}>
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
          style={{ flex: 1, fontFamily: T.govde, fontSize: 15, padding: S.sm, border: `1px solid ${C.cizgi}`,
            borderRadius: 2, background: C.muhre, color: C.murekkep, outline: "none", resize: "none" }} />
        <Dugme tikla={() => gonder(giris)} pasif={yuklu || !giris.trim()}><Send size={14} /></Dugme>
      </div>
    </div>
  );
}

/* ══════════════════════ DİVAN ══════════════════════ */

function Divan({ profil, ustalik, hatalar, metinler, oturumlar, esdizim, git, gitDugum, calis, sonDisa, tasindi, dag }) {
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
      <YasayanBaslik ad={profil.ad} dag={dag || {}} ustalik={ustalik} hatalar={hatalar} oturumlar={oturumlar} git={git} />

      <div style={{ display: "flex", alignItems: "center", gap: S.md, marginBottom: S.lg }}>
        <Halka deger={genel} boy={62} kalinlik={4} renk={C.altin}
          ic={<div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: T.hat, fontSize: 18, ...T.rakam, color: C.altin, lineHeight: 1 }}>{genel}</div>
            <div style={{ ...T.cap, fontSize: 6.5, color: C.murekkepSis, marginTop: 1 }}>gramer</div>
          </div>} />
        <div style={{ flex: 1 }}>
          <Serlevha />
        </div>
      </div>

      {/* Ocak */}
      <Cetvel style={{ marginBottom: S.lg }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: S.md, gap: S.md, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
            <Flame size={16} style={{ color: bugunCalisti ? C.altin : C.murekkepSis }} />
            <span style={{ fontFamily: T.hat, ...T.d3, color: C.murekkep }}>Ocak</span>
            <span style={{ ...T.xs, color: C.murekkepSis }}>· bugünün {ocak.toplamDk} dakikası</span>
          </div>
          <div style={{ display: "flex", gap: S.sm, alignItems: "center" }}>
            {seri > 0 && <Nisan renk={C.altin} dolu>{seri} günlük seri</Nisan>}
            {bugunCalisti && <Nisan renk={C.zumrut}><Check size={10} /> bugün çalıştın</Nisan>}
          </div>
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          {ocak.adimlar.map((a, i) => (
            <div key={i} onClick={() => a.dugumId ? calis(a.dugumId) : git(a.hedef)}
              style={{ display: "flex", alignItems: "center", gap: S.md, padding: `${S.sm + 2}px ${S.sm}px`,
                borderBottom: i < ocak.adimlar.length - 1 ? `1px dashed ${C.cizgi}` : "none", cursor: "pointer" }}>
              <span style={{ fontFamily: T.hat, fontSize: 15, color: C.altin, width: 18, ...T.rakam }}>{i + 1}</span>
              <span style={{ flex: 1, fontFamily: T.govde, fontSize: 15, color: C.murekkep }}>{a.ad}</span>
              <span style={{ ...T.xs, color: C.murekkepSis }}>{a.dk} dk</span>
              <ChevronRight size={14} style={{ color: C.murekkepSis }} />
            </div>
          ))}
        </div>
      </Cetvel>

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
                <PolarAngleAxis dataKey="aile" tick={{ fill: C.murekkepAlt, fontSize: 9.5, fontFamily: T.govde }} />
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
                    <span style={{ fontFamily: T.hat, fontSize: 17, color: C.lal, width: 18, ...T.rakam }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.govde, fontSize: 14, color: C.murekkep }}>
                        {g.dugumId ? (dugum(g.dugumId) || {}).tr : g.dugumAdi || aileAd(g.aile)}
                      </div>
                      <div style={{ fontFamily: T.kalem, fontSize: 10.5, color: C.murekkepSis, marginTop: 2,
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

function Seyir({ ustalik, hatalar, metinler, oturumlar }) {
  const tik = { fill: C.murekkepAlt, fontSize: 10.5, fontFamily: T.govde };
  const kutu = { background: C.muhre, border: `1px solid ${C.cizgi}`, borderRadius: 1, fontFamily: T.govde, fontSize: 13 };

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
                style={{ aspectRatio: "1", borderRadius: 1, border: `1px solid ${C.cizgi}`,
                  background: x.dk === 0 ? C.kagit : x.dk < 12 ? C.altinSis : x.dk < 30 ? C.altinAcik : C.altin }} />
            ))}
          </div>
        </Levha>
      </div>
    </div>
  );
}

/* ─── TANI SINAVI ──────────────────────────────────────────────── */

const TANI = [
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

const YOL_OBEK = [
  { id: "tan", ad: "Tanışma", renk: C.lacivert, ac: "Kelimeyi ilk kez karşıla" },
  { id: "ure", ad: "Üretim",  renk: C.zumrut,   ac: "Kendin yaz, kendin kur" },
  { id: "snv", ad: "Sınav",   renk: C.lal,      ac: "IB'nin sorduğu biçimler" },
  { id: "oyn", ad: "Oyun",    renk: C.altin,    ac: "Baskı altında, hızlı" },
  { id: "der", ad: "Derinlik",renk: "#4A3B6B",  ac: "Kelimeyi kendine bağla" }
];

/* Mini devinim — her yol kartının üstünde çalışan küçük görsel */
function YolDevinim({ tip, renk }) {
  const s = { position: "absolute", inset: 0, overflow: "hidden", borderRadius: 2, pointerEvents: "none" };
  const g = { position: "absolute", background: renk, borderRadius: 1 };
  const P = {
    kart:   <><i style={{ ...g, width: 17, height: 23, left: 12, top: 9, opacity: .32, animation: "nvKart1 3.2s ease-in-out infinite" }} />
               <i style={{ ...g, width: 17, height: 23, left: 19, top: 9, opacity: .72, animation: "nvKart2 3.2s ease-in-out infinite" }} /></>,
    basamak:<>{[0, 1, 2].map((i) => <i key={i} style={{ ...g, width: 7, height: 7 + i * 7, left: 12 + i * 11, bottom: 10, opacity: .35 + i * .22, animation: `nvYuk 2.4s ${i * .25}s ease-in-out infinite` }} />)}</>,
    yaz:    <><i style={{ ...g, width: 26, height: 2, left: 11, bottom: 14, opacity: .4 }} />
               <i style={{ ...g, width: 2, height: 13, left: 11, bottom: 16, animation: "nvImlec 1.3s steps(2) infinite" }} /></>,
    bosluk: <><i style={{ ...g, width: 11, height: 3, left: 8, top: 18, opacity: .4 }} />
               <i style={{ ...g, width: 11, height: 3, left: 29, top: 18, opacity: .4 }} />
               <i style={{ ...g, width: 9, height: 12, left: 20, top: 13, opacity: .25, borderRadius: 2, animation: "nvNefes 2s ease-in-out infinite" }} /></>,
    harf:   <>{["e", "d", "u"].map((t, i) => <i key={i} style={{ position: "absolute", left: 9 + i * 13, top: 14, width: 11, height: 13, border: `1px solid ${renk}`, borderRadius: 1, color: renk, fontSize: 8, fontFamily: T.kalem, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "normal", animation: `nvZipla 2.6s ${i * .18}s ease-in-out infinite` }}>{t}</i>)}</>,
    dalga:  <>{[0, 1, 2, 3].map((i) => <i key={i} style={{ ...g, width: 3, height: 6 + (i % 2) * 11, left: 12 + i * 8, top: 15, borderRadius: 9, animation: `nvDalga 1.1s ${i * .13}s ease-in-out infinite` }} />)}</>,
    isaret: <><i style={{ ...g, width: 28, height: 2.4, left: 10, top: 15, opacity: .35 }} />
               <i style={{ ...g, width: 28, height: 2.4, left: 10, top: 24, opacity: .35 }} />
               <i style={{ ...g, width: 13, height: 8, left: 15, top: 12, opacity: .45, animation: "nvKaydir 3s ease-in-out infinite" }} /></>,
    esit:   <><i style={{ ...g, width: 10, height: 10, left: 8, top: 15, borderRadius: 9, opacity: .55 }} />
               <i style={{ position: "absolute", left: 22, top: 13, color: renk, fontSize: 12, fontStyle: "normal", fontWeight: 700 }}>=</i>
               <i style={{ ...g, width: 10, height: 10, left: 33, top: 15, borderRadius: 9, opacity: .55, animation: "nvNefes 2.2s .4s ease-in-out infinite" }} /></>,
    test:   <>{[0, 1, 2].map((i) => <i key={i} style={{ ...g, width: 24, height: 3, left: 13, top: 12 + i * 8, opacity: i === 1 ? .8 : .3, animation: i === 1 ? "nvNefes 2s ease-in-out infinite" : "none" }} />)}</>,
    simsek: <><i style={{ position: "absolute", left: 17, top: 10, width: 0, height: 0, borderLeft: `7px solid transparent`, borderRight: `7px solid transparent`, borderBottom: `11px solid ${renk}`, opacity: .8, animation: "nvCakan 1.6s ease-in-out infinite" }} />
               <i style={{ position: "absolute", left: 17, top: 19, width: 0, height: 0, borderLeft: `7px solid transparent`, borderRight: `7px solid transparent`, borderTop: `11px solid ${renk}`, opacity: .8, animation: "nvCakan 1.6s .15s ease-in-out infinite" }} /></>,
    eslestir:<><i style={{ ...g, width: 11, height: 11, left: 9, top: 14, animation: "nvSagaSola 2.4s ease-in-out infinite" }} />
               <i style={{ ...g, width: 11, height: 11, left: 30, top: 14, opacity: .5, animation: "nvSagaSola 2.4s .3s ease-in-out infinite reverse" }} /></>,
    izgara: <>{[0, 1, 2, 3].map((i) => <i key={i} style={{ ...g, width: 10, height: 10, left: 12 + (i % 2) * 13, top: 11 + Math.floor(i / 2) * 13, opacity: .3 + (i === 1 ? .5 : 0), animation: `nvCevir 3s ${i * .35}s ease-in-out infinite` }} />)}</>,
    vapur:  <><i style={{ ...g, width: 34, height: 2, left: 8, bottom: 12, opacity: .3 }} />
               <i style={{ ...g, width: 13, height: 7, left: 8, bottom: 14, borderRadius: "2px 5px 0 0", animation: "nvVapur 3.4s linear infinite" }} /></>,
    ampul:  <><i style={{ ...g, width: 12, height: 12, left: 18, top: 13, borderRadius: 9, animation: "nvParla 2.6s ease-in-out infinite" }} />
               {[0, 1, 2].map((i) => <i key={i} style={{ ...g, width: 2, height: 5, left: 23, top: 4, transformOrigin: "50% 16px", transform: `rotate(${-40 + i * 40}deg)`, opacity: .5, animation: `nvParla 2.6s ${.2 + i * .1}s ease-in-out infinite` }} />)}</>,
    mikrofon:<><i style={{ ...g, width: 8, height: 14, left: 20, top: 9, borderRadius: 6 }} />
               <i style={{ position: "absolute", left: 14, top: 22, width: 20, height: 10, border: `2px solid ${renk}`, borderTop: "none", borderRadius: "0 0 10px 10px", opacity: .6, animation: "nvNefes 1.8s ease-in-out infinite" }} /></>,
    zincir: <><i style={{ position: "absolute", left: 10, top: 15, width: 13, height: 9, border: `2px solid ${renk}`, borderRadius: 5, opacity: .7 }} />
               <i style={{ position: "absolute", left: 20, top: 15, width: 13, height: 9, border: `2px solid ${renk}`, borderRadius: 5, opacity: .7, animation: "nvNefes 2.2s .3s ease-in-out infinite" }} /></>,
    kok:    <><i style={{ ...g, width: 2, height: 14, left: 24, top: 8, opacity: .7 }} />
               <i style={{ ...g, width: 11, height: 2, left: 14, top: 21, opacity: .45, transform: "rotate(28deg)" }} />
               <i style={{ ...g, width: 11, height: 2, left: 26, top: 21, opacity: .45, transform: "rotate(-28deg)", animation: "nvNefes 2.4s ease-in-out infinite" }} /></>
  };
  return <span style={s} aria-hidden="true">{P[tip] || null}</span>;
}

const YOLLAR = [
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

const YOL_HARITA = Object.fromEntries(YOLLAR.map((y) => [y.id, y]));

/* ─── Soru üreteçleri ─────────────────────────────────────────────── */

function soruKur(tip, hedef, havuz) {
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
    const gizli = hedef.ornek.replace(new RegExp(hedef.w.split(" ")[0], "gi"), "______");
    return { tip: "secim", metin: gizli, soru: "Boşluğa hangi kelime gelir?",
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  if (tip === "tanimBul") {
    return { tip: "secim", metin: hedef.tr, altMetin: DURAK_META[hedef.durak].ad,
      soru: "Bu anlama gelen kelime hangisi?",
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  if (tip === "esdizimBul") {
    return { tip: "secim", metin: hedef.esdizim.replace(new RegExp(hedef.w.split(" ")[0], "gi"), "______"),
      soru: "Bu eşdizimde boşluğa ne gelir?", altMetin: hedef.tr,
      secenekler: karistir([hedef, ...c].map((k) => ({ id: k.id, t: k.w }))), dogruId: hedef.id };
  }
  return null;
}

function yazSoru(tip, hedef) {
  if (tip === "bosluk") {
    const kok = hedef.w.split(" ")[0];
    const re = new RegExp("\\b" + kok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\w*", "i");
    const esles = hedef.ornek.match(re);
    if (!esles) return null;
    return { tip: "metin", metin: hedef.ornek.replace(re, "______"), soru: "Boşluğu doldur",
      ipucu: hedef.tr, cevap: esles[0], tamCevap: hedef.ornek };
  }
  if (tip === "dikte") {
    return { tip: "metin", metin: null, seslendir: hedef.w, soru: "Duyduğunu yaz",
      ipucu: hedef.tr, cevap: hedef.w, tamCevap: hedef.ornek };
  }
  return { tip: "metin", metin: hedef.tr, altMetin: turYaz(hedef.pos), soru: "İngilizcesini yaz",
    ipucu: hedef.ornek.replace(new RegExp(hedef.w.split(" ")[0], "gi"), "______"), cevap: hedef.w, tamCevap: hedef.ornek };
}

/* Harf harf: karışık harflerden kelime kurma */
function harfKur(k) {
  const hedef = k.w;
  const harfler = hedef.split("").map((h, i) => ({ h, i, kullanildi: false }));
  const bosluklar = hedef.split("").map((h) => (h === " " || h === "-" ? h : null));
  return { hedef, havuz: karistir(harfler.filter((x) => x.h !== " " && x.h !== "-")), bosluklar, yerlesim: [] };
}

/* ─── Seslendirme ─────────────────────────────────────────────────── */
const sesVar = () => typeof window !== "undefined" && "speechSynthesis" in window;
function seslendir(metin, hiz) {
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

function OturumUst({ i, n, skor, baslik, cik, sayac }) {
  return (
    <div style={{ marginBottom: S.md }}>
      <div style={{ display: "flex", alignItems: "center", gap: S.sm, marginBottom: 7 }}>
        <Dugme tur="sessiz" kucuk tikla={cik}><ChevronLeft size={13} /> Çık</Dugme>
        <span style={{ ...T.cap, color: C.murekkepSis }}>{baslik}</span>
        <span style={{ flex: 1 }} />
        {sayac != null && <Nisan kucuk renk={sayac < 11 ? C.lal : C.murekkepAlt} zemin={sayac < 11 ? C.lalSis : undefined}><Clock size={10} /> {sayac}</Nisan>}
        {skor != null && <Nisan kucuk renk={C.zumrut}>{skor}</Nisan>}
        {n > 0 && <span style={{ ...T.cap, color: C.murekkepSis, ...T.rakam }}>{Math.min(i + 1, n)} / {n}</span>}
      </div>
      {n > 0 && <Cubuk deger={(i / n) * 100} boy={3} />}
    </div>
  );
}

function KelimeBasligi({ k, buyuk, sesli }) {
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

function KelimeAyrinti({ k, acikBasla }) {
  return (
    <div style={{ display: "grid", gap: S.sm }}>
      <div style={{ fontFamily: T.govde, fontSize: 18, color: C.altin, fontWeight: 600 }}>{k.tr}</div>
      <Aralik en={k.ornek.replace(new RegExp("(" + k.w.split(" ")[0] + "\\w*)", "i"), "[[$1]]")}
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

function SonucEkrani({ dogru, toplam, sure, enIyi, yeniRekor, yanlislar, tekrar, cik, ek }) {
  const oran = toplam ? Math.round((dogru / toplam) * 100) : 0;
  const n = useSayac(oran, 1100);
  useEffect(() => {
    if (oran >= 80) { konfeti(oran === 100 ? 170 : 110); titre(oran === 100 ? 26 : 14); }
  }, []);
  return (
    <div style={{ display: "grid", gap: S.md }}>
      <Cetvel sikilik="genis" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: S.md }}><Gul boy={26} /></div>
        <div style={{ fontFamily: T.hat, fontSize: 52, fontWeight: 400, color: oran >= 80 ? C.zumrut : oran >= 50 ? C.altin : C.lal, ...T.rakam, lineHeight: 1 }}>
          %{n}
        </div>
        <div style={{ ...T.cap, color: C.murekkepAlt, marginTop: S.sm }}>{dogru} / {toplam} doğru</div>
        {sure != null && <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 5 }}>{Math.floor(sure / 60)} dk {sure % 60} sn</div>}
        {yeniRekor && <div style={{ marginTop: S.md }}><Nisan renk={C.altin} dolu>Yeni rekor</Nisan></div>}
        {enIyi != null && !yeniRekor && <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 6 }}>En iyin: {enIyi}</div>}
      </Cetvel>
      {ek}
      {yanlislar && yanlislar.length > 0 && (
        <Levha renk={C.lal}>
          <Etiket renk={C.lal}>Bunlar seni zorladı · {yanlislar.length}</Etiket>
          <div style={{ display: "grid", gap: 7 }}>
            {yanlislar.map((k) => (
              <div key={k.id} style={{ display: "flex", gap: S.sm, alignItems: "baseline", ...T.s }}>
                <span style={{ fontFamily: T.kalem, color: C.murekkep, minWidth: 110 }}>{k.w}</span>
                <span style={{ color: C.murekkepAlt }}>{k.tr}</span>
              </div>
            ))}
          </div>
        </Levha>
      )}
      <div style={{ display: "flex", gap: S.sm }}>
        {tekrar && <Dugme tur="altin" tikla={tekrar} tam><RotateCcw size={13} /> Bir tur daha</Dugme>}
        <Dugme tur="ikincil" tikla={cik} tam>Bitir</Dugme>
      </div>
    </div>
  );
}

/* ─── 1. Keşif ────────────────────────────────────────────────────── */

function KesifYolu({ kelimeler, dag, kaydet, cik }) {
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
        <div style={{ marginTop: S.lg, fontFamily: T.kalem, fontSize: 15, lineHeight: 1.9, color: C.murekkepAlt }}>
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
                style={{ border: `1px solid ${C.cizgi}`, background: C.muhre, borderRadius: 2, padding: S.md,
                  cursor: "pointer", fontFamily: T.govde, fontSize: 15, color: C.murekkep }}>{o.t}</div>
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

function OgrenYolu({ kelimeler, dag, kaydet, cik }) {
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
            <div style={{ height: 3, borderRadius: 9, background: bi < basamak ? C.zumrut : bi === basamak ? C.altin : C.kagitDerin }} />
            <div style={{ fontSize: 9.5, marginTop: 4, color: bi === basamak ? C.altin : C.murekkepSis, fontWeight: bi === basamak ? 700 : 400 }}>{b}</div>
          </div>
        ))}
      </div>

      <Cetvel>
        <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: S.sm }}>{soru.soru}</div>
        <div style={{ fontFamily: basamak === 1 ? T.kalem : T.govde, fontSize: basamak === 2 ? 22 : 17, lineHeight: 1.7, color: C.murekkep }}>
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
                  borderRadius: 2, padding: S.md, cursor: geri ? "default" : "pointer",
                  fontFamily: basamak === 0 ? T.govde : T.kalem, fontSize: 15, color: C.murekkep }}>{o.t}</div>
            );
          })}
        </div>
      ) : (
        <div style={{ marginTop: S.md }}>
          {!geri && <>
            <Satir deger={cevap} degistir={setCevap} ipucu="İngilizcesini yaz…"
              gonder={() => { const r = kelimeEsit(cevap, soru.cevap); setGeri({ ok: r.ok, yakin: r.yakin }); }}
              style={{ fontFamily: T.kalem, fontSize: 17, textAlign: "center" }} />
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

function YazYolu({ yol, kelimeler, kaydet, cik }) {
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
          <div style={{ fontFamily: yol === "bosluk" ? T.kalem : T.govde, fontSize: yol === "bosluk" ? 16.5 : 22,
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
            <div style={{ fontFamily: T.govde, fontSize: 16, color: C.altin, marginBottom: 6 }}>{k.tr}</div>
            <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepAlt, lineHeight: 1.75 }}>{soru.tamCevap}</div>
          </Levha>
          <Dugme tikla={ilerle} tam>{i + 1 < liste.length ? "Sonraki" : "Turu bitir"}</Dugme>
        </div>
      )}
    </div>
  );
}

/* ─── 5. Harf harf ────────────────────────────────────────────────── */

function HarfYolu({ kelimeler, kaydet, cik }) {
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
                background: h ? (geri ? (geri.ok ? C.zumSis : C.lalSis) : C.altinSis) : C.muhre, borderRadius: 2,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.kalem, fontSize: 17, color: C.murekkep }}>{h || ""}</span>)}
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
                    background: kul ? C.kagitAlt : C.muhre, borderRadius: 2, cursor: kul ? "default" : "pointer",
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
            <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepAlt, lineHeight: 1.75 }}>{k.ornek}</div>
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

function SecimYolu({ yol, kelimeler, kaydet, cik }) {
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
                borderRadius: 2, padding: S.md, cursor: secim ? "default" : "pointer",
                fontFamily: T.kalem, fontSize: 15.5, color: C.murekkep, display: "flex", justifyContent: "space-between", gap: S.sm }}>
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
            <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepAlt, lineHeight: 1.8 }}>{k.ornek}</div>
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

function KontrolYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
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
              style={{ border: `1px solid ${C.cizgi}`, background: C.muhre, borderRadius: 2, padding: S.md,
                cursor: "pointer", fontFamily: T.kalem, fontSize: 15.5, color: C.murekkep }}>{o.t}</div>
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

function SimsekYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
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
        <Dugme tur="tehlike" tikla={() => karar(false)} style={{ padding: "16px 18px", fontSize: 17 }}>Eşleşmiyor</Dugme>
        <Dugme tur="altin" tikla={() => karar(true)} style={{ padding: "16px 18px", fontSize: 17 }}>Eşleşiyor</Dugme>
      </div>
    </div>
  );
}

/* ─── 12. Eşleştir ────────────────────────────────────────────────── */

function EslestirYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
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
              style={{ minHeight: 64, padding: S.sm, borderRadius: 2, cursor: yok ? "default" : "pointer",
                border: `1px solid ${hat ? C.lal : sec ? C.altin : yok ? C.zumrut : C.cizgi}`,
                background: hat ? C.lalSis : sec ? C.altinSis : yok ? C.zumSis : C.muhre,
                opacity: yok ? 0.32 : 1, transition: "all .18s",
                transform: hat ? "translateX(-3px)" : "none",
                fontFamily: k.yon === "w" ? T.kalem : T.govde, fontSize: 14.5,
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

function HafizaYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
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
              style={{ aspectRatio: "3/4", padding: 6, borderRadius: 2, cursor: yok ? "default" : "pointer",
                border: `1px solid ${yok ? C.zumrut : ac ? C.altin : C.cetvel}`,
                background: yok ? C.zumSis : ac ? C.muhre : C.kagitAlt,
                opacity: yok ? 0.36 : 1, transition: "all .25s",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: k.yon === "w" ? T.kalem : T.govde, fontSize: 12.5,
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

function VapurYolu({ kelimeler, kaydet, cik, enIyi, rekorKaydet }) {
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
        <span style={{ letterSpacing: 2, fontSize: 14 }}>{"♥".repeat(can)}<span style={{ opacity: .22 }}>{"♥".repeat(3 - can)}</span></span>
        <Nisan kucuk renk={C.zumrut}>{puan}</Nisan>
        <Nisan kucuk renk={C.murekkepAlt}>sv {seviye}</Nisan>
      </div>
      <Cetvel sikilik="dar">
        <div style={{ textAlign: "center", padding: `${S.md}px 0 ${S.lg}px` }}>
          <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 7 }}>Hangi vapur?</div>
          <div style={{ fontFamily: T.govde, fontSize: 23, color: C.altin }}>{dalga.hedef.tr}</div>
        </div>
        <div style={{ position: "relative", height: 5, background: C.kagitDerin, borderRadius: 9, overflow: "hidden", marginBottom: S.md }}>
          <div style={{ width: `${100 - konum}%`, height: "100%", background: konum > 72 ? C.lal : C.zumrut, transition: "width .04s linear" }} />
        </div>
        <div style={{ display: "grid", gap: 7 }}>
          {dalga.vapurlar.map((v) => (
            <button key={v.id} onClick={() => bin(v)}
              style={{ padding: `${S.md}px ${S.md}px`, border: `1px solid ${C.cetvel}`, background: C.muhre,
                borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: S.sm,
                fontFamily: T.kalem, fontSize: 16, color: C.murekkep,
                transform: `translateX(${(konum / 100) * 7}px)`, transition: "transform .05s linear" }}>
              <span style={{ fontSize: 15, opacity: .55 }}>⛴</span>{v.w}
            </button>
          ))}
        </div>
      </Cetvel>
    </div>
  );
}

/* ─── 16. Telaffuz ────────────────────────────────────────────────── */

function TelaffuzYolu({ kelimeler, kaydet, cik }) {
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
                <span key={j} style={{ width: 4, height: 12, background: C.lal, borderRadius: 9,
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
              <div style={{ fontFamily: T.kalem, fontSize: 17, color: geri.ok ? C.zumrut : C.lal }}>{duyulan || "—"}</div>
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

function EsdizimYolu({ kelimeler, kaydet, cik }) {
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
    return { metin: k.esdizim.replace(new RegExp("\\b" + k.w.split(" ")[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\w*", "i"), "______"),
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
                borderRadius: 2, padding: S.md, cursor: secim ? "default" : "pointer",
                fontFamily: T.kalem, fontSize: 15.5, color: C.murekkep }}>{o.t}</div>
          );
        })}
      </div>
      {secim && (
        <div style={{ marginTop: S.md, display: "grid", gap: S.sm }}>
          <Levha style={{ background: C.kagitAlt }}>
            <div style={{ fontFamily: T.kalem, fontSize: 16, color: C.zumrut, marginBottom: 7 }}>{k.esdizim}</div>
            <div style={{ fontFamily: T.kalem, fontSize: 13.5, color: C.murekkepAlt, lineHeight: 1.8 }}>{k.ornek}</div>
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

function YapayYolu({ yol, kelimeler, kaydet, cik, hataEkle }) {
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
            <div style={{ marginTop: S.md, fontFamily: T.govde, fontSize: 17, color: C.altin }}>{k.tr}</div>
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
                        <span style={{ fontFamily: T.kalem, fontSize: 16, color: C.murekkep }}>{d.w}</span>
                        <Nisan kucuk renk={C.murekkepSis}>{turYaz(d.pos)}</Nisan>
                        <span style={{ ...T.s, color: C.altin }}>{d.tr}</span>
                      </div>
                      <div style={{ fontFamily: T.kalem, fontSize: 12.5, color: C.murekkepAlt, marginTop: 6, lineHeight: 1.7 }}>{d.ornek}</div>
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
            <div style={{ marginTop: S.md, fontFamily: T.govde, fontSize: 17, color: C.altin }}>{k.tr}</div>
            <div style={{ marginTop: S.md, paddingTop: S.md, borderTop: `1px dashed ${C.cizgi}` }}>
              <div style={{ ...T.cap, color: C.murekkepSis, marginBottom: 6 }}>
                {yol === "parafraz" ? "Bu cümleyi aynı anlamda yeniden kur" : "Örnek"}
              </div>
              <div style={{ fontFamily: T.kalem, fontSize: 14.5, color: C.murekkepAlt, lineHeight: 1.8 }}>{k.ornek}</div>
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
                      <div style={{ fontFamily: T.kalem, fontSize: 13.5 }}>
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
                  <div style={{ fontFamily: T.kalem, fontSize: 14.5, color: C.murekkep, lineHeight: 1.8 }}>{rapor.gelistirilmis}</div>
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

function HatHaritasi({ dag, secili, sec, seciliDurak, secDurak }) {
  return (
    <div style={{ display: "grid", gap: S.sm }}>
      {HATLAR.map((h) => {
        const ilr = hatIlerleme(dag, h.id);
        const acik = secili === h.id;
        return (
          <div key={h.id} style={{ border: `1px solid ${acik ? h.renk : C.cizgi}`, borderRadius: 2,
            background: acik ? h.acik + "55" : C.muhre, overflow: "hidden", transition: "border-color .2s" }}>
            <div onClick={() => sec(acik ? null : h.id)}
              style={{ display: "flex", alignItems: "center", gap: S.md, padding: `${S.md}px ${S.md}px`, cursor: "pointer" }}>
              <span style={{ width: 30, height: 30, borderRadius: 99, background: h.renk, color: "#FFF9EC",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                fontFamily: T.hat, fontSize: 16, fontWeight: 600 }}>{h.no}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.govde, fontSize: 16.5, color: C.murekkep }}>{h.ad}</div>
                <div style={{ ...T.xs, color: C.murekkepSis, marginTop: 2 }}>
                  {h.en} · {h.duraklar.length} durak · {ilr.toplam} kelime
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: T.hat, fontSize: 17, color: h.renk, ...T.rakam }}>%{ilr.oran}</div>
                <div style={{ ...T.xs, fontSize: 10, color: C.murekkepSis }}>{ilr.usta} usta</div>
              </div>
              <ChevronDown size={15} style={{ color: C.murekkepSis, flexShrink: 0,
                transform: acik ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </div>

            {acik && (
              <div style={{ borderTop: `1px dashed ${C.cizgi}`, padding: `${S.md}px ${S.md}px`, background: C.muhre }}>
                <div style={{ position: "relative", paddingLeft: 18 }}>
                  <div style={{ position: "absolute", left: 5, top: 10, bottom: 10, width: 2.5, background: h.renk, opacity: .32, borderRadius: 9 }} />
                  {h.duraklar.map(([did, dad]) => {
                    const p = durakIlerleme(dag, did);
                    const se = seciliDurak === did;
                    return (
                      <div key={did} onClick={() => secDurak(se ? null : did)}
                        style={{ position: "relative", display: "flex", alignItems: "center", gap: S.sm,
                          padding: "7px 8px", marginBottom: 3, borderRadius: 2, cursor: "pointer",
                          background: se ? h.acik : "transparent", border: `1px solid ${se ? h.renk : "transparent"}` }}>
                        <span style={{ position: "absolute", left: -16, width: 11, height: 11, borderRadius: 99,
                          background: p.usta === p.toplam && p.toplam ? h.renk : C.muhre,
                          border: `2.5px solid ${h.renk}`, boxSizing: "border-box" }} />
                        <span style={{ flex: 1, fontFamily: T.govde, fontSize: 14.5, color: C.murekkep }}>{dad}</span>
                        <span style={{ ...T.xs, fontSize: 10.5, color: C.murekkepSis, ...T.rakam }}>{p.usta}/{p.toplam}</span>
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

function YolSecimi({ sec, havuz, rekorlar }) {
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
                      border: `1px solid ${C.cizgi}`, background: C.muhre, borderRadius: 2, cursor: "pointer",
                      overflow: "hidden", transition: "border-color .18s, box-shadow .18s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = o.renk; e.currentTarget.style.boxShadow = `0 2px 12px ${C.golge}55`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.cizgi; e.currentTarget.style.boxShadow = "none"; }}>
                    <span style={{ position: "absolute", right: 6, top: 6, width: 52, height: 42, opacity: .5 }}>
                      <YolDevinim tip={y.dev} renk={o.renk} />
                    </span>
                    <div style={{ fontFamily: T.govde, fontSize: 15.5, color: C.murekkep, marginBottom: 5, position: "relative" }}>{y.ad}</div>
                    <div style={{ ...T.xs, fontSize: 11, color: C.murekkepSis, lineHeight: 1.5, position: "relative", paddingRight: 44 }}>
                      {y.neden.split(".")[0]}.
                    </div>
                    {r != null && <div style={{ position: "absolute", left: S.md, bottom: 7, ...T.xs, fontSize: 10, color: o.renk }}>
                      en iyi {r}{y.id === "eslestir" ? " sn" : y.id === "hafiza" ? " hamle" : y.id === "kontrol" ? "%" : ""}
                    </div>}
                    {y.yapay && <span style={{ position: "absolute", right: S.md, bottom: 7, display: "inline-flex", alignItems: "center", gap: 3, ...T.xs, fontSize: 9.5, color: C.altin }}><Sparkles size={10} /> yapay zekâ</span>}
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

function Dagarcik({ dag, kelimeKaydet, rekorlar, rekorKaydet, hataEkle, oturumBitir, acilisDurak }) {
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
        borderRadius: 2, padding: `${S.sm}px ${S.md}px`, background: C.muhre, marginBottom: S.md }}>
        <Search size={14} style={{ color: C.murekkepSis }} />
        <input value={ara} onChange={(e) => setAra(e.target.value)} placeholder="Kelime ara — İngilizce ya da Türkçe…"
          style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: T.govde, fontSize: 15, color: C.murekkep }} />
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
                  <span style={{ fontFamily: T.kalem, fontSize: 16, color: C.murekkep }}>{k.w}</span>
                  <Nisan kucuk renk={SEVIYE_RENK[k.lv]}>{k.lv}</Nisan>
                  <span style={{ ...T.s, color: C.altin, flex: 1 }}>{k.tr}</span>
                  {sesVar() && <button onClick={() => seslendir(k.w)} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.altin }}><Volume2 size={14} /></button>}
                </div>
                <div style={{ fontFamily: T.kalem, fontSize: 12.5, color: C.murekkepAlt, marginTop: 6, lineHeight: 1.7 }}>{k.ornek}</div>
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

function YasayanBaslik({ ad, dag, ustalik, hatalar, oturumlar, git }) {
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
    <div style={{ position: "relative", borderRadius: 3, overflow: "hidden", marginBottom: S.lg,
      border: `1px solid ${C.cetvel}`, minHeight: 184 }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={{ position: "absolute", inset: 0, background: acikMurekkep
        ? "radial-gradient(ellipse 70% 60% at 18% 22%, rgba(8,14,34,.5), transparent 70%), radial-gradient(ellipse 40% 45% at 92% 18%, rgba(8,14,34,.38), transparent 70%), linear-gradient(180deg, rgba(8,14,34,.24) 0%, rgba(8,14,34,.04) 46%, rgba(8,14,34,.46) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,.3) 0%, rgba(255,255,255,0) 44%, rgba(20,31,42,.26) 100%)" }} />

      <div style={{ position: "relative", padding: `${S.lg}px ${S.lg}px`, display: "flex", flexDirection: "column", minHeight: 184 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: S.md }}>
          <div>
            <div style={{ fontFamily: T.hat, fontSize: "clamp(19px, 4.6vw, 25px)", fontWeight: 400, letterSpacing: "0.02em",
              color: acikMurekkep ? "#FDF8EC" : C.murekkep, textShadow: acikMurekkep ? "0 1px 10px rgba(0,0,0,.42)" : "0 1px 8px rgba(255,255,255,.6)" }}>
              {selamla(an, ad)}
            </div>
            <div style={{ ...T.xs, marginTop: 5, color: acikMurekkep ? "rgba(253,248,236,.82)" : C.murekkepAlt,
              textShadow: acikMurekkep ? "0 1px 7px rgba(0,0,0,.4)" : "none" }}>
              {trTarih(bugun())}{G.ay > 0 ? ` · ${ayAdi(an)}` : ""}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: T.hat, fontSize: "clamp(19px, 4.6vw, 25px)", ...T.rakam, letterSpacing: "0.04em",
              color: acikMurekkep ? "#FDF8EC" : C.murekkep, textShadow: acikMurekkep ? "0 1px 10px rgba(0,0,0,.42)" : "none" }}>{saat}</div>
            {seri > 0 && (
              <div style={{ ...T.xs, fontSize: 11, marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4,
                color: acikMurekkep ? "#FFE0A0" : C.altin, textShadow: acikMurekkep ? "0 1px 7px rgba(0,0,0,.4)" : "none" }}>
                <Flame size={11} /> {seri} gün
              </div>
            )}
          </div>
        </div>

        <span style={{ flex: 1 }} />

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
          <div onClick={() => git && git("dagarcik")} style={{ cursor: "pointer",
            background: "rgba(253,248,236,.93)", border: `1px solid ${C.cetvel}`, borderRadius: 2,
            padding: "6px 11px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: T.hat, fontSize: 17, color: C.altin, ...T.rakam }}>{n}</span>
            <span style={{ ...T.cap, fontSize: 8.5, color: C.murekkepAlt }}>kelime</span>
          </div>
          {vadesi > 0 && (
            <div onClick={() => git && git("dagarcik")} style={{ cursor: "pointer",
              background: C.altin, borderRadius: 2, padding: "6px 11px", display: "flex", alignItems: "center", gap: 6,
              color: "#FFFBF0", ...T.xs, fontSize: 11.5, fontWeight: 600 }}>
              <RotateCcw size={11} /> {vadesi} tekrar bekliyor
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ TANI SINAVI ══════════════════════ */

function TaniSinavi({ bitir }) {
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
        <Satir deger={ad} degistir={setAd} ipucu="Adın" style={{ textAlign: "center", fontSize: 16, marginBottom: S.md }} />
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
                  <span style={{ flex: 1, fontFamily: T.govde, fontSize: 15.5, color: C.murekkep }}>{aileAd(aid)}</span>
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
        <div style={{ fontFamily: T.kalem, fontSize: 16, lineHeight: 1.8, color: C.murekkep }}>{s.s}</div>
      </Cetvel>
      <div style={{ display: "grid", gap: 6 }}>
        {s.o.map((o, k) => (
          <div key={k} onClick={() => setSecim(k)}
            style={{ border: `1px solid ${secim === k ? C.altin : C.cizgi}`, background: secim === k ? C.altinSis : C.muhre,
              borderRadius: 2, padding: S.md, cursor: "pointer", fontFamily: T.kalem, fontSize: 14,
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

function KomutPaleti({ kapat, komutlar }) {
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
        style={{ width: "min(580px, 92vw)", background: C.muhre, border: `1px solid ${C.cetvel}`, borderRadius: 2,
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
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: T.govde, fontSize: 16, color: C.murekkep }} />
        </div>
        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          {liste.length === 0 && <div style={{ padding: S.lg, ...T.s, color: C.murekkepSis, textAlign: "center" }}>Sonuç yok</div>}
          {liste.map((k, i) => (
            <div key={i} onMouseEnter={() => setSec(i)} onClick={() => { k.calistir(); kapat(); }}
              style={{ padding: `${S.sm + 2}px ${S.lg}px`, cursor: "pointer", background: sec === i ? C.altinSis : "transparent",
                display: "flex", alignItems: "center", gap: S.md }}>
              <span style={{ flex: 1, fontFamily: T.govde, fontSize: 14.5, color: C.murekkep }}>{k.ad}</span>
              {k.grup && <span style={{ ...T.cap, fontSize: 9.5, color: C.murekkepSis }}>{k.grup}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ SANDIK ══════════════════════ */

function Sandik({ ozet, saglik, yenile }) {
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
              style={{ width: "100%", boxSizing: "border-box", fontFamily: T.kalem, fontSize: 11, lineHeight: 1.5,
                padding: S.sm, border: `1px solid ${C.cizgi}`, borderRadius: 2, background: C.kagitAlt, color: C.murekkepAlt, resize: "vertical" }} />
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
          ipucu='Yedek JSON metnini buraya yapıştır…' style={{ fontSize: 11.5 }} />
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
              <div style={{ ...T.xs, color: C.murekkepAlt, marginBottom: S.md, fontStyle: "italic" }}>
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

/* ══════════════════════ KABUK ══════════════════════ */

const SEKMELER = [
  { id: "divan",    ad: "Divan",      ikon: Compass,       ust: "Bugün" },
  { id: "dagarcik", ad: "Dağarcık",   ikon: Library,       ust: "Bugün" },
  { id: "yazihane", ad: "Yazıhane",   ikon: Feather,       ust: "Üretim" },
  { id: "sesli",    ad: "Sesli",      ikon: Mic,           ust: "Üretim" },
  { id: "talim",    ad: "Talimhane",  ikon: Target,        ust: "Alıştırma" },
  { id: "sokrates", ad: "Sokrates",   ikon: MessageSquare, ust: "Alıştırma" },
  { id: "harita",   ad: "Takımyıldız",ikon: Waypoints,     ust: "Kaynak" },
  { id: "defter",   ad: "Defter",     ikon: Book,          ust: "Kaynak" },
  { id: "seyir",    ad: "Seyir",      ikon: TrendingUp,    ust: "Kaynak" },
  { id: "sandik",   ad: "Sandık",     ikon: Bookmark,      ust: "Kaynak" }
];

export default function Nahiv() {
  const [hazir, setHazir] = useState(false);
  const [profil, setProfil] = useState({ ad: null, baslangic: null, taniBitti: false });
  const [ustalik, setUstalik] = useState({});
  const [hatalar, setHatalar] = useState([]);
  const [metinler, setMetinler] = useState([]);
  const [oturumlar, setOturumlar] = useState([]);
  const [derin, setDerin] = useState({});
  const [sohbetler, setSohbetler] = useState({});
  const [esdizim, setEsdizim] = useState({});
  const [taslak, setTaslak] = useState("");
  const [dag, setDag] = useState({});
  const [rekorlar, setRekorlar] = useState({});

  const [sekme, setSekme] = useState("divan");
  const [haritaSecili, setHaritaSecili] = useState(null);
  const [talimHedef, setTalimHedef] = useState(null);
  const [sokratesDugum, setSokratesDugum] = useState(null);
  const [palet, setPalet] = useState(false);
  const [dar, setDar] = useState(false);
  const [saglik, setSaglik] = useState(undefined);
  const [tasindi, setTasindi] = useState(null);
  const [gunluk, setGunluk] = useState({});

  useEffect(() => {
    const f = () => setDar(window.innerWidth < 900);
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const veriYukle = useCallback(async () => {
    const [p, u, h, m, o, d, s, e, t, dg, rk] = await Promise.all([
      sGet(K.profil, { ad: null, baslangic: null, taniBitti: false }),
      sGet(K.ustalik, {}), sGet(K.hatalar, []), sGet(K.metinler, []), sGet(K.oturum, []),
      sGet(K.derin, {}), sGet(K.sohbet, {}), sGet(K.esdizim, {}), sGet(K.taslak, ""),
      sGet(K.dagarcik, {}), sGet(K.rekor, {})
    ]);
    setProfil(p); setUstalik(u); setHatalar(h); setMetinler(m); setOturumlar(o);
    setDerin(d); setSohbetler(s); setEsdizim(e); setTaslak(t); setDag(dg); setRekorlar(rk);
    setGunluk(await sGet(K.gunluk, {}));
  }, []);

  useEffect(() => {
    (async () => {
      setSaglik(await depoSagligi());
      // v1 verisi duruyor ve v2 boşsa sessizce taşı
      const mevcut = await sGet(K.hatalar, []);
      const mevcutUst = await sGet(K.ustalik, {});
      if (!mevcut.length && !Object.keys(mevcutUst).length) {
        const eski = await eskiSurumTara();
        if (eski) {
          await veriYaz(eski, "birlestir");
          const oz = paketOzeti(eski);
          setTasindi(`Eski sürümden ${oz.hatalar} hata ve ${oz.dugumler} düğüm kaydı taşındı.`);
        }
      }
      await veriYukle();
      await gunlukYedek();
      setHazir(true);
    })();
  }, [veriYukle]);

  useEffect(() => {
    const f = (ev) => { if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); setPalet((p) => !p); } };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const ustalikKaydet = useCallback((id, dogruMu, basamak) => {
    setUstalik((e) => { const y = { ...e, [id]: ustalikGuncelle(e[id], dogruMu, basamak) }; sSet(K.ustalik, y); return y; });
  }, []);

  const hataEkle = useCallback((h) => {
    setHatalar((e) => {
      const ayni = e.find((x) => norm(x.hataliMetin) === norm(h.hataliMetin) && !x.cozuldu);
      const y = ayni
        ? e.map((x) => x.id === ayni.id ? { ...x, tekrarSayisi: (x.tekrarSayisi || 1) + 1, tarih: new Date().toISOString(), srs: { ...(x.srs || {}), sonrakiTarih: bugun() } } : x)
        : [...e, { id: yeniId("h"), tarih: new Date().toISOString(), tekrarSayisi: 1, cozuldu: false,
            srs: { tekrar: 0, aralik: 0, kolaylik: 2.5, sonrakiTarih: bugun() }, ...h }];
      sSet(K.hatalar, y.slice(-600)); return y.slice(-600);
    });
  }, []);

  const hataGuncelle = useCallback((id, yama) => {
    setHatalar((e) => { const y = e.map((h) => h.id === id ? { ...h, ...yama } : h); sSet(K.hatalar, y); return y; });
  }, []);
  const hataSil = useCallback((id) => {
    setHatalar((e) => { const y = e.filter((h) => h.id !== id); sSet(K.hatalar, y); return y; });
  }, []);
  const metinEkle = useCallback((m) => {
    setMetinler((e) => { const y = [...e, m].slice(-80); sSet(K.metinler, y); return y; });
  }, []);
  const oturumBitir = useCallback((o) => {
    setOturumlar((e) => { const y = [...e, { id: yeniId("o"), tarih: new Date().toISOString(), ...o }].slice(-500); sSet(K.oturum, y); return y; });
  }, []);
  const derinlestir = useCallback((id, veri) => {
    setDerin((e) => { const y = { ...e, [id]: veri }; sSet(K.derin, y); return y; });
  }, []);
  const sohbetKaydet = useCallback((k, mesajlar) => {
    setSohbetler((e) => { const y = { ...e, [k]: mesajlar.slice(-24) }; sSet(K.sohbet, y); return y; });
  }, []);
  const esdizimGuncelle = useCallback((k, srs) => {
    setEsdizim((e) => { const y = { ...e, [k]: srs }; sSet(K.esdizim, y); return y; });
  }, []);
  const taslakKaydet = useCallback((t) => { setTaslak(t); sSet(K.taslak, t); }, []);
  const kelimeKaydet = useCallback((id, dogruMu) => {
    setDag((e) => { const y = { ...e, [id]: kelimeGuncelle(e[id], dogruMu) }; sSet(K.dagarcik, y); return y; });
  }, []);
  const rekorKaydet = useCallback((yol, deger) => {
    setRekorlar((e) => { const y = { ...e, [yol]: deger }; sSet(K.rekor, y); return y; });
  }, []);

  function taniBitir({ ad, ustalik: u, yanlislar }) {
    const p = { ad, baslangic: bugun(), taniBitti: true };
    setProfil(p); sSet(K.profil, p);
    setUstalik(u); sSet(K.ustalik, u);
    const yeni = (yanlislar || []).map((y) => {
      const d = dugum(y.d) || {};
      return { id: yeniId("h"), tarih: new Date().toISOString(), tekrarSayisi: 1, cozuldu: false,
        srs: { tekrar: 0, aralik: 0, kolaylik: 2.5, sonrakiTarih: bugun() },
        hataliMetin: String(y.soru).replace("___", `[${y.verilen}]`),
        dogruMetin: String(y.soru).replace("___", `[${y.dogruCevap}]`),
        dugumId: y.d, dugumAdi: d.tr, aile: d.a, hataTuru: "yanlis-secim",
        l1Kaynakli: (d.l1 || 0) >= 2, l1Aciklama: d.t || null, maliyet: Math.min(5, 2 + (d.l1 || 0)),
        kaynak: "tanı", baglam: "Tanı sınavı", aciklama: d.k || null };
    });
    setHatalar(yeni); sSet(K.hatalar, yeni);
    oturumBitir({ tur: "tani", dogru: TANI.length - yanlislar.length, toplam: TANI.length, saniye: 720 });
  }

  const gitDugum = useCallback((id) => { setHaritaSecili(id); setSekme("harita"); }, []);
  const calisDugum = useCallback((id) => { setTalimHedef(id); setSekme("talim"); }, []);
  const konusDugum = useCallback((id) => { setSokratesDugum(id); setSekme("sokrates"); }, []);

  const komutlar = useMemo(() => {
    const k = SEKMELER.map((s) => ({ ad: s.ad, grup: "sekme", oncelik: 1, calistir: () => setSekme(s.id) }));
    k.push({ ad: "Bugünün ocağını aç", grup: "eylem", oncelik: 1, calistir: () => setSekme("divan") });
    k.push({ ad: "Tuzak cümle kurdur", grup: "eylem", oncelik: 1, calistir: () => { setTalimHedef(null); setSekme("talim"); } });
    k.push({ ad: "Kur — hataları bul", grup: "eylem", oncelik: 1, calistir: () => setSekme("talim") });
    k.push({ ad: "Canlı tashihle yaz", grup: "eylem", oncelik: 1, calistir: () => setSekme("yazihane") });
    k.push({ ad: "Konuşarak çalış", grup: "eylem", oncelik: 1, calistir: () => setSekme("sesli") });
    k.push({ ad: "Bekleyen tekrarları aç", grup: "eylem", oncelik: 1, calistir: () => setSekme("defter") });
    k.push({ ad: "Yedek al — verini dışa aktar", grup: "eylem", oncelik: 1, calistir: () => setSekme("sandik") });
    k.push({ ad: "Kelime çalış — Dağarcık", grup: "eylem", oncelik: 1, calistir: () => setSekme("dagarcik") });
    k.push({ ad: "Kelime tekrarlarını yap", grup: "eylem", oncelik: 1, calistir: () => setSekme("dagarcik") });
    YOLLAR.forEach((y) => k.push({ ad: `${y.ad} — kelime yolu`, grup: "dağarcık", calistir: () => setSekme("dagarcik") }));
    HATLAR.forEach((h) => k.push({ ad: h.ad, grup: "hat", calistir: () => setSekme("dagarcik") }));
    k.push({ ad: "Rastgele zayıf düğüm çalış", grup: "eylem", oncelik: 1, calistir: () => {
      const z = zayifDugumler(ustalik, hatalar, 5);
      if (z.length) calisDugum(z[Math.floor(Math.random() * z.length)].d.id);
    }});
    DUGUMLER.forEach((d) => k.push({ ad: d.tr, grup: aileKisa(d.a), calistir: () => gitDugum(d.id) }));
    return k;
  }, [ustalik, hatalar, gitDugum, calisDugum]);

  const stil = `${YAZI_TIPLERI}
    @keyframes nspin{to{transform:rotate(360deg)}}
    @keyframes nyanip{0%,100%{opacity:1}50%{opacity:.25}}
    @keyframes nvKart1{0%,100%{transform:translate(0,0) rotate(-5deg)}50%{transform:translate(-3px,-2px) rotate(-9deg)}}
    @keyframes nvKart2{0%,100%{transform:translate(0,0) rotate(5deg)}50%{transform:translate(3px,-2px) rotate(9deg)}}
    @keyframes nvYuk{0%,100%{transform:scaleY(.72)}50%{transform:scaleY(1)}}
    @keyframes nvImlec{0%,49%{opacity:1}50%,100%{opacity:0}}
    @keyframes nvNefes{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.14);opacity:.75}}
    @keyframes nvZipla{0%,100%{transform:translateY(0)}45%{transform:translateY(-4px)}}
    @keyframes nvDalga{0%,100%{transform:scaleY(.42)}50%{transform:scaleY(1.25)}}
    @keyframes nvKaydir{0%,100%{transform:translateX(0)}50%{transform:translateX(13px)}}
    @keyframes nvCakan{0%,100%{opacity:.25}48%{opacity:1}}
    @keyframes nvSagaSola{0%,100%{transform:translateX(0)}50%{transform:translateX(7px)}}
    @keyframes nvCevir{0%,100%{transform:rotateY(0)}50%{transform:rotateY(180deg)}}
    @keyframes nvVapur{0%{transform:translateX(0)}100%{transform:translateX(26px)}}
    @keyframes nvParla{0%,100%{opacity:.35}50%{opacity:1}}
    @keyframes nvGir{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    .nv-vapur{animation:nvYuzer 46s linear infinite}
    @keyframes nvYuzer{from{transform:translateX(-40px)}to{transform:translateX(840px)}}
    *{-webkit-tap-highlight-color:transparent;box-sizing:border-box}
    button,input,textarea,select{font-family:inherit}
    input:focus,textarea:focus,select:focus{border-color:${C.altin}!important}
    button:focus-visible{outline:2px solid ${C.altin};outline-offset:2px}
    ::selection{background:${C.altinSis}}
    ::-webkit-scrollbar{width:9px;height:9px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${C.kagitDerin};border-radius:9px}
    ::-webkit-scrollbar-thumb:hover{background:${C.golge}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`;

  if (!hazir) {
    return (
      <div style={{ minHeight: "100vh", background: C.kagit, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: S.md }}>
        <style>{stil}</style>
        <Gul boy={30} opak={0.5} />
        <div style={{ fontFamily: T.hat, letterSpacing: "0.28em", fontSize: 14, color: C.murekkepSis }}>NAHİV</div>
      </div>
    );
  }

  if (!profil.taniBitti) {
    return (
      <div style={{ minHeight: "100vh", background: C.kagit, backgroundImage: DOKU, fontFamily: T.govde }}>
        <style>{stil}</style>
        <TaniSinavi bitir={taniBitir} />
      </div>
    );
  }

  const seri = seriHesapla(oturumlar);
  const kuyruk = bekleyenTekrarlar(hatalar).length;
  const gruplar = [...new Set(SEKMELER.map((s) => s.ust))];

  const Ray = (
    <div style={{
      width: dar ? "100%" : 208, flexShrink: 0, background: C.kagitAlt, backgroundImage: DOKU,
      borderRight: dar ? "none" : `1px solid ${C.cizgi}`, borderBottom: dar ? `1px solid ${C.cizgi}` : "none",
      display: "flex", flexDirection: dar ? "row" : "column", alignItems: dar ? "center" : "stretch",
      padding: dar ? `${S.sm}px ${S.md}px` : `${S.lg}px 0`, gap: dar ? S.sm : 0,
      position: "sticky", top: 0, zIndex: 30, alignSelf: dar ? undefined : "flex-start",
      height: dar ? undefined : "100vh", maxHeight: dar ? undefined : "100vh", overflowY: dar ? "auto" : "hidden", overflowX: dar ? "auto" : "hidden"
    }}>
      <div style={{ padding: dar ? 0 : `0 ${S.lg}px`, marginBottom: dar ? 0 : S.lg, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.sm }}>
          <Gul boy={dar ? 18 : 22} />
          {!dar && (
            <div>
              <div style={{ fontFamily: T.hat, fontSize: 19, letterSpacing: "0.2em", color: C.murekkep }}>NAHİV</div>
              <div style={{ ...T.cap, fontSize: 8, color: C.altin, marginTop: 1 }}>sarf · nahiv</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: dar ? "row" : "column", gap: dar ? 2 : 0, overflowY: dar ? "visible" : "auto", minWidth: 0 }}>
        {dar
          ? SEKMELER.map((s) => {
              const I = s.ikon, etkin = sekme === s.id;
              return (
                <div key={s.id} onClick={() => setSekme(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: `6px 10px`, cursor: "pointer",
                    whiteSpace: "nowrap", borderRadius: 1, background: etkin ? C.muhre : "transparent",
                    border: `1px solid ${etkin ? C.cetvel : "transparent"}`,
                    color: etkin ? C.murekkep : C.murekkepAlt, fontFamily: T.govde, fontSize: 13 }}>
                  <I size={13} />{s.ad}
                </div>
              );
            })
          : gruplar.map((g) => (
              <div key={g} style={{ marginBottom: S.md }}>
                <div style={{ ...T.cap, fontSize: 8.5, color: C.murekkepSis, padding: `0 ${S.lg}px`, marginBottom: 5 }}>{g}</div>
                {SEKMELER.filter((s) => s.ust === g).map((s) => {
                  const I = s.ikon, etkin = sekme === s.id;
                  return (
                    <div key={s.id} onClick={() => setSekme(s.id)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: `7px ${S.lg}px`, cursor: "pointer",
                        borderLeft: `2px solid ${etkin ? C.altin : "transparent"}`,
                        background: etkin ? C.muhre : "transparent",
                        color: etkin ? C.murekkep : C.murekkepAlt, fontFamily: T.govde, fontSize: 14.5,
                        letterSpacing: "0.015em", transition: "background .15s" }}>
                      <I size={14} style={{ color: etkin ? C.altin : C.murekkepSis, flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{s.ad}</span>
                      {s.id === "defter" && kuyruk > 0 && <Nisan kucuk renk={C.altin} dolu>{kuyruk}</Nisan>}
                    </div>
                  );
                })}
              </div>
            ))}
      </div>

      {!dar && (
        <div style={{ padding: `${S.md}px ${S.lg}px 0`, borderTop: `1px solid ${C.cizgi}`, flexShrink: 0 }}>
          {seri > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, ...T.xs, color: C.altin, marginBottom: S.sm }}>
              <Flame size={12} /> {seri} günlük seri
            </div>
          )}
          <div onClick={() => setPalet(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", ...T.xs, color: C.murekkepSis }}>
            <Command size={11} /> K · komut paleti
          </div>
        </div>
      )}
      {dar && (
        <Command size={16} style={{ color: C.murekkepSis, cursor: "pointer", flexShrink: 0 }} onClick={() => setPalet(true)} />
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.kagit, backgroundImage: DOKU, fontFamily: T.govde,
      color: C.murekkep, display: "flex", flexDirection: dar ? "column" : "row" }}>
      <style>{stil}</style>
      {Ray}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: dar ? `${S.lg}px ${S.md}px ${S.xxl}px` : `${S.xl}px ${S.xl}px ${S.xxxl}px` }}>
          {sekme === "divan" && <Divan profil={profil} ustalik={ustalik} hatalar={hatalar} metinler={metinler}
            oturumlar={oturumlar} esdizim={esdizim} git={setSekme} gitDugum={gitDugum} calis={calisDugum}
            sonDisa={gunluk.sonDisa} tasindi={tasindi} dag={dag} />}
          {sekme === "yazihane" && <Yazihane hatalar={hatalar} ustalik={ustalik} metinler={metinler} hataEkle={hataEkle}
            metinEkle={metinEkle} oturumBitir={oturumBitir} taslak={taslak} taslakKaydet={taslakKaydet} derinlestir={derinlestir} />}
          {sekme === "sesli" && <Sesli hataEkle={hataEkle} metinEkle={metinEkle} oturumBitir={oturumBitir} hatalar={hatalar} ustalik={ustalik} />}
          {sekme === "talim" && <Talimhane ustalik={ustalik} hatalar={hatalar} hedef={talimHedef} setHedef={setTalimHedef}
            kaydet={ustalikKaydet} hataEkle={hataEkle} oturumBitir={oturumBitir} esdizim={esdizim} esdizimGuncelle={esdizimGuncelle} />}
          {sekme === "sokrates" && <Sokrates dugumId={sokratesDugum} setDugumId={setSokratesDugum}
            gecmisler={sohbetler} gecmisKaydet={sohbetKaydet} hatalar={hatalar} />}
          {sekme === "harita" && <Harita ustalik={ustalik} hatalar={hatalar} derin={derin} derinlestir={derinlestir}
            secili={haritaSecili} setSecili={setHaritaSecili} calis={calisDugum} konus={konusDugum} />}
          {sekme === "defter" && <Defter hatalar={hatalar} guncelle={hataGuncelle} sil={hataSil} git={gitDugum} ustalik={ustalik} />}
          {sekme === "seyir" && <Seyir ustalik={ustalik} hatalar={hatalar} metinler={metinler} oturumlar={oturumlar} />}
          {sekme === "dagarcik" && <Dagarcik dag={dag} kelimeKaydet={kelimeKaydet} rekorlar={rekorlar}
            rekorKaydet={rekorKaydet} hataEkle={hataEkle} oturumBitir={oturumBitir} />}
          {sekme === "sandik" && <Sandik saglik={saglik} yenile={veriYukle}
            ozet={{ hatalar: hatalar.length, dugumler: Object.keys(ustalik).length,
              metinler: metinler.length, oturumlar: oturumlar.length, baslangic: profil.baslangic,
              kelimeler: Object.keys(dag).length }} />}
        </div>
      </div>
      {palet && <KomutPaleti kapat={() => setPalet(false)} komutlar={komutlar} />}
    </div>
  );
}
