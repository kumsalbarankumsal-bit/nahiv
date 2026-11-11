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
