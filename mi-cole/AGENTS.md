# AGENTS.md — MiCole Multi-Agent Configuration

## Agent Pipeline Overview

MiCole uses a three-system pipeline:
- **Gemini** (AI Studio / Antigravity planning mode): Strategic planning, architecture decisions, task decomposition
- **Claude Code** (Antigravity terminal): All code generation, implementation, debugging
- **TestSprite MCP**: Automated testing and QA

Within Claude Code, we use specialized agents to keep context focused and prevent one agent from trying to do everything at once.

---

## Agent Definitions

### 🏗️ Agent: Architect
**Trigger**: New features, schema changes, major refactors
**Scope**: `lib/types/`, `lib/firebase/`, `SCHEMA.md`, `firestore.rules`, `firestore.indexes.json`
**Responsibilities**:
- Design and update Firestore schema (document structure, subcollections, indexes)
- Write and maintain Firestore security rules
- Define TypeScript interfaces for all data models
- Design the offline sync strategy for new features
- Plan Cloud Function triggers and their side effects
- Ensure multi-tenant data isolation (every query scoped to schoolId)

**Rules**:
- ALWAYS update `lib/types/` when changing Firestore schema
- ALWAYS update `firestore.rules` when adding new collections/subcollections
- NEVER allow a query that can read across schools
- MUST consider offline behavior for every schema decision
- Document all architecture decisions as comments in the relevant files

**Handoff**: After defining types and schema, hands off to Frontend or Backend agent with clear interface contracts.

---

### 🎨 Agent: Frontend
**Trigger**: UI screens, components, navigation, styling, animations
**Scope**: `app/`, `components/`, `lib/hooks/`, `lib/stores/`, `assets/`
**Responsibilities**:
- Build all React Native screens and components
- Implement Expo Router navigation (file-based)
- Apply school theming (dynamic colors, logos from Firestore)
- Build the social feed UI and all feed item types
- Implement roll call (attendance) interface
- Build grade entry and display
- Create QR code generation and display
- Handle i18n integration (all strings through react-i18next)
- Implement Zustand stores for UI state
- Optimize for low-end Android (memo, lazy loading, minimal re-renders)

**Rules**:
- NEVER hardcode Spanish strings — all text through i18n keys
- NEVER hardcode colors — all theming through school config
- ALL list items (feed cards, student cards) MUST use `React.memo()`
- ALL touchable targets minimum 44x44dp
- ALL screens must look correct with system font scaling up to 1.5x
- PREFER NativeWind utility classes over inline styles
- ALWAYS add `testID` props to interactive elements
- Keep components under 150 lines — extract subcomponents aggressively

**Handoff**: If a feature needs new Firestore queries or Cloud Functions, describe the data contract needed and hand off to Architect or Backend agent.

---

### ⚙️ Agent: Backend
**Trigger**: Cloud Functions, Firestore triggers, FCM notifications, server-side logic
**Scope**: `functions/`, `lib/firebase/`, `firestore.rules`, `firestore.indexes.json`
**Responsibilities**:
- Write Firebase Cloud Functions (TypeScript)
- Build Firestore triggers for auto-generated feed items
- Implement FCM push notification logic (when to notify, who to notify)
- Handle parent onboarding token generation and validation
- Write composite Firestore indexes for complex queries
- Implement data aggregation (weekly summaries, attendance stats)

**Rules**:
- ALL Cloud Functions must be idempotent (safe to retry)
- Triggers must handle partial data (a document might not have all fields yet due to offline sync)
- FCM notifications MUST include both `notification` (for background) and `data` (for foreground handling) payloads
- NEVER send push notifications that reveal grades or attendance to anyone other than the authorized parent
- Cloud Functions must complete within 60 seconds
- Use batched writes when updating multiple documents (e.g., creating feed items for an entire section)
- Log errors to Cloud Functions logger, NEVER console.log in production

**Handoff**: After deploying functions, notify Frontend agent of any new data shapes or notification payloads to handle.

---

### 🌐 Agent: i18n
**Trigger**: New screens, new features, text changes, translation updates
**Scope**: `lib/i18n/es.json`, `lib/i18n/en.json`, `lib/i18n/index.ts`
**Responsibilities**:
- Maintain Spanish and English translation files
- Ensure every user-facing string has a translation key
- Use Venezuelan Spanish conventions (see glossary below)
- Keep translation keys organized by feature namespace
- Handle pluralization and interpolation

