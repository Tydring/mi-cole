# SCHEMA.md — MiCole Firestore Database Design

## Multi-Tenant Architecture

Every school is a top-level document. All school-specific data lives in subcollections under `/schools/{schoolId}/`. This provides:
- Clean data isolation (security rules scope to schoolId)
- Simple queries (no `.where('schoolId', '==', ...)` needed on every query)
- Independent scaling per school
- Easy data export/deletion per school

## Global Collections

### `/users/{userId}`
The global user profile. Exists independently of any school. Follows the user across schools.

```typescript
interface User {
  id: string;                          // Firebase Auth UID
  email: string;                       // Gmail address
  displayName: string;
  photoURL?: string;                   // Google profile photo
  role: 'teacher' | 'parent' | 'coordinator' | 'admin';
  schools: string[];                   // Array of schoolIds they belong to
  activeSchoolId: string;              // Currently selected school
  language: 'es' | 'en';              // UI language preference
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
  
  // Teacher-specific (portable across schools)
  teacherProfile?: {
    yearsOnPlatform: number;
    totalStudentsManaged: number;
    totalClassesManaged: number;
    achievements: string[];            // Badge IDs that travel with the teacher
    verifiedTeacher: boolean;          // Confirmed by at least one school
  };
}
```

---

## School-Scoped Collections

### `/schools/{schoolId}`
The school workspace configuration.

```typescript
interface School {
  id: string;
  name: string;                        // "U.E. Colegio San José"
  shortName: string;                   // "San José"
  motto?: string;                      // "Educando con Fe y Valores"
  type: 'public' | 'subsidized' | 'private' | 'fe_y_alegria';
  
  // Branding
  theme: {
    primaryColor: string;              // Hex color, e.g., "#1e3a5f"
    secondaryColor: string;            // Hex color
    accentColor: string;               // Hex color
    logoURL?: string;                  // Firebase Storage URL
  };
  
  // Location
  city: string;
  state: string;                       // Venezuelan state (Caracas, Miranda, etc.)
  
  // Configuration
  settings: {
    gradesScale: { min: 1; max: 20 };  // Venezuelan default
    passingGrade: 10;
    currentLapso: 1 | 2 | 3;
    currentSchoolYear: string;         // "2025-2026"
    
    // Feature toggles — schools enable what they need
    features: {
      grades: boolean;                 // Grade tracking (default: false — many schools use external platforms)
      attendance: boolean;             // Attendance tracking (default: false)
      moments: boolean;                // Momento del Día posts (default: true)
      circulares: boolean;             // School announcements (default: true)
      homework: boolean;               // Homework posts in feed (default: true)
      emotionalCheckins: boolean;      // Phase 3 (default: false)
    };
    
    // Parent visibility — what parents can see (independent of feature toggle)
    parentVisibility: {
      grades: boolean;                 // Show grades to parents (default: false)
      attendance: boolean;             // Show attendance to parents (default: false)
      moments: boolean;                // Show momentos to parents (default: true)
      circulares: boolean;             // Show circulares to parents (default: true)
      homework: boolean;               // Show homework to parents (default: true)
    };
  };
  
  // Metadata
  createdBy: string;                   // userId of creator
  createdAt: Timestamp;
  memberCount: number;                 // Denormalized count
  verified: boolean;                   // Confirmed by second teacher
}
```

---

### `/schools/{schoolId}/members/{userId}`
Maps users to their role within this specific school.

```typescript
interface SchoolMember {
  userId: string;
  role: 'teacher' | 'parent' | 'coordinator' | 'admin';
  displayName: string;                 // Denormalized for quick display
  joinedAt: Timestamp;
  
  // Teacher-specific
  assignedSections?: string[];         // ["4to A", "5to B"]
  subjects?: string[];                 // ["Matemáticas", "Ciencias"]
  
  // Parent-specific
  childrenIds?: string[];              // Student doc IDs in this school
}
```

---

### `/schools/{schoolId}/sections/{sectionId}`
A class group (e.g., "4to Grado, Sección A").

