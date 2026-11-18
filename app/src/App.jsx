import React, { useEffect, useState, useCallback, useRef, createContext, useContext } from "react";
import { useDemo, useNow, demoNow } from "./store.js";
import {
  SECCIONES, TOTAL, DEMO_REP, DEMO_CHILD, EJEMPLO, DOCENTE, CLOSE_OPTIONS,
  repsFor, repById, readAt, readStats, cuando, hora, horaMin, audienceLabel, seccionById, isOpen, deliverAt, cuandoLlega,
  BRAND_COLORS, brandTokens, MATERIAS, ILUS, SIN_PERMISO, TIPOS, MOTIVOS, ESTADOS, dayKey, keyToTs, schoolDayFrom, isSchoolDayKey, dayLabel,
} from "./data.js";

const ROLES = [
  { id: "direccion", label: "Dirección" },
  { id: "docente", label: "Docente" },
  { id: "representante", label: "Representante" },
];
const TABS = {
  direccion: [{ id: "circulares", label: "Circulares" }, { id: "avisos", label: "Avisos" }, { id: "mensajes", label: "Mensajes" }],
  docente: [{ id: "asistencia", label: "Asistencia" }, { id: "momentos", label: "Momentos" }, { id: "tareas", label: "Tareas" }, { id: "mensajes", label: "Mensajes" }],
  representante: [{ id: "circulares", label: "Circulares" }, { id: "momentos", label: "Momentos" }, { id: "tareas", label: "Tareas" }, { id: "asistencia", label: "Asistencia" }, { id: "mensajes", label: "Mensajes" }],
};
const HOME = { direccion: "circulares", docente: "asistencia", representante: "circulares" };
const CLOCKS = [
  { id: "real", label: "Hora real" },
  { id: "tarde", label: "Hoy, 6:00 p.m." },
  { id: "manana", label: "Día siguiente, 7:05 a.m." },
];
const MARK = "/demo/icons/micole-mark-light.svg";
const Brand = createContext({ name: "Colegio Demo", color: "", logo: "" });
const visibleToRep = (c) => c.audience === "all" || c.audience === "4A";
const repName = (id) => `Rep. de ${repById(id).child}`;

/* ---------- unread counts ---------- */
function unreadMsgs(state, thread, side, now) {
  const seen = state.seen[thread + ":" + side] || 0;
  return state.mensajes.filter((m) => m.thread === thread && m.from !== side && m.deliverAt <= now && m.deliverAt > seen).length;
}
const threads = (state) => [...new Set(state.mensajes.map((m) => m.thread))];

export default function App() {
  const demo = useDemo();
  const { state } = demo;
  const now = useNow(state.clock, 5000);
  const [role, setRole] = useState(() => { try { return sessionStorage.getItem("micole-role") || "direccion"; } catch (e) { return "direccion"; } });
  const [tabs, setTabs] = useState(HOME);
  const [stacks, setStacks] = useState({ direccion: [], docente: [], representante: [] });
  const [toast, setToast] = useState(null);
  const toastT = useRef(0);

  useEffect(() => { try { sessionStorage.setItem("micole-role", role); } catch (e) {} }, [role]);

  // Each role keeps its own place, so you can switch roles mid-story and come back.
  const stack = stacks[role];
  const screen = stack[stack.length - 1] || { name: "home" };
  const push = useCallback((s) => { history.pushState({ d: 1 }, ""); setStacks((st) => ({ ...st, [role]: [...st[role], s] })); }, [role]);
  const replace = useCallback((s) => setStacks((st) => ({ ...st, [role]: [...st[role].slice(0, -1), s] })), [role]);
  const back = useCallback(() => history.back(), []);
  useEffect(() => {
    const on = () => setStacks((st) => ({ ...st, [role]: st[role].slice(0, -1) }));
    addEventListener("popstate", on);
    return () => removeEventListener("popstate", on);
  }, [role]);
  useEffect(() => { if (screen.name !== "chat") window.scrollTo(0, 0); }, [role, stack.length, tabs[role]]);

  const say = useCallback((t) => { setToast(t); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2800); }, []);
  const setTab = (t) => { setTabs((x) => ({ ...x, [role]: t })); setStacks((st) => ({ ...st, [role]: [] })); };

  const repCirc = state.circulares.filter((c) => visibleToRep(c) && !c.reads[DEMO_REP]).length;
  const repMsg = unreadMsgs(state, DEMO_REP, "rep", now);
  const docMsg = threads(state).reduce((a, t) => a + unreadMsgs(state, t, "doc", now), 0);
  const newAvisos = state.avisos.filter((a) => !a.seenAt && a.sentAt <= now).length;
  const askedJust = state.avisos.filter((a) => a.rep === DEMO_REP && a.estado === "pendiente").length;
  const repMom = state.momentos.filter((m) => m.at <= now && m.at > (state.seen["momentos:rep"] || 0)).length;
  const repTar = state.tareas.filter((t) => t.publishedAt <= now && t.publishedAt > (state.seen["tareas:rep"] || 0)).length;
  const badges = { direccion: { avisos: newAvisos }, docente: { mensajes: docMsg }, representante: { circulares: repCirc, momentos: repMom, tareas: repTar, mensajes: repMsg, asistencia: askedJust } };
  const pings = { direccion: newAvisos > 0, docente: docMsg > 0, representante: repCirc + repMsg + askedJust + repMom + repTar > 0 };

  const reset = () => {
    if (!confirm("¿Reiniciar la demo? Se borra todo lo que se publicó y escribió, y vuelve al inicio.")) return;
    demo.reset(); setStacks({ direccion: [], docente: [], representante: [] });
    setTabs(HOME); setRole("direccion"); say("Demo reiniciada");
  };
  const setClock = (mode) => {
    demo.setClock(mode);
    say(mode === "real" ? "De vuelta a la hora real" : `Hora simulada: ${CLOCKS.find((c) => c.id === mode).label}`);
  };

  const ctx = { ...demo, push, replace, back, say };
  const bt = brandTokens(state.brand.color);
  const brandStyle = { "--acc": bt.acc, "--acc-ink": bt.ink, "--acc-text": bt.text };
  useEffect(() => { document.title = `${state.brand.name} · miCole`; }, [state.brand.name]);
  const tab = tabs[role];
  const atHome = stack.length === 0;
  const showTabs = atHome && TABS[role].length > 1;
  let view;
  if (screen.name === "chat") view = <Chat ctx={ctx} thread={screen.thread} side={screen.side} />;
  else if (screen.name === "foto") view = <Foto ctx={ctx} id={screen.id} i={screen.i} />;
  else if (screen.name === "momentoNuevo") view = <MomentoNuevo ctx={ctx} />;
  else if (tab === "momentos" && atHome) view = <Momentos ctx={ctx} side={role === "docente" ? "doc" : "rep"} />;
  else if (screen.name === "tareaNueva") view = <TareaNueva ctx={ctx} />;
  else if (tab === "tareas" && atHome) view = role === "docente" ? <DocTareas ctx={ctx} /> : <RepTareas ctx={ctx} />;
  else if (role === "direccion") {
    if (screen.name === "compose") view = <DirCompose ctx={ctx} />;
    else if (screen.name === "brand") view = <BrandEdit ctx={ctx} />;
    else if (screen.name === "circular") view = <DirCircular ctx={ctx} id={screen.id} />;
    else if (screen.name === "seccion") view = <DirSeccion ctx={ctx} id={screen.id} sec={screen.sec} />;
    else if (screen.name === "aviso") view = <DirAviso ctx={ctx} id={screen.id} />;
    else view = tab === "mensajes" ? <DirMensajes ctx={ctx} /> : tab === "avisos" ? <DirAvisos ctx={ctx} /> : <DirHome ctx={ctx} />;
  } else if (role === "representante") {
    if (screen.name === "circular") view = <RepCircular ctx={ctx} id={screen.id} />;
    else if (screen.name === "avisoNuevo") view = <RepAvisoNuevo ctx={ctx} />;
    else if (screen.name === "aviso") view = <RepAviso ctx={ctx} id={screen.id} />;
    else view = tab === "mensajes" ? <RepMensajes ctx={ctx} /> : tab === "asistencia" ? <RepAsistencia ctx={ctx} /> : <RepHome ctx={ctx} />;
  } else view = tab === "mensajes" ? <DocMensajes ctx={ctx} /> : <DocAsistencia ctx={ctx} />;

  return (
    <Brand.Provider value={state.brand}>
    <div className={showTabs ? "with-tabs" : ""} style={brandStyle}>
      <DemoBar role={role} setRole={setRole} pings={pings} onReset={reset} clock={state.clock} now={now} setClock={setClock} />
      <main className="app" key={role + tab + stack.length}>{view}</main>
      {showTabs && (
        <nav className="tabbar" aria-label="Secciones">
          {TABS[role].map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? "on" : ""} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.id === "circulares" ? <IconDoc /> : t.id === "mensajes" ? <IconChat /> : t.id === "momentos" ? <IconImg /> : t.id === "tareas" ? <IconBook /> : <IconCheck />}
              <span>{t.label}</span>
              {badges[role][t.id] > 0 && <b className="badge">{badges[role][t.id]}</b>}
            </button>
          ))}
        </nav>
      )}
      <div className={"toast" + (toast ? " on" : "")} role="status" aria-live="polite">{toast}</div>
    </div>
    </Brand.Provider>
  );
}

