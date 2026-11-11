/* Claude dışında window.storage yoktur. Aynı arayüzü tarayıcı belleğiyle
   sağlar: get olmayan anahtarda hata fırlatır, değerler metin olarak saklanır. */
const ON = "nahiv:";
function bellek() { try { return window.localStorage; } catch { return null; } }

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const b = bellek(); const v = b ? b.getItem(ON + key) : null;
      if (v === null) throw new Error("anahtar yok: " + key);
      return { key, value: v };
    },
    async set(key, value) {
      const b = bellek(); if (!b) throw new Error("depolama kapalı");
      b.setItem(ON + key, String(value)); return { key, value };
    },
    async delete(key) { const b = bellek(); if (b) b.removeItem(ON + key); return { key, deleted: true }; },
    async list(prefix) {
      const b = bellek(); const keys = [];
      if (b) for (let i = 0; i < b.length; i++) {
        const k = b.key(i);
        if (k && k.startsWith(ON) && k.slice(ON.length).startsWith(prefix || "")) keys.push(k.slice(ON.length));
      }
      return { keys };
    }
  };
  window.NAHIV_AI_URL = "/api/claude";
}
