# miCole promo site: design brief (for sign-off)

Status: draft, waiting for Christian's yes. Nothing gets built until then.
Visual reference: `explore/synthesis.html` (the combined direction). Decisions trace back to the judge's review of the six directions in `explore/directions.html`.

## BUSINESS
- **Name:** miCole ("Mi Colegio").
- **Sells:** a school communication platform for Venezuelan schools, not built yet. The page sells a conversation, not a product.
- **For:** directors of private schools in Caracas first; teachers and representantes second.
- **Main action:** "Agenda una conversación", opening WhatsApp with a prefilled message to +58 424 279 9280. Email as the second channel: **[CORREO PENDIENTE]**.
- **Contact and location:** WhatsApp above; Caracas, Venezuela. No street address.
- **Offers and prices:** none on the page. The business model is undecided.
- **Language:** Venezuelan Spanish, **usted** with the reader. Warm and direct, no corporate filler, no em dashes.
- **Real proof available:** the founder, Christian Corrie, named and pictured. No schools, testimonials, numbers or client logos, because none exist yet.

## REFERENCES AND PICKS
- References: `explore/references.md`.
- Picked from exploration (judge's synthesis, approved):
  - **Promise:** the headline from 1 El hilo.
  - **Voice:** the letter and the numbered principles from 3 Manifiesto.
  - **Proof:** the school-day timeline from 5 El día.
  - **Closing:** the dark board from 6 Pizarra.
- Signature interaction chosen: **the thread**. It runs down the school-day timeline.
- Left out:
  - the split screen of 2, because it fails on phones
  - the lined paper and paper plane of 4, which add noise and weight
  - the giant C of 6

## DESIGN

**The idea.** A single mango thread, the cord of the logo's tassel, carries a school day from the aula to the casa, told as a calm letter to a director.

**Fonts.**
- **Bricolage Grotesque 700:** headings only. Self-hosted as one Latin subset WOFF2 of about 20 KB, with `font-display: swap`.
  - Hero at clamp(50px, 9.2vw, 132px), line-height 0.95.
  - Section titles at clamp(34px, 5vw, 64px).
  - Tracking -0.02em, sentence case.
- **Body:** the phone's own system font (system-ui), 18px on desktop and 17px on phones, line-height 1.6. Zero download.

**Colors.**
| Name | Hex | Job |
|---|---|---|
| Papel | #F5EFE3 | Page background |
| Pizarra | #17363A | All text, headings, drawn phone frames |
| Pizarra noche | #10282B | Closing section background (matches the dark logo file) |
| Mango | #E59A2F | The main button, the thread, lit timeline dots, the status dot. Never body text. |
| Salvia | #A9C2B4 | The unlit part of the thread, dashed "estamos explorando" box |
| Tiza | #56625E | Secondary text, captions |

Guayaba (#D4614A) is not used on this page. Status colors for the app (present, absent, late) are an app decision, not a site one.

**The signature object: the thread.**
- **Drawing:** an inline SVG line running down the left of the timeline. The full rail is in Salvia, with a thicker Mango line drawn over it.
- **Motion:** as each hour (7:15, 9:30, 11:00, 13:00) enters the screen, the mango line grows down to it and that dot fills Mango.
- **Look:** flat and matte, no glow, no shadow. It is the same cord as the tassel in the logo and the line in the logo video.
- **Fallback:** without JavaScript, with reduced motion, or on a browser without IntersectionObserver, the thread is fully drawn and every dot is lit.

**Sections (top to bottom).**
1. **Hero:** a nav with the logo and a short button ("Conversemos" on phones, "Agenda una conversación" on desktop).
   - The headline "Lo que pasa en el aula, llega a la casa." is set huge and left-aligned, with "casa." in Mango.
   - A margin note in Tiza with a Mango rule: "Para directores de colegios en Caracas...".
   - The main button, plus a status line: a Mango dot and "miCole está en construcción".
   - No phone and no image, so the first screen is just type and paints instantly.
2. **The problem, as a letter:** one large paragraph about WhatsApp groups, the teacher's personal number, messages at any hour, and circulares that may have stayed in the morral. It ends in bold: "un lugar del colegio, no del teléfono de alguien."
3. **A school day (the signature):** "Un día de colegio, contado a la casa."
   - Four stops on the thread: 7:15 asistencia, 9:30 lo que pasó en clase, 11:00 circular, 13:00 tarea.
   - Each stop has a small drawn phone showing one card.
   - Each phone is captioned "Ilustración del concepto" outside the frame, and the section ends with "Día de ejemplo".
   - The thread grows down this section.
4. **Built for here:** four numbered commitments, then a dashed box headed "Lo que estamos explorando" (see the claim boundary below).
5. **Who is behind it:** Christian's photo, a short first-person quote and signature: "Christian Corrie, Fundador de miCole". Default position: just before the closing (switchable to right after the hero).
6. **Closing:** "¿Lo conversamos?" on Pizarra noche (switchable to Papel).
   - Honest line: "Estoy conversando con directores para construirla..."
   - Button: WhatsApp, with the prefilled message.
   - Self-aware note: "Sí, por WhatsApp, mientras miCole no existe."
   - Email, then a footer with the dark logo and "Caracas, Venezuela".

The main action appears three times: nav, hero and closing.

**Motion.**
- **The only real moment:** the thread along the school day.
  - **Trigger:** each stop entering the screen (IntersectionObserver), so the scroll is never pinned or hijacked.
  - **Animation:** only transform and opacity, or the SVG stroke-dashoffset. About 400 ms per step, ease-out.
  - **Resting state:** fully drawn.
- **Everything else is subtle:** sections fade up 12px once, and buttons darken slightly on press. Nothing else moves.
- **`prefers-reduced-motion`:** no animation at all. The thread and the dots appear complete.

## CLAIM BOUNDARY (what the page may promise)
Everything about the product is in future tense, from the founder's point of view.
- **Committed** (from the brief's own facts):
  - Teachers will post classroom updates and take attendance from their phone.
  - Representantes will follow their child.
  - Nobody will have to share their personal WhatsApp.
  - It will be built around lapsos, boletines, 1 to 20 grading and secciones, for mid-range Android phones.
  - "Se podrá publicar sin conexión; se enviará cuando vuelva el internet."
- **"Lo que estamos explorando"** (shown as ideas, never as features):
  - QR sign-up for representantes
  - knowing which representantes saw a circular
  - each school choosing whether it uses grades and attendance
- **Never on the page:**
  - "gratis" or any price
  - "sin trabajo extra"
  - "cada circular le llegará a cada representante"
  - "✓ Recibida" badges
  - "muy pronto" or any launch date
  - any school name, number of users or testimonial
  - the name of the school where Christian teaches

## BUILD
- **Files:** one long page in plain files: `index.html`, `style.css`, `script.js`. No framework, no build step.
- **Weight:** under 500 KB in total without photos. Expected: about 40 KB of HTML, CSS and JS, about 20 KB of font, about 30 KB of logo and favicon. Christian's photo will be compressed to under 80 KB as WebP at 2x for a 260px slot, with a JPEG fallback.
- **Readable before any script runs:** all content is in the HTML and nothing is hidden waiting for JavaScript. The script only adds the thread animation.
- **Real copy:** no invented facts. Every missing fact is a marked placeholder, listed at the end.
- **Meta and sharing:** title, description, share image (built from the logo and headline), favicon set and theme color.
- **Verification:** in a browser at 390, 820 and 1440 px, plus a slow-phone simulation (CPU throttled 4x, slow 3G). The signature has to run smoothly there.
- **Nothing goes online** without an explicit "proceed".

## PLACEHOLDERS SO FAR
1. **[CORREO PENDIENTE]:** the email for the second contact channel.
2. **[FOTO DE CHRISTIAN]:** a portrait, ideally in natural light, shoulders up, about 4:5.
3. **[FRASE PERSONAL]:** one or two sentences, in your words, on why you started miCole. (I won't write this for you; it has to be yours.)

## OPEN QUESTIONS
- Is "docente de sexto grado en un colegio de Caracas" fine to say publicly, without naming the school? It is the default.
- The main button opens a WhatsApp chat, while its label says "Agenda" (scheduling). The judge flagged the mismatch. It is kept because it was your label; say if you prefer "Escríbame por WhatsApp".
- Domain and hosting are decided at the end (options will be laid out then).
