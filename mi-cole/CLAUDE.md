# CLAUDE.md — MiCole

## Project Overview

MiCole is a school social platform for Venezuelan schools. It is NOT an LMS, NOT a Google Classroom replacement, and NOT a messaging app. It is a social network where the school is the community. Teachers post, parents follow, students engage.

One app. Multiple school workspaces. Each school gets its own branded experience (colors, logo, motto). Teachers who switch schools keep their profile and achievements.

## Core Philosophy

- **Offline-first**: Every core feature MUST work without internet. Venezuela has unreliable power and connectivity. If it doesn't work offline, it doesn't work.
- **Teacher-zero-effort**: The social feed auto-generates from teacher actions (taking attendance, entering grades). Teachers should never feel like they're doing "extra work" to use this app.
- **Parent privacy**: Teachers NEVER share their personal phone number or WhatsApp. Parent communication happens through the app only.
- **Lightweight**: Must run smoothly on low-end Android devices (2GB RAM minimum, Android 7.0+). Keep bundle size minimal.

## Tech Stack

- **Frontend**: React Native + Expo (managed workflow)
- **Backend**: Firebase (Firestore, Auth, Cloud Functions, Cloud Messaging, Hosting)
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand + Firestore offline persistence
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind for React Native)
- **i18n**: react-i18next (Spanish default, English toggle)
- **Testing**: Jest + React Native Testing Library

## Project Structure

```
micole/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Auth screens (login, school picker)
│   ├── (teacher)/          # Teacher-role screens
│   │   ├── feed/           # Social feed + Momento del Día
│   │   ├── students/       # Student roster + profiles
│   │   ├── attendance/     # Roll call interface
│   │   ├── grades/         # Grade book
│   │   └── circulares/     # School announcements
│   ├── (parent)/           # Parent-role screens
│   │   ├── feed/           # Filtered feed (their child's class only)
│   │   ├── child/          # Child profile + grades + attendance
│   │   └── circulares/     # School announcements
│   └── (student)/          # Student-role screens (Phase 2+)
├── components/             # Shared UI components
│   ├── ui/                 # Base components (Card, Button, Badge, etc.)
│   ├── feed/               # Feed item components by type
│   ├── school/             # School-themed wrapper components
│   └── qr/                 # QR code generation/display
├── lib/                    # Core logic
│   ├── firebase/           # Firebase config + helpers
│   │   ├── config.ts       # Firebase initialization
│   │   ├── auth.ts         # Authentication helpers
│   │   ├── db.ts           # Firestore helpers + offline config
│   │   └── fcm.ts          # Push notification setup
│   ├── stores/             # Zustand state stores
│   │   ├── authStore.ts    # User auth state
│   │   ├── schoolStore.ts  # Active school context
│   │   ├── feedStore.ts    # Feed items
│   │   └── syncStore.ts    # Offline sync queue status
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Pure utility functions
│   ├── i18n/               # Translation files
│   │   ├── es.json         # Spanish translations
│   │   └── en.json         # English translations
│   └── types/              # TypeScript type definitions
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   ├── triggers/       # Firestore triggers (auto-generate feed items)
│   │   ├── notifications/  # FCM push notification logic
│   │   └── api/            # HTTP callable functions
│   └── package.json
├── assets/                 # Static assets (icons, splash)
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Composite indexes
└── app.json                # Expo config
```

## Architecture Decisions

### Multi-Tenant School Workspaces
Each school is a top-level document in `/schools/{schoolId}`. All school-specific data lives in subcollections under that school. This provides clean data isolation and simpler security rules. See SCHEMA.md for full database design.

### Offline-First Strategy
- Firestore persistence is enabled by default (`experimentalForceLongPolling` for React Native)
- All reads go through Firestore cache first
- Writes go to local cache immediately, sync when online
- The app NEVER blocks on network requests for core features
- A `syncStore` tracks pending writes and shows sync status in the UI

### Auto-Generated Feed
The social feed is the heart of the app. Feed content comes from two sources:

**Manual posts (always available):**
- "Momento del Día" — teacher writes one sentence about what happened in class
- Circulares — school-wide announcements from administrators
- Homework reminders — teacher posts assignment with due date

**Auto-generated posts (only when features are enabled):**
- When a teacher takes attendance → feed item (only if school has `features.attendance = true`)
- When grades are entered → feed item (only if school has `features.grades = true`)
- Achievement milestones → feed item (only if relevant feature is enabled)

Many Venezuelan schools already use another platform for grades and attendance. MiCole does NOT force them to switch. By default, grades and attendance features are OFF. Schools toggle them on when ready. The app's initial value is the communication layer: momentos, circulares, and school updates.

### Feature Toggles
Every school has a `features` config and a separate `parentVisibility` config in Firestore. This creates a two-layer system:
- **Feature toggle**: Controls whether the feature exists at all in the school's workspace (UI shows/hides entire tabs and entry points)
- **Parent visibility**: Controls whether parents can see data from that feature (even if teachers use it internally, parents may not see it)

