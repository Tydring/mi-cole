# PHASE1.md — MiCole Phase 1 Build Plan

## Goal
Ship a school social platform that serves as the communication backbone for Venezuelan schools. Teachers post classroom updates (Momentos) and schools publish announcements (Circulares), creating a feed that parents can follow. Grades and attendance tracking are built-in but OPTIONAL — schools already using another platform can leave them off. The app enters schools as the communication layer first, then expands.

## Success Criteria
- A teacher can create a school workspace, invite parents via QR code, and post Momentos and Circulares
- Parents can scan a QR code, download the app, and see their child's school feed (momentos, circulares, homework reminders)
- Schools can toggle grades and attendance ON if they want to use MiCole for those — but they work without them
- Push notifications fire when new content is posted
- The app themes itself to the school's colors and logo
- Everything works in Spanish (default) and English (toggle)
- Core features work fully offline

---

## Sprint 1: Foundation (Week 1-2)

### 1.1 Project Scaffolding
- [ ] Initialize Expo project with TypeScript template
- [ ] Configure Expo Router (file-based routing)
- [ ] Set up NativeWind (Tailwind CSS for React Native)
- [ ] Configure react-i18next with `es.json` and `en.json` stubs
- [ ] Set up Zustand stores (auth, school, sync)
- [ ] Configure ESLint + Prettier
- [ ] Initialize Git repo with `.gitignore` for Expo/Firebase
- [ ] Create Firebase project (`micole-dev`)
- [ ] Configure Firebase in Expo (`lib/firebase/config.ts`)
- [ ] Enable Firestore offline persistence
- [ ] Set up Firebase Emulator Suite for local dev

### 1.2 Authentication
- [ ] Google Sign-In with Expo AuthSession
- [ ] Firebase Auth integration (personal Gmail — no domain restriction)
- [ ] Create `/users/{userId}` document on first sign-in
- [ ] Auth state listener → Zustand `authStore`
- [ ] Login screen UI (school-themed once school is selected, neutral before)
- [ ] Logout functionality
- [ ] i18n: all auth strings (`auth.login.title`, `auth.login.googleButton`, etc.)
- [ ] Handle edge case: user re-installs app (Auth persistence across installs)

### 1.3 School Workspace — Create & Join
- [ ] "Create School" flow:
  - School name, short name, type, city, state
  - Color picker for primary/secondary (with presets)
  - Optional logo upload (Firebase Storage)
  - Motto field (optional)
  - **Feature toggle setup**: checkboxes for "Use MiCole for grades?", "Use MiCole for attendance?", "Enable Momentos?", "Enable Circulares?" (Momentos and Circulares default ON, grades and attendance default OFF)
  - Creates `/schools/{schoolId}` + adds creator as admin in `/members/`
- [ ] "Join School" flow:
  - Search schools by name
  - Request to join → pending approval by admin (or auto-join for Phase 1 simplicity)
  - Adds user to `/schools/{schoolId}/members/`
- [ ] School settings screen (admin/coordinator only):
  - Toggle features on/off
  - Toggle parent visibility per feature
  - Edit branding (colors, logo, motto)
- [ ] School switcher (sidebar or bottom sheet with school icons, like Discord)
- [ ] Zustand `schoolStore` — tracks active school, caches school config including feature toggles
- [ ] Theme provider — reads active school's colors, applies to all components
- [ ] Feature gate utility — `useFeature('grades')` hook that checks school settings, used by all components to show/hide sections
- [ ] i18n: all school setup strings

---

## Sprint 2: Students & Attendance (Week 3-4)

### 2.1 Student Management
- [ ] "Add Student" form (firstName, lastName, section)
- [ ] Creates `/schools/{schoolId}/students/{studentId}` with auto-generated `parentToken`
- [ ] Student roster view — grouped by section, sorted alphabetically
- [ ] Student profile view — name, section, photo placeholder (initials), badges, stats
- [ ] QR code display in student profile (generated from `parentToken`)
  - Visible ONLY to teacher/coordinator roles
  - "Regenerate Code" button (invalidates old token)
  - Short link display: `micole.app/p/{token}`
- [ ] Batch student import (CSV upload — nice to have, can defer)
- [ ] i18n: all student management strings

### 2.2 Section Management
- [ ] Create section (grade + letter: "4to" + "A")
- [ ] Assign teacher(s) to section
- [ ] Section list view
- [ ] Section detail view (student list + summary stats)

