# TASKS.md — MiCole Phase 1 Task Tracker

## How to Use This File
After Gemini plans each sprint, paste the atomic task list here. Check off tasks as Claude Code agents complete them. This is your single source of truth for progress.

---

## Pre-Flight Checklist
- [ ] Firebase project created (`micole-dev`)
- [ ] Firebase Auth enabled (Google provider)
- [ ] Firestore database created (production mode)
- [ ] Firebase Storage enabled
- [ ] Cloud Functions enabled
- [ ] Cloud Messaging enabled
- [ ] Google Play Developer account ready ($25 one-time)
- [ ] Git repo initialized
- [ ] CLAUDE.md, CONTEXT.md, AGENTS.md, SCHEMA.md committed to repo root
- [ ] Expo project initialized and running on physical device

---

## Sprint 1: Foundation
_Planned by: Gemini_
_Built by: Claude Code agents_
_Target: Week 1-2_

> Paste Gemini's task list here after planning

---

## Sprint 2: Students & Attendance
_Planned by: Gemini_
_Built by: Claude Code agents_
_Target: Week 3-4_

> Paste Gemini's task list here after planning

---

## Sprint 3: Grades & Feed
_Planned by: Gemini_
_Built by: Claude Code agents_
_Target: Week 5-6_

> Paste Gemini's task list here after planning

---

## Sprint 4: Parent Experience
_Planned by: Gemini_
_Built by: Claude Code agents_
_Target: Week 7-8_

> Paste Gemini's task list here after planning

---

## Sprint 5: Polish & Testing
_Planned by: Gemini_
_Built by: Claude Code agents_
_Target: Week 9-10_

> Paste Gemini's task list here after planning

---

## Bug Tracker
| # | Description | Severity | Status | Agent |
|---|---|---|---|---|
| | | | | |

---

## Decision Log
| Date | Decision | Reason |
|---|---|---|
| 2026-02-11 | WhatsApp replaced with parent portal + QR | Teachers refuse to share personal WhatsApp |
| 2026-02-11 | React Native + Expo over PWA | Native feel, push notifications, Play Store presence |
| 2026-02-11 | Firebase over Supabase | Firestore offline persistence is the killer feature |
| 2026-02-11 | Subcollections per school | Clean data isolation, simpler security rules |
| 2026-02-11 | Classroom sync pushed to Phase 2 | Reduces Phase 1 scope dramatically |
| 2026-02-11 | D&D gamification = separate app | Protects core app performance and bundle size |
| 2026-02-11 | Grade conflict uses field-level ownership | Teacher owns grade, student owns submission status |
| 2026-02-11 | Android 7.0+ minimum (not 5.0) | Modern library compatibility, covers ~95% of Venezuelan devices |
| 2026-02-11 | Spanish default, English toggle | react-i18next, Venezuelan Spanish conventions |
| 2026-02-11 | Feed auto-generates from teacher actions | Teachers do less, not more |
| 2026-02-11 | Momento del Día added to Phase 1 | Social hook that makes feed feel alive |
| 2026-02-11 | Circular Digital added to Phase 1 | Gets administrators invested in the platform |
| 2026-02-11 | Grades & attendance are toggleable, OFF by default | Many schools use other platforms — MiCole enters as communication layer first |
| 2026-02-11 | Two-layer toggle: features + parentVisibility | Schools can track grades internally but hide from parents |
| 2026-02-11 | Parent feed is lighter: Momentos + Circulares + Homework | Core parent value is school communication, not grade portal |
