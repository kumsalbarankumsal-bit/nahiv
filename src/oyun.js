/* Oyunlaştırma: puan, iskele seviyeleri, günlük hedef, seri.
   Seviyeler Boğaz'ın gerçek iskeleleridir: Kadıköy'den binilir,
   Anadolu Kavağı'nda inilir. */
import { bugun, gunEkle } from "./cekirdek.jsx";

export const ISKELELER = [
  "Kadıköy", "Haydarpaşa", "Karaköy", "Eminönü", "Üsküdar", "Beşiktaş", "Ortaköy", "Kuzguncuk",
  "Beylerbeyi", "Çengelköy", "Arnavutköy", "Bebek", "Kandilli", "Anadolu Hisarı", "Rumeli Hisarı",
  "Emirgân", "Kanlıca", "İstinye", "Çubuklu", "Yeniköy", "Paşabahçe", "Beykoz", "Tarabya", "Sarıyer",
  "Rumeli Kavağı", "Anadolu Kavağı"
];

/* n. iskeleye varmak için gereken toplam puan */
export const esik = (n) => Math.round(90 * Math.pow(n, 1.7));

export function seviyeHesap(xp) {
  let n = 0;
  while (n < ISKELELER.length - 1 && xp >= esik(n + 1)) n++;
  const alt = esik(n), ust = n < ISKELELER.length - 1 ? esik(n + 1) : null;
  return {
    no: n + 1, ad: ISKELELER[n], sonraki: ust ? ISKELELER[n + 1] : null,
    alt, ust, kalan: ust ? ust - xp : 0,
    oran: ust ? Math.round(((xp - alt) / (ust - alt)) * 100) : 100
  };
}

export const BOS_OYUN = { xp: 0, gunler: {}, hedef: 100 };

export function puanEkle(oyun, miktar) {
  const o = { ...BOS_OYUN, ...(oyun || {}) };
  const g = bugun();
  const gunler = { ...o.gunler, [g]: (o.gunler[g] || 0) + miktar };
  /* yalnızca son 400 gün saklanır */
  const anahtarlar = Object.keys(gunler).sort();
  if (anahtarlar.length > 400) anahtarlar.slice(0, anahtarlar.length - 400).forEach((k) => delete gunler[k]);
  return { ...o, xp: o.xp + miktar, gunler };
}

export const bugunPuan = (oyun) => ((oyun && oyun.gunler) || {})[bugun()] || 0;

export function seriGun(oyun) {
  const g = (oyun && oyun.gunler) || {};
  let n = 0, d = bugun();
  if (!g[d]) d = gunEkle(d, -1);
  while (g[d] > 0) { n++; d = gunEkle(d, -1); }
  return n;
}

export function sonGunler(oyun, kac) {
  const g = (oyun && oyun.gunler) || {};
  return Array.from({ length: kac }, (_, i) => { const d = gunEkle(bugun(), i - kac + 1); return { gun: d, xp: g[d] || 0 }; });
}