### 2.3 Attendance (Feature-Gated — only visible if school enables it)
- [ ] All attendance UI wrapped in `useFeature('attendance')` gate
- [ ] "Start Roll Call" button → attendance mode
- [ ] Full student list for active section
- [ ] Per-student toggle: Present ✓ / Late T / Absent ✗ / Excused E
- [ ] One-tap "Mark All Present" (then adjust exceptions — faster for typical days)
- [ ] Save attendance → creates `/schools/{schoolId}/attendance/{YYYY-MM-DD}`
- [ ] Offline support: saves locally, syncs when online
- [ ] Attendance history view (calendar or list by date)
- [ ] Summary stats per student (percentage, streak)
- [ ] Cloud Function trigger: on attendance save → update `student.attendanceRate` and `student.currentStreak`
- [ ] Cloud Function trigger: on attendance save → create feed item ONLY if `features.attendance = true`
- [ ] Feed item respects `parentVisibility.attendance` — if false, item is tagged `teacherOnly: true`
- [ ] Bottom tab for Attendance only appears if school has feature enabled
- [ ] i18n: all attendance strings

---

## Sprint 3: Grades & Feed (Week 5-6)

### 3.1 Grade Entry (Feature-Gated — only visible if school enables it)
- [ ] All grade UI wrapped in `useFeature('grades')` gate
- [ ] Grade entry form:
  - Select section
  - Select subject (from predefined Venezuelan curriculum list OR custom)
  - Select evaluation type (exam, assignment, participation, project, quiz)
  - Evaluation name (free text)
  - Select lapso (1, 2, or 3)
  - Grade input per student (number field, 1-20, with color feedback)
- [ ] Bulk grade entry — list all students, enter grades in sequence (fast flow)
- [ ] Save grades → creates `/schools/{schoolId}/grades/{gradeId}` per student
- [ ] Offline support: saves locally, syncs when online
- [ ] Conflict detection: if same student+subject+evaluation exists with different grade, flag it
- [ ] Conflict resolution UI: "You entered 15. The server has 17. Which do we keep?"
- [ ] Grade book view — matrix of students × subjects for a section/lapso
- [ ] Student grade detail — all grades for one student, grouped by subject
- [ ] Cloud Function trigger: on grade save → update `student.currentAverage`
- [ ] Cloud Function trigger: on grade batch save → create feed item ONLY if `features.grades = true`
- [ ] Feed item respects `parentVisibility.grades` — if false, item is tagged `teacherOnly: true`
- [ ] Bottom tab for Grades only appears if school has feature enabled
- [ ] i18n: all grade strings

### 3.2 Social Feed
- [ ] Feed screen — scrollable list of feed items
- [ ] Feed item card component with variants:
  - `momento` — teacher post with text, like button (ALWAYS available)
  - `circular` — school announcement, red accent, pinned option (ALWAYS available)
  - `homework` — assignment with due date, manual post by teacher (ALWAYS available)
  - `attendance` — auto-generated, shows present/total (ONLY if feature enabled)
  - `grades` — auto-generated, shows subject + evaluation name (ONLY if feature enabled)
  - `achievement` — student milestone (ONLY if relevant feature enabled)
- [ ] Feed items have `teacherOnly: boolean` field — items tagged `teacherOnly: true` are hidden from parent feed
- [ ] "Momento del Día" composer:
  - Simple text input (max 280 chars)
  - "Post" button → creates feed item
  - Teacher can post one per day per section
- [ ] "Homework Reminder" composer:
  - Subject, description, due date
  - Creates feed item visible to parents (helps fill the parent feed)
- [ ] Like functionality (tap heart → add to `/feed/{feedId}/likes/`)
- [ ] View tracking (on render → add to `/feed/{feedId}/views/`)
- [ ] Feed filtering: "All" | by section | by type
- [ ] Pull-to-refresh
- [ ] Infinite scroll / pagination (load 20 items, then load more)
- [ ] Offline: feed items cached via Firestore persistence, viewable offline
- [ ] Teacher sees view counts ("24 padres vieron esto")
- [ ] Parent feed query: filter by `sectionId` matching their child + `schoolWide = true`, EXCLUDE items where `teacherOnly = true`
- [ ] Empty state for parent feed: friendly message if no posts yet ("Tu profe aún no ha publicado esta semana")
- [ ] i18n: all feed strings

### 3.3 Circulares
- [ ] Create circular form (title, content, priority)
- [ ] Only coordinator/admin role can create
- [ ] Creates both `/circulares/` doc AND `/feed/` item
- [ ] Dedicated "Circulares" tab for parents (filtered view of important announcements)
- [ ] Push notification to all school parents when urgent circular posted
- [ ] View tracking (who opened it)
- [ ] i18n: all circular strings

---

## Sprint 4: Parent Experience (Week 7-8)

### 4.1 Parent Onboarding
- [ ] QR code scanning flow:
  - Parent downloads app → "I'm a parent" path
  - Scan QR code from teacher's phone (or enter short code manually)
  - App validates token against `/students/{studentId}.parentToken`
  - Links parent's userId to student (`student.parentUserId = userId`)
  - Adds parent to `/schools/{schoolId}/members/` with role "parent" and `childrenIds`
