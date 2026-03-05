# CONTEXT.md — MiCole

## What is MiCole?

MiCole ("Mi Colegio" — "My School") is a mobile-first school social platform designed specifically for Venezuelan schools. It gives every school its own branded digital workspace where teachers post classroom updates, parents follow their child's progress, and the school community stays connected — all without requiring WhatsApp, teacher phone numbers, or reliable internet.

## The Problem

Venezuelan schools face a unique combination of challenges:

1. **Infrastructure collapse**: Frequent power outages and unreliable internet make cloud-only tools (Google Classroom, ClassDojo) effectively unusable for daily operations.
2. **Communication breakdown**: Teachers are expected to message parents via personal WhatsApp, which invades their privacy, creates 24/7 availability expectations, and most teachers refuse to do it.
3. **Information black hole**: Parents have almost no visibility into what happens at school. Grades arrive once per lapso (trimester). Attendance issues surface too late. Paper circulares get lost in backpacks.
4. **Zero IT budgets**: Schools cannot afford software licenses. Teachers earn under $50/month. Any solution must be free or near-free to use.

## The Solution

MiCole turns routine teacher actions into a social feed. When a teacher takes attendance, a feed item is auto-generated. When grades are entered, parents get a push notification. When the school publishes a circular, every parent receives it instantly. The teacher's only "extra" effort is an optional daily one-liner about what happened in class ("Momento del Día").

Parents onboard by scanning a QR code from the teacher's app (embedded in the student's profile). This gives them access to their child's data — and only their child's data — through the MiCole app. No WhatsApp groups, no teacher phone numbers, no chaos.

## Why "Social Platform" and Not "School Tool"?

Tools get abandoned. Nobody opens a tool because they want to. Social platforms create habit loops. A parent checking MiCole to see if the teacher posted about today's science class is a fundamentally different (and more sustainable) engagement pattern than a parent begrudgingly checking a grade portal once per trimester.

The feed is the product. Everything else (attendance, grades, QR onboarding) is infrastructure that feeds into it.

## Target Users

### Primary: Venezuelan Teachers (Phase 1 focus)
- Work at private and subsidized private schools
- Use personal Gmail accounts (not school-managed Workspace domains)
- Have Android phones, usually mid-to-low range
- Already use Google Classroom inconsistently due to connectivity
- WILL NOT share personal WhatsApp with parents
- Want to feel professional and organized, not burdened by more tech

### Secondary: Venezuelan Parents ("Representantes")
- Have Android phones with WhatsApp and Chrome
- Want to know what's happening at school but have no reliable channel
- Will NOT download a complex app — onboarding must be frictionless
- Many are not highly tech-literate — the UI must be dead simple
- The emotional hook: seeing their child's school life in real-time

### Tertiary: School Administrators and Coordinators
- Need to distribute circulares reliably
- Want attendance and grade data without chasing teachers
- Would value a "digital presence" for their school (branded workspace)

### Future: Students (Phase 2+)
- See their own grades and homework
- Emotional check-in (mood selector)
- Gamification layer (separate companion experience)

## Venezuelan School System Context

### Academic Structure
- School year divided into 3 **lapsos** (trimesters), not semesters
- Grading scale: **1 to 20** (10 = minimum passing, 16+ = excellent)
- Report cards called **boletines**
- Parents called **representantes** (legally, the person who enrolls and is responsible for the student)
- Class groups called **secciones** (e.g., "4to A", "5to B")

### School Types
- **Public (U.E.)**: Government-run, zero budget, often crumbling infrastructure. Hardest to reach but largest population.
- **Subsidized Private (U.E.P.)**: Receive some government funding, charge modest fees. Sweet spot for MiCole — some organization, some resources, but not enough for enterprise software.
- **Private (Colegio)**: Fee-based, better infrastructure, more likely to adopt tech. Early adopter segment.
- **Fe y Alegría**: NGO-run network of schools serving low-income communities. Potential institutional partner for grants.

### Technology Reality
- Most teachers and parents have Android phones (Samsung, Xiaomi, Redmi)
- iPhones are rare (~5-10% of market)
- Data plans are limited — heavy media consumption is a barrier
- Wi-Fi available at some schools but unreliable
- Power outages are frequent (sometimes daily, lasting hours)
- Many teachers use personal Gmail, NOT school-issued email

