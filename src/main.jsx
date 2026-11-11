import "./depo.js";
import React from "react";
import { createRoot } from "react-dom/client";
import Nahiv from "./Nahiv.jsx";

createRoot(document.getElementById("kok")).render(<Nahiv />);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("/sw.js").catch(() => {}); });
}