- [ ] Deep link support: `micole.app/p/{token}` opens app or Play Store
- [ ] Handle multiple children: parent can scan multiple QR codes, sees all children
- [ ] Handle re-scan: if token regenerated, old parent link is revoked

### 4.2 Parent Portal
- [ ] Parent feed — filtered to their child's section + school-wide circulares, EXCLUDING `teacherOnly` items
- [ ] The feed IS the parent's home screen. Momentos, circulares, and homework reminders are the core content.
- [ ] Child profile view — basic info, section, badges
  - Shows grades summary ONLY if `parentVisibility.grades = true`
  - Shows attendance summary ONLY if `parentVisibility.attendance = true`
  - If both are off, profile shows badges and feed activity only
- [ ] Circulares tab — school-wide announcements (always visible)
- [ ] CRITICAL: parent can ONLY see their own child's data. Security rules enforce this.
- [ ] CRITICAL: parent NEVER sees features the school has hidden via `parentVisibility`
- [ ] Empty state handling: if feed is sparse, show encouraging message ("¡Bienvenido! Aquí verás las novedades del salón de tu hijo/a")
- [ ] i18n: all parent-facing strings

### 4.3 Push Notifications
- [ ] Firebase Cloud Messaging setup in Expo
- [ ] Request notification permission on first launch
- [ ] Store FCM token in `/users/{userId}.fcmToken`
- [ ] Cloud Function: on new Momento → notify parents in that section
  - "MiCole — San José: La profe publicó una actualización en 4to A"
- [ ] Cloud Function: on urgent circular → notify all parents in school
  - "MiCole — San José: Nueva circular importante del colegio"
- [ ] Cloud Function: on homework post → notify parents in that section
  - "MiCole — San José: Nueva tarea publicada en 4to A — Matemáticas"
- [ ] Cloud Function: on new grade → notify linked parent ONLY if `parentVisibility.grades = true`
  - "MiCole: Nuevas calificaciones publicadas para María — Matemáticas"
- [ ] Cloud Function: on attendance marked absent → notify linked parent ONLY if `parentVisibility.attendance = true`
  - "MiCole: María no asistió a clases hoy"
- [ ] Cloud Function: weekly digest (Friday 3pm) → summary notification
  - "MiCole: Resumen semanal del salón de María disponible"
- [ ] Notification tap → deep link to relevant screen
- [ ] Notification preferences (parents can mute non-urgent)
- [ ] ALL notification Cloud Functions check school feature toggles before sending
- [ ] i18n: all notification strings (these are CRITICAL — parents see these on lock screen)

---

## Sprint 5: Polish & Testing (Week 9-10)

### 5.1 Offline Resilience
- [ ] Test EVERY feature with airplane mode
- [ ] Sync status indicator in header (green dot = synced, yellow = pending, red = offline)
- [ ] Queue display: "3 cambios pendientes de sincronizar"
- [ ] Auto-retry on reconnection
- [ ] Handle "stale data" gracefully — show last-synced timestamp on data screens

### 5.2 Theming & Branding
- [ ] Verify all screens adapt to school colors
- [ ] School logo display in header
- [ ] Splash screen with school branding (after login)
- [ ] App icon considerations (generic MiCole icon, school branding inside app)

### 5.3 Performance
- [ ] Profile on low-end Android device (Redmi 9A or equivalent)
- [ ] Feed scroll performance — 60fps target
- [ ] App launch time — under 3 seconds on cold start
- [ ] Memory profiling — keep under 150MB active
- [ ] Bundle size check — target under 25MB APK

### 5.4 Testing
- [ ] Unit tests for all Firestore helpers
- [ ] Component tests for all feed item variants
- [ ] Integration tests for attendance → feed generation pipeline
- [ ] Integration tests for grade → notification pipeline
- [ ] Offline sync tests (write offline → go online → verify)
- [ ] Role-based access tests (teacher vs parent vs coordinator)
- [ ] Multi-tenant isolation tests (school A data never appears in school B)

### 5.5 Deployment
- [ ] Firebase security rules deployed and tested
- [ ] Cloud Functions deployed to staging
- [ ] EAS Build — Android APK (preview profile)
- [ ] Internal testing with 3-5 teachers
- [ ] Iterate based on feedback
- [ ] Play Store listing preparation (screenshots, description, privacy policy)

---

## Out of Scope for Phase 1
- Google Classroom sync (Phase 2)
- Student self-access / login (Phase 2)
- Emotional wellness check-ins (Phase 3)
- AI study tools (Phase 4)
- Gamification (Phase 5 — separate app)
- iOS build (after Android validation)
- Boletín PDF generation (Phase 2)
- Photo uploads in feed (Phase 2)
- Teacher-to-teacher chat (Phase 2 — nice to have but not core)
- Admin analytics dashboard (Phase 2)
- Homework assignment management beyond feed posts (Phase 2)
