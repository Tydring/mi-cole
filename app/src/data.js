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
    v: 1,
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
