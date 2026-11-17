import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDemo, useNow, demoNow } from "./store.js";
import {
  SECCIONES, TOTAL, DEMO_REP, DEMO_CHILD, EJEMPLO, DOCENTE, CLOSE_OPTIONS,
  repsFor, repById, readAt, readStats, cuando, hora, horaMin, audienceLabel, seccionById, isOpen, deliverAt, cuandoLlega,
} from "./data.js";

const ROLES = [
  { id: "direccion", label: "Dirección" },
  { id: "docente", label: "Docente" },
  { id: "representante", label: "Representante" },
];
const TABS = {
  direccion: [{ id: "circulares", label: "Circulares" }, { id: "mensajes", label: "Mensajes" }],
  docente: [{ id: "mensajes", label: "Mensajes" }],
  representante: [{ id: "circulares", label: "Circulares" }, { id: "mensajes", label: "Mensajes" }],
};
const CLOCKS = [
  { id: "real", label: "Hora real" },
  { id: "tarde", label: "Hoy, 6:00 p.m." },
  { id: "manana", label: "Día siguiente, 7:05 a.m." },
];
const MARK = "/demo/icons/micole-mark-light.svg";
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
  const [tabs, setTabs] = useState({ direccion: "circulares", docente: "mensajes", representante: "circulares" });
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
  const badges = { direccion: {}, docente: { mensajes: docMsg }, representante: { circulares: repCirc, mensajes: repMsg } };
  const pings = { direccion: false, docente: docMsg > 0, representante: repCirc + repMsg > 0 };

  const reset = () => {
    if (!confirm("¿Reiniciar la demo? Se borra todo lo que se publicó y escribió, y vuelve al inicio.")) return;
    demo.reset(); setStacks({ direccion: [], docente: [], representante: [] });
    setTabs({ direccion: "circulares", docente: "mensajes", representante: "circulares" }); setRole("direccion"); say("Demo reiniciada");
  };
  const setClock = (mode) => {
    demo.setClock(mode);
    say(mode === "real" ? "De vuelta a la hora real" : `Hora simulada: ${CLOCKS.find((c) => c.id === mode).label}`);
  };

  const ctx = { ...demo, push, replace, back, say };
  const tab = tabs[role];
  const atHome = stack.length === 0;
  const showTabs = atHome && TABS[role].length > 1;
  let view;
  if (screen.name === "chat") view = <Chat ctx={ctx} thread={screen.thread} side={screen.side} />;
  else if (role === "direccion") {
    if (screen.name === "compose") view = <DirCompose ctx={ctx} />;
    else if (screen.name === "circular") view = <DirCircular ctx={ctx} id={screen.id} />;
    else if (screen.name === "seccion") view = <DirSeccion ctx={ctx} id={screen.id} sec={screen.sec} />;
    else view = tab === "mensajes" ? <DirMensajes ctx={ctx} /> : <DirHome ctx={ctx} />;
  } else if (role === "representante") {
    if (screen.name === "circular") view = <RepCircular ctx={ctx} id={screen.id} />;
    else view = tab === "mensajes" ? <RepMensajes ctx={ctx} /> : <RepHome ctx={ctx} />;
  } else view = <DocMensajes ctx={ctx} />;

  return (
    <div className={showTabs ? "with-tabs" : ""}>
      <DemoBar role={role} setRole={setRole} pings={pings} onReset={reset} clock={state.clock} now={now} setClock={setClock} />
      <main className="app" key={role + tab + stack.length}>{view}</main>
      {showTabs && (
        <nav className="tabbar" aria-label="Secciones">
          {TABS[role].map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? "on" : ""} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.id === "circulares" ? <IconDoc /> : <IconChat />}
              <span>{t.label}</span>
              {badges[role][t.id] > 0 && <b className="badge">{badges[role][t.id]}</b>}
            </button>
          ))}
        </nav>
      )}
      <div className={"toast" + (toast ? " on" : "")} role="status" aria-live="polite">{toast}</div>
    </div>
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
const IconSend = svg(<path d="M4 12 20 4l-5 16-3-7z" />);

function Head({ title, sub }) {
  return (
    <header className="head">
      <img src={MARK} alt="" width="36" height="36" />
      <div><div className="head-t">{title}</div><div className="head-s">{sub}</div></div>
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
      <p className="hint center">Momentos del día, tareas y asistencia llegan en los próximos pasos de la demo.</p>
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