Example: A school enables `features.attendance = true` so teachers can track it, but sets `parentVisibility.attendance = false` because they send attendance reports through another channel. The teacher sees the Attendance tab. The parent does not.

All components MUST check `schoolSettings.features.X` before rendering. All feed auto-generation MUST check the toggle before creating items. All parent views MUST check `schoolSettings.parentVisibility.X` before displaying data.

### Parent Onboarding
Each student has a unique token stored in their Firestore document. This token generates a QR code visible only to teachers/coordinators. Parents scan the QR or receive a short link, which opens the app and registers them as that student's parent. No WhatsApp, no phone numbers exchanged.

### Role-Based Access
- **Teacher**: Full access to their classes. Can see all students, take attendance, enter grades, post momentos, view emotional check-ins, see parent engagement metrics, access teacher-only chat.
- **Parent**: Can ONLY see data for their own child(ren). Sees filtered feed for their child's class + school-wide circulares.
- **Coordinator/Admin**: Can see all classes in their school. Can post circulares. Can manage teacher assignments.
- **Student**: (Phase 2) Can see their own grades, homework, and participate in feed.

### Conflict Resolution (Grades)
DO NOT use last-write-wins for grades. Grades use field-level ownership:
- Teacher owns the `grade` field
- Student owns the `submissionStatus` field (Phase 2, when Classroom sync is added)
- If a conflict is detected, show the teacher a resolution UI — never silently overwrite

### i18n
- Spanish is the default language
- All user-facing strings go through react-i18next, NEVER hardcode Spanish strings
- Translation keys use dot notation: `feed.momento.placeholder`, `attendance.save`, etc.
- Venezuelan Spanish conventions: "representante" not "padre de familia", "lapso" not "trimestre", "boletín" not "boleta"

## Coding Standards

### TypeScript
- Strict mode enabled, no `any` types
- All Firestore documents have corresponding TypeScript interfaces in `lib/types/`
- Use discriminated unions for feed item types

### Components
- Functional components only, no class components
- Props interfaces defined and exported for every component
- Use `memo()` for list item components (feed items, student cards)
- All components must accept a `testID` prop for testing

### Firebase
- Never import Firebase modules at the top level of a component — use lazy imports or the helper files in `lib/firebase/`
- All Firestore queries must include a `.where('schoolId', '==', activeSchoolId)` or use the subcollection path — NEVER query across schools
- Enable offline persistence in `lib/firebase/config.ts` before any other Firebase calls

### State Management
- Zustand for client-side state (UI state, active school, cached data)
- Firestore for persistent data (grades, attendance, feed)
- Do NOT duplicate Firestore data in Zustand unless needed for offline display
- Sync status lives in Zustand and shows a small indicator in the header

### Feature Gating
- Use a `useFeature(featureName)` hook that reads from `schoolStore.settings.features`
- Use a `useParentVisible(featureName)` hook for parent-facing components
- Every screen, tab, and component related to grades or attendance MUST be wrapped in a feature gate
- Bottom navigation tabs dynamically show/hide based on enabled features
- Cloud Functions that generate feed items or send notifications MUST check the school's feature config before acting
- The feature toggle UI is accessible only to admin/coordinator roles in school settings

### Error Handling
- All Firebase operations wrapped in try/catch
- Offline errors are NOT shown to the user — the app should silently queue and retry
- Network errors show a non-blocking toast: "Sin conexión — los cambios se guardarán cuando vuelvas a conectarte"
- Authentication errors redirect to login

### Accessibility
- All touchable elements have minimum 44x44dp hit targets
- All images have alt text
- Color is never the ONLY indicator of state (always pair with icon or text)
- Support for system font scaling

## Commands

```bash
# Development
npx expo start                    # Start dev server
npx expo start --android          # Start on Android device/emulator

# Testing
npm test                          # Run Jest tests
npm run test:watch                # Watch mode

# Firebase
cd functions && npm run build     # Build Cloud Functions
firebase deploy --only functions  # Deploy Cloud Functions
firebase deploy --only firestore  # Deploy Firestore rules

# Build
eas build --platform android --profile preview   # Build Android APK for testing
```

## Critical Reminders

1. OFFLINE FIRST. If you're writing code that fails without internet, you're doing it wrong. Test every feature with airplane mode ON.
2. Every Firestore write should assume it might not sync for hours. Design accordingly.
3. The feed is the heart of the app. If the feed feels dead or empty, the app fails. Auto-generate aggressively.
4. Venezuelan school terminology: lapso (not trimestre), representante (not padre), boletín (not boleta), sección (not salón), plantel (not escuela when formal).
5. Grade scale is 1-20, not 1-100, not A-F. Colors: green >= 16, yellow >= 10, red < 10.
6. NEVER expose teacher personal info (phone, email) to parents through any UI or API.