```typescript
interface Section {
  id: string;
  name: string;                        // "4to A"
  grade: string;                       // "4to"
  section: string;                     // "A"
  teacherId: string;                   // Primary homeroom teacher
  additionalTeacherIds: string[];      // Subject teachers
  studentCount: number;                // Denormalized
  schoolYear: string;                  // "2025-2026"
  createdAt: Timestamp;
}
```

---

### `/schools/{schoolId}/students/{studentId}`
A student enrolled in this school.

```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;                 // "María García"
  sectionId: string;                   // Reference to section
  sectionName: string;                 // Denormalized: "4to A"
  
  // Parent onboarding
  parentToken: string;                 // UUID — used to generate QR code
  parentLinked: boolean;               // Has a parent scanned the QR?
  parentUserId?: string;              // Linked parent's userId
  
  // Optional student self-access (Phase 2)
  studentToken?: string;              // Separate token for student login
  studentLinked: boolean;
  studentUserId?: string;
  
  // Stats (denormalized for quick display)
  currentAverage: number;              // Recalculated on grade entry
  attendanceRate: number;              // Percentage, recalculated daily
  currentStreak: number;               // Consecutive present days
  longestStreak: number;
  
  // Achievements
  badges: string[];                    // ["perfect_week", "honor_roll"]
  
  // Emotional check-in (Phase 3)
  lastMood?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited';
  lastMoodDate?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### `/schools/{schoolId}/attendance/{date}`
One document per day. The date is the document ID in format `YYYY-MM-DD`.

```typescript
interface AttendanceRecord {
  date: string;                        // "2026-02-13"  (also the doc ID)
  sectionId: string;
  sectionName: string;                 // Denormalized
  takenBy: string;                     // Teacher userId
  takenAt: Timestamp;
  
  // Map of studentId → status
  records: {
    [studentId: string]: {
      status: 'present' | 'absent' | 'late' | 'excused';
      note?: string;                   // Optional reason
      updatedAt: Timestamp;
    };
  };
  
  // Summary (denormalized for feed generation)
  summary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
  
  // Sync metadata
  syncedToCloud: boolean;              // False if created offline
  lastSyncAt?: Timestamp;
}
```

**Index needed**: `sectionId` + `date` (descending) for querying attendance by section.

---

### `/schools/{schoolId}/grades/{gradeId}`
Individual grade entries. One per student per subject per evaluation.

```typescript
interface Grade {
  id: string;
  studentId: string;
  studentName: string;                 // Denormalized
  sectionId: string;
  subject: string;                     // "Matemáticas"
  
  // Grade data
  grade: number;                       // 1-20 scale
  maxGrade: number;                    // Usually 20
  evaluationType: 'exam' | 'assignment' | 'participation' | 'project' | 'quiz';
  evaluationName: string;              // "Examen Parcial Semana 8"
  lapso: 1 | 2 | 3;
  weight?: number;                     // Percentage weight of this evaluation
  
  // Ownership (for conflict resolution)
  enteredBy: string;                   // Teacher userId
  enteredAt: Timestamp;
  
  // Sync metadata
  syncedToCloud: boolean;
  lastSyncAt?: Timestamp;
  
  // Conflict resolution
  hasConflict: boolean;
  conflictData?: {
    localGrade: number;
    remoteGrade: number;
    localTimestamp: Timestamp;
    remoteTimestamp: Timestamp;
  };
}
```

**Indexes needed**:
- `studentId` + `lapso` + `subject` (for student grade report)
- `sectionId` + `lapso` + `subject` (for teacher gradebook view)
- `sectionId` + `subject` + `enteredAt` desc (for recent grades feed)

---

### `/schools/{schoolId}/feed/{feedId}`
The social feed. Auto-generated and manual posts.

```typescript
interface FeedItem {
  id: string;
  type: 'momento' | 'attendance' | 'grades' | 'achievement' | 'circular' | 'homework';
  
  // Scope
  sectionId?: string;                  // null for school-wide (circulares)
  sectionName?: string;
  schoolWide: boolean;                 // true = visible to all parents in school
  
