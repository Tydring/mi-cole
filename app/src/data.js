/* Colegio Demo: everything here is invented for the demo. No real school, no real students. */

export const SECCIONES = [
  { id: "1A", name: "1er grado A", n: 25 },
  { id: "2A", name: "2do grado A", n: 24 },
  { id: "3A", name: "3er grado A", n: 26 },
  { id: "4A", name: "4to grado A", n: 24 },
  { id: "5A", name: "5to grado A", n: 23 },
  { id: "6A", name: "6to grado A", n: 25 },
];
export const TOTAL = SECCIONES.reduce((a, s) => a + s.n, 0);
export const seccionById = (id) => SECCIONES.find((s) => s.id === id);

// The demo family: the representante whose phone the demo shows.
export const DEMO_REP = "4A-17";
export const DEMO_CHILD = "Sofía Rojas";

const NOMBRES = ["Valentina", "Santiago", "Camila", "Sebastián", "Isabella", "Diego", "Mariana", "Samuel", "Victoria", "Gabriel", "Daniela", "Andrés", "Lucía", "Mateo", "Paula", "Alejandro", "Antonella", "Joaquín", "Emma", "Tomás", "Ariana", "Nicolás", "Julieta", "Miguel", "Sara", "Emilio", "Martina", "Rafael", "Fabiana", "Luis"];
const APELLIDOS = ["González", "Rodríguez", "Pérez", "Hernández", "García", "Martínez", "Ramírez", "Torres", "Díaz", "Moreno", "Mendoza", "Castillo", "Suárez", "Rivas", "Medina", "Guerrero", "Romero", "Salazar", "Briceño", "Contreras", "Blanco", "Colmenares", "Villegas", "Marcano", "Ochoa", "Peña"];

/* Students (one representante each), deterministic so every reset looks the same. */
export const REPS = [];
SECCIONES.forEach((s, si) => {
  for (let i = 0; i < s.n; i++) {
    const id = `${s.id}-${String(i).padStart(2, "0")}`;
    const name = id === DEMO_REP ? DEMO_CHILD : `${NOMBRES[(i * 7 + si * 11) % NOMBRES.length]} ${APELLIDOS[(i * 5 + si * 3) % APELLIDOS.length]}`;
    REPS.push({ id, seccion: s.id, child: name });
  }
});
REPS.sort((a, b) => a.child.localeCompare(b.child, "es"));
export const repsFor = (audience) => (audience === "all" ? REPS : REPS.filter((r) => r.seccion === audience));

/* ---------- simulated reading ----------
   Other families read on their own, on a fixed pseudo-random schedule from the moment of publishing.
   Only the demo family is read by hand (Representante: "Confirmar lectura"). */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 100000) / 100000;
}
export function readAt(c, rep) {
  if (c.reads[rep.id]) return c.reads[rep.id];
  if (rep.id === DEMO_REP) return null;
  const h = hash(c.id + "|" + rep.id);
  if (h < 0.1) return null; // about one in ten never reads it
  const g = hash(rep.id + "|" + c.id);
  // most read in the first two minutes, some within twenty (times c.speed for older circulares)
  const sec = h < 0.28 ? 120 + g * 1080 : 4 + Math.pow(g, 1.6) * 116;
  return c.publishedAt + sec * 1000 * (c.speed || 1);
}
export function readStats(c, now, audience = c.audience) {
  const list = repsFor(audience);
  let read = 0;
  for (const r of list) { const t = readAt(c, r); if (t && t <= now) read++; }
  return { read, total: list.length };
}

/* ---------- seed ---------- */
const H = 3600e3, D = 24 * H;
function at(daysAgo, h, m) { const d = new Date(Date.now() - daysAgo * D); d.setHours(h, m, 0, 0); return d.getTime(); }

export function seed() {
  const c = (id, daysAgo, h, m, audience, title, body) => {
    const publishedAt = at(daysAgo, h, m);
    return { id, title, body, audience, publishedAt, speed: 90, reads: { [DEMO_REP]: publishedAt + 2.6 * H } };
  };
  return {
    v: 3,
    close: DEFAULT_CLOSE,
    avisos: seedAvisos(),
    asistencia: {},
    clock: { mode: "real" },
    ...seedMensajes(),
    circulares: [
      c("s3", 1, 16, 10, "4A", "Reunión de representantes de 4to grado A",
        "Les invitamos a la reunión de representantes de 4to grado A el jueves a las 7:00 a.m. en el salón. Hablaremos del cierre del primer lapso y de las actividades de diciembre. Agradecemos su puntualidad."),
      c("s2", 3, 11, 30, "all", "Cierre del primer lapso",
        "Les recordamos que se acerca el cierre del primer lapso. Los boletines se entregarán en la reunión de representantes de cada sección. Cualquier duda, pueden escribir a la dirección."),
      c("s1", 6, 9, 15, "all", "Uso del uniforme deportivo",
        "A partir de la próxima semana, los estudiantes deben venir con el uniforme deportivo los días que tienen Educación Física. Les pedimos marcar cada prenda con el nombre del estudiante."),
    ],
  };
}

