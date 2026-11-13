# NAHİV

IB English B HL için gramer teşhisi ve kelime dağarcığı. Türkçe konuşan birinin İngilizce
üretirken yaptığı hataları kaynağına kadar izler; 1024 kelimeyi beş IB teması ve sınav dili
üzerinden on sekiz ayrı yolla çalıştırır.

## Yapı

```
index.html            sayfa iskeleti
src/main.jsx          giriş noktası
src/depo.js           Claude dışında window.storage yerine tarayıcı belleği
src/Nahiv.jsx         uygulamanın tamamı
api/claude.js         Vercel sunucu fonksiyonu — yapay zekâ köprüsü
public/               simgeler, manifest, çevrimdışı önbellek
```

## Vercel

1. Vercel'de **Add New → Project** ve bu repoyu içe aktar. Ön ayar Vite olarak kendiliğinden gelir.
2. **Settings → Environment Variables** altına `ANTHROPIC_API_KEY` ekle.
   Bu olmadan uygulama açılır ve bütün kelime yolları çalışır; yalnızca yapay zekâ
   gerektiren yerler (Tashih, Sokrates, Talimhane alıştırmaları, Parafraz, Bağ kur, Kökten dal) çalışmaz.
3. İsteğe bağlı: `NAHIV_MODEL` ile modeli değiştir.

Anahtar yalnızca sunucuda durur; tarayıcıya gönderilmez. Fonksiyon modeli ve yanıt uzunluğunu sabitler.

## Yerel

```
npm install
npm run dev
```

## Veri

İlerleme tarayıcıda tutulur. Cihaz değiştirmeden ya da tarayıcı verisini temizlemeden önce
**Sandık → Dosya olarak indir** ile yedek al; yeni yerde **Sandık → İçe aktar → Birleştir**.

## Sürüm 4.0 (Kasım 2026)

NAHİV artık yalnızca bir gramer defteri değil, İngilizce B HL için bir merkez.

- **Dağarcık:** 3166 kelime ve kalıp (B1'den C2'ye), 7 hat, 101 durak; 446'sı deyim, öbek fiil ve hazır kalıp. Veriler `src/veri/k*.txt` dosyalarında, satır başına bir kelime: `kelime|Türkçe|seviye|tür|durak|örnek cümle|eşdizim`.
- **27 çalışma yolu:** eski 18 yola Kartlar, Maraton, Radyo, Cümle dizgisi, Daktilo, Yükselt, Yabancıyı bul, Aktarma ve Harf avı eklendi (`src/yollar2.jsx`).
- **Sınav merkezi** (`src/sinav.jsx`): Metin türleri (17 tür, açıklamalı modeller, tür seçme alıştırması), Paper 1 (ölçütler, plan, 24 görevlik banka, süreli prova, yapay zekâ puanlaması), Paper 2 (soru tipleri, 5 okuma provası, dinleyerek çözme), Bireysel sözlü (iskelet, 68 soru, süreli prova, yapay zekâ sınav görevlisi).
- **Yeni kabuk** (`src/Nahiv.jsx`): beş gruplu gezinme, yaşayan İstanbul başlığı, sefer tahtası, günlük hedef, puan ve 26 Boğaz iskelesinden oluşan seviye yolu, yazı boyu ayarı.
- **Veri:** `nahiv2:*` anahtarları değişmedi; eski yedekler aynen yüklenir. Yeni anahtarlar `nahiv2:oyun` ve `nahiv2:sinav` yedeğe dahildir.

Dosya düzeni: `src/cekirdek.jsx` (gramer tarafı ve ortak bileşenler), `src/dagarcik2.jsx`, `src/yollar2.jsx`, `src/sinav.jsx`, `src/oyun.js`, `src/veri/`.
