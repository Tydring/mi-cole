import { useEffect, useState, useCallback } from "react";
import { seed } from "./data.js";

/* All demo state lives on this phone only (localStorage). Nothing is sent anywhere. */
const KEY = "micole-demo-v1";

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) {}
  return seed();
}
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

export function useDemo() {
  const [state, setState] = useState(load);
  useEffect(() => { save(state); }, [state]);
  useEffect(() => {
    const on = (e) => { if (e.key === KEY) setState(load()); };
    addEventListener("storage", on);
    return () => removeEventListener("storage", on);
  }, []);

  const publish = useCallback(({ title, body, audience }) => {
    const id = "c" + Date.now().toString(36);
    setState((s) => ({ ...s, circulares: [{ id, title, body, audience, publishedAt: Date.now(), speed: 1, reads: {} }, ...s.circulares] }));
    return id;
  }, []);
  const confirmRead = useCallback((cid, repId) => {
    setState((s) => ({ ...s, circulares: s.circulares.map((c) => (c.id === cid && !c.reads[repId] ? { ...c, reads: { ...c.reads, [repId]: Date.now() } } : c)) }));
  }, []);
  const reset = useCallback(() => setState(seed()), []);
  return { state, publish, confirmRead, reset };
}

/* A clock that ticks while a screen needs live numbers (reads arriving). */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}