## Business Model (Current Thinking)

MiCole is NOT a VC-funded startup. The target market cannot support subscription pricing. Viable paths:

1. **NGO/Grant funded**: Position as education infrastructure for crisis zones. Pitch to UNICEF, CAF, USAID, Fe y Alegría. App is free, grants cover server costs.
2. **Freemium for private schools**: Free basic tier. Paid school customization (custom branding, priority support, advanced analytics). $20-50/month per school.
3. **Sponsor banners**: Local businesses (bookstores, uniform shops, ISPs) pay for a "Patrocinado por..." slot. $50-100/month paid directly via PagoMóvil/Zelle.
4. **One-time unlocks**: Boletín PDF generation ($2-5), Excel export ($2). Via Google Play Billing.

The priority is adoption first, monetization second. The product must be 100% functional on the free tier.

## Competitive Landscape

| Competitor | Why MiCole Wins |
|---|---|
| Google Classroom | No offline. No parent feed. No Venezuelan school structure (lapsos, 1-20 scale). Requires Workspace domain for full features. |
| ClassDojo | No offline. No WhatsApp-free parent comm. Not localized for LATAM. Behavior system is culturally foreign. |
| Edupage / Schoology | Enterprise pricing. Requires school IT admin. Overkill for Venezuelan context. |
| WhatsApp Groups | Chaotic. No structure. No privacy. No data tracking. Teachers hate it. |

MiCole's moat: the ONLY app that combines offline-first architecture with a social feed model, designed specifically for Venezuelan school culture and infrastructure constraints.

## Product Roadmap

### Phase 1 — School Communication Platform (Current Build)
- Teacher auth (personal Gmail via Firebase Auth)
- Create/join school workspace (multi-tenant, branded per school)
- Student management (add students, profiles with QR codes)
- **Feature toggle system** — schools enable grades/attendance when ready (OFF by default)
- Attendance tracking (optional — for schools not using another platform)
- Grades (optional — Venezuelan 1-20 scale, per-subject, per-lapso)
- Social feed (Momentos + Circulares + Homework reminders as core content)
- Auto-generated feed items from attendance/grades ONLY if school enables them
- Momento del Día (teacher's daily one-liner — the social hook)
- Circular Digital (school announcements — the admin hook)
- Parent onboarding (QR code scan → app download → see child's feed)
- Parent portal (filtered feed, circulares, child profile — grades/attendance only if school enables parent visibility)
- Push notifications (FCM — free, unlimited, respects feature toggles)
- Bilingual (Spanish default, English toggle)

### Phase 2 — Google Classroom Sync
- OAuth connection to Classroom API
- Pull courses, rosters, assignments, grades
- Field-level conflict resolution (teacher owns grade, student owns submission)
- Bidirectional sync with offline queue

### Phase 3 — Emotional Wellness
- Student mood check-in (simplified Plutchik's wheel)
- Teacher dashboard (class emotional climate over time)
- Pattern detection (5+ low-mood days triggers alert)
- Privacy-first: encrypted, teacher/coordinator only

### Phase 4 — AI Study Tools
- Gemini Flash integration for quiz/study guide generation
- Teacher-uploaded materials → AI generates review content
- Offline caching (pre-generate during Wi-Fi)
- Parent-facing: "What is my child learning this week?" summaries

### Phase 5 — Gamification (Separate Companion App)
- D&D-inspired class system
- Quest builder for teachers
- XP tied to academic performance
- Party system for collaborative learning
- Completely decoupled from core MiCole app

## Key Design Principles

1. **The feed is the product.** If it's empty or boring, the app fails.
2. **Teachers do LESS, not more.** Every feature must reduce teacher workload, never add to it.
3. **Parents are spectators, not participants.** They watch the feed. They don't create content or message teachers.
4. **Every school feels like home.** The branded workspace makes the school proud of their digital presence.
5. **Offline is not an error state.** It's the default state. Online is a bonus.
6. **Privacy is non-negotiable.** No teacher phone numbers exposed. No student data visible to other parents. No cross-school data leaks.
