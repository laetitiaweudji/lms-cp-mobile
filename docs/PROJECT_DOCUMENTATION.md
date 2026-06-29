# SCP Portal Mobile — Project Documentation

A complete record of this repository from its creation to its current
state: what was built, why, in what order, and how the pieces fit together.
For testing specifically, see [`testing/README.md`](./testing/README.md).

---

## 1. What this is

**SCP Portal Mobile** is a React Native (Expo) companion app for *SCP
Portal*, an existing School Communication Platform built as a Next.js +
Supabase web app. The web app supports 4 roles (Admin, Teacher, Student,
Parent); the mobile app covers 3 — **Admin stays web-only**. Logging in as
an admin on mobile is explicitly rejected with a message directing the user
to the web portal.

**Stack:** Expo SDK 56, `expo-router` (file-based navigation), Supabase
(`@supabase/supabase-js`) for auth, `@tanstack/react-query` for data
fetching/caching, NativeWind v4 (Tailwind for React Native) for styling
matched to the web app's design system, `@gorhom/bottom-sheet` for modals,
`expo-audio` for lecture recording/playback, `react-native-mmkv` (encrypted)
+ `expo-secure-store` for session storage.

## 2. How this repo came to exist

The repo originally held an unrelated Flutter prototype (`5176760`), which
was removed (`ed7d17e`) to start fresh once the decision was made to build
in React Native/Expo instead. Everything described below was built from an
empty repository (aside from `.git`) over a single continuous session,
organized into one git branch per logical phase, following the project's
existing gitflow convention (`<issue-number>-<short-description>` branch
names, several of which already existed on the remote as empty placeholders
before this work began).

## 3. Build timeline (phase → branch → what shipped)

| # | Branch | What shipped |
|---|---|---|
| 0 | `setup-expo-mobile-project` | Expo scaffold, NativeWind, Google Fonts (Geist, Geist Mono, Playfair Display, DM Sans), design tokens (color scales, per-role themes, avatar gradients) |
| 1 | `build-login-screen` | Supabase auth (`AuthProvider`), encrypted MMKV+SecureStore session storage, Login + Reset Password screens, 3-fail lockout, admin rejection, per-role route guards — **merged to `develop` via PR #10** |
| 2 | `2-configure-api-connection` | Typed `apiClient` (Bearer token attachment, `{error}` normalization, 401 auto-logout), React Query wiring, shared change-password/avatar-upload |
| 3 | `3-shared-ui-and-tab-navigation` | Shared component library (StatCard, HeroBanner, Badge, ScoreBadge, AvatarCircle, EmptyState, buttons), bottom-sheet system, `ThemeProvider` (per-role colors via NativeWind CSS vars), all 3 bottom-tab navigators |
| 4 | `5-build-student-dashboard` | All 8 Student screens wired to real endpoints |
| 5 | `6-build-teacher-dashboard` | All 7 Teacher screens — **reads via direct Supabase queries, writes via the API** (architecture detail in §5) |
| 6 | `build-parent-dashboard` | All 5 Parent screens wired to `/api/parent/*` |
| 7 | `7-file-uploads` | Material file upload (`expo-document-picker`, type/size validation) |
| 8 | `8-audio-recording` | Lecture recording (`expo-audio`), embedded audio playback |
| 9 | `9-polish-pass` | Loading-state fix (8 screens), backend-changelog response (disabled accounts, grade shape, recording MIME format), defensive null-guards across Teacher/Parent after live-data testing surfaced 2 real crash bugs, EAS Build setup |
| 11 | `11-testing-infrastructure` | Jest unit tests (37 tests), QA test cases, UAT scenarios, load-test script, security review |

Each phase was verified with `tsc --noEmit`, `expo export` (bundle build),
and `expo-doctor` before moving to the next — all clean throughout. Phase
10 doesn't exist as a separate branch; the backend-changelog/crash-bug
fixes landed on `9-polish-pass` directly.

## 4. High-level architecture

```mermaid
flowchart LR
    subgraph Mobile["SCP Portal Mobile (Expo / React Native)"]
        Screens["Screens (app/)"]
        Hooks["React Query hooks (src/hooks)"]
        ApiClient["apiClient (src/lib/api/client.ts)"]
        SupaClient["Supabase client (src/lib/supabase)"]
        Screens --> Hooks
        Hooks --> ApiClient
        Hooks --> SupaClient
    end

    ApiClient -- "Authorization: Bearer token" --> NextAPI["Next.js API routes\n/api/student/* /api/parent/* /api/teacher/{stats,announcements,grades,materials,recordings}"]
    SupaClient -- "RLS-scoped direct queries\n(Teacher reads only)" --> Supabase[("Supabase\nPostgres + Auth + Storage")]
    NextAPI --> Supabase
```