/* ---------- demo chrome: clearly not part of the app ---------- */
function DemoBar({ role, setRole, pings, onReset, clock, now, setClock }) {
  const [open, setOpen] = useState(false);
  const sim = clock.mode !== "real";
  return (
    <div className="demobar">
      <div className="demobar-top">
        <span><b>Demo</b> · datos de ejemplo</span>
        <span className="demobar-act">
          <button type="button" className={"clock" + (sim ? " sim" : "")} aria-expanded={open} onClick={() => setOpen(!open)}>
            <IconClock /> {hora(now)}<span className="sr">{sim ? " (hora simulada)" : ""}</span>
          </button>
          <button type="button" className="link" onClick={onReset}>Reiniciar</button>
        </span>
      </div>
      {open && (
        <div className="clockpick">
          <p>Para mostrar el horario de mensajes a cualquier hora:</p>
          <div className="clockopts">
            {CLOCKS.map((c) => (
              <button key={c.id} type="button" className={clock.mode === c.id ? "on" : ""} onClick={() => { setClock(c.id); setOpen(false); }}>{c.label}</button>
            ))}
          </div>
        </div>
      )}
      <div className="roles" role="tablist" aria-label="Ver la app como">
        {ROLES.map((r) => (
          <button key={r.id} type="button" role="tab" aria-selected={role === r.id} className={role === r.id ? "on" : ""} onClick={() => setRole(r.id)}>
            {r.label}
            {pings[r.id] && <i className="ping" aria-label="tiene algo nuevo" />}
          </button>
        ))}
      </div>
    </div>
  );
}

