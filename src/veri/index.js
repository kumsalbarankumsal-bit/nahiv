/* Kelime hazinesi ham verisi. Her satır:
   kelime|Türkçe|seviye|tür|durak|örnek cümle|eşdizim                      */
const dosyalar = import.meta.glob("./k*.txt", { query: "?raw", import: "default", eager: true });
export const HAM_HEPSI = Object.keys(dosyalar).sort().map((k) => dosyalar[k]).join("\n");
export { HATLAR, DURAK_META } from "./hatlar.js";