export const EJEMPLO = {
  title: "Actividad de fin de año",
  body: "El viernes celebraremos la actividad de fin de año en el patio, de 10:00 a.m. a 12:00 m. Los estudiantes pueden venir con ropa casual. Las familias están invitadas.",
};

/* ---------- time, in Venezuelan Spanish ---------- */
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export function hora(ts) {
  const d = new Date(ts); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, "0");
  const suf = h < 12 ? "a.m." : "p.m."; h = h % 12 || 12;
  return `${h}:${m} ${suf}`;
}
export function cuando(ts, now) {
  const s = (now - ts) / 1000;
  if (s < 45) return "ahora";
  if (s < 3600) return `hace ${Math.max(1, Math.round(s / 60))} min`;
  const a = new Date(ts), b = new Date(now);
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(b) - day(a)) / D);
  if (diff === 0) return `hoy, ${hora(ts)}`;
  if (diff === 1) return `ayer, ${hora(ts)}`;
  if (diff < 7) return `${DIAS[a.getDay()]}, ${hora(ts)}`;
  return `${a.getDate()} ${MESES[a.getMonth()]}`;
}
export const audienceLabel = (a) => (a === "all" ? "Todo el colegio" : seccionById(a).name);

/* ---------- messages with office hours ----------
   Default: 7:00 a.m. to 3:30 p.m., Monday to Friday. Each school can change the closing time. */
export const OPEN_MIN = 7 * 60;
export const DEFAULT_CLOSE = 15 * 60 + 30;
export const CLOSE_OPTIONS = [14 * 60, 15 * 60 + 30, 17 * 60];
const isSchoolDay = (d) => d.getDay() >= 1 && d.getDay() <= 5;
export function isOpen(ts, close) {
  const d = new Date(ts), m = d.getHours() * 60 + d.getMinutes();
  return isSchoolDay(d) && m >= OPEN_MIN && m < close;
}
/* The moment a message written at ts reaches the other side. */
export function deliverAt(ts, close) {
  if (isOpen(ts, close)) return ts;
  const d = new Date(ts);
  const m = d.getHours() * 60 + d.getMinutes();
  if (!(isSchoolDay(d) && m < OPEN_MIN)) d.setDate(d.getDate() + 1);
  while (!isSchoolDay(d)) d.setDate(d.getDate() + 1);
  d.setHours(7, 0, 0, 0);
  return d.getTime();
}
export function horaMin(min) { const d = new Date(); d.setHours(Math.floor(min / 60), min % 60, 0, 0); return hora(d.getTime()); }
/* "mañana a las 7:00 a.m.", "el lunes a las 7:00 a.m.", "hoy a las 7:00 a.m." */
export function cuandoLlega(ts, now) {
  const day = (x) => { const d = new Date(x); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
  const diff = Math.round((day(ts) - day(now)) / D);
  const h = hora(ts);
  if (diff <= 0) return `hoy a las ${h}`;
  if (diff === 1) return `mañana a las ${h}`;
  return `el ${DIAS[new Date(ts).getDay()]} a las ${h}`;
}
function prevSchoolDay(daysBack = 1) {
  const d = new Date(); d.setDate(d.getDate() - daysBack);
  while (!isSchoolDay(d)) d.setDate(d.getDate() - 1);
  return d;
}
const atDay = (d, h, m) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x.getTime(); };
export const DOCENTE = { name: "Prof. Andrea Méndez", role: "Docente de 4to grado A" };
export const repById = (id) => REPS.find((r) => r.id === id);