const svg = (d, w = 22) => (p) => <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{d}</svg>;
const IconDoc = svg(<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>);
const IconChat = svg(<path d="M4 5h16v11H9l-5 4z" />);
const IconClock = svg(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, 15);
const IconCheck = svg(<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>);
const IconCam = svg(<><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>, 20);
const IconImg = svg(<><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" /></>);
const IconHeart = svg(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />, 20);
const IconBook = svg(<><path d="M5 4.5h10.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h10.5" /></>);
const IconBrush = svg(<><path d="M14.5 4.5 19.5 9.5 10 19H5v-5z" /><path d="m12.5 6.5 5 5" /></>, 18);
const IconSend = svg(<path d="M4 12 20 4l-5 16-3-7z" />);

function Head({ title, sub }) {
  const brand = useContext(Brand);
  const fix = (t) => (t || "").replace("Colegio Demo", brand.name);
  return (
    <header className="head">
      <img src={brand.logo || MARK} alt="" width="36" height="36" className={brand.logo ? "logo" : ""} />
      <div className="head-txt"><div className="head-t">{fix(title)}</div><div className="head-s">{fix(sub)}</div></div>
      <span className="with">con miCole</span>
    </header>
  );
}
function Back({ onClick, children }) {
  return (
    <button type="button" className="back" onClick={onClick}>
      <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2 2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="back-l">{children}</span>
    </button>
  );
}
function Chev() {
  return <svg className="chev" width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="m2 2 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Bar({ read, total }) {
  return <div className="bar" aria-hidden="true"><span style={{ width: `${total ? (read / total) * 100 : 0}%` }} /></div>;
}
function Paras({ text }) { return text.split(/\n+/).map((p, i) => <p key={i}>{p}</p>); }

/* ---------- Dirección: circulares ---------- */
function DirHome({ ctx }) {
  const now = useNow(ctx.state.clock);
  return (
    <>
      <Head title="Colegio Demo" sub="Dirección" />
      <button type="button" className="custom" onClick={() => ctx.push({ name: "brand" })}><IconBrush /> Personalizar colegio</button>
      <h1>Circulares</h1>
      <ul className="cards">
        {ctx.state.circulares.map((c) => {
          const st = readStats(c, now);
          const live = now - c.publishedAt < 20 * 60e3 && st.read < st.total;
          return (
            <li key={c.id}>
              <button type="button" className="card" onClick={() => ctx.push({ name: "circular", id: c.id })}>
                <span className="meta">{audienceLabel(c.audience)} · {cuando(c.publishedAt, now)}</span>
                <span className="card-t">{c.title}</span>
                <Bar {...st} />
                <span className="count">{live && <i className="live" aria-hidden="true" />}<b>{st.read} de {st.total}</b> representantes la leyeron</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="dock"><button type="button" className="btn" onClick={() => ctx.push({ name: "compose" })}>Nueva circular</button></div>
    </>
  );
}

function DirCompose({ ctx }) {
  const [audience, setAudience] = useState("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const ok = title.trim() && body.trim();
  const n = audience === "all" ? TOTAL : seccionById(audience).n;
  const submit = (e) => {
    e.preventDefault(); if (!ok) return;
    const id = ctx.publish({ title: title.trim(), body: body.trim(), audience });
    ctx.replace({ name: "circular", id });
    ctx.say(`Circular publicada para ${n} representantes`);
  };
  return (
    <form onSubmit={submit} className="compose">
      <Back onClick={ctx.back}>Cancelar</Back>
      <h1>Nueva circular</h1>
      <fieldset>
        <legend>Para</legend>
        <div className="chips">
          {[{ id: "all", name: "Todo el colegio" }, ...SECCIONES].map((s) => (
            <label key={s.id} className={"chip" + (audience === s.id ? " on" : "")}>
              <input type="radio" name="aud" value={s.id} checked={audience === s.id} onChange={() => setAudience(s.id)} />
              {s.id === "all" ? s.name : s.name.replace(" grado", "")}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field"><span>Título</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Por ejemplo: Actividad de fin de año" maxLength={90} /></label>
      <label className="field"><span>Mensaje</span><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Escriba aquí el mensaje para los representantes." /></label>
      {!title && !body && <button type="button" className="link ink" onClick={() => { setTitle(EJEMPLO.title); setBody(EJEMPLO.body); }}>Usar un texto de ejemplo</button>}
      <p className="hint">Cada representante podrá confirmar que la leyó, y usted verá quién falta. Al principio también saldrá por correo, como hoy.</p>
      <div className="dock"><button type="submit" className="btn" disabled={!ok}>Publicar para {n} representantes</button></div>
    </form>
  );
}

function ReadList({ c, reps, now }) {
  const rows = reps.map((r) => ({ r, t: readAt(c, r) })).map((x) => ({ ...x, done: x.t && x.t <= now }));
  const faltan = rows.filter((x) => !x.done), leyeron = rows.filter((x) => x.done).sort((a, b) => b.t - a.t);
  const Name = ({ r }) => <span>Rep. de {r.child}{r.id === DEMO_REP && <em className="you">Familia de la demo</em>}</span>;
  return (
    <>
      <h2>Faltan por leer <span className="n">{faltan.length}</span></h2>
      {faltan.length ? <ul className="people">{faltan.map(({ r }) => <li key={r.id}><Name r={r} /></li>)}</ul> : <p className="muted">Todos la leyeron.</p>}
      <h2>La leyeron <span className="n">{leyeron.length}</span></h2>
      {leyeron.length ? <ul className="people">{leyeron.map(({ r, t }) => <li key={r.id} className={r.id === DEMO_REP ? "hl" : ""}><Name r={r} /><span className="when">{cuando(t, now)}</span></li>)}</ul> : <p className="muted">Todavía nadie. Las lecturas van llegando solas.</p>}
    </>
  );
}

function DirCircular({ ctx, id }) {
  const now = useNow(ctx.state.clock);
  const c = ctx.state.circulares.find((x) => x.id === id);
  if (!c) return <Back onClick={ctx.back}>Circulares</Back>;
  const st = readStats(c, now);
  return (
    <>
      <Back onClick={ctx.back}>Circulares</Back>
      <p className="meta">{audienceLabel(c.audience)} · {cuando(c.publishedAt, now)}</p>
      <h1>{c.title}</h1>
      <div className="body"><Paras text={c.body} /></div>
      <section className="stat" aria-live="polite">
        <div className="big"><b>{st.read}</b> de {st.total}</div>
        <div>representantes la leyeron</div>
        <Bar {...st} />
      </section>
      {c.audience === "all" ? (
        <>
          <h2>Por sección</h2>
          <ul className="secs">
            {SECCIONES.map((s) => {
              const ss = readStats(c, now, s.id);
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => ctx.push({ name: "seccion", id: c.id, sec: s.id })}>
                    <span className="sec-n">{s.name}</span><span className="sec-c">{ss.read}/{ss.total}</span><Bar {...ss} /><Chev />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : <ReadList c={c} reps={repsFor(c.audience)} now={now} />}
    </>
  );
}

function DirSeccion({ ctx, id, sec }) {
  const now = useNow(ctx.state.clock);
  const c = ctx.state.circulares.find((x) => x.id === id);
  if (!c) return <Back onClick={ctx.back}>Volver</Back>;
  const st = readStats(c, now, sec);
  return (
    <>
      <Back onClick={ctx.back}>{c.title}</Back>
      <p className="meta">{c.title}</p>
      <h1>{seccionById(sec).name}</h1>
      <section className="stat"><div className="big"><b>{st.read}</b> de {st.total}</div><div>representantes la leyeron</div><Bar {...st} /></section>
      <ReadList c={c} reps={repsFor(sec)} now={now} />
    </>
  );
}

/* ---------- Mensajes: shared pieces ---------- */
function HoursNote({ state, now }) {
  const open = isOpen(now, state.close);
  return (
    <p className={"hours" + (open ? "" : " closed")}>
      <IconClock /> {open
        ? <>Mensajes abiertos hasta las {horaMin(state.close)}</>
        : <>Fuera de horario · abre {cuandoLlega(deliverAt(now, state.close), now)}</>}
    </p>
  );
}

function ThreadList({ ctx, side, list }) {
  const now = useNow(ctx.state.clock, 5000);
  const { state } = ctx;
  const rows = list.map((t) => {
    const ms = state.mensajes.filter((m) => m.thread === t && (side === "dir" || m.from === side || m.deliverAt <= now));
    return { t, last: ms[ms.length - 1], n: side === "dir" ? 0 : unreadMsgs(state, t, side, now) };
  }).filter((r) => r.last).sort((a, b) => b.last.sentAt - a.last.sentAt);
  return (
    <ul className="threads">
      {rows.map(({ t, last, n }) => (
        <li key={t}>
          <button type="button" className={n ? "unread" : ""} onClick={() => ctx.push({ name: "chat", thread: t, side })}>
            <span className="th-n">{side === "rep" ? DOCENTE.name : repName(t)}{t === DEMO_REP && side !== "rep" && <em className="you">Familia de la demo</em>}</span>
            <span className="th-w">{cuando(last.sentAt, now)}</span>
            <span className="th-s">{last.from === side ? "Usted: " : ""}{last.text}</span>
            {n > 0 && <b className="badge">{n}</b>}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Chat({ ctx, thread, side }) {
  const { state } = ctx;
  const now = useNow(state.clock, 2000);
  const [text, setText] = useState("");
  const readOnly = side === "dir";
  const msgs = state.mensajes.filter((m) => m.thread === thread && (readOnly || m.from === side || m.deliverAt <= now)).sort((a, b) => a.sentAt - b.sentAt);
  const open = isOpen(now, state.close);
  const arrives = cuandoLlega(deliverAt(now, state.close), now);
  const title = side === "rep" ? DOCENTE.name : repName(thread);
  const sub = side === "rep" ? DOCENTE.role : "4to grado A";

  useEffect(() => { if (!readOnly) ctx.markSeen(thread, side); }, [msgs.length]);
  useEffect(() => { window.scrollTo(0, document.documentElement.scrollHeight); }, [msgs.length]);

  const submit = (e) => {
    e.preventDefault(); const t = text.trim(); if (!t) return;
    ctx.send(thread, side, t); setText("");
    if (!open) ctx.say(`Se entregará ${arrives}`);
  };
  const mine = (m) => (readOnly ? m.from === "doc" : m.from === side);

  return (
    <div className={"chat" + (readOnly ? " ro" : "") + (!readOnly && !open ? " closed" : "")}>
      <Back onClick={ctx.back}>Mensajes</Back>
      <div className="chat-h"><div className="head-t">{title}</div><div className="head-s">{sub}</div></div>
      {readOnly ? <p className="hours"><IconClock /> Solo lectura. Los mensajes son del colegio, no del teléfono de nadie.</p> : <HoursNote state={state} now={now} />}
      <ol className="msgs">
        {msgs.map((m) => {
          const held = m.deliverAt > now, late = m.deliverAt > m.sentAt;
          let meta = hora(m.sentAt);
          if (held) meta += ` · se entrega ${cuandoLlega(m.deliverAt, now)}`;
          else if (late) meta = `Escrito ${cuando(m.sentAt, now)} · ${mine(m) ? "entregado" : "le llegó"} ${cuando(m.deliverAt, now)}`;
          if (readOnly) meta = (m.from === "doc" ? "Docente · " : "Representante · ") + meta;
          return (
            <li key={m.id} className={(mine(m) ? "me" : "them") + (held ? " held" : "")}>
              <div className="bub">{m.text}</div>
              <div className="bmeta">{held && <IconClock />}{meta}</div>
            </li>
          );
        })}
      </ol>
      {!readOnly && (
        <div className="dock composer">
          {!open && (
            <div className="afterhours">
              {side === "rep"
                ? <><b>Fuera del horario de mensajes.</b> Lo que escriba le llegará a la docente {arrives} ¿Es urgente? Llame a la secretaría del colegio.</>
                : <><b>Fuera de horario.</b> Si responde ahora, su respuesta se entregará {arrives} Puede descansar.</>}
            </div>
          )}
          <form onSubmit={submit} className="send">
            <label className="sr" htmlFor="msg">Mensaje</label>
            <textarea id="msg" rows={1} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escriba un mensaje" />
            <button type="submit" className="sendbtn" disabled={!text.trim()} aria-label="Enviar"><IconSend /></button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- Dirección: mensajes ---------- */
function DirMensajes({ ctx }) {
  const now = useNow(ctx.state.clock, 5000);
  const { state } = ctx;
  return (
    <>
      <Head title="Colegio Demo" sub="Dirección" />
      <h1>Mensajes</h1>
      <section className="setting">
        <h2>Horario de mensajes</h2>
        <p>De lunes a viernes, desde las 7:00 a.m. Fuera de ese horario, los mensajes esperan al día siguiente y nadie recibe avisos.</p>
        <p className="legend">Los mensajes cierran a las:</p>
        <div className="chips" role="radiogroup" aria-label="Hora de cierre">
          {CLOSE_OPTIONS.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={state.close === c} className={"chip" + (state.close === c ? " on" : "")} onClick={() => { ctx.setClose(c); ctx.say(`Los mensajes cierran a las ${horaMin(c)}`); }}>
              {horaMin(c)}
            </button>
          ))}
        </div>
        <HoursNote state={state} now={now} />
      </section>
      <h2>Conversaciones · 4to grado A</h2>
      <p className="hint">Solo lectura. Los mensajes son del colegio, no del teléfono de nadie.</p>
      <ThreadList ctx={ctx} side="dir" list={threads(state)} />
    </>
  );
}

/* ---------- Docente ---------- */
function DocMensajes({ ctx }) {
  const now = useNow(ctx.state.clock, 5000);
  return (
    <>
      <Head title={DOCENTE.name} sub="4to grado A · Colegio Demo" />
      <h1>Mensajes</h1>
      <HoursNote state={ctx.state} now={now} />
      <ThreadList ctx={ctx} side="doc" list={threads(ctx.state)} />
      
    </>
  );
}

/* ---------- Representante ---------- */
function RepHome({ ctx }) {
  const now = useNow(ctx.state.clock, 30000);
  const list = ctx.state.circulares.filter(visibleToRep);
  const pending = list.filter((c) => !c.reads[DEMO_REP]).length;
  return (
    <>
      <Head title={DEMO_CHILD} sub="4to grado A · Colegio Demo" />
      <h1>Circulares</h1>
      {pending > 0 && <p className="lead">{pending === 1 ? "Tiene una circular nueva." : `Tiene ${pending} circulares nuevas.`}</p>}
      <ul className="cards">
        {list.map((c) => {
          const isNew = !c.reads[DEMO_REP];
          return (
            <li key={c.id}>
              <button type="button" className={"card" + (isNew ? " new" : "")} onClick={() => ctx.push({ name: "circular", id: c.id })}>
                <span className="meta">{isNew && <span className="tag">Nueva</span>}Dirección · {cuando(c.publishedAt, now)}</span>
                <span className="card-t">{c.title}</span>
                <span className="snip">{c.body}</span>
                {!isNew && <span className="ok">✓ Leída</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function RepCircular({ ctx, id }) {
  const now = useNow(ctx.state.clock, 30000);
  const c = ctx.state.circulares.find((x) => x.id === id);
  if (!c) return <Back onClick={ctx.back}>Circulares</Back>;
  const t = c.reads[DEMO_REP];
  return (
    <>
      <Back onClick={ctx.back}>Circulares</Back>
      <p className="meta">Dirección · {audienceLabel(c.audience)} · {cuando(c.publishedAt, now)}</p>
      <h1>{c.title}</h1>
      <div className="body"><Paras text={c.body} /></div>
      <div className="dock">
        {t ? <p className="done">✓ Usted confirmó que la leyó · {cuando(t, now)}</p>
           : <button type="button" className="btn" onClick={() => { ctx.confirmRead(c.id, DEMO_REP); ctx.say("Lectura confirmada. La dirección ya lo ve."); }}>Confirmar lectura</button>}
      </div>
    </>
  );
}

function RepMensajes({ ctx }) {
  const now = useNow(ctx.state.clock, 5000);
  return (
    <>
      <Head title={DEMO_CHILD} sub="4to grado A · Colegio Demo" />
      <h1>Mensajes</h1>
      <HoursNote state={ctx.state} now={now} />
      <ThreadList ctx={ctx} side="rep" list={[DEMO_REP]} />
    </>
  );
}

/* ---------- asistencia + avisos de inasistencia ---------- */
const childOf = (rep) => repById(rep).child;
const secOf = (rep) => seccionById(repById(rep).seccion).name;
function Estado({ a, now }) {
  const cls = { enviado: "", recibido: "ok", pendiente: "warn", justificada: "ok" }[a.estado];
  let t = ESTADOS[a.estado];
  if (a.estado === "recibido" && a.seenAt) t += ` · ${cuando(a.seenAt, now)}`;
  return <span className={"pill " + cls}>{t}</span>;
}
function avisoLine(a, now) { return `${TIPOS[a.tipo]} ${dayLabel(a.day, now)} · ${a.motivo}`; }

/* image from the phone, shrunk so it fits in the demo's local storage */
function shrink(file) {
  return new Promise((ok, no) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 700 / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = no; img.src = url;
  });
}
function PhotoInput({ onPick, label }) {
  return (
    <label className="photo">
      <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files[0]; if (f) { try { onPick(await shrink(f)); } catch (x) { onPick(null); } } e.target.value = ""; }} />
      <IconCam /> {label}
    </label>
  );
}
function Just({ a }) {
  if (a.img) return <img className="justimg" src={a.img} alt="Foto del justificativo" />;
  if (a.just) return <p className="muted">Justificativo entregado.</p>;
  return <p className="muted">Sin justificativo.</p>;
}

/* Representante */
function RepAsistencia({ ctx }) {
  const now = useNow(ctx.state.clock, 30000);
  const { state } = ctx;
  const today = dayKey(now);
  const rec = state.asistencia[today];
  const aviso = state.avisos.find((a) => a.rep === DEMO_REP && a.day === today);
  let status;
  if (!isSchoolDayKey(today)) status = <>Hoy no hay clases.</>;
  else if (rec) {
    const m = rec.marks[DEMO_REP] || "presente";
    status = m === "presente" ? <><b>Sofía llegó.</b> Asistencia pasada a las {hora(rec.savedAt)}</>
      : m === "tarde" ? <><b>Sofía llegó tarde.</b> Registrado a las {hora(rec.savedAt)}</>
      : <><b>Sofía no asistió hoy.</b>{aviso ? " Usted avisó a coordinación." : " Si no avisó, puede hacerlo aquí abajo."}</>;
  } else status = <>La asistencia de hoy todavía no se ha pasado.{aviso ? ` Usted avisó: ${TIPOS[aviso.tipo].toLowerCase()}.` : ""}</>;
  const mine = state.avisos.filter((a) => a.rep === DEMO_REP).sort((x, y) => y.sentAt - x.sentAt);
  return (
    <>
      <Head title={DEMO_CHILD} sub="4to grado A · Colegio Demo" />
      <h1>Asistencia</h1>
      <section className="today"><span className="meta">Hoy</span><p>{status}</p></section>
      <button type="button" className="btn" onClick={() => ctx.push({ name: "avisoNuevo" })}>Avisar inasistencia</button>
      <p className="hint">Para avisar que no asistirá, que llegará tarde o que se retira temprano. Llega a coordinación y a la docente.</p>
      <h2>Sus avisos</h2>
      {mine.length ? (
        <ul className="cards">
          {mine.map((a) => (
            <li key={a.id}>
              <button type="button" className={"card" + (a.estado === "pendiente" ? " new" : "")} onClick={() => ctx.push({ name: "aviso", id: a.id })}>
                <span className="card-t">{TIPOS[a.tipo]} {dayLabel(a.day, now)}</span>
                <span className="meta">{a.motivo} · enviado {cuando(a.sentAt, now)}</span>
                <Estado a={a} now={now} />
              </button>
            </li>
          ))}
        </ul>
      ) : <p className="muted">Todavía no ha enviado avisos.</p>}
    </>
  );
}

function RepAvisoNuevo({ ctx }) {
  const now = useNow(ctx.state.clock, 30000);
  const today = dayKey(now);
  const next = schoolDayFrom(now, isSchoolDayKey(today) ? 1 : 0);
  const [tipo, setTipo] = useState("ausente");
  const [dia, setDia] = useState(isSchoolDayKey(today) ? today : next);
  const [otra, setOtra] = useState(false);
  const [motivo, setMotivo] = useState("Enfermedad");
  const [nota, setNota] = useState("");
  const [img, setImg] = useState(null);
  const submit = (e) => {
    e.preventDefault(); if (!dia) return;
    const id = ctx.sendAviso({ rep: DEMO_REP, tipo, day: dia, motivo, nota: nota.trim(), just: !!img, img });
    ctx.replace({ name: "aviso", id });
    ctx.say("Aviso enviado a coordinación y a la docente");
  };
  const Chip = ({ on, onClick, children }) => <button type="button" className={"chip" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>{children}</button>;
  const dias = [...new Set([isSchoolDayKey(today) ? today : null, next].filter(Boolean))];
  return (
    <form onSubmit={submit} className="compose">
      <Back onClick={ctx.back}>Cancelar</Back>
      <h1>Avisar inasistencia</h1>
      <p className="meta">{DEMO_CHILD} · 4to grado A</p>
      <fieldset><legend>Qué pasa</legend><div className="chips">{Object.entries(TIPOS).map(([k, v]) => <Chip key={k} on={tipo === k} onClick={() => setTipo(k)}>{v}</Chip>)}</div></fieldset>
      <fieldset><legend>Cuándo</legend><div className="chips">
        {dias.map((k) => <Chip key={k} on={!otra && dia === k} onClick={() => { setOtra(false); setDia(k); }}>{dayLabel(k, now).replace(/^./, (c) => c.toUpperCase())}</Chip>)}
        <Chip on={otra} onClick={() => { setOtra(true); setDia(""); }}>Otra fecha</Chip>
      </div>
      {otra && <label className="field" style={{ marginTop: 10 }}><span>Fecha</span><input type="date" min={today} value={dia} onChange={(e) => setDia(e.target.value)} /></label>}
      </fieldset>
      <fieldset><legend>Motivo</legend><div className="chips">{MOTIVOS.map((m) => <Chip key={m} on={motivo === m} onClick={() => setMotivo(m)}>{m}</Chip>)}</div></fieldset>
      <label className="field"><span>Nota (opcional)</span><textarea rows={3} value={nota} onChange={(e) => setNota(e.target.value)} placeholder={tipo === "tarde" ? "Por ejemplo: llega a las 9:00 a.m." : "Lo que coordinación deba saber"} /></label>
      {img ? <div className="justwrap"><img className="justimg" src={img} alt="Foto del justificativo" /><button type="button" className="link" onClick={() => setImg(null)}>Quitar foto</button></div>
        : <PhotoInput onPick={setImg} label="Adjuntar justificativo (opcional)" />}
      <p className="hint">Puede enviarlo a cualquier hora. Nadie recibe avisos de noche: coordinación lo ve a las 7:00 a.m. Al principio también se copiará al correo de coordinación, como hoy.</p>
      <div className="dock"><button type="submit" className="btn" disabled={!dia}>Enviar aviso</button></div>
    </form>
  );
}

function RepAviso({ ctx, id }) {
  const now = useNow(ctx.state.clock, 5000);
  const a = ctx.state.avisos.find((x) => x.id === id);
  if (!a) return <Back onClick={ctx.back}>Asistencia</Back>;
  return (
    <>
      <Back onClick={ctx.back}>Asistencia</Back>
      <p className="meta">{DEMO_CHILD} · enviado {cuando(a.sentAt, now)}</p>
      <h1>{TIPOS[a.tipo]} {dayLabel(a.day, now)}</h1>
      <Estado a={a} now={now} />
      <dl className="facts"><dt>Motivo</dt><dd>{a.motivo}</dd>{a.nota && <><dt>Nota</dt><dd>{a.nota}</dd></>}<dt>Para</dt><dd>Coordinación y {DOCENTE.name}</dd></dl>
      <h2>Justificativo</h2>
      <Just a={a} />
      {a.estado === "pendiente" && <p className="warnbox">Coordinación pide el justificativo para dar la inasistencia por justificada.</p>}
      {!a.img && a.estado !== "justificada" && <PhotoInput onPick={(img) => { if (img) { ctx.attach(a.id, img); ctx.say("Justificativo enviado"); } }} label={a.estado === "pendiente" ? "Enviar foto del justificativo" : "Adjuntar justificativo"} />}
    </>
  );
}

/* Dirección / coordinación */
function DirAvisos({ ctx }) {
  const now = useNow(ctx.state.clock, 5000);
  const today = dayKey(now);
  const list = ctx.state.avisos.filter((a) => a.sentAt <= now);
  const groups = [
    ["Hoy", list.filter((a) => a.day === today)],
    ["Próximos días", list.filter((a) => a.day > today)],
    ["Anteriores", list.filter((a) => a.day < today)],
  ];
  const rec = ctx.state.asistencia[today];
  return (
    <>
      <Head title="Colegio Demo" sub="Dirección y coordinación" />
      <h1>Avisos de inasistencia</h1>
      <p className="hours"><IconClock /> 4to grado A: {rec ? `asistencia pasada a las ${hora(rec.savedAt)}` : "asistencia de hoy pendiente"}</p>
      {groups.map(([g, as]) => as.length > 0 && (
        <section key={g}>
          <h2>{g} <span className="n">{as.length}</span></h2>
          <ul className="cards">
            {as.sort((x, y) => y.sentAt - x.sentAt).map((a) => (
              <li key={a.id}>
                <button type="button" className={"card" + (!a.seenAt ? " new" : "")} onClick={() => ctx.push({ name: "aviso", id: a.id })}>
                  <span className="meta">{!a.seenAt && <span className="tag">Nuevo</span>}{secOf(a.rep)} · {cuando(a.sentAt, now)}</span>
                  <span className="card-t">{childOf(a.rep)}{a.rep === DEMO_REP && <em className="you">Familia de la demo</em>}</span>
                  <span className="snip">{avisoLine(a, now)}{a.just ? " · con justificativo" : ""}</span>
                  {a.seenAt && <Estado a={a} now={now} />}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function DirAviso({ ctx, id }) {
  const now = useNow(ctx.state.clock, 5000);
  const a = ctx.state.avisos.find((x) => x.id === id);
  useEffect(() => { if (a && !a.seenAt) ctx.seeAviso(id); }, [id]);
  if (!a) return <Back onClick={ctx.back}>Avisos</Back>;
  return (
    <>
      <Back onClick={ctx.back}>Avisos</Back>
      <p className="meta">{secOf(a.rep)} · enviado {cuando(a.sentAt, now)} por su representante</p>
      <h1>{childOf(a.rep)}</h1>
      <Estado a={a} now={now} />
      <dl className="facts"><dt>Aviso</dt><dd>{TIPOS[a.tipo]} {dayLabel(a.day, now)}</dd><dt>Motivo</dt><dd>{a.motivo}</dd>{a.nota && <><dt>Nota</dt><dd>{a.nota}</dd></>}</dl>
      <h2>Justificativo</h2>
      <Just a={a} />
      <p className="hint">El representante ya ve que usted lo recibió. La docente lo ve en su lista de asistencia.</p>
      {a.estado !== "justificada" && (
        <div className="dock two">
          {!a.just && a.estado !== "pendiente" && <button type="button" className="btn ghost" onClick={() => { ctx.setEstado(a.id, "pendiente"); ctx.say("Se le pidió el justificativo al representante"); }}>Pedir justificativo</button>}
          <button type="button" className="btn" onClick={() => { ctx.setEstado(a.id, "justificada"); ctx.say("Inasistencia justificada"); }}>Marcar como justificada</button>
        </div>
      )}
    </>
  );
}

/* Docente */
function DocAsistencia({ ctx }) {
  const now = useNow(ctx.state.clock, 30000);
  const { state } = ctx;
  const today = dayKey(now);
  const reps = repsFor("4A");
  const avisos = Object.fromEntries(state.avisos.filter((a) => a.day === today && a.sentAt <= now && repById(a.rep).seccion === "4A").map((a) => [a.rep, a]));
  const rec = state.asistencia[today];
  const initial = () => Object.fromEntries(reps.map((r) => [r.id, rec ? rec.marks[r.id] || "presente" : avisos[r.id] && avisos[r.id].tipo !== "retiro" ? avisos[r.id].tipo : "presente"]));
  const [marks, setMarks] = useState(initial);
  const [editing, setEditing] = useState(!rec);
  const school = isSchoolDayKey(today);
  const count = (k) => Object.values(marks).filter((v) => v === k).length;
  const save = () => {
    const m = Object.fromEntries(Object.entries(marks).filter(([, v]) => v !== "presente"));
    ctx.saveAsistencia(today, m); setEditing(false);
    ctx.say("Asistencia guardada. Los representantes ya lo ven.");
  };
  const opts = [["presente", "P", "Presente"], ["ausente", "A", "Ausente"], ["tarde", "T", "Tarde"]];
  return (
    <>
      <Head title={DOCENTE.name} sub="4to grado A · Colegio Demo" />
      <h1>Asistencia</h1>
      {!school ? <p className="muted">Hoy no hay clases. Con la hora simulada puede mostrar un día de clases.</p> : (
        <>
          <p className="hours"><IconClock /> {rec && !editing ? `Pasada a las ${hora(rec.savedAt)} · ${count("presente")} presentes, ${count("ausente")} ausentes, ${count("tarde")} tarde` : `Hoy · ${reps.length} estudiantes`}</p>
          {Object.keys(avisos).length > 0 && (
            <section className="avisobox">
              <h2>Avisos de hoy <span className="n">{Object.keys(avisos).length}</span></h2>
              <ul>{Object.values(avisos).map((a) => <li key={a.id}><b>{childOf(a.rep)}</b>: {TIPOS[a.tipo].toLowerCase()} · {a.motivo}{a.nota ? `. ${a.nota}` : ""}</li>)}</ul>
            </section>
          )}
          <ul className="roll">
            {reps.map((r) => {
              const a = avisos[r.id];
              return (
                <li key={r.id}>
                  <div className="roll-n"><span>{r.child}</span>{a && <small>Avisado {hora(a.sentAt)} · {TIPOS[a.tipo].toLowerCase()}</small>}</div>
                  <div className="seg" role="radiogroup" aria-label={`Asistencia de ${r.child}`}>
                    {opts.map(([k, l, full]) => (
                      <button key={k} type="button" role="radio" aria-checked={marks[r.id] === k} aria-label={full} disabled={!editing} className={marks[r.id] === k ? "on " + k : ""} onClick={() => setMarks({ ...marks, [r.id]: k })}>{l}</button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="dock">
            {editing ? <button type="button" className="btn" onClick={save}>Guardar asistencia · {count("presente")} presentes</button>
              : <button type="button" className="btn ghost" onClick={() => setEditing(true)}>Corregir asistencia</button>}
          </div>
        </>
      )}
    </>
  );
}

/* ---------- momentos del día + galería ---------- */
function Pics({ m, onOpen }) {
  return (
    <div className={"pics n" + Math.min(m.imgs.length, 3)}>
      {m.imgs.slice(0, 3).map((src, i) => (
        <button key={i} type="button" className="pic" onClick={() => onOpen(i)} aria-label={`Ver foto ${i + 1}`}>
          <img src={src} alt="" loading="lazy" />
          {m.illus && <span className="ilus">Ilustración</span>}
          {i === 2 && m.imgs.length > 3 && <span className="more">+{m.imgs.length - 3}</span>}
        </button>
      ))}
    </div>
  );
}

function Momentos({ ctx, side }) {
  const now = useNow(ctx.state.clock, 30000);
  const [view, setView] = useState("feed");
  const list = ctx.state.momentos.filter((m) => m.at <= now).sort((a, b) => b.at - a.at);
  useEffect(() => { if (side === "rep") ctx.markSeen("momentos", "rep"); }, [list.length]);
  const photos = list.flatMap((m) => m.imgs.map((src, i) => ({ m, i, src })));
  const head = side === "rep" ? <Head title={DEMO_CHILD} sub="4to grado A · Colegio Demo" /> : <Head title={DOCENTE.name} sub="4to grado A · Colegio Demo" />;
  return (
    <>
      {head}
      <h1>Momentos del día</h1>
      <div className="seg2" role="tablist">
        <button type="button" role="tab" aria-selected={view === "feed"} className={view === "feed" ? "on" : ""} onClick={() => setView("feed")}>Momentos</button>
        <button type="button" role="tab" aria-selected={view === "gal"} className={view === "gal" ? "on" : ""} onClick={() => setView("gal")}>Galería · {photos.length}</button>
      </div>
      {view === "feed" ? (
        <ul className="feed">
          {list.map((m) => {
            const likes = m.likeBase + (m.liked ? 1 : 0);
            return (
              <li key={m.id} className="mom">
                <p className="meta">{DOCENTE.name} · {cuando(m.at, now)}</p>
                <p className="mom-t">{m.text}</p>
                {m.imgs.length > 0 && <Pics m={m} onOpen={(i) => ctx.push({ name: "foto", id: m.id, i })} />}
                {side === "rep" ? (
                  <button type="button" className={"like" + (m.liked ? " on" : "")} aria-pressed={m.liked} onClick={() => ctx.toggleLike(m.id)}>
                    <IconHeart /> {m.liked ? "Le gusta" : "Me gusta"}{likes ? ` · ${likes}` : ""}
                  </button>
                ) : <p className="likes"><IconHeart /> {likes ? `A ${likes} ${likes === 1 ? "familia le gustó" : "familias les gustó"}` : "Todavía sin reacciones"}</p>}
              </li>
            );
          })}
        </ul>
      ) : (
        photos.length ? (
          <ul className="gal">
            {photos.map(({ m, i, src }) => (
              <li key={m.id + i}><button type="button" onClick={() => ctx.push({ name: "foto", id: m.id, i })} aria-label={`Foto de ${cuando(m.at, now)}`}><img src={src} alt="" loading="lazy" />{m.illus && <span className="ilus">Ilustración</span>}</button></li>
            ))}
          </ul>
        ) : <p className="muted">Todavía no hay fotos.</p>
      )}
      <p className="hint center">{side === "rep" ? "Solo lo ven las familias de 4to grado A." : "Lo ven solo las familias de 4to grado A. Nada se publica fuera de miCole."}</p>
      {side === "doc" && <div className="dock"><button type="button" className="btn" onClick={() => ctx.push({ name: "momentoNuevo" })}>Nuevo momento</button></div>}
    </>
  );
}

function MomentoNuevo({ ctx }) {
  const [text, setText] = useState("");
  const [imgs, setImgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const sin = SIN_PERMISO();
  const add = async (e) => {
    const files = [...e.target.files].slice(0, 4 - imgs.length); e.target.value = "";
    setBusy(true);
    const out = [];
    for (const f of files) { try { out.push(await shrink(f)); } catch (x) {} }
    setImgs((v) => [...v, ...out].slice(0, 4)); setBusy(false);
  };
  const submit = (e) => {
    e.preventDefault(); if (!text.trim()) return;
    ctx.postMomento(text.trim(), imgs); ctx.back();
    ctx.say("Publicado para las familias de 4to grado A");
  };
  return (
    <form onSubmit={submit} className="compose">
      <Back onClick={ctx.back}>Cancelar</Back>
      <h1>Nuevo momento</h1>
      <label className="field"><span>Qué pasó hoy en clase</span><textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Una o dos líneas sobre lo que hicieron hoy." maxLength={400} /></label>
      {!text && <button type="button" className="link ink" onClick={() => setText("Hoy hicimos un experimento: pusimos hielo al sol y a la sombra y medimos cuál se derritió primero.")}>Usar un texto de ejemplo</button>}
      {imgs.length > 0 && (
        <ul className="thumbs">
          {imgs.map((src, i) => <li key={i}><img src={src} alt={`Foto ${i + 1}`} /><button type="button" aria-label={`Quitar foto ${i + 1}`} onClick={() => setImgs(imgs.filter((_, j) => j !== i))}>×</button></li>)}
        </ul>
      )}
      {imgs.length < 4 && (
        <label className="photo">
          <input type="file" accept="image/*" multiple onChange={add} />
          <IconCam /> {busy ? "Preparando fotos..." : imgs.length ? "Agregar otra foto" : "Agregar fotos (hasta 4)"}
        </label>
      )}
      {imgs.length > 0 && <p className="warnbox"><b>Antes de publicar:</b> en 4to grado A, {sin.join(" y ")} no tienen permiso de fotos. Revise que no aparezcan.</p>}
      <p className="hint">Lo ven solo las familias de 4to grado A. Las fotos se comprimen para que no gasten datos.</p>
      <div className="dock"><button type="submit" className="btn" disabled={!text.trim() || busy}>Publicar para 24 familias</button></div>
    </form>
  );
}

function Foto({ ctx, id, i }) {
  const now = useNow(ctx.state.clock, 30000);
  const m = ctx.state.momentos.find((x) => x.id === id);
  if (!m) return <Back onClick={ctx.back}>Momentos</Back>;
  return (
    <div className="foto">
      <Back onClick={ctx.back}>Momentos</Back>
      <figure>
        <img src={m.imgs[i]} alt={m.illus ? "Ilustración de ejemplo" : "Foto de la clase"} />
        <figcaption><span className="meta">{DOCENTE.name} · {cuando(m.at, now)}{m.illus ? " · Ilustración de ejemplo" : ""}</span>{m.text}</figcaption>
      </figure>
    </div>
  );
}

/* ---------- tareas ---------- */
function dueGroups(list, now) {
  const today = dayKey(now), next = schoolDayFrom(now, isSchoolDayKey(today) ? 1 : 0);
  return [
    ["Para " + dayLabel(next, now), list.filter((t) => t.due === next)],
    ["Más adelante", list.filter((t) => t.due > next)],
    ["Para hoy", list.filter((t) => t.due === today && today !== next)],
    ["Anteriores", list.filter((t) => t.due < today)],
  ].filter(([, l]) => l.length);
}
const dueText = (t, now) => `Para ${dayLabel(t.due, now)}`;

function RepTareas({ ctx }) {
  const now = useNow(ctx.state.clock, 30000);
  const list = ctx.state.tareas.filter((t) => t.publishedAt <= now);
  useEffect(() => { ctx.markSeen("tareas", "rep"); list.forEach((t) => !t.reads[DEMO_REP] && ctx.seeTarea(t.id, DEMO_REP)); }, [list.length]);
  const traer = list.filter((t) => t.traer && t.due >= dayKey(now) && !t.done);
  return (
    <>
      <Head title={DEMO_CHILD} sub="4to grado A · Colegio Demo" />
      <h1>Tareas</h1>
      {traer.length > 0 && (
        <section className="traer"><b>Hay que traer</b><ul>{traer.map((t) => <li key={t.id}>{t.traer} · {dayLabel(t.due, now)} ({t.materia})</li>)}</ul></section>
      )}
      {dueGroups(list, now).map(([g, l]) => (
        <section key={g}>
          <h2>{g.replace(/^Para (.)/, (m, c) => "Para " + c)}</h2>
          <ul className="cards">
            {l.sort((a, b) => a.due.localeCompare(b.due)).map((t) => (
              <li key={t.id} className={"tarea" + (t.done ? " is-done" : "")}>
                <span className="meta"><span className="mat">{t.materia}</span>{dueText(t, now)}</span>
                <span className="card-t">{t.title}</span>
                <span className="tarea-d">{t.detail}</span>
                {t.traer && <span className="traer-l">Traer: {t.traer}</span>}
                <button type="button" className={"check" + (t.done ? " on" : "")} aria-pressed={t.done} onClick={() => ctx.toggleDone(t.id)}>
                  <span className="box" aria-hidden="true">{t.done ? "✓" : ""}</span>{t.done ? "Lista" : "Marcar como lista"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="hint center">"Lista" es solo para su control en casa. La docente ve quién vio la tarea, no quién la marcó.</p>
    </>
  );
}

function DocTareas({ ctx }) {
  const now = useNow(ctx.state.clock, 2000);
  const list = ctx.state.tareas.filter((t) => t.publishedAt <= now);
  return (
    <>
      <Head title={DOCENTE.name} sub="4to grado A · Colegio Demo" />
      <h1>Tareas</h1>
      {dueGroups(list, now).map(([g, l]) => (
        <section key={g}>
          <h2>{g}</h2>
          <ul className="cards">
            {l.map((t) => {
              const st = readStats(t, now);
              return (
                <li key={t.id} className="tarea">
                  <span className="meta"><span className="mat">{t.materia}</span>{dueText(t, now)} · publicada {cuando(t.publishedAt, now)}</span>
                  <span className="card-t">{t.title}</span>
                  {t.traer && <span className="traer-l">Traer: {t.traer}</span>}
                  <Bar {...st} />
                  <span className="count"><b>{st.read} de {st.total}</b> familias la vieron</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <div className="dock"><button type="button" className="btn" onClick={() => ctx.push({ name: "tareaNueva" })}>Nueva tarea</button></div>
    </>
  );
}

function TareaNueva({ ctx }) {
  const now = useNow(ctx.state.clock, 30000);
  const today = dayKey(now);
  const d1 = schoolDayFrom(now, isSchoolDayKey(today) ? 1 : 0), d2 = schoolDayFrom(keyToTs(d1), 1);
  const [materia, setMateria] = useState("Ciencias");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState(d1);
  const [otra, setOtra] = useState(false);
  const [traerOn, setTraerOn] = useState(false);
  const [traer, setTraer] = useState("");
  const ok = title.trim() && due;
  const Chip = ({ on, onClick, children }) => <button type="button" className={"chip" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>{children}</button>;
  const cap = (x) => x.replace(/^./, (c) => c.toUpperCase());
  const submit = (e) => {
    e.preventDefault(); if (!ok) return;
    ctx.postTarea({ materia, title: title.trim(), detail: detail.trim(), due, traer: traerOn ? traer.trim() : "" });
    ctx.back(); ctx.say("Tarea publicada para las familias de 4to grado A");
  };
  return (
    <form onSubmit={submit} className="compose">
      <Back onClick={ctx.back}>Cancelar</Back>
      <h1>Nueva tarea</h1>
      <fieldset><legend>Materia</legend><div className="chips">{MATERIAS.map((m) => <Chip key={m} on={materia === m} onClick={() => setMateria(m)}>{m}</Chip>)}</div></fieldset>
      <label className="field"><span>Tarea</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Por ejemplo: Ejercicios de la página 42" maxLength={80} /></label>
      <label className="field"><span>Detalle (opcional)</span><textarea rows={3} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Lo que la familia necesita saber para ayudar en casa." /></label>
      {!title && <button type="button" className="link ink" onClick={() => { setMateria("Ciencias"); setTitle("Traer un vaso de plástico"); setDetail("Para el experimento del viernes. Puede ser reciclado."); setTraerOn(true); setTraer("Un vaso de plástico"); }}>Usar un ejemplo</button>}
      <fieldset><legend>Para cuándo</legend><div className="chips">
        <Chip on={!otra && due === d1} onClick={() => { setOtra(false); setDue(d1); }}>{cap(dayLabel(d1, now))}</Chip>
        <Chip on={!otra && due === d2} onClick={() => { setOtra(false); setDue(d2); }}>{cap(dayLabel(d2, now))}</Chip>
        <Chip on={otra} onClick={() => { setOtra(true); setDue(""); }}>Otra fecha</Chip>
      </div>
      {otra && <label className="field" style={{ marginTop: 10 }}><span>Fecha</span><input type="date" min={today} value={due} onChange={(e) => setDue(e.target.value)} /></label>}
      </fieldset>
      <label className="toggle"><input type="checkbox" checked={traerOn} onChange={(e) => setTraerOn(e.target.checked)} /> Hay que traer algo</label>
      {traerOn && <label className="field"><span>Qué hay que traer</span><input value={traer} onChange={(e) => setTraer(e.target.value)} placeholder="Por ejemplo: una hoja de árbol" maxLength={60} /></label>}
      <p className="hint">Lo que hay que traer aparece arriba en la vista de las familias, para que no dependa de la agenda en el morral.</p>
      <div className="dock"><button type="submit" className="btn" disabled={!ok}>Publicar para 24 familias</button></div>
    </form>
  );
}

/* ---------- school branding (Dirección) ---------- */
function shrinkLogo(file) {
  return new Promise((ok, no) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 192 / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      ok(c.toDataURL("image/png"));
    };
    img.onerror = no; img.src = url;
  });
}

function BrandEdit({ ctx }) {
  const cur = ctx.state.brand;
  const [name, setName] = useState(cur.name);
  const [color, setColor] = useState(cur.color || "#E59A2F");
  const [logo, setLogo] = useState(cur.logo);
  const bt = brandTokens(color);
  const save = (e) => {
    e.preventDefault();
    ctx.setBrand({ name: name.trim() || "Colegio Demo", color, logo });
    ctx.back(); ctx.say("Listo: así se ve miCole para su colegio");
  };
  const restore = () => { setName("Colegio Demo"); setColor("#E59A2F"); setLogo(""); };
  return (
    <form onSubmit={save} className="compose" style={{ "--acc": bt.acc, "--acc-ink": bt.ink, "--acc-text": bt.text }}>
      <Back onClick={ctx.back}>Cancelar</Back>
      <h1>Personalizar colegio</h1>
      <p className="hint">El nombre, el logo y el color del colegio aparecen en todas las pantallas, para docentes y familias.</p>
      <label className="field"><span>Nombre del colegio</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Por ejemplo: U.E. Colegio Los Samanes" /></label>
      <fieldset><legend>Logo</legend>
        <div className="logorow">
          <span className="logoprev">{logo ? <img src={logo} alt="Logo del colegio" /> : <img src={MARK} alt="" />}</span>
          <label className="photo small">
            <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files[0]; e.target.value = ""; if (f) { try { setLogo(await shrinkLogo(f)); } catch (x) { ctx.say("No se pudo leer esa imagen"); } } }} />
            <IconCam /> {logo ? "Cambiar logo" : "Subir logo"}
          </label>
          {logo && <button type="button" className="link" onClick={() => setLogo("")}>Quitar</button>}
        </div>
      </fieldset>
      <fieldset><legend>Color del colegio</legend>
        <div className="swatches">
          {BRAND_COLORS.map((c) => (
            <button key={c.hex} type="button" className={"sw" + (color.toLowerCase() === c.hex.toLowerCase() ? " on" : "")} style={{ background: c.hex }} aria-label={c.name} aria-pressed={color.toLowerCase() === c.hex.toLowerCase()} onClick={() => setColor(c.hex)} />
          ))}
          <label className="sw custom-c" aria-label="Otro color"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} />+</label>
        </div>
        {bt.light && <p className="hint">Es un color claro: lo usamos en botones y franjas, y una versión más oscura para los textos, para que se lea bien.</p>}
      </fieldset>
      <div className="preview" style={{ "--acc": bt.acc, "--acc-ink": bt.ink, "--acc-text": bt.text }} aria-label="Vista previa">
        <div className="head">
          {logo ? <img src={logo} alt="" width="36" height="36" className="logo" /> : <img src={MARK} alt="" width="36" height="36" />}
          <div className="head-txt"><div className="head-t">{name || "Colegio Demo"}</div><div className="head-s">4to grado A</div></div>
          <span className="with">con miCole</span>
        </div>
        <div className="card new"><span className="meta"><span className="tag">Nueva</span>Dirección · ahora</span><span className="card-t">Reunión de representantes</span><div className="bar"><span style={{ width: "70%" }} /></div></div>
        <span className="btn as">Confirmar lectura</span>
      </div>
      <button type="button" className="link" onClick={restore}>Volver a Colegio Demo</button>
      <p className="hint">Solo se guarda en este teléfono. "Reiniciar" lo borra, para que el logo de un colegio no aparezca en la demo del siguiente.</p>
      <div className="dock"><button type="submit" className="btn">Guardar</button></div>
    </form>
  );
}