**Rules**:
- Spanish is the source of truth — write Spanish first, then English
- Key format: `feature.subfeature.element` (e.g., `attendance.rollCall.saveButton`)
- NEVER use generic keys like `button1` or `text3`
- Venezuelan Spanish glossary:
  - "representante" NOT "padre de familia" or "acudiente"
  - "lapso" NOT "trimestre" or "periodo"
  - "boletín" NOT "boleta" or "libreta"
  - "sección" NOT "salón" or "aula" (when referring to a class group)
  - "plantel" NOT "institución" (when referring to the school formally)
  - "nota" NOT "calificación" (colloquial, preferred in UI)
  - "pase de lista" NOT "control de asistencia" (colloquial)
  - "tarea" NOT "asignación" (colloquial)
  - "profe" can be used in informal contexts (feed, moments)
- English translations should be natural, not word-for-word
- Use ICU message format for plurals: `{count, plural, one {# student} other {# students}}`

---

### 🧪 Agent: QA
**Trigger**: After any feature is built, before merging
**Scope**: `__tests__/`, `*.test.ts`, `*.test.tsx`
**Responsibilities**:
- Write unit tests for utility functions and hooks
- Write component tests for UI components
- Write integration tests for Firestore operations
- Verify offline behavior (mock Firestore offline mode)
- Verify role-based access (teacher sees X, parent sees Y)
- Verify multi-tenant isolation (school A data never leaks to school B)

**Rules**:
- Every new component gets at least one render test
- Every Firestore helper gets at least one happy path + one error test
- Offline scenarios MUST be tested: write offline → come online → verify sync
- Role-based tests: render same screen as teacher vs parent, verify different content
- Test file lives next to the file it tests: `Component.tsx` → `Component.test.tsx`
- Use `testID` props for querying elements, NEVER query by text content (breaks with i18n)

**Integration**: Works with TestSprite MCP for automated test generation and coverage analysis.

---

## Agent Workflow

### For a New Feature (e.g., "Circular Digital"):

```
1. [Gemini] Plans the feature — defines user stories, data flow, edge cases
2. [Architect] Designs the Firestore schema, types, security rules
3. [Backend] Writes Cloud Function triggers (e.g., circular → push notification to all parents)
4. [Frontend] Builds the UI screens (create circular, view circular list, notification display)
5. [i18n] Adds all translation keys for both languages
6. [QA] Writes tests — unit, component, integration, offline
```

### For a Bug Fix:

```
1. [QA] Identifies the bug and writes a failing test
2. [Relevant Agent] Fixes the code
3. [QA] Confirms the test passes
```

### For a Refactor:

```
1. [Architect] Plans the refactor, identifies affected files
2. [QA] Ensures existing tests pass before starting
3. [Relevant Agent] Performs the refactor
4. [QA] Confirms all tests still pass
```

---

## Git Workflow

### Branch Naming
- `feature/attendance-roll-call`
- `feature/parent-onboarding-qr`
- `fix/offline-sync-grades`
- `refactor/feed-item-types`

### Commit Convention
```
type(scope): description

feat(attendance): add roll call UI with offline support
fix(grades): resolve conflict when grade entered offline
refactor(feed): extract FeedItem into discriminated union types
docs(schema): update SCHEMA.md with circular subcollection
test(attendance): add offline sync integration test
i18n(attendance): add Spanish and English strings for roll call
```

### PR Flow
1. Create feature branch from `main`
2. Implement with relevant agents
3. QA agent writes/runs tests
4. Self-review the diff
5. Merge to `main`
6. Deploy via `firebase deploy` (functions) + `eas build` (app)

---

## Environment Configuration

### Development
- Expo Go on physical Android device (preferred) or Android emulator
- Firebase Emulator Suite for local Firestore/Auth/Functions testing
- `.env.local` for Firebase config (NEVER commit)

### Staging
- Firebase project: `micole-staging`
- EAS build profile: `preview`
- Internal distribution for testers

### Production
- Firebase project: `micole-prod`
- EAS build profile: `production`
- Google Play Store distribution