  // Content
  authorId: string;                    // Teacher userId or 'system'
  authorName: string;                  // Denormalized
  authorRole: 'teacher' | 'coordinator' | 'admin' | 'system';
  content: string;                     // The main text
  
  // Engagement
  likeCount: number;
  viewCount: number;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  pinned: boolean;                     // Pinned to top of feed
  teacherOnly: boolean;                // If true, hidden from parent feed (e.g., attendance/grade items when parentVisibility is off)
  
  // Type-specific data
  metadata?: {
    // For 'attendance' type
    attendanceDate?: string;
    presentCount?: number;
    totalCount?: number;
    
    // For 'grades' type
    subject?: string;
    evaluationName?: string;
    
    // For 'achievement' type
    studentId?: string;
    studentName?: string;
    achievementType?: string;
    
    // For 'homework' type
    dueDate?: string;
    subject?: string;
  };
}
```

**Indexes needed**:
- `sectionId` + `createdAt` desc (section feed)
- `schoolWide` + `createdAt` desc (school-wide feed)
- `type` + `createdAt` desc (filter feed by type)

---

### `/schools/{schoolId}/feed/{feedId}/likes/{userId}`
Tracks who liked a feed item.

```typescript
interface FeedLike {
  userId: string;
  createdAt: Timestamp;
}
```

---

### `/schools/{schoolId}/feed/{feedId}/views/{userId}`
Tracks who viewed a feed item (for parent engagement metrics).

```typescript
interface FeedView {
  userId: string;
  viewedAt: Timestamp;
}
```

---

### `/schools/{schoolId}/circulares/{circularId}`
School-wide announcements. Also appear in the feed, but stored separately for the dedicated Circulares tab.

```typescript
interface Circular {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: 'coordinator' | 'admin';
  
  priority: 'normal' | 'important' | 'urgent';
  
  // Tracking
  totalParents: number;                // How many parents should see this
  viewedBy: number;                    // Denormalized count
  
  createdAt: Timestamp;
  expiresAt?: Timestamp;               // Auto-hide after this date
}
```

---

## Denormalization Strategy

Firestore is not a relational database. We denormalize aggressively for read performance and offline usability:

| Denormalized Field | Source | Updated When |
|---|---|---|
| `student.currentAverage` | Calculated from grades subcollection | On grade entry (Cloud Function) |
| `student.attendanceRate` | Calculated from attendance records | On attendance save (Cloud Function) |
| `student.currentStreak` | Calculated from consecutive present days | On attendance save (Cloud Function) |
| `feedItem.authorName` | From user profile | On user profile update (Cloud Function) |
| `section.studentCount` | Count of students in section | On student add/remove (Cloud Function) |
| `school.memberCount` | Count of members collection | On member add/remove (Cloud Function) |
| `attendance.summary` | Count of each status in records map | On attendance save (client-side) |
| `circular.viewedBy` | Count of views subcollection | On view (Cloud Function increment) |

## Security Rules Overview

```
// Pseudocode — actual rules in firestore.rules

/users/{userId}
  - Read: own document only
  - Write: own document only

/schools/{schoolId}
  - Read: must be a member of this school
  - Write: admin/coordinator only for settings; any member for joining
  
  /members/{userId}
    - Read: any school member
    - Write: admin for role changes; self for joining
    
  /students/{studentId}
    - Read: teachers/coordinators of this school, OR linked parent (parentUserId matches)
    - Write: teachers/coordinators only
    - parentToken: readable ONLY by teachers/coordinators (NEVER by parents)
    
  /attendance/{date}
    - Read: teachers/coordinators of this school
    - Write: teachers only
    
  /grades/{gradeId}
    - Read: teacher who entered it, OR linked parent of that student
    - Write: teacher only, NEVER overwrite if hasConflict is true without explicit resolution
    
  /feed/{feedId}
    - Read: school members (filtered by sectionId for parents)
    - Write: teachers (momentos), coordinators/admin (circulares), system (auto-generated)
    
  /circulares/{circularId}
    - Read: all school members
    - Write: coordinators/admin only
```
