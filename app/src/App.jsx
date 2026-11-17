import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDemo, useNow } from "./store.js";
import { SECCIONES, TOTAL, DEMO_REP, DEMO_CHILD, EJEMPLO, repsFor, readAt, readStats, cuando, hora, audienceLabel, seccionById } from "./data.js";

const ROLES = [
  { id: "direccion", label: "Dirección" },
  { id: "docente", label: "Docente" },
  { id: "representante", label: "Representante" },
];
const MARK = "/demo/icons/micole-mark-light.svg";
const visibleToRep = (c) => c.audience === "all" || c.audience === "4A";

export default function App() {
  const demo = useDemo();
  const [role, setRole] = useState(() => { try { return sessionStorage.getItem("micole-role") || "direccion"; } catch (e) { return "direccion"; } });
  const [stacks, setStacks] = useState({ direccion: [], docente: [], representante: [] });
  const [toast, setToast] = useState(null);
  const main = useRef(null);

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
  useEffect(() => { window.scrollTo(0, 0); }, [role, stack.length]);

  const say = useCallback((t) => { setToast(t); clearTimeout(say.t); say.t = setTimeout(() => setToast(null), 2600); }, []);
  const unread = demo.state.circulares.some((c) => visibleToRep(c) && !c.reads[DEMO_REP]);

  const reset = () => {
    if (!confirm("¿Reiniciar la demo? Se borra todo lo que se publicó y vuelve al inicio.")) return;
    demo.reset(); setStacks({ direccion: [], docente: [], representante: [] }); setRole("direccion"); say("Demo reiniciada");
  };

  const ctx = { ...demo, push, replace, back, say };
  let view;
  if (role === "direccion") {
    if (screen.name === "compose") view = <DirCompose ctx={ctx} />;
    else if (screen.name === "circular") view = <DirCircular ctx={ctx} id={screen.id} />;
    else if (screen.name === "seccion") view = <DirSeccion ctx={ctx} id={screen.id} sec={screen.sec} />;
    else view = <DirHome ctx={ctx} />;
  } else if (role === "representante") {
    view = screen.name === "circular" ? <RepCircular ctx={ctx} id={screen.id} /> : <RepHome ctx={ctx} />;
  } else view = <DocHome />;

  return (
    <>
      <DemoBar role={role} setRole={setRole} unread={unread} onReset={reset} />
      <main ref={main} className="app" key={role + stack.length}>{view}</main>
      <div className={"toast" + (toast ? " on" : "")} role="status" aria-live="polite">{toast}</div>
    </>
  );
}

/* ---------- demo chrome: clearly not part of the app ---------- */
function DemoBar({ role, setRole, unread, onReset }) {
  return (
    <div className="demobar">
      <div className="demobar-top">
        <span><b>Demo de miCole</b> · datos de ejemplo</span>
        <button type="button" className="link" onClick={onReset}>Reiniciar</button>
      </div>
      <div className="roles" role="tablist" aria-label="Ver la app como">
        {ROLES.map((r) => (
          <button key={r.id} type="button" role="tab" aria-selected={role === r.id} className={role === r.id ? "on" : ""} onClick={() => setRole(r.id)}>
            {r.label}
            {r.id === "representante" && unread && <i className="ping" aria-label="tiene una circular sin leer" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Head({ title, sub }) {
  return (
    <header className="head">
      <img src={MARK} alt="" width="36" height="36" />
      <div><div className="head-t">{title}</div><div className="head-s">{sub}</div></div>
    </header>
  );
}
function Back({ onClick, children }) {
  return <button type="button" className="back" onClick={onClick}><svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2 2 8l6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span className="back-l">{children}</span></button>;
}
function Bar({ read, total }) {
  return <div className="bar" aria-hidden="true"><span style={{ width: `${total ? (read / total) * 100 : 0}%` }} /></div>;
}
function Paras({ text }) { return text.split(/\n+/).map((p, i) => <p key={i}>{p}</p>); }

/* ---------- Dirección ---------- */
function DirHome({ ctx }) {
  const now = useNow();
  const list = ctx.state.circulares;
  return (
    <>
      <Head title="Colegio Demo" sub="Dirección" />
      <h1>Circulares</h1>
      <ul className="cards">
        {list.map((c) => {
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
  const now = useNow();
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
                    <span className="sec-n">{s.name}</span><span className="sec-c">{ss.read}/{ss.total}</span><Bar {...ss} /><svg className="chev" width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="m2 2 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
  const now = useNow();
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

/* ---------- Representante ---------- */
function RepHome({ ctx }) {
  const now = useNow(30000);
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
  const now = useNow(30000);
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

/* ---------- Docente (slice 2) ---------- */
function DocHome() {
  return (
    <>
      <Head title="Prof. Andrea Méndez" sub="4to grado A · Colegio Demo" />
      <div className="empty">
        <h1>Próximo paso de la demo</h1>
        <p>Aquí el docente publicará lo que pasó en clase, pasará la asistencia y dejará la tarea, desde su teléfono.</p>
      </div>
    </>
  );
}