## 5. The hybrid data-access architecture (Teacher vs Student/Parent)

This is the single most important architectural fact about this codebase,
discovered mid-build (not in the original spec) and confirmed with the
backend team: **Student and Parent go through API routes for everything.
Teacher reads go straight to Supabase; only Teacher writes go through the
API.**

```mermaid
flowchart TD
    subgraph TeacherReads["Teacher — reads"]
        T1["Teacher screens\n(courses, grades, announcements,\nmaterials, recordings lists)"] -->|"direct query,\nRLS is the only gate"| DB[("Supabase Postgres")]
    end
    subgraph TeacherWrites["Teacher — writes"]
        T2["Create/edit announcement,\ncreate/edit/delete grade,\nupload material/recording"] -->|"Bearer token"| API1["/api/teacher/*"]
        API1 --> DB
    end
    subgraph StudentParent["Student & Parent — everything"]
        SP["All Student/Parent screens"] -->|"Bearer token"| API2["/api/student/* and /api/parent/*"]
        API2 --> DB
    end
```

**Why:** the backend's `GET /api/teacher/*` list routes simply don't exist
— only `GET /teacher/stats` and the mutation routes are real API endpoints.
This mirrors the web app's own code, where Teacher pages always queried
Supabase directly and never went through the API-route rewrite that
Student/Parent got. **Consequence:** Teacher-read correctness depends
entirely on Supabase RLS policies being correct on `courses`, `materials`,
`recordings`, and `announcements` — and as of this writing, the backend
team had only confirmed/fixed RLS on `grades`, leaving those four
unaudited. This is a real, open risk tracked in §9.

## 6. Authentication flow

```mermaid
sequenceDiagram
    actor User
    participant App as Mobile App
    participant Auth as Supabase Auth
    participant DB as profiles table

    User->>App: Enter email/password, tap Sign In
    App->>Auth: signInWithPassword(email, password)
    alt invalid credentials
        Auth-->>App: error
        App-->>User: "Invalid credentials. N attempt(s) remaining."
        Note over App: After 3 failures: 30s lockout banner + countdown
    else success
        Auth-->>App: session (access_token, refresh_token)
        App->>DB: SELECT role, full_name, email, avatar_url WHERE id = user.id
        DB-->>App: profile row
        alt role == admin
            App->>Auth: signOut()
            App-->>User: "Admin accounts should use the web portal."
        else role == teacher/student/parent
            App->>App: persist session (encrypted MMKV + SecureStore-held key)
            App-->>User: redirect to role's tab navigator
        end
    end
```

Session persistence detail: Supabase session JSON routinely exceeds
`expo-secure-store`'s safe per-item size (~2KB), so the session itself is
stored in **encrypted MMKV**, with SecureStore holding only the small
random encryption key — neither piece is useful without the other.

## 7. API request lifecycle (Bearer auth, 401/403 handling)

```mermaid
sequenceDiagram
    participant App as apiClient
    participant API as Next.js /api/*
    participant Auth as Supabase

    App->>App: getSession() → access_token
    App->>API: request + "Authorization: Bearer <token>"
    API->>Auth: verify token (proxy.ts middleware)
    alt token missing/expired
        API-->>App: 401 { error: "Unauthorized" }
        App->>Auth: signOut()
        Note over App: Every role-guarded route's <Redirect> sends user to /login
    else account disabled
        API-->>App: 403 { error: "Account disabled" }
        App->>Auth: signOut()
    else ordinary 403 (role mismatch)
        API-->>App: 403 { error: "Forbidden" }
        Note over App: Surfaced as a catchable error — NOT a forced logout
    else success
        API-->>App: 200 + JSON body
    end
```

This exact logic is what's covered by the `apiClient` unit tests (see
`src/lib/api/__tests__/client.test.ts`) — including the important
distinction that a disabled-account 403 forces logout but an ordinary
role-mismatch 403 does not.

## 8. Navigation structure

