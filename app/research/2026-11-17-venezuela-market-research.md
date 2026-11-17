# miCole: Venezuela market and product research

Date: 2026-11-17. Scope: private schools in Caracas first, then Venezuela. Method: web research (Venezuelan press, vendor pricing pages, official documentation), with comparable LatAm markets where Venezuelan data does not exist.

**How to read this report.** Every figure is labeled:
- **[Sourced]**: taken from a cited source (which may itself be a gremio estimate, not an official statistic).
- **[Estimate]**: my own reasoning from sourced inputs. Treat these as hypotheses to check with directors.

**Research limitation.** Several Venezuelan news sites (eldiario.com, lapatilla.com) could not be opened directly from this research environment, so figures from them come from search-engine summaries of those articles, not from reading the full article. They are cited with their URLs; confirm the exact wording before quoting them to a director.

**Context that changes the picture in 2026.** After the US operation of 3 January 2026 that removed Nicolás Maduro, an interim government took over ([La Nación](https://www.lanacion.com.ar/el-mundo/la-justicia-venezolana-declaro-la-asuncion-de-delcy-rodriguez-como-presidenta-interina-nid04012026), [Bloomberg Línea](https://www.bloomberglinea.com/latinoamerica/venezuela/venezuela-enfrenta-un-incierto-traspaso-de-poder-tras-la-captura-de-maduro/)). In April 2026 the US Treasury lifted sanctions on the BCV and three state banks ([Teletica / DW](https://www.teletica.com/internacional/ee-uu-levanta-sanciones-al-banco-central-de-venezuela_406882)), but sanctions remain as a control tool ([El Diario, Aug 2026](https://eldiario.com/2026/08/28/sanciones-seguiran-ahora-sirven-para-controlar-venezuela/)). The official exchange rate roughly doubled in the first half of 2026, from 301 to 623 Bs/USD ([Finanzas Digital](https://finanzasdigital.com/dolarizacion-formal-venezuela-2026/)). Power rationing worsened during 2026 ([Local10/AFP](https://www.local10.com/espanol/2026/08/19/apagones-y-racionamientos-electricos-alteran-la-vida-diaria-de-los-venezolanos/)). Plan for volatility: prices, payment rails and infrastructure can all change within one school year.

---

## Executive summary

1. **The core problem is real, but the paying customer is poor and has free alternatives.** Directors already use WhatsApp, email and Google Classroom at zero cost, and ClassDojo is free in Spanish and added schoolwide tools in July 2026. miCole does not compete on features; it competes on *control, proof and calm*: proof that families read the circular, office hours that protect teachers, and avisos that land in coordinación with a trace. If a director does not feel those three pains strongly, they will not pay.
2. **Price low and in USD, as a share of a teacher's salary, not as a SaaS benchmark.** A private-school teacher in Venezuela earns about $330 to $380 a month [Sourced]. A director will compare miCole's fee to that number. A realistic range is **$3 to $6 per student per year** (roughly $75 to $200 a month for a 300 to 400 student school) [Estimate]. Anything above about half a teacher's salary per month will be a hard sale for most schools.
3. **Read confirmation only has value if most families are actually on the app.** The whole pitch collapses at 40% parent adoption. The first pilot must measure, before anything else: what share of families activated within two weeks, and what share of circulares were read within 48 hours. Onboarding (QR or code per family, multiple children per family, email fallback) matters more than any extra feature.
4. **Market size [Sourced + Estimate]:** about 3,900 private schools nationally in 2023-24 (ANDIEP), about 1 million private students (ANDIEP, 2025), roughly 12% to 15% of all students. Gran Caracas likely has 500 to 800 private schools, of which perhaps 150 to 300 can plausibly pay for software [Estimate].
5. **Realistic revenue at 5 to 10 schools is about $700 to $2,000 a month** [Estimate]. That is meaningful money in Venezuela (several teacher salaries) but it is a small business, not a venture-scale company. Plan it as such.
6. **Running costs are low:** under $100 a month at 10 schools if built on Supabase or Firebase, with push via FCM (free) and email as fallback [Estimate]. Avoid SMS and WhatsApp API messages as a default channel; they would eat most of the margin.
7. **Cut now:** Instagram auto-posting (legal and Meta review burden, LOPNNA art. 65 risk), Google Classroom integration (OAuth verification and admin approval per school), portable teacher profile, student records that follow the student. None of these help close the first five schools.
8. **Build as a PWA first, with email fallback; add a Play Store wrapper later.** Tecno, Infinix and Xiaomi phones (a large share of the Venezuelan market) aggressively kill background apps, so push is unreliable. Design for "I open the app when I want" plus a daily email digest of unread circulares, not for real-time push.
9. **Collecting money is solvable but needs a decision early:** Stripe does not serve Venezuelan entities. Options are invoicing locally (RIF, factura, Bs at BCV rate or USD cash), Zelle into a US account, or USDT. Most schools will need a valid factura, which points to a Venezuelan registered entity or firma personal. Talk to a Venezuelan accountant before the first paid contract.
10. **Timing:** decisions about next year's costs happen roughly April to July. The realistic path is: director conversations now, an MVP by February 2027, a free pilot in lapso 3 (April to July 2027), first paid contracts starting September 2027, and 5 to 10 paying schools by mid 2028 [Estimate].

---

## 1. Market

### 1.1 How many private schools and students

| Figure | Value | Type | Source |
|---|---|---|---|
| Private schools nationally, 2017-18 | at least 5,100 | Sourced (gremio estimate) | Consenso Educativo, via [Finanzas Digital](https://finanzasdigital.com/fenasopadres-ajustes-matricula-colegios-privados-venezuela-ano-escolar-2025-2026/) |
| Private schools nationally, 2023-24 | about 3,900 (about 1,200 closed in 6 years) | Sourced (ANDIEP) | [El Diario, Feb 2024](https://eldiario.com/2024/02/09/ninos-inscritos-sistema-privado-venezuela-retirado-migracion/) |
| Private students | "more than 3 million in 2018, only 1 million now" | Sourced (ANDIEP, April 2025) | [La Patilla](https://lapatilla.com/2025/04/07/educacion-privada-al-limite-alertan-sobre-la-drastica-disminucion-de-la-matricula-en-venezuela/) |
| Private share of school population | about 12% (Fenasopadres); about 15% (2023 source) | Sourced | [Finanzas Digital](https://finanzasdigital.com/fenasopadres-ajustes-matricula-colegios-privados-venezuela-ano-escolar-2025-2026/), [El Diario 2024](https://eldiario.com/2024/08/05/ley-proteccion-pensiones-aumento-matriculas-colegios-privados/) |
| Students withdrawn from private schools due to migration (2023-24) | at least 10% | Sourced (ANDIEP) | [El Diario](https://eldiario.com/2024/02/09/ninos-inscritos-sistema-privado-venezuela-retirado-migracion/) |
| Total students 2026-27 start | "more than six million" | Sourced (MPPE, via press) | [Bloomberg Línea](https://www.bloomberglinea.com/latinoamerica/venezuela/regreso-a-clases-en-venezuela-sera-el-14-de-septiembre-asi-queda-el-calendario-escolar-2026-2027/) |
| Last official INE education statistics | 2017-18 (7,664,869 students); no MPPE Memoria y Cuenta since 2015 | Sourced | [Venamcham report](https://www.venamcham.org/wp-content/uploads/2023/08/Reportaje-Educarse-bajo-la-mano-del-Estado-parte-I.pdf) |

**Skeptical note.** The ANDIEP "3 million in 2018" figure is inconsistent with a total of 7.66 million students and a private share of 12% to 15%. It probably mixes levels (including university) or is rhetorical. The 1 million figure today, with 6 million total students, gives about 16%, which fits the other estimates. Use "about 1 million private students, about 3,900 schools" and say these are gremio figures.

**Gran Caracas [Estimate].** No source gives a count for Caracas. Reasoning: Gran Caracas (Distrito Capital plus the metropolitan municipalities of Miranda) is about 12% to 15% of the national population, and private education is over-represented in the capital. Applying 13% to 20% to 3,900 schools gives **roughly 500 to 800 private schools**. Average size nationally is about 1,000,000 / 3,900 = **about 250 students per school** [Estimate]; Caracas schools that would buy software are likely larger, 300 to 1,000 students. Of those 500 to 800 schools, perhaps **150 to 300** charge enough (above roughly $100 a month) and are organized enough to pay for software [Estimate]. That is the realistic addressable market in Caracas. It is small: 10 schools would already be 3% to 7% of it.

**Trend.** The sector shrank sharply from 2018 to 2024 (closures, migration). In 2026 gremios expected stable enrollment for 2026-27 ([El Diario, June 2026](https://eldiario.com/2026/06/17/colegios-privados-matriculas-ano-escolar-2026-2027/)). Schools are fragile businesses: one gremio source spoke of schools planning for 40% morosidad ([Finanzas Digital](https://finanzasdigital.com/morosidad-golpea-a-colegios-privados-y-pone-en-riesgo-la-educacion/)), and one school justified a fee increase with 80% morosidad (via El Diario summary, [link](https://eldiario.com/2025/07/29/colegios-privados-gran-caracas-aumentaron-precios-nuevamente-dolares/); figure unverified).

### 1.2 How schools are structured

- **Levels:** Educación inicial (preescolar), primaria (1ro to 6to grado), educación media general (1ro to 5to año, "bachillerato"). Each grade is split into **secciones** (A, B, C). [Sourced in general terms: [state university overview](https://education.stateuniversity.com/pages/1663/Venezuela-EDUCATIONAL-SYSTEM-OVERVIEW.html)]
- **School year:** September to July. The 2026-27 year started on 14 September 2026 ([Bloomberg Línea](https://www.bloomberglinea.com/latinoamerica/venezuela/regreso-a-clases-en-venezuela-sera-el-14-de-septiembre-asi-queda-el-calendario-escolar-2026-2027/)). It is divided into **three lapsos** (roughly Sept to Dec, Jan to Mar/Apr, Apr to July). Exact 2026-27 lapso dates were not found; Christmas break reported as 15 Dec to 12 Jan (single source, NTN24).
- **Grading:** media general uses a **1 to 20 scale, 10 to pass** ([Academic grading in Venezuela](https://kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Academic_grading_in_Venezuela)). Inicial and primaria use mainly qualitative/descriptive evaluation (literales A to E in primaria are common practice; I could not find the current MPPE resolution, so verify).
- **Roles that matter for miCole:** Dirección, Coordinación (often one per level: primaria, media), docente guía per sección in primaria, subject teachers in media, secretaría/administración (cobranza), and the **representante** (legal guardian, the term schools use for the parent).
- **Subvencionados vs. independent:** some private schools (many Catholic AVEC schools) receive state payroll support and charge less. They are a different buyer with less money ([El Diario, Aug 2026](https://eldiario.com/2026/08/10/colegios-privados-caracas-tarifas-ano-escolar/)).

### 1.3 Tuition in Caracas (USD), 2024 to 2026

| School year | What was reported | Type | Source |
|---|---|---|---|
| 2025-26 | West and center of Caracas: inscripción $120 to $300, mensualidad **$45 to $75** | Sourced | [El Diario, July 2025](https://eldiario.com/2025/07/29/colegios-privados-gran-caracas-aumentaron-precios-nuevamente-dolares/) |
| 2025-26 | Further east: inscripción over $1,000, mensualidad **over $250** | Sourced | same |
| 2025-26 | A family in El Hatillo with three children: about $4,000 in inscriptions and almost $1,000 per month | Sourced (anecdote) | same |
| 2026-27 | Examples: $225/month (Montalbán, set by asamblea), $228/month plus $500 inscripción (El Paraíso), $360/month base ($330 with early payment), media general $280/month with inscripción $1,470 to $1,560; inscriptions range $225 to $1,560 | Sourced | [El Diario, Aug 2026](https://eldiario.com/2026/08/10/colegios-privados-caracas-tarifas-ano-escolar/) |

**Reading [Estimate].** Caracas private schools span roughly three tiers: low-cost and subvencionado ($30 to $80/month), middle ($100 to $250/month), and upper ($250 to $500+/month, with international schools above). miCole's natural buyer is the **middle and upper-middle tier**: enough money, enough families with smartphones and email, and enough communication volume to feel the pain.

### 1.4 How tuition is paid

- Fees are **set in USD but payable in bolívares at the BCV rate of the day of payment**. Paying in foreign currency cannot legally be mandatory ([El Diario 2025](https://eldiario.com/2025/07/29/colegios-privados-gran-caracas-aumentaron-precios-nuevamente-dolares/), [Diario de Los Andes / Sundde](https://diariodelosandes.com/sundde-realizara-revision-por-cobros-de-matriculas-en-colegios-privados), [2020 resolution summary](https://www.traviesoevans.com/wp-content/uploads/2021/02/Alerta-Resolucion-Metodologia-Especial-calculo-de-mensualidades-de-Instituciones-Educ-Privadas-esp-septiembre-2-2020.pdf)).
- Typical channels: USD cash, bolívares by transfer or Pago Móvil, point of sale in the school; one Caracas school's 2024-25 inscription rules list "efectivo en divisas, bolívares, transferencias, punto de venta; no cheques ni tarjetas de crédito" ([school inscription PDF](https://www.colegiosanignacio.com.ve/portal/cem/images/content/k2-component/Recaudos_Proceso_de_Inscripcion_24-25.pdf)). Zelle is widely used informally for USD between people with US accounts [Estimate, common practice; no source found with a share].
- Mensualidades are calculated by a regulated methodology tied to payroll and approved in an **asamblea** with representantes ([ANDIEP explanation via El Diario](https://eldiario.com/2024/06/05/andiep-aumento-mensualidad-escolar-ley-de-pensiones/), [Acceso a la Justicia](https://accesoalajusticia.org/metodologia-a-seguir-para-la-fijacion-de-la-matricula-en-instituciones-de-educacion-privadas/)). Implication: **any new cost a school takes on competes with salaries in a publicly discussed budget.** That is a big constraint on price.
- Since 2024 the Ley de Protección de Pensiones added a payroll tax that schools passed on (about 6% to 7% per ANDIEP) ([El Diario](https://eldiario.com/2024/06/05/andiep-aumento-mensualidad-escolar-ley-de-pensiones/)).

### 1.5 How big a school's software budget realistically is

No Venezuelan data exists [none found]. Reasoning [Estimate]:

- **Anchor 1: teacher salary.** Private-school teachers earn about $330 to $380 a month (integral) in 2026 ([Finanzas Digital](https://finanzasdigital.com/ingreso-docente-sector-privado-venezuela-2026/), [El Diario](https://eldiario.com/2026/06/02/salario-docentes-colegios-privados/)). Directors think in "how many teachers is this".
- **Anchor 2: share of revenue.** In the US, communication platforms cost $3 to $8 per student per year (Bloomz $3 to $7, Seesaw about $7 to $7.75) against tuitions of $10,000+; that is well under 0.1% of revenue. A Caracas school at $150/month x 10 to 12 months = $1,500 to $1,800 per student per year; 0.25% to 0.35% of that is **$4 to $6 per student per year**.
- **Anchor 3: what they pay today.** Most pay $0 for communication (WhatsApp, Gmail/Outlook, Classroom). Some pay for an administrative system (control de estudios, cobranza); prices unknown, ask.

**Conclusion [Estimate]:** for a 300 to 400 student middle-tier school, a communication tool is plausibly worth **$75 to $200 a month**, i.e. a quarter to half a teacher salary. Upper-tier schools of 600 to 1,000 students could pay $200 to $400. Low-cost schools will pay little or nothing.

---

## 2. Competitors and substitutes

### 2.1 What Venezuelan schools actually use today

No survey exists [none found]. From press, the brief and regional patterns [Estimate]:

| Tool | Use in Venezuelan private schools | Cost to school | Notes |
|---|---|---|---|
| **WhatsApp groups** (per sección, plus teacher-parent 1:1) | Near universal | $0 | WhatsApp is the most used social network in Venezuela, over 92% of users per one Venezuelan academic source ([LUZ](https://produccioncientifica.luz.edu.ve/index.php/rluz/article/download/42636/49704)). Known problems everywhere: message overload, conflict, misinformation, teachers reachable at night ([Diario Uno](https://www.diariouno.com.ar/sociedad/grupos-whatsapp-padres-pesadilla-docentes-y-alumnos-n227732), [INCIBE](https://www.incibe.es/index.php/menores/blog/madres-padres-profesores-y-sus-grupos-de-whatsapp)). |
| **Email circulares** (Outlook or Gmail, often to a school email for the student) | Common in middle/upper tier | $0 to low | Low read rates, no proof of reading. |
| **Google Classroom / Workspace for Education Fundamentals** | Common, especially bachillerato | $0 for eligible schools ([Google](https://edu.google.com/intl/ALL_ec/workspace-for-education/classroom/editions)) | Student-facing, not parent-facing; guardian email summaries exist but are weak. |
| **Microsoft Teams / Office 365 A1** | Some schools | $0 today | Microsoft announced in Nov 2026 it will retire free Office 365 A1; the replacement A0 reportedly drops Teams and Exchange, effective at renewals from 1 Jan 2028 ([gHacks](https://www.ghacks.net/2026/11/10/microsoft-will-retire-free-office-365-a1-email-for-schools-moving-them-to-an-a0-plan-without-exchange-or-teams/), [lazyadmin](https://lazyadmin.nl/office-365/microsoft-retires-office-365-a1-and-student-use-benefit/)). Secondary sources; verify. A small opening for 2028, not now. |
| **Local admin systems** (control de estudios, cobranza, boletas) | Unknown share | Unknown | One Venezuelan product found: "Educa" by Internacional de Sistemas Empresariales (Maracaibo), studied in 26 institutions in a 2023 paper ([Innovaciones Educativas](https://doaj.org/article/d3e6331f5c0445d3aec62cc9e16a16f9)). Many schools likely use spreadsheets, desktop systems or custom builds. **Ask every director what they use.** |
| **Paper** (cuaderno de comunicaciones, justificativos) | Common in primaria | $0 | |

### 2.2 International and LatAm products

| Product | What it is | Price | Status / relevance |
|---|---|---|---|
| **ClassDojo** | Class and school communication, stories, messaging, translation | Free for schools, teachers, families; parents can buy Plus (about $5 to $15/month depending on source and year) ([ClassDojo Translate](https://blog.classdojo.com/introducing-classdojo-translate/), [myengineeringbuddy review](https://www.myengineeringbuddy.com/blog/classdojo-reviews-alternatives-pricing-offerings/)) | **Biggest free threat.** Spanish (Latin America) UI, schoolwide tools launched July 2026 ([K-12 Dive](https://www.k12dive.com/press-release/20260713-classdojo-expands-beyond-the-classroom-with-new-schoolwide-tools-for-school/)), Spanish leaders page ([ClassDojo es-mx](https://www.classdojo.com/es-mx/school-leaders)). Weak points for Venezuela: generic, not built for representantes/secciones/lapsos, no office-hours enforcement for the school, US company with student data abroad. |
| **Seesaw** | Student portfolio plus family communication, primaria | About $7.00 to $7.75 per student per year (2025-27 consortium pricing) ([ACTEM consortium](https://actem.wildapricot.org/seesaw)); free "Starter" tier ([Seesaw](https://seesaw.com/pricing-packages/free-changes/)) | Pedagogical tool more than school comms. |
| **Edmodo** | Former free LMS | Shut down 22 Sept 2022; all data deleted ([EdSurge](https://edsurge.com/news/2022-08-16-popular-k-12-tool-edmodo-shuts-down), [Wikipedia](https://en.wikipedia.org/wiki/Edmodo)) | **Useful sales lesson:** directors who lost content in Edmodo will ask "what if you disappear?". Have a data export answer. |
| **Schoology** (PowerSchool) | LMS | Quote-based, district oriented | Not relevant for Caracas private schools [Estimate]. |
| **Bloomz** (US) | School-family communication | $3, $5, $7 per student per year by tier, free for parents ([Bloomz pricing](https://www.bloomz.com/bloomz-pricing)) | **Best public price benchmark** for a comms-only product. |
| **ParentSquare, Brightwheel** (US) | Comms (district) / childcare | Quote-based ([Pulse Signal](https://getpulsesignal.com/pricing/parentsquare)) | Not relevant except as feature reference. |
| **Phidias, Cerebrum, Ciudad Educativa** (Colombia) | Full school management incl. parent comms | Quote-based, per module ([OpenEduCat overview](https://openeducat.org/solutions/school-management-system-colombia/), vendor marketing) | Shows that in LatAm, comms is usually sold **inside** a management suite. |
| **SieWeb** (Peru) | School intranet + app, about 300 schools, integrated tuition payments ([Mercado Negro](https://mercadonegro.pe/noticias/padres-de-familia-podran-pagar-pensiones-de-colegios-en-bodegas-y-tiendas-tambo)) | Not public | Same pattern: comms plus payments. |
| **Lirmi + Papinotas** (Chile) | Libro de clases + family comms; over 2,000 schools in LatAm ([DF](https://www.df.cl/df-mas/punto-de-partida/la-edtech-mas-grande-de-chile-opera-desde-la-araucania-y-llega-a-mas-de)) | Not public | Merged; once offered the product free for 2 years to gain schools ([El Dínamo](https://www.eldinamo.cl/empren-d/2021/03/25/startup-lanza-version-gratuita-de-libro-de-clases-digital/)). |
| **Idukay** (LatAm) | All-in-one school ecosystem with payments, free for families ([App Store](https://apps.apple.com/app/id1633485231)) | Not public | |
| **Agenda Edu, ClassApp** (Brazil) | Digital school agenda + payments; Agenda Edu 3.5M users, bought by Bemobi in 2023 ([Bemobi](https://bemobi.com/solution/agenda-edu)) | Not public | Shows the winning model in Brazil: agenda + **payments**. |
| **Blended** (Argentina) | Comms plan and management plan, charged **monthly per student** to the school ([iProUP](https://www.iproup.com/innovacion/8816-emprendedor-ico-plataforma-Blended-app-de-gestion-escolar-argentina-factura-30-millones)) | Peso prices, old article | Confirms per-student-monthly as a regional norm. |
| **OpenEduCat** | Open-source ERP marketed for Venezuela ([OpenEduCat VE](https://openeducat.org/education-software-venezuela/)) | Modules from $69/year | University oriented; marketing claims of MPPE compliance unverified. |

### 2.3 What gap miCole fills, and where it is weak

**Real gap [Estimate]:** No product found is built for Venezuelan private schools specifically: Venezuelan vocabulary (representante, sección, lapso, coordinación, justificativo), low-data and offline-first design, enforced office hours, avisos de inasistencia as a structured flow, priced in USD at local levels and payable through local rails. The ClassDojo-style free tools are generic; LatAm suites are heavy, quote-based and not present in Venezuela as far as I could find.

**Where miCole is weak, honestly:**
1. **Free substitutes are "good enough" for many directors.** WhatsApp works, everyone has it, and it costs nothing. miCole must win on things WhatsApp structurally cannot do (proof of reading per family, office hours, school ownership of messages, no personal numbers, structured avisos). If a director does not care about those, there is no sale.
2. **Comms-only is a feature, not a category, in LatAm.** Regional winners bundle comms with grades, administration and especially **tuition payments** (SieWeb, Agenda Edu, Idukay). A director's biggest pain is likely **morosidad**, not circulares. miCole touches that only through "payment reminders", which is sensitive.
3. **Network effect is per school, and fragile.** The product only works if most families in a school join. One sección of non-users means Dirección still sends by email and WhatsApp, and miCole becomes a third channel.
4. **Single founder risk.** A school puts its communication on miCole; if the founder is sick, leaves the country or loses interest, the school loses its channel (the Edmodo fear).
5. **Teacher resistance.** "Dirección can read your conversations" can be sold as protection, or felt as surveillance. Teachers can silently sabotage adoption by continuing on WhatsApp.

---

## 3. Pricing

### 3.1 Models seen in the market

| Model | Who uses it | Fit for Caracas |
|---|---|---|
| **Per student per year, school pays** | Bloomz ($3 to $7), Seesaw (~$7 to $7.75), many LatAm suites | Good: scales with school size, easy to compare to tuition. |
| **Per student per month, school pays** | Blended (Argentina) | Good, but monthly billing in a volatile economy means monthly collection effort. |
| **Flat fee per school by size band** | Kinderpedia (about EUR 49 per center per month, [FitGap](https://us.fitgap.com/products/022035/kinderpedia)) | Good for directors who want one number. |
| **Freemium (free for teachers/families, paid upsell)** | ClassDojo, Seesaw Starter | Bad for a solo founder: needs huge volume. |
| **Parents pay** | ClassDojo Plus (optional extras) | **Risky. See 3.3.** |
| **Setup fee** | Common in LatAm suites (data migration, training) | Small or waived at the start; it slows the yes. |
| **Free first period / free for founding schools** | Lirmi offered 2 years free in 2021 | Good for 1 to 2 pilot schools only. |

### 3.2 What a Caracas school could plausibly pay [Estimate]

| School | Students | Tuition tier | Plausible monthly fee | Per student per year |
|---|---|---|---|---|
| Small middle-tier | 150 to 250 | $100 to $200/month | $50 to $90 | about $4 |
| Mid | 300 to 500 | $150 to $300/month | $100 to $200 | $4 to $5 |
| Large upper-tier | 600 to 1,000 | $250+/month | $200 to $400 | $4 to $5 |
| Low-cost or subvencionado | any | under $80/month | $0 to $40 | under $2 |

### 3.3 Who pays: school or parents

**Recommendation: the school pays. Do not charge parents directly.** Reasons:
- **Adoption:** any parent fee lowers activation, and read confirmation needs high activation.
- **Legal and political:** mensualidades follow a regulated methodology discussed in asamblea, Sundde reviews fees, and Fenasopadres actively contests increases ([Finanzas Digital](https://finanzasdigital.com/fenasopadres-ajustes-matricula-colegios-privados-venezuela-ano-escolar-2025-2026/), [Diario de Los Andes](https://diariodelosandes.com/sundde-realizara-revision-por-cobros-de-matriculas-en-colegios-privados)). An extra "app fee" can become a complaint against the school and against miCole.
- **Collection:** collecting $1 from 400 families is far more work than collecting $150 from one school.
- If a school chooses to include the cost in its own fee structure, that is the school's decision; miCole should not invoice families.

---

## 4. Realistic expectations

### 4.1 What a solo founder with AI tools can build, run and support

**Can build [Estimate]:** a PWA with auth, roles, circulares with read tracking, messaging with schedule rules, avisos, photo posts with compression, simple dashboards, CSV roster import, email notifications, and an admin panel. With AI tools and a managed backend (Supabase or Firebase), an MVP of circulares + read confirmation + families + avisos is a 6 to 10 week part-time build for someone already shipping the demo; messaging and momentos add 4 to 8 weeks each to production quality.

**Hard for one person:**
- **Security and privacy** of minors' data (row-level access rules per school, sección and family; mistakes here are reputation-ending). Get an outside review before real data.
- **Support.** Each school is 300 to 600 families. Expect 5% to 10% of families to need help in the first two weeks (forgot code, wrong child linked, two representantes, new phone) [Estimate]. With 5 schools that is 100 to 300 support contacts at onboarding, mostly in September. Design self-service (codes the school can reissue) and make secretaría the first line of support.
- **On-call.** If circulares fail on the morning classes are suspended, the school notices immediately. A solo founder who also teaches full time cannot answer at 10 a.m. on a Tuesday. This is the biggest operational contradiction in the plan.
- **Sales.** Directors buy from people they trust. The founder's credibility as a teacher and psychologist is a real asset in Caracas, but sales take in-person visits.

### 4.2 Sales cycle and calendar

- **School year:** September to July; three lapsos; Christmas break mid December to mid January.
- **Budget timing:** fees for next year are set and discussed with representantes roughly **April to July**, with inscriptions in July/August ([El Diario 2025](https://eldiario.com/2025/07/29/colegios-privados-gran-caracas-aumentaron-precios-nuevamente-dolares/), [El Diario 2022](https://eldiario.com/2022/07/17/colegios-privados-en-caracas-adelanto-en-dolares-cupos/)). A new recurring cost should be agreed **before** the school fixes next year's mensualidad.
- **Private schools are more flexible than public systems** and can buy mid-year ([Monetizely](https://www.getmonetizely.com/articles/how-do-edtech-saas-startups-align-with-educational-institution-budget-cycles)), but rolling out to families mid-year is harder than in September.
- **Realistic cycle [Estimate]:** 2 to 6 months from first conversation to yes, mostly waiting for the right moment in the calendar. Director, then often the owner or a junta directiva or the religious congregation decides.

### 4.3 Adoption risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Parents do not activate** | Read confirmation means nothing below about 80% activation | QR/code per family handed out in a reunión de representantes; activation dashboard per sección for Dirección; keep email circulares in parallel for one lapso, then stop |
| **Older parents and grandparents** (many children live with grandparents due to migration) | Low digital comfort; shared phones | Big text, no passwords, magic link or code; allow two or more representantes per child; a printed one-page guide |
| **Parents abroad** | Many representantes are outside Venezuela | Email login, no Venezuelan phone dependency; time zones irrelevant for read confirmations |
| **Teacher resistance to surveillance** | "Dirección reads my messages" | Tell teachers explicitly, show it in the UI ("Esta conversación es visible para Dirección"), frame as protection against unfair parent complaints; office hours as a teacher benefit. Ask teachers directly in validation. |
| **Teachers keep WhatsApp anyway** | Two channels, miCole loses | Dirección policy decision; miCole cannot fix this alone. Ask directors if they are willing to make it policy. |
| **Data cost** | Teachers earn about $380/month; a 6 GB Digitel plan was about $6.86 in Oct 2026 ([Finanzas Digital](https://finanzasdigital.com/tarifas-de-digitel-octubre-planes-paquetes/)) | Photos compressed to 100 to 200 KB, thumbnails, no video, text-first feed |

### 4.4 Realistic timeline [Estimate]

| Period | Milestone |
|---|---|
| Nov to Dec 2026 | 10 to 15 director conversations with the demo; 5 teacher and 10 parent conversations. Decide the MVP. |
| Jan to Feb 2027 | Build MVP on real backend (circulares + read + families + avisos). Security review. |
| Mar 2027 | Free pilot starts in 1 school, 2 to 6 secciones (start of lapso 3 is ideal, after Carnaval and before Semana Santa). |
| Apr to Jun 2027 | Pilot data: activation, read rates, avisos per week, teacher feedback. Add messaging with office hours if pilot is healthy. Pitch 5 to 10 schools for September with pilot evidence. |
| Jun to Jul 2027 | Sign first paid contracts for 2027-28 (target 2 to 4 schools). |
| Sep 2027 | Onboarding season: the heaviest support month. |
| By Jul 2028 | 5 to 10 paying schools if the pilot shows strong adoption. Ten is optimistic for one part-time founder. |

### 4.5 Realistic revenue at 5 to 10 schools [Estimate]

Assume 350 students per school, $5 per student per year, i.e. about $1,750 per school per year (about $146/month).

| Schools | Annual revenue | Monthly equivalent |
|---|---|---|
| 5 | $8,750 | about $730 |
| 10 | $17,500 | about $1,460 |
| 10 at $6/student and 450 students | $27,000 | about $2,250 |

Expect collection delays and some schools paying in bolívares at the BCV rate; real cash will be lower. This is roughly 2 to 6 private-teacher salaries per month: a meaningful income in Venezuela, not enough to hire a team.

### 4.6 Operating costs [Estimate]

Assumptions per school: 400 families, 20 secciones, each sección posts 4 photos per school day at about 200 KB, 180 school days; families view about 4 photos per day.

| Item | Cost at 1 school | Cost at 10 schools | Basis |
|---|---|---|---|
| Backend (Supabase Pro) | $25/month | $25 to $50/month | Pro is $25 base, includes 8 GB DB, 100 GB file storage, 250 GB egress ([Supabase docs](https://supabase.com/docs/pricing)) |
| Photo storage | about 3 GB/year | about 30 GB/year | within the 100 GB included |
| Photo egress | about 5 GB/month | about 50 GB/month | within 250 GB included; overage $0.09/GB |
| Alternative: Firebase Blaze | about $5 to $30/month | $20 to $80/month | Storage about $0.02/GB-month, downloads about $0.12/GB, Firestore reads beyond free tier ([Verdent guide](https://www.verdent.ai/guides/devtools/firebase-pricing), [Firebase pricing](https://firebase.google.com/pricing/?hl=en)) |
| Push notifications (FCM / Web Push) | $0 | $0 | FCM is no-cost ([Firebase pricing](https://firebase.google.com/pricing/?hl=en)) |
| Transactional email (digests, magic links) | $0 to $20/month | $20 to $35/month | Typical providers charge about $0.10 to $1 per 1,000 emails [Estimate] |
| WhatsApp Business API (if used for every circular) | about $90/month | about $900/month | Utility template about $0.011 to $0.013 per message in "Rest of LatAm" ([Meta](https://developers.facebook.com/docs/whatsapp/pricing), [SleekFlow](https://help.sleekflow.io/en_US/whatsapp/pricing)); 400 families x 20 messages/month. **Too expensive as a default.** |
| SMS | avoid | avoid | International SMS to Venezuela is costly and unreliable [Estimate] |
| Domain, Google Play ($25 once), Apple developer ($99/year) | about $15/month | about $15/month | |
| **Total (without WhatsApp/SMS)** | **about $40 to $70/month** | **about $70 to $130/month** | |

Infrastructure is not the problem. Time and support are.

---

## 5. What it can and cannot realistically do in Venezuela

### 5.1 Connectivity, data and power

- **Mobile speed:** improving but low. One aggregator puts Venezuela at about 29 Mbps mobile download, rank 97 ([datosmundial](https://www.datosmundial.com/america/venezuela/telecomunicacion.php)); in 2023 Ookla showed about 9 Mbps and rank 139 ([DPL News](https://dplnews.com/venezuela-esta-fuera-del-top-100-en-el-ranking-de-velocidad-de-internet-movil/)). Movistar won Ookla's best network award for H1 2026 ([El Diario](https://eldiario.com/2026/09/02/movistar-venezuela-reconocida-ookla-mejor-red-movil-venezuela/)). Venezuela had only about 1% 5G shipments ([Counterpoint via search](https://counterpointresearch.com/de/insights/latam-smartphone-shipments-q1-2026)).
- **Data cost:** about $1.15 per GB on a 6 GB Digitel plan in Oct 2026 ([Finanzas Digital](https://finanzasdigital.com/tarifas-de-digitel-octubre-planes-paquetes/)); mobile spending is about 12% of income per ITU-based data ([datosmundial](https://www.datosmundial.com/america/venezuela/telecomunicacion.php)). Every MB matters for a teacher earning $380.
- **Power:** in 2026 rationing spread; reports conflict on whether Caracas was exempt in August, while an EFE-cited figure says 82% of Caracas households had daily interruptions by September ([Local10/AFP](https://www.local10.com/espanol/2026/08/19/apagones-y-racionamientos-electricos-alteran-la-vida-diaria-de-los-venezolanos/), [Emol](https://www.emol.com/noticias/Internacional/2026/10/10/1213792/venezuela-cortes-electricidad-protestas.html), [El Diario](https://eldiario.com/2026/09/05/crisis-electrica-venezuela-2/)). When power fails, home Wi-Fi fails and cell towers degrade.

**Implications:** offline-first (queue posts and avisos, send when connected), tiny first load (the demo's 300 KB target is right), aggressive image compression, no video, and **urgent notices must also go by email** because a family might not open the app that day.

### 5.2 Phones and push notifications

- **Market:** StatCounter-based figures for May 2025 showed Tecno 31.6%, Xiaomi about 19%, Infinix 16.6%, Samsung 14.2% ([Finanzas Digital](https://finanzasdigital.com/mercado-movil-venezuela-tecno-xiaomi-samsung/)); a May 2026 StatCounter view showed Samsung 18.5%, Apple 16.6%, Xiaomi 15.4%, Tecno 12.1% ([StatCounter](https://gs.statcounter.com/vendor-market-share/mobile-tablet-console/venezuela)). The sources disagree; either way, **budget Transsion (Tecno, Infinix) and Xiaomi phones dominate**, and iPhones are a meaningful minority, likely larger among private-school parents [Estimate].
- **Push reliability:** Tecno's HiOS and Xiaomi's MIUI kill background apps; dontkillmyapp says for Tecno there is "no known solution on the developer end", only user settings ([dontkillmyapp Tecno](https://dontkillmyapp.com/tecno)); FCM high-priority messages help on some brands ([Pushy](https://support.pushy.me/hc/en-us/articles/360043864791)). Huawei phones without Google services cannot use FCM at all ([TechEconomy](https://techeconomy.ng/huawei-phones-without-google-play-store-what-you-can-and-cant-do-in-2026)); small share in Venezuela.
- **iOS PWA push** only works when the PWA is added to the Home Screen (iOS 16.4+); there is no install prompt ([MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide), [Pushpad](https://pushpad.xyz/blog/ios-special-requirements-for-web-push-notifications)).

**Recommendation:** PWA first (no store review, instant updates, works on any phone, matches the demo), plus a **daily email digest of anything unread**, plus a Play Store wrapper (TWA or Capacitor) later because many parents trust "the app from the store" more than a link [Estimate]. Never promise "notificación inmediata". Promise "queda registrado y le avisamos".

### 5.3 App stores vs. PWA

| | PWA | Play Store (TWA/Capacitor) | App Store |
|---|---|---|---|
| Cost | $0 | $25 once | $99/year |
| Review delays | none | days | days, stricter (and Apple scrutinizes apps for children) |
| Push | Android OK (subject to battery killers), iOS only if installed to Home Screen | FCM, same battery issues | APNs, reliable |
| Trust with parents | lower ("un link") | higher | higher |
| Recommendation | Launch | Add for the first paid schools | Only when iPhone share at paying schools justifies it |

### 5.4 Getting paid

- **Stripe:** not available to Venezuelan-based businesses; creators in Venezuela report Stripe and PayPal as blocked or unusable ([DEV Community](https://dev.to/global-creator-lab/payment-alternatives-for-digital-creators-in-venezuela-are-not-as-scarcely-reliable-as-youve-been-5c7c)). Not needed anyway: schools do not pay software by card.
- **How schools pay suppliers [Estimate]:** bolívares by transfer at the BCV rate against a **factura fiscal**, USD cash, or Zelle from a US account. Schools need facturas for their accounting and for the asamblea cost justification.
- **Options for miCole:**
  1. **Venezuelan firma personal or company with RIF, invoicing in USD equivalent payable in Bs at BCV rate** (matches how schools pay everything else). Requires SENIAT-compliant invoicing and IVA (16%) handling ([Edicom](https://edicomgroup.com/blog/digital-invoicing-venezuela)). Exposes revenue to devaluation between invoice and conversion: convert quickly.
  2. **Zelle into a US account** (if the founder or a partner has one). Easy for schools that hold USD abroad, but usually no Venezuelan factura; some schools will refuse.
  3. **USDT (Binance P2P / Binance Pay)**: widely used by individuals ([Deel](https://www.deel.com/es/blog/stablecoin-cobrar-en-dolares-desde-venezuela/)), but awkward for a school's accounting and carries regulatory ambiguity; note the 2026 OFAC licensing framework explicitly excludes crypto payments for the licensed transactions it covers ([El Diario summary](https://eldiario.com/2026/04/15/sanciones-bcv-economia-venezuela/)). Not recommended as the main rail.
  4. **US LLC** (for later, if expanding beyond Venezuela). Adds cost and tax complexity; not needed for the first 10 schools.
- **Bank APIs for Pago Móvil** exist (Activo, Mercantil C2P, Banco de Venezuela) ([Ecosistema Startup](https://ecosistemastartup.com/activo-banco-universal-lanza-apis-para-empresas-en-venezuela/), [Odoo Mercantil module](https://apps.odoo.com/apps/modules/19.0/l10n_ve_pos_mercantil_c2p)). Relevant only if miCole ever processes tuition, which it should not do soon.
- **Action:** one paid hour with a Venezuelan accountant before the first contract: entity type, factura, IVA, how to price in USD legally.

### 5.5 Legal and data considerations (not legal advice; get a lawyer's read)

- **No general data protection law in Venezuela.** Protection comes from **Constitution art. 28 (habeas data)**, enforced case by case by the Sala Constitucional ([TSJ cases on vLex](https://vlexvenezuela.com/vid/andi-starlyn-segovia-andrade-283240887); [DataGuidance](https://www.dataguidance.com/taxonomy/term/176)). Practical meaning: families have a constitutional right to know, correct and delete data about them and their children. Build "export my data" and "delete" from day one.
- **LOPNNA art. 65:** children and adolescents have the right to honor, reputation, own image, private life and family intimacy; no arbitrary interference ([cited text via La Patilla](https://lapatilla.com/2016/05/26/introducen-amparo-constitucional-contra-diosdado-cabello/), [Crónica Uno via Diario de Los Andes](https://diariodelosandes.com/procesos-judiciales-de-acoso-escolar-deben-mantenerse-bajo-confidencialidad)). Courts apply it to public exposure of minors. Cecodap warned about overexposure of children's photos online in 2026 ([El Diario](https://eldiario.com/2026/07/07/proteccion-ninos-emergencias/)). **Photos of children are the single biggest legal risk in the product.** Required: per-student photo consent recorded by the school, consent visible to the teacher at posting time (the demo does this), gallery visible only to the sección's families, no public sharing.
- **Ley Especial contra los Delitos Informáticos (2001)** penalizes violating the privacy of personal data [from general knowledge; verify the exact articles with a lawyer].
- **Ownership:** the school is the data controller; miCole is the processor. Put that in a short written agreement with each school (who owns the data, what happens at contract end, export format, deletion within N days).
- **"Messages belong to the school"** must be disclosed to teachers and parents in plain Spanish at onboarding.
- **MPPE rules on student records:** I found no public, current MPPE rules about third-party platforms; official records (matrícula, boletas, certificaciones) go through MPPE processes. **Do not touch grades or official records in v1.** That keeps miCole out of MPPE's regulatory scope.
- **State attitude to platforms:** the TSJ backed a $10M fine on TikTok in a child-safety case ([Acceso a la Justicia](https://accesoalajusticia.org/tsj-respalda-gobierno-multa-tiktok-10-millones-dolares/)). Children's online content is politically visible.
- **Where data lives:** Supabase/Firebase in a US or São Paulo region is normal practice; tell schools where data is stored.

### 5.6 Instagram and Google Classroom feasibility

- **Instagram Graph API publishing:** requires a professional account; publishing for accounts you do not own requires Advanced Access through **App Review and Business Verification** ([Meta Content Publishing docs](https://developers.facebook.com/docs/instagram-platform/content-publishing/), [Meta overview](https://developers.facebook.com/documentation/instagram-platform/overview.md)); about 50 to 100 API posts per 24 hours. Technically feasible, but business verification of a Venezuelan entity may be slow, and **auto-posting children's photos to a public account is exactly the LOPNNA risk**. Cheaper alternative: a "Descargar para redes" button that gives Dirección the consented photo to post manually.
- **Google Classroom API:** requires OAuth app verification; restricted scopes need a yearly third-party security assessment (CASA) ([Google restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)); the school's Workspace admin must allow the app, and admins can block it ([Classroom best practices](https://developers.google.com/classroom/best-practices/access-control-enhancements)). Weeks to months of compliance work for a feature most directors will not pay extra for. Cheaper alternative: a link to the Classroom course from the Tareas tab.

---

## 6. What it should do

### 6.1 The real selling points to a director (in order)

1. **"Sabe exactamente quién leyó cada circular, por sección."** Proof, not hope. This is the headline. It also protects the school in disputes ("se informó el 3 de octubre, la familia lo leyó el 4").
2. **Avisos de inasistencia with a trace for coordinación.** Replaces emails and notes, pre-fills attendance. Operational, daily, measurable, and nobody does it well today.
3. **Office hours and no personal numbers.** Teachers get their evenings back; the school controls the channel. This is the argument that wins *teachers*, and teacher support is what makes adoption real.
4. **Momentos del día.** Not a reason to buy, but the reason parents **open the app daily**, which is what makes circulares get read. Keep it, keep it simple.
5. **Tareas.** Useful in primaria; in bachillerato Classroom already does it. Low priority.

### 6.2 Cut or delay

| Feature | Decision | Why |
|---|---|---|
| Instagram auto-posting | **Cut** (replace with "download for social media") | Meta review, LOPNNA risk, little willingness to pay |
| Google Classroom integration | **Cut for now** (link only) | OAuth verification, admin approval per school |
| Portable teacher profile | **Cut** | Different business, buyer does not want it |
| Student records that follow the student | **Cut** | Highest legal risk, needs many schools, MPPE territory |
| Grades and boletines | **Delay indefinitely** | MPPE territory; schools already have systems |
| Payment processing | **Do not build** | Regulatory and reconciliation burden |
| Mensualidad payment reminders (no processing) | **Validate first**, possibly v1.1 | Possibly the director's biggest pain; sensitive; ask |
| Urgent notices (ignore office hours, plus email) | **Include in MVP** | Classes suspended for power/water/security is common; cheap to build |
| Families with several children | **Include in MVP** | Must-have, not an idea; a family with 3 children must not get 3 accounts |
| Permission slips (autorizaciones) | v1.1 | Cheap, clear value, builds on circular + confirmation |
| Authorized pickup people | Delay | Security-sensitive; needs process at the gate, not just an app |

### 6.3 Minimum paid product [Recommendation]

1. Roster import from a spreadsheet (grados, secciones, students, representantes, multiple representantes per child, multiple children per family).
2. Family activation by code/QR per family; login by email magic link or code; no passwords.
3. Circulares by Dirección to the whole school, a level, a grade or a sección, with attachments (PDF) and **read confirmation per family per sección**, plus an activation dashboard.
4. Urgent notices that bypass office hours.
5. Email fallback: daily digest of unread circulares; circulares also sent by email for the first lapso.
6. Avisos de inasistencia to coordinación and the teacher, with optional justificativo photo.
7. Basic data export and deletion per school.

Then, in the pilot: messaging with office hours (once teachers trust it), momentos with consent, tareas.

### 6.4 What to validate in the first director conversations

See "Questions to ask directors" below. The three things that decide whether to continue:
1. Does the director feel the "nobody reads circulares" pain strongly enough to change a habit?
2. Will the director make miCole the **official** channel (and tell teachers to stop using WhatsApp for school matters)?
3. Would they pay $100 to $200 a month for it from September, and who signs?

---

## Recommended pricing options

All prices in USD, payable in USD or in bolívares at the BCV rate on the payment date, with factura. Billed per lapso (three times a year) or annually with a discount. School pays; parents never pay miCole.

### Option A: per student per year (recommended default)

- **$5 per enrolled student per year**, billed per lapso (about $1.67 per student per lapso).
- Minimum $50 per month equivalent ($500 per year) so small schools are still worth supporting.
- Annual prepayment: 10% off.
- Example: 350 students = $1,750/year = about $146/month.
- **Why:** scales with school size and with the support load; directors can express it as "less than $0.50 per student per month", a small share of a $100 to $300 mensualidad; aligned with Bloomz ($3 to $7) and below Seesaw (~$7.5), adjusted for Venezuelan tuition.

### Option B: flat size bands (for directors who want one number)

| Band | Students | Monthly | Annual (prepaid) |
|---|---|---|---|
| Pequeño | up to 250 | $75 | $750 |
| Mediano | 251 to 600 | $150 | $1,500 |
| Grande | 601+ | $250 | $2,500 |

- No per-module pricing at the start; everything included.
- **Why:** easier to approve in an asamblea or by an owner; predictable; less counting.

### Option C: founding school pilot, then locked price

- **Free during the pilot** (lapso 3 of 2026-27, roughly April to July 2027) for 1 school, maximum 2.
- In exchange: written permission to use anonymized results and a testimonial, access to teachers and representantes for feedback, a named person in the school who handles first-line support, and a decision meeting in June.
- From September 2027: **50% off Option A or B for the first year, price locked for 2 years** ("colegio fundador").
- **Why:** proves activation and read rates with real data before asking anyone to pay; the June decision meeting fits the April to July budget window.

**Setup fee:** waive for founding schools; later $100 to $200 one-time if miCole imports the roster and runs the reunión de representantes for activation.

**What to avoid:** freemium for teachers (needs volume you will not have), parent fees, monthly invoicing to many small schools (collection effort), and any price above about $300/month in the first year.

**Note on the founder's own school:** piloting where the founder works is the fastest path, but it creates a conflict of interest (employee selling to employer, access to colleagues' messages, students' data). Get the director's written approval, keep the pilot free, and clarify ownership of the software (check the employment contract). Ideally run the paid pilot in a second school.

---

## Recommended next 90 days (17 Nov 2026 to mid February 2027)

**Weeks 1 to 4 (to mid December, before the Christmas break)**
1. Book 10 to 15 director conversations across tiers (at least 3 middle tier, 3 upper tier, 2 subvencionado) through personal network and colleagues. Use the demo; take notes using the question list below.
2. Talk to 5 teachers (separately from directors) about office hours and "Dirección puede leer".
3. Talk to 10 representantes, including at least 3 older parents/grandparents and 2 parents living abroad.
4. Find out what the schools currently pay for software (admin systems, Workspace paid tiers, websites).
5. One hour with a Venezuelan accountant (entity, factura, IVA, USD pricing). One hour with a lawyer on LOPNNA art. 65, consent wording and the school data agreement.

**Weeks 5 to 8 (January, after classes resume)**
6. Decide the MVP scope from the conversations (default: section 6.3).
7. Choose the stack: Supabase (Postgres, row-level security fits school/sección/family permissions) is the stronger fit for relational school data; Firebase is fine if already familiar.
8. Build roster import, family activation, circulares with read confirmation, urgent notices, email digest, avisos.
9. Draft the one-page data agreement and the consent form for photos.

**Weeks 9 to 12 (February to mid March)**
10. Security review of access rules (ask a developer friend or pay for a few hours).
11. Sign the founding-school pilot (Option C) with one school; plan the reunión de representantes for activation at the start of lapso 3.
12. Define pilot success metrics in writing with the director: e.g. 80% of families activated in 2 weeks, 70% of circulares read within 48 hours, coordinación uses avisos daily, at least 70% of teachers would keep it.
13. Stop building new features when the pilot starts; spend the time on support and measurement.

---

## Questions to ask directors

**Pain and current practice**
1. ¿Cómo envían hoy las circulares? ¿Cuántas al mes? ¿Cómo saben si las familias las leyeron?
2. Cuénteme la última vez que una familia dijo "no me enteré". ¿Qué pasó?
3. ¿Los docentes usan grupos de WhatsApp con representantes? ¿Es política del colegio o iniciativa de cada docente? ¿Le gusta?
4. ¿Ha tenido problemas por mensajes de representantes a docentes fuera de horario o por números personales?
5. ¿Cómo llegan hoy los avisos de inasistencia y los justificativos? ¿Quién los procesa y cuánto tiempo toma?
6. ¿Qué sistema usan para control de estudios, notas y cobranza? ¿Cuánto pagan por él? ¿Quién lo eligió?
7. ¿Usan Google Workspace o Microsoft? ¿Para qué exactamente?

**Willingness to change**
8. Si tuviera miCole, ¿lo haría el canal oficial y pediría a los docentes dejar los grupos de WhatsApp para temas del colegio?
9. ¿Qué porcentaje de sus familias cree que lo instalaría en las dos primeras semanas? ¿Qué familias serían las difíciles?
10. ¿Qué pensarían sus docentes de que Dirección pueda leer las conversaciones con representantes?
11. De lo que vio en la demo, ¿qué es lo único que sí o sí necesita? ¿Qué sobra?
12. ¿Qué le falta que lo haría decir "esto lo necesito ya"? (Listen for cobranza/morosidad without leading.)

**Money and decision**
13. ¿Quién decide una compra así: usted, el dueño, una junta, la congregación? ¿En qué mes del año se decide?
14. ¿Cuándo definen los costos del próximo año escolar? ¿Este gasto tendría que discutirse en la asamblea con representantes?
15. Si costara alrededor de $150 al mes para su colegio, ¿cómo lo ve? ¿Y $5 por estudiante al año? ¿Prefiere pago por lapso o anual?
16. ¿Cómo pagan normalmente a proveedores: bolívares con factura, divisas, Zelle?
17. ¿Estaría dispuesto a una prueba gratuita con dos o tres secciones en el tercer lapso, con una reunión en junio para decidir?

**Risk and trust**
18. ¿Qué le preocuparía de poner la comunicación del colegio en una plataforma nueva hecha por una sola persona? (Edmodo, continuity, data.)
19. ¿Cómo manejan hoy los permisos de fotos de los estudiantes?
20. ¿Hay algún requisito del Ministerio o de su red de colegios sobre dónde se guardan los datos de los estudiantes?

---

## Biggest risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Low willingness to pay** because WhatsApp, email and ClassDojo are free | High | High | Sell proof and control, not features; price as a fraction of a teacher salary; validate price in conversations before building more |
| 2 | **Low parent activation**, making read confirmation meaningless | High | High | Activation via reunión de representantes, codes/QR, no passwords, email fallback, activation dashboard; make activation the pilot's first metric |
| 3 | **Solo founder capacity** (full-time teaching job, support at 10 a.m., September onboarding peak) | High | High | Limit to 1 pilot school in 2026-27; secretaría as first-line support; self-service; consider a part-time support person once 3+ schools pay; status message plan for outages |
| 4 | **Minors' data and photos** (LOPNNA art. 65, habeas data) | Medium | Very high | Consent per student, private galleries, no public posting, data agreement, export/delete, outside security review, lawyer's read before launch |
| 5 | **Teacher resistance** (surveillance, extra work) | Medium | High | Office hours as a teacher benefit, transparency in UI, ask teachers early, keep posting to 30 seconds |
| 6 | **Push notifications unreliable** on Tecno/Infinix/Xiaomi and iOS PWA | High | Medium | Do not promise instant alerts; email digest; urgent notices also by email; Play Store wrapper later |
| 7 | **Payment collection and currency** (devaluation, no Stripe, factura requirement) | Medium | Medium | Local entity with factura, USD pricing payable at BCV rate, convert quickly, annual or per-lapso billing |
| 8 | **Macro and political volatility** (rate doubled in H1 2026, power crisis, sanctions changes, school closures) | Medium | High | Short commitments, low fixed costs, offline-first, keep the business lean |
| 9 | **Conflict of interest** with the founder's employer | Medium | Medium | Written approval, free pilot only, clarify IP, run the paid pilot elsewhere |
| 10 | **Scope creep** (Instagram, Classroom, records, payments) | High | Medium | Written "not now" list (section 6.2); revisit only with paying-school demand |
| 11 | **A regional suite or ClassDojo** enters seriously | Low to medium | Medium | Local relationships, Venezuelan workflows (avisos, lapsos), local payment, fast support in person |
| 12 | **Edmodo-style trust fear** ("what if you disappear?") | Medium | Medium | Data export at any time, written exit clause, email remains as fallback channel |

---

## Sources

**Venezuelan market, tuition and sector**
- https://eldiario.com/2025/07/29/colegios-privados-gran-caracas-aumentaron-precios-nuevamente-dolares/
- https://eldiario.com/2026/08/10/colegios-privados-caracas-tarifas-ano-escolar/
- https://eldiario.com/2026/06/17/colegios-privados-matriculas-ano-escolar-2026-2027/
- https://eldiario.com/2024/02/09/ninos-inscritos-sistema-privado-venezuela-retirado-migracion/
- https://eldiario.com/2024/06/05/andiep-aumento-mensualidad-escolar-ley-de-pensiones/
- https://eldiario.com/2024/08/05/ley-proteccion-pensiones-aumento-matriculas-colegios-privados/
- https://eldiario.com/2022/07/17/colegios-privados-en-caracas-adelanto-en-dolares-cupos/
- https://eldiario.com/2026/06/02/salario-docentes-colegios-privados/
- https://lapatilla.com/2025/04/07/educacion-privada-al-limite-alertan-sobre-la-drastica-disminucion-de-la-matricula-en-venezuela/
- https://finanzasdigital.com/fenasopadres-ajustes-matricula-colegios-privados-venezuela-ano-escolar-2025-2026/
- https://finanzasdigital.com/morosidad-golpea-a-colegios-privados-y-pone-en-riesgo-la-educacion/
- https://finanzasdigital.com/ingreso-docente-sector-privado-venezuela-2026/
- https://www.venamcham.org/wp-content/uploads/2023/08/Reportaje-Educarse-bajo-la-mano-del-Estado-parte-I.pdf
- https://diariodelosandes.com/sundde-realizara-revision-por-cobros-de-matriculas-en-colegios-privados
- https://www.traviesoevans.com/wp-content/uploads/2021/02/Alerta-Resolucion-Metodologia-Especial-calculo-de-mensualidades-de-Instituciones-Educ-Privadas-esp-septiembre-2-2020.pdf
- https://accesoalajusticia.org/metodologia-a-seguir-para-la-fijacion-de-la-matricula-en-instituciones-de-educacion-privadas/
- https://www.colegiosanignacio.com.ve/portal/cem/images/content/k2-component/Recaudos_Proceso_de_Inscripcion_24-25.pdf
- https://www.bloomberglinea.com/latinoamerica/venezuela/regreso-a-clases-en-venezuela-sera-el-14-de-septiembre-asi-queda-el-calendario-escolar-2026-2027/
- https://education.stateuniversity.com/pages/1663/Venezuela-EDUCATIONAL-SYSTEM-OVERVIEW.html
- https://kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Academic_grading_in_Venezuela
- https://doaj.org/article/d3e6331f5c0445d3aec62cc9e16a16f9
- https://produccioncientifica.luz.edu.ve/index.php/rluz/article/download/42636/49704

**Political and economic context**
- https://www.lanacion.com.ar/el-mundo/la-justicia-venezolana-declaro-la-asuncion-de-delcy-rodriguez-como-presidenta-interina-nid04012026
- https://www.bloomberglinea.com/latinoamerica/venezuela/venezuela-enfrenta-un-incierto-traspaso-de-poder-tras-la-captura-de-maduro/
- https://www.teletica.com/internacional/ee-uu-levanta-sanciones-al-banco-central-de-venezuela_406882
- https://eldiario.com/2026/04/15/sanciones-bcv-economia-venezuela/
- https://eldiario.com/2026/08/28/sanciones-seguiran-ahora-sirven-para-controlar-venezuela/
- https://finanzasdigital.com/dolarizacion-formal-venezuela-2026/
- https://www.local10.com/espanol/2026/08/19/apagones-y-racionamientos-electricos-alteran-la-vida-diaria-de-los-venezolanos/
- https://www.emol.com/noticias/Internacional/2026/10/10/1213792/venezuela-cortes-electricidad-protestas.html
- https://eldiario.com/2026/09/05/crisis-electrica-venezuela-2/

**Connectivity and devices**
- https://www.datosmundial.com/america/venezuela/telecomunicacion.php
- https://dplnews.com/venezuela-esta-fuera-del-top-100-en-el-ranking-de-velocidad-de-internet-movil/
- https://eldiario.com/2026/09/02/movistar-venezuela-reconocida-ookla-mejor-red-movil-venezuela/
- https://finanzasdigital.com/tarifas-de-digitel-octubre-planes-paquetes/
- https://finanzasdigital.com/mercado-movil-venezuela-tecno-xiaomi-samsung/
- https://gs.statcounter.com/vendor-market-share/mobile-tablet-console/venezuela
- https://counterpointresearch.com/de/insights/latam-smartphone-shipments-q1-2026
- https://dontkillmyapp.com/tecno
- https://support.pushy.me/hc/en-us/articles/360043864791
- https://techeconomy.ng/huawei-phones-without-google-play-store-what-you-can-and-cant-do-in-2026
- https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide
- https://pushpad.xyz/blog/ios-special-requirements-for-web-push-notifications

**Competitors and pricing**
- https://blog.classdojo.com/introducing-classdojo-translate/
- https://www.classdojo.com/es-mx/school-leaders
- https://www.k12dive.com/press-release/20260713-classdojo-expands-beyond-the-classroom-with-new-schoolwide-tools-for-school/
- https://www.myengineeringbuddy.com/blog/classdojo-reviews-alternatives-pricing-offerings/
- https://actem.wildapricot.org/seesaw
- https://seesaw.com/pricing-packages/free-changes/
- https://www.bloomz.com/bloomz-pricing
- https://getpulsesignal.com/pricing/parentsquare
- https://edsurge.com/news/2022-08-16-popular-k-12-tool-edmodo-shuts-down
- https://en.wikipedia.org/wiki/Edmodo
- https://openeducat.org/solutions/school-management-system-colombia/
- https://openeducat.org/education-software-venezuela/
- https://mercadonegro.pe/noticias/padres-de-familia-podran-pagar-pensiones-de-colegios-en-bodegas-y-tiendas-tambo
- https://www.df.cl/df-mas/punto-de-partida/la-edtech-mas-grande-de-chile-opera-desde-la-araucania-y-llega-a-mas-de
- https://www.eldinamo.cl/empren-d/2021/03/25/startup-lanza-version-gratuita-de-libro-de-clases-digital/
- https://apps.apple.com/app/id1633485231
- https://bemobi.com/solution/agenda-edu
- https://www.iproup.com/innovacion/8816-emprendedor-ico-plataforma-Blended-app-de-gestion-escolar-argentina-factura-30-millones
- https://us.fitgap.com/products/022035/kinderpedia
- https://edu.google.com/intl/ALL_ec/workspace-for-education/classroom/editions
- https://www.ghacks.net/2026/11/10/microsoft-will-retire-free-office-365-a1-email-for-schools-moving-them-to-an-a0-plan-without-exchange-or-teams/
- https://lazyadmin.nl/office-365/microsoft-retires-office-365-a1-and-student-use-benefit/
- https://www.diariouno.com.ar/sociedad/grupos-whatsapp-padres-pesadilla-docentes-y-alumnos-n227732
- https://www.incibe.es/index.php/menores/blog/madres-padres-profesores-y-sus-grupos-de-whatsapp
- https://www.getmonetizely.com/articles/how-do-edtech-saas-startups-align-with-educational-institution-budget-cycles

**Infrastructure costs**
- https://supabase.com/docs/pricing
- https://firebase.google.com/pricing/?hl=en
- https://www.verdent.ai/guides/devtools/firebase-pricing
- https://developers.facebook.com/docs/whatsapp/pricing
- https://help.sleekflow.io/en_US/whatsapp/pricing

**Payments**
- https://dev.to/global-creator-lab/payment-alternatives-for-digital-creators-in-venezuela-are-not-as-scarcely-reliable-as-youve-been-5c7c
- https://www.deel.com/es/blog/stablecoin-cobrar-en-dolares-desde-venezuela/
- https://edicomgroup.com/blog/digital-invoicing-venezuela
- https://ecosistemastartup.com/activo-banco-universal-lanza-apis-para-empresas-en-venezuela/
- https://apps.odoo.com/apps/modules/19.0/l10n_ve_pos_mercantil_c2p
- https://finanzasdigital.com/airtm-cuentas-virtuales-venezuela-eeuu-transferencias-ach/

**Legal**
- https://vlexvenezuela.com/vid/andi-starlyn-segovia-andrade-283240887
- https://www.dataguidance.com/taxonomy/term/176
- https://lapatilla.com/2016/05/26/introducen-amparo-constitucional-contra-diosdado-cabello/
- https://diariodelosandes.com/procesos-judiciales-de-acoso-escolar-deben-mantenerse-bajo-confidencialidad
- https://eldiario.com/2026/07/07/proteccion-ninos-emergencias/
- https://accesoalajusticia.org/tsj-respalda-gobierno-multa-tiktok-10-millones-dolares/

**APIs**
- https://developers.facebook.com/docs/instagram-platform/content-publishing/
- https://developers.facebook.com/documentation/instagram-platform/overview.md
- https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification
- https://developers.google.com/classroom/best-practices/access-control-enhancements
