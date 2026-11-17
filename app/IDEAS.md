# miCole: feature ideas (brainstorm, 2026-11-17)

Christian's list, with Sam's read. These are ideas, not commitments. Test them in director conversations before building them for real.

## Three layers
| Layer | Ideas | Note |
|---|---|---|
| A. School communication | Chat with office hours, circulares hub, gallery | This is miCole. Sells to one school. |
| B. Integrations | Instagram, Google Classroom | Plumbing into what schools already use. |
| C. A network across schools | Portable teacher profile, student expediente | Only works with many schools on miCole. A different company. Park it. |

## The ideas

### 1 + 2. Messages with office hours (in the demo: slice 2)
- **Hours:** 7:00 a.m. to 3:30 p.m. by default; each school can change them. (Decided 2026-11-17: 3:30 p.m. is the default.)
- **After hours:**
  - **Parents** can still write. The message waits and reaches the teacher at the next school day, 7:00 a.m.
  - **Teachers** can reply after hours, but the reply is held until 7:00 a.m., so parents do not learn they are available at night.
  - **Urgent cases** go another way: "¿Es urgente? Llame a la secretaría del colegio."
- **Who sees the messages:** they belong to the school, not to the teacher's phone. Dirección can read them.
  - **Open question:** does that scare teachers? Ask them.

### 3. Instagram (on the site under "explorando")
- **How:** the official publishing API, with a Business account.
- **The real issue is consent.** LOPNNA protects children's right to their own image. That means:
  - a photo consent flag per student
  - teachers propose posts and Dirección publishes them
  - students without consent are never shown
- **Get a legal read before promising it.**

### 4. Google Classroom
- **The idea:** pull tareas from Classroom into miCole, so parents see everything in one place without a second password. Classroom stays the students' tool.
- **What it needs:** the school's Google admin has to approve access.
- **The catch:** other schools use Microsoft or nothing at all.

### 5. Circulares hub (slice 1 is the base)
To add, all cheap:
- search
- filter by lapso
- pinned circulares
- PDF attachments

### 6. Gallery per grade (in the demo: slice 3, with momentos)
- **Data cost:** heavy compression and thumbnails first, because data is expensive in Venezuela.
- **Consent:** the same consent rules as Instagram. The gallery is the private source, and Instagram gets a chosen, consented subset.

### 7. Portable teacher profile (layer C, parked)
- **Who pays?** The director buys miCole, and a feature that makes it easier for teachers to leave is not a selling point for them.
- **"Progress" is not defined yet.** Is it a portfolio, trainings, years?
- **Ask teachers about it.**

### 8. Student archive and expediente (layer C, parked, highest risk)
- **Archiving at graduation:** fine. It is the school keeping its own records.
- **A profile that carries over to a new school:**
  - it involves minors' data and parental consent
  - it raises the question of who owns the record
  - official transfer paperwork already exists
- **Universities:** not now. Maybe later, with the student's own consent once they are 18.

## Not on the list, worth asking directors about
- **Urgent notices** that ignore office hours, for example when classes are suspended because of the power, the water or the situation outside.
- **Autorizaciones:** permission slips signed in the app.
- **Who picks up the child:** authorized people, with a photo.
- **Mensualidad payment reminders.** This is likely the director's biggest pain, and it is sensitive.
- **Families with several children** in different secciones.

## Avisos de inasistencia (added 2026-11-17, built in slice 3)
Today parents email coordinación when a child will miss school, because it is important and leaves a trace. In miCole it is not a chat message: it is a structured aviso (type, day, reason, optional justificativo photo) that goes to coordinación and the teacher, can be sent at any hour without waking anyone, shows "Recibido por coordinación" to the parent, and arrives pre-filled in the teacher's attendance list.

## Demo order (updated 2026-11-17)
1. Circulares + who read it (done)
2. Messages with office hours (done)
3. Asistencia + avisos de inasistencia (done)
4. Momentos + gallery (done)
5. Tareas (done)