```mermaid
flowchart TD
    Root["Root Layout\n(fonts, QueryClient, AuthProvider, ThemeProvider, BottomSheetProvider)"]
    Root --> Resolver["index.tsx\n(redirect resolver)"]
    Root --> AuthGroup["(auth) group"]
    AuthGroup --> Login[login.tsx]
    AuthGroup --> Reset[reset-password.tsx]

    Resolver -- role=teacher --> TTabs["(teacher) tabs"]
    Resolver -- role=student --> STabs["(student) tabs"]
    Resolver -- role=parent --> PTabs["(parent) tabs"]
    Resolver -- unauthenticated --> Login

    TTabs --> TDash[Dashboard]
    TTabs --> TCourses["My Courses"]
    TCourses --> TDetail["[id] Course Detail (pushed route)"]
    TTabs --> TAnn[Announcements]
    TTabs --> TGrades[Grades]
    TTabs --> TRec[Recordings]
    TTabs --> TProfile[Profile]

    STabs --> SDash[Dashboard]
    STabs --> SCourses[Courses]
    STabs --> SGrades[Grades]
    STabs --> SAnn[Announcements]
    STabs --> SMore["More (nested stack)"]
    SMore --> SMaterials[Materials]
    SMore --> SRecordings[Recordings]
    SMore --> SResults[Results]
    SMore --> SSettings[Settings]

    PTabs --> PDash[Dashboard]
    PTabs --> PChildren["My Students"]
    PTabs --> PGrades[Grades]
    PTabs --> PAnn[Announcements]
    PTabs --> PProfile[Profile]
```

Rule of thumb used throughout: any row-tap detail that isn't its own
spec'd screen opens a **bottom sheet** (announcement detail, a student's
grades within a course, a child's detail) instead of a pushed route. Only
Teacher's Course Detail is a real route, since the spec calls it out as a
distinct screen.

## 9. Use case diagrams

### Teacher

```mermaid
flowchart LR
    Teacher(["Teacher"])
    Teacher --> UC1(["View dashboard stats\n& quick actions"])
    Teacher --> UC2(["Browse assigned courses\n& view course detail"])
    Teacher --> UC3(["Post / edit a course\nor global announcement"])
    Teacher --> UC4(["View students enrolled\nin a course"])
    Teacher --> UC5(["Enter / edit / delete\na student's grade"])
    Teacher --> UC6(["Record a lecture\n& upload it"])
    Teacher --> UC7(["Upload a course material file"])
    Teacher --> UC8(["Update avatar\n& change password"])
    Teacher --> UC9(["Sign out"])
```

### Student

```mermaid
flowchart LR
    Student(["Student"])
    Student --> SC1(["View dashboard summary\n(courses, average, deadlines)"])
    Student --> SC2(["Browse & search\nenrolled courses"])
    Student --> SC3(["View grades & standing,\noptionally filtered by course"])
    Student --> SC4(["View announcements\nwith urgency badges"])
    Student --> SC5(["Download course materials"])
    Student --> SC6(["Open lecture recordings"])
    Student --> SC7(["View official semester results"])
    Student --> SC8(["Change password / sign out"])
```

### Parent

```mermaid
flowchart LR
    Parent(["Parent"])
    Parent --> PC1(["View dashboard\n(linked students, recent activity)"])
    Parent --> PC2(["View list of linked children"])
    Parent --> PC3(["Select a child & view\ntheir grades + average"])
    Parent --> PC4(["View announcements"])
    Parent --> PC5(["View own profile\n& linked students"])
    Parent --> PC6(["Change password / sign out"])
```

## 10. Core module structure (class diagram)

```mermaid
classDiagram
    class AuthProvider {
        -session: Session
        -profile: MobileProfile
        -status: loading|unauthenticated|authenticated|admin_rejected
        +signIn(email, password) SignInResult
        +signOut() void
        +acknowledgeAdminRejection() void
    }
    class apiClient {
        +get(path, query) T
        +post(path, body) T
        +patch(path, body) T
        +delete(path, body) T
        +upload(path, formData) T
    }
    class ApiError {
        +status: number
        +message: string
    }
    class secureStorage {
        +getItem(key) string
        +setItem(key, value) void
        +removeItem(key) void
    }
    class useLockout {
        +isLocked: boolean
        +remainingSeconds: number
        +attemptsRemaining: number
        +recordFailure() void
        +reset() void
    }
    class BottomSheetProvider {
        +open(content, options) void
        +close() void
    }

    AuthProvider ..> secureStorage : session persisted via
    AuthProvider ..> useLockout : Login screen composes both
    apiClient ..> ApiError : throws
    apiClient ..> AuthProvider : signOut() on 401/disabled-403
```

## 11. Data model (as confirmed against the live API, not just the spec)

