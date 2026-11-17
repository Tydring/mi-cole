import { useEffect, useState, useCallback } from "react";
import { seed, deliverAt } from "./data.js";

/* All demo state lives on this phone only (localStorage). Nothing is sent anywhere. */
const KEY = "micole-demo-v1";

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 2) return s; } catch (e) {}
  return seed();
}
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

/* The demo clock: real time, or a simulated afternoon or next morning, so office hours can be shown at any hour. */
export function demoNow(clock, real = Date.now()) {
  return clock && clock.mode !== "real" ? clock.base + Math.max(0, real - clock.setAt) : real;
}
function clockFor(mode, close) {
  if (mode === "real") return { mode };
  const t = new Date(); t.setHours(18, 0, 0, 0);
  const base = mode === "tarde" ? t.getTime() : deliverAt(t.getTime(), close) + 5 * 60e3;
  return { mode, base, setAt: Date.now() };
}

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
    setState((s) => ({ ...s, circulares: [{ id, title, body, audience, publishedAt: demoNow(s.clock), speed: 1, reads: {} }, ...s.circulares] }));
    return id;
  }, []);
  const confirmRead = useCallback((cid, repId) => {
    setState((s) => ({ ...s, circulares: s.circulares.map((c) => (c.id === cid && !c.reads[repId] ? { ...c, reads: { ...c.reads, [repId]: demoNow(s.clock) } } : c)) }));
  }, []);
  const send = useCallback((thread, from, text) => {
    setState((s) => {
      const now = demoNow(s.clock);
      const msg = { id: "m" + Date.now().toString(36), thread, from, text, sentAt: now, deliverAt: deliverAt(now, s.close) };
      return { ...s, mensajes: [...s.mensajes, msg], seen: { ...s.seen, [thread + ":" + from]: now } };
    });
  }, []);
  const markSeen = useCallback((thread, side) => {
    setState((s) => {
      const now = demoNow(s.clock), k = thread + ":" + side;
      return s.seen[k] && s.seen[k] >= now - 1000 ? s : { ...s, seen: { ...s.seen, [k]: now } };
    });
  }, []);
  const setClose = useCallback((close) => setState((s) => ({ ...s, close })), []);
  const setClock = useCallback((mode) => setState((s) => ({ ...s, clock: clockFor(mode, s.close) })), []);
  const reset = useCallback(() => setState(seed()), []);
  return { state, publish, confirmRead, send, markSeen, setClose, setClock, reset };
}

/* A demo clock that ticks while a screen needs live numbers. */
export function useNow(clock, ms = 1000) {
  const [real, setReal] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setReal(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return demoNow(clock, real);
}
