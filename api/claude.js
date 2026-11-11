/* Vercel sunucu fonksiyonu: tarayıcıdan gelen isteği Anthropic API'ye iletir.
   Anahtar yalnızca ANTHROPIC_API_KEY ortam değişkeninde durur, tarayıcıya hiç gitmez.
   Model ve uzunluk burada sabitlenir; istemci bunları değiştiremez. */

const MODEL = process.env.NAHIV_MODEL || "claude-sonnet-4-6";
const UST_SINIR = 3200;
const METIN_SINIRI = 60000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Yalnızca POST" });
  }
  const anahtar = process.env.ANTHROPIC_API_KEY;
  if (!anahtar) {
    return res.status(503).json({ error: "ANTHROPIC_API_KEY tanımlı değil. Vercel → Settings → Environment Variables." });
  }

  let govde = req.body;
  if (typeof govde === "string") { try { govde = JSON.parse(govde); } catch { govde = null; } }
  const mesajlar = govde && Array.isArray(govde.messages) ? govde.messages : null;
  if (!mesajlar || !mesajlar.length) return res.status(400).json({ error: "messages eksik" });

  const toplam = JSON.stringify(mesajlar).length;
  if (toplam > METIN_SINIRI) return res.status(413).json({ error: "İstek çok uzun" });

  const temiz = mesajlar
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content }));
  if (!temiz.length) return res.status(400).json({ error: "Geçerli mesaj yok" });

  try {
    const cevap = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anahtar,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: Math.min(Number(govde.max_tokens) || 1600, UST_SINIR),
        messages: temiz
      })
    });
    const veri = await cevap.json();
    return res.status(cevap.status).json(veri);
  } catch (e) {
    return res.status(502).json({ error: "Anthropic API'ye ulaşılamadı" });
  }
}