export function seedMensajes() {
  const y = prevSchoolDay(1);
  const y2 = new Date(y); y2.setDate(y2.getDate() - 1); while (!isSchoolDay(y2)) y2.setDate(y2.getDate() - 1);
  const m = (thread, from, ts, text) => ({ id: thread + ts + from, thread, from, text, sentAt: ts, deliverAt: deliverAt(ts, DEFAULT_CLOSE) });
  const t4A = REPS.filter((r) => r.seccion === "4A" && r.id !== DEMO_REP);
  const a = t4A[2].id, b = t4A[9].id;
  return {
    mensajes: [
      m(DEMO_REP, "rep", atDay(y, 10, 12), "Buenos días, profesora. Sofía dejó el cuaderno de Matemáticas en el carro. ¿Lo puede entregar mañana?"),
      m(DEMO_REP, "doc", atDay(y, 10, 40), "Buenos días. Sí, no hay problema. Que lo traiga mañana con la tarea completa."),
      m(DEMO_REP, "rep", atDay(y, 10, 42), "¡Muchas gracias!"),
      m(a, "rep", atDay(y2, 14, 50), "Profesora, ¿la salida al museo necesita autorización firmada?"),
      m(a, "doc", atDay(y2, 15, 5), "Sí, la enviamos en la carpeta. Debe volver firmada antes del jueves."),
      m(b, "rep", atDay(y, 20, 15), "Buenas noches, profesora. ¿Hasta cuándo hay plazo para entregar el proyecto de Ciencias?"),
    ],
    seen: { [DEMO_REP + ":rep"]: atDay(y, 11, 0), [DEMO_REP + ":doc"]: atDay(y, 11, 0), [a + ":doc"]: atDay(y2, 16, 0) },
  };
}

/* ---------- asistencia + avisos de inasistencia ---------- */
export const TIPOS = { ausente: "No asistirá", tarde: "Llegará tarde", retiro: "Se retira temprano" };
export const MOTIVOS = ["Enfermedad", "Cita médica", "Viaje", "Otro"];
export const ESTADOS = {
  enviado: "Enviado · esperando a coordinación",
  recibido: "Recibido por coordinación",
  pendiente: "Coordinación pide el justificativo",
  justificada: "Justificada",
};
export function dayKey(ts) { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
export function keyToTs(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d, 12).getTime(); }
export function schoolDayFrom(ts, offset = 0) {
  const d = new Date(ts); let n = offset;
  while (!isSchoolDay(d)) d.setDate(d.getDate() + 1);
  while (n > 0) { d.setDate(d.getDate() + 1); if (isSchoolDay(d)) n--; }
  return dayKey(d.getTime());
}
export const isSchoolDayKey = (k) => isSchoolDay(new Date(keyToTs(k)));
export function dayLabel(k, now) {
  const diff = Math.round((keyToTs(k) - keyToTs(dayKey(now))) / D);
  if (diff === 0) return "hoy";
  if (diff === 1) return "mañana";
  if (diff === -1) return "ayer";
  const d = new Date(keyToTs(k));
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;
}

export function seedAvisos() {
  const ref = schoolDayFrom(Date.now());
  const refTs = keyToTs(ref);
  const t4A = REPS.filter((r) => r.seccion === "4A" && r.id !== DEMO_REP);
  const r2A = REPS.find((r) => r.seccion === "2A");
  const before = new Date(refTs); before.setDate(before.getDate() - 1); while (!isSchoolDay(before)) before.setDate(before.getDate() - 1);
  const last = new Date(refTs); last.setDate(last.getDate() - 6); while (!isSchoolDay(last)) last.setDate(last.getDate() - 1);
  const at = (base, h, m) => { const x = new Date(base); x.setHours(h, m, 0, 0); return x.getTime(); };
  const a = (id, rep, tipo, day, motivo, nota, sentAt, estado, seenAt, just = false) => ({ id, rep, tipo, day, motivo, nota, sentAt, estado, seenAt, just, img: null });
  return [
    a("a1", t4A[5].id, "ausente", ref, "Enfermedad", "Amaneció con fiebre. Les aviso cómo sigue.", at(refTs, 6, 12), "enviado", null),
    a("a2", t4A[11].id, "tarde", ref, "Cita médica", "Llega a las 9:00 a.m. aproximadamente.", at(before, 20, 15), "recibido", at(refTs, 7, 2)),
    a("a3", r2A.id, "ausente", ref, "Viaje", "Viaje familiar, vuelve el lunes.", at(before, 17, 40), "pendiente", at(refTs, 7, 4)),
    a("a4", DEMO_REP, "ausente", dayKey(last.getTime()), "Enfermedad", "Gripe.", at(last, 6, 30), "justificada", at(last, 7, 5), true),
  ];
}
