# Testing — SCP Portal Mobile

This project has four distinct kinds of testing, each living in a different
place and run a different way. This doc is the map.

## 1. Unit tests (automated)

**Where:** colocated with the code, in `__tests__` folders — e.g.
`src/utils/__tests__/date.test.ts`, `src/lib/api/__tests__/client.test.ts`.
New tests should follow this pattern: a `__tests__` folder next to the file
being tested, not a separate top-level test tree.

**What's covered today:** date/pagination/upload-constraint utils, the
`ApiError` class, the full `apiClient` request/error/upload pipeline
(Bearer token attachment, 401 and disabled-account-403 auto-logout, query
encoding, FormData vs JSON bodies), `useLockout`'s lockout/countdown state
machine, and `ScoreBadge`'s pass/fail color threshold.

**Run:**
```
npm test              # run once
npm run test:watch    # re-run on file changes
npm run test:coverage # with coverage report
```

**When to add more:** any time you write non-trivial logic that doesn't
need a real device to verify (validation rules, data transforms, hook state
machines, API error handling). Don't bother unit-testing pure UI layout —
that's what manual QA (below) and the `verify`/`run` skills are for.

## 2. QA test cases (manual, granular)

**Where:** [`qa-test-cases.md`](./qa-test-cases.md) — one row per testable
behavior, organized by screen, with an ID (e.g. `T-14`), steps, and expected
result.

**Run:** on a real device or dev-client build (see §5 below), with one real
Supabase test account per role. Walk the table top to bottom, mark each row
☐ → ✅/❌, and note the build/commit you tested against.

**When to run:** before any release/demo, and after any change that touches
auth, navigation, or a specific screen (just re-run that screen's rows).

## 3. UAT scenarios (manual, end-to-end)

**Where:** [`uat-scenarios.md`](./uat-scenarios.md) — 5 scenarios written as
real user journeys ("as a teacher, I want to post an announcement, record a
lecture, and grade my students"), for non-technical sign-off rather than
exhaustive screen-by-screen coverage.

**Run:** same setup as QA, but follow each scenario as a continuous flow
without skipping steps. A scenario fails if any step breaks the flow, even
if a later step still "works" in isolation.

**When to run:** before a release, or whenever you need a stakeholder
(not just a developer) to confirm the app actually does what it's supposed
to do.

## 4. Security review (ad-hoc, AI-assisted)

**Where:** no fixed file — run via the `/security-review` skill against the
current diff/branch. Findings get reported in the conversation, not
committed to the repo (they're a snapshot of one review, not a living
checklist).

**Run:** `/security-review` before merging any branch with meaningful new
logic (auth, storage, network, file handling). It scans for HIGH/MEDIUM
confidence vulnerabilities introduced in the diff — it does not audit the
whole codebase from scratch every time, and it does not check the backend
(separate repo) or infrastructure (Supabase RLS, Vercel config).

## 5. Load testing (manual, scripted)

**Where:** [`scripts/load-test.js`](../../scripts/load-test.js).

**Run:**
```
LOAD_TEST_EMAIL=<test-account-email> LOAD_TEST_PASSWORD=<password> \
  npm run load-test -- --path /api/student/dashboard --connections 10 --duration 15
```
Logs in for real via Supabase (same flow the app uses), then hits the given
endpoint concurrently via `autocannon` and prints latency/throughput stats.

**⚠️ Before running this against any deployment:** get explicit consent
from whoever owns that backend/deployment first. This generates real
traffic against the real backend and real Supabase project — running it
without coordinating can look like (and have the effect of) a denial-of-
service attack, and can exhaust database connections shared with real
users. Start with low `--connections`/`--duration` values.

**When to run:** once, deliberately, against a non-production deployment
or a production deployment with the owner's sign-off — not as part of
routine development.

## Tracking test runs as GitHub issues

This repo's branches already follow a `<issue-number>-<description>` gitflow
convention (e.g. `5-build-student-dashboard`). The same pattern works for
testing: file one GitHub issue per QA pass / UAT pass / load-test run (e.g.
"QA: Teacher flow on build abc1234"), paste the relevant rows from
`qa-test-cases.md` or the scenario from `uat-scenarios.md` into the issue
body, and check them off there. That gives you a dated, attributable record
of what was tested and by whom — the markdown files in this folder are the
canonical test *definitions*; the issues are the test *runs*.

## 6. Running the app on a real device

Unit tests run anywhere (`npm test`). Everything else needs the actual app
on a device, which needs a **custom dev client** — `react-native-mmkv`
requires `react-native-nitro-modules` (a native module), so Expo Go alone
won't work. See the project's EAS setup (`eas.json`) — `eas build --profile
development` for an iterative dev-client build, or `--profile production`
for a standalone APK that needs no Metro connection (simpler for one-off QA
runs, but no live reload).