```mermaid
erDiagram
    PROFILES ||--o{ ENROLLMENTS : "student_id"
    PROFILES ||--o{ COURSES : "teacher_id"
    PROFILES ||--o{ GRADES : "student_id"
    PROFILES ||--o{ GRADES : "teacher_id"
    PROFILES ||--o{ ANNOUNCEMENTS : "teacher_id"
    COURSES ||--o{ ENROLLMENTS : "course_id"
    COURSES ||--o{ GRADES : "course_id"
    COURSES ||--o{ ANNOUNCEMENTS : "course_id (nullable)"
    COURSES ||--o{ MATERIALS : "course_id"
    COURSES ||--o{ RECORDINGS : "course_id"

    PROFILES {
        uuid id
        string full_name
        string email
        string role
        string avatar_url
    }
    COURSES {
        uuid id
        string title
        string code
        string description
        uuid teacher_id
    }
    ENROLLMENTS {
        uuid student_id
        uuid course_id
    }
    GRADES {
        uuid id
        string assessment_name
        string assessment_type
        int score
        int max_score
        uuid course_id
        uuid student_id
        uuid teacher_id
    }
    ANNOUNCEMENTS {
        uuid id
        string title
        string content
        date deadline
        uuid course_id "nullable - null means global"
        boolean is_global
        string target_role
    }
    MATERIALS {
        uuid id
        string title
        string file_url
        uuid course_id
    }
    RECORDINGS {
        uuid id
        string title
        string description
        string file_url
        uuid course_id
    }
```

**Important, hard-won detail:** `ANNOUNCEMENTS.course_id` is nullable
(global announcements), and the joined `courses` object can come back
`null` even on endpoints the original spec didn't flag as nullable. This
was discovered by testing the live API with a real account mid-build (see
§13) and is now defensively guarded everywhere across Student, Teacher, and
Parent screens.

## 12. Screens inventory

| Role | Screens |
|---|---|
| Auth | Login, Reset Password |
| Teacher (7) | Dashboard, My Courses, Course Detail, Announcements, Grades, Recordings, Profile |
| Student (8) | Dashboard, Courses, Grades, Announcements, More→Materials, More→Recordings, More→Results, More→Settings |
| Parent (5) | Dashboard, My Students, Grades, Announcements, Profile |

## 13. Real-world verification, not just static checks

Every phase passed `tsc --noEmit`, `expo export`, and `expo-doctor` — but
those only prove the code *compiles*. Three things made this build
meaningfully more trustworthy than "it builds":

1. **A real backend bug was found and reported, not assumed.** Early on,
   the backend's `proxy.ts` middleware only recognized browser cookies,
   silently rejecting every mobile request before the Bearer-token logic
   in `requireAuth()` ever ran — confirmed by logging in for real and
   sending a valid token to the live API, which came back `401` until the
   fix was deployed.
2. **Two real crash bugs were found via live data, not code review.**
   Once the backend fix was live, logging in with a real student account
   and hitting the real `/student/dashboard` and `/student/announcements`
   endpoints surfaced response shapes the original spec didn't document
   (`courses: null` for global announcements; the dashboard's embedded
   grades missing fields the dedicated endpoint has). Both were fixed and
   re-verified against the live API; the same risk class was then
   defensively guarded across Teacher and Parent screens even without
   live credentials to reproduce it there.
3. **A real recording-format bug was caught before any user hit it.**
   `expo-audio`'s default recording preset produces `.m4a` (`audio/mp4`),
   which was never in the backend's accepted upload list
   (`audio/webm`/`mpeg`/`wav`/`ogg`) — every recording upload would have
   silently failed. Replaced with a custom config (WAV via Linear PCM on
   iOS; webm on Android, flagged as unverified without a physical device).

## 14. Known open risks (as of this writing)

- **Teacher RLS unaudited** on `courses`, `materials`, `recordings`,
  `announcements` (only `grades` confirmed fixed by the backend team) — see
  §5.
- **Parent `student_id` authorization** on `/api/parent/grades` not yet
  confirmed server-side (a parent could request a `student_id` that isn't
  their own child; whether the backend rejects it is unverified).
- **Android recording format unverified on a physical device** (§13.3).
- **Teacher and Parent flows have not been tested with a real login**, only
  defensively hardened against the failure pattern found in Student.
- No screen has been visually confirmed on a device by a human yet.

## 15. Where to go next

See [`testing/README.md`](./testing/README.md) for the full testing
strategy (unit tests, QA test cases, UAT scenarios, load testing, security
review) and exactly how/where to run each one.
