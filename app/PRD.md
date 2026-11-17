# miCole demo app: PRD (signed off 2026-11-17)

Date: 2026-11-17. Signed off with the decisions below.

## 1. Problem
Directors have never seen miCole. The site describes it in words, but a director only reacts for real when they can hold it. Christian needs something to put in a director's hand during a conversation that makes the idea concrete, so the conversation produces real feedback ("I'd use this", "this part is useless", "we'd need X").

## 2. What it is
A clickable demo of miCole that runs in the phone browser from a link and can be installed to the home screen. Fake data, no accounts, no backend. It looks and feels like the real app.

It is not the product. Nothing a director types leaves their phone.

## 3. Success criteria
1. Christian can open it on his phone and walk a director through it in under 5 minutes without explaining how to use it.
2. **The key moment works:** Dirección publishes a circular, you switch to Representante and it is there, you confirm it, you switch back and Dirección sees "leído" next to that family. Every action in one role shows up in the others.
3. It runs smoothly on a mid-range Android over a weak connection. First load is under 300 KB, and after that it works offline.
4. Any director who sees it understands within 10 seconds that it is a demo with made-up data.
5. "Reiniciar demo" resets everything to the starting state, so each conversation starts clean.

## 4. Scope

**Roles** (switched from a visible role picker, no login):
- **Dirección:** publishes circulares and sees who read them.
- **Docente** (one teacher, one sección, for example 4to A): posts momentos, takes attendance and posts tareas.
- **Representante** (parent of one child in 4to A): sees their child's feed and confirms circulares.

**Flows, in build order (each slice is shippable on its own):**

| Slice | Flow | Roles |
|---|---|---|
| 1 | Circular + who read it: publish, receive, confirm, see the read list (e.g. "18 de 24 representantes") (done) | Dirección, Representante |
| 2 | Messages with office hours: 7:00 a.m. to 3:30 p.m. by default; after hours, messages wait until the next school day; Dirección can read conversations and change the hours | Representante, Docente, Dirección |
| 3 | Momentos del día + gallery per grade | Docente, Representante |
| 4 | Tareas: what to bring and for when | Docente, Representante |
| 5 | Asistencia: tap through a list of 24 students; the representante sees "llegó a las 7:15" or "ausente" | Docente, Representante |

Order changed 2026-11-17 after the brainstorm in `IDEAS.md`. Messaging moved up; asistencia stays.

Slice 1 alone is already worth showing. After each slice I stop, you try it on your phone, and then we go on.

**Out of scope for the demo:** real login, real notifications, Instagram posting, Google Classroom, QR sign-up, grades and boletines, multiple secciones or children, email sending, teacher and student profiles, and an admin panel.

## 5. Constraints
- **Brand:** the miCole brand from `brand/final/`, the same tokens as the site (Papel, Pizarra, Mango, Salvia, Tiza), Bricolage Grotesque 400 and 700, and the logo. Do not use christian-brand.
- **Language:** Venezuelan Spanish. School vocabulary: lapso, sección, representante, circular, tarea.
- **Copy:** no em dashes.
- **Data:** a clearly fictional school ("Colegio Demo"), fictional names for teachers and students, and a permanent "Demo · datos de ejemplo" tag. Never Henry Clay, never real students.
- **Tech:**
  - Vite + React, built to static files.
  - State lives in `localStorage` on that one phone, so the role switch is instant and works offline.
  - A service worker for offline use, and a manifest so it can be installed.
- **Design:** mobile-first at 360 to 412 px, tap targets of at least 44 px. It must be usable one-handed.
- **Separation:** it lives in `app/` in this repo, away from the site. Nothing goes online until you say "proceed".

## 6. Plan
1. Sign-off on this PRD and the open questions.
2. Set up `app/`: Vite, React, brand tokens, fonts, the role switcher, the demo store with seed data, and the "Reiniciar demo" button.
3. Slice 1 (circular and read list), checked at 360 and 412 px and on a throttled CPU, then you try it on your phone through a local preview.
4. Slices 2, 3 and 4, with the same check after each.
5. An independent judge plays a director using the demo, plus the QA pass.
6. Deploy once you say "proceed".

## 7. Decisions (2026-11-17)
1. Usted throughout; avoid pronouns where possible.
2. Lives at `mi-cole-one.vercel.app/demo` for now (built with base `/demo/`).
3. The site does not link to the demo. Christian shares it by hand.
4. School name: "Colegio Demo", nothing more.
5. Read confirmation is a committed feature for now. Later: move it out of "explorando" on the site.
