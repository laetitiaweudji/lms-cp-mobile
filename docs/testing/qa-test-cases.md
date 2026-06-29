# QA Test Cases — SCP Portal Mobile

Manual test cases for the mobile app. Run these against a real device/dev-client
build (Expo Go won't work — see `docs/testing/README.md`) with `EXPO_PUBLIC_API_BASE_URL`
pointed at a deployment that has the Bearer-auth proxy fix live, and one real
Supabase test account per role (teacher / student / parent / admin).

Each case: **ID**, **Precondition**, **Steps**, **Expected Result**. Status column
for tracking runs: ☐ not run / ✅ pass / ❌ fail (note the build/commit tested).

## 1. Authentication

| ID | Precondition | Steps | Expected Result | Status |
|---|---|---|---|---|
| AUTH-01 | Logged out | Open app | Login screen renders: dark gradient, SCP logo, headline, 3 feature chips, white card with Email/Password fields | ☐ |
| AUTH-02 | Valid teacher account | Enter correct email+password, tap Sign In | Button shows "Signing in...", then redirects to Teacher tab navigator | ☐ |
| AUTH-03 | Valid student account | Sign in | Redirects to Student tab navigator | ☐ |
| AUTH-04 | Valid parent account | Sign in | Redirects to Parent tab navigator | ☐ |
| AUTH-05 | Valid admin account | Sign in | Shows "Admin accounts should use the web portal.", signs out, returns to login | ☐ |
| AUTH-06 | Wrong password | Sign in with wrong password once | Shows "Invalid credentials. 2 attempt(s) remaining." | ☐ |
| AUTH-07 | Wrong password x3 | Fail login 3 times in a row | Orange banner "Account locked. Try again in {n}s.", Sign In button disabled, countdown ticks down | ☐ |
| AUTH-08 | Locked out | Wait for countdown to reach 0 | Banner disappears, button re-enabled, attempt counter resets | ☐ |
| AUTH-09 | Login screen | Tap "Forgot password?" | Modal opens: "Reset Password" / "Enter your email to receive a secure reset link." | ☐ |
| AUTH-10 | Forgot-password modal open | Enter email, tap "Send Reset Link" | Button shows "Sending...", then "Reset link sent! Check your email." | ☐ |
| AUTH-11 | Reset email received | Tap the reset link on the phone | Opens app to Reset Password screen, shows "Verifying link..." then the new-password form | ☐ |
| AUTH-12 | Reset Password screen | Enter new password < 6 chars | Shows "Password must be at least 6 characters." | ☐ |
| AUTH-13 | Reset Password screen | Enter mismatched passwords | Shows "Passwords do not match." | ☐ |
| AUTH-14 | Reset Password screen | Enter valid matching password ≥6 chars, submit | "Password updated successfully! Redirecting to login..." then redirects after ~2s | ☐ |
| AUTH-15 | Logged in as teacher | Force-quit and reopen the app | Session persists — lands directly on Teacher tabs, no re-login required | ☐ |
| AUTH-16 | Logged in | Backend returns a 401 on any request (e.g. expired token) | App automatically signs out and returns to login | ☐ |
| AUTH-17 | Logged in | Account gets disabled server-side mid-session, next request | App signs out and returns to login (403 "Account disabled" handling) | ☐ |
| AUTH-18 | Logged in as student | Manually navigate to a teacher-only URL/route | Redirected away, cannot access Teacher screens | ☐ |
| AUTH-19 | Logged out | Manually navigate to any role's tab route | Redirected to login | ☐ |

## 2. Teacher Flow

| ID | Screen | Steps | Expected Result | Status |
|---|---|---|---|---|
| T-01 | Dashboard | Open Teacher Dashboard | Hero "Teacher Workspace", 4 gradient link cards, 3 Quick Action buttons, overview stats (Courses/Announcements/Grades Posted) | ☐ |
| T-02 | Dashboard | Pull to refresh | Stats refetch, spinner shows during refresh | ☐ |
| T-03 | My Courses | Open My Courses | Hero "My Courses", 3 stat cards, list of assigned courses with code badge + "View Course" | ☐ |
| T-04 | My Courses | No courses assigned (test account with 0 courses) | Empty state: "No courses assigned yet." | ☐ |
| T-05 | Course Detail | Tap "View Course" on a course | Navigates to Course Detail; hero shows course title/code/description, 4 stat cards, 4 sections (Students/Materials/Announcements/Recordings) | ☐ |
| T-06 | Course Detail | Course has no materials | Materials section shows "No materials found for this course." | ☐ |
| T-07 | Course Detail | Course has recordings with audio | Embedded audio player shows with play/pause + time | ☐ |
| T-08 | Announcements | Open Announcements | Hero "Course Announcements", create form, search box, list of announcements | ☐ |
| T-09 | Announcements | Fill form (course, title, message), tap "Publish Announcement" | Button shows "Publishing...", new announcement appears in list after success | ☐ |
| T-10 | Announcements | Tap an announcement card | Detail bottom-sheet opens with Course/Deadline/Posted/Type + related materials | ☐ |
| T-11 | Announcements | Tap "Edit Announcement" on own announcement | Form populates with existing values, course select disabled, "Update Announcement" + Cancel shown | ☐ |
| T-12 | Announcements | Edit and submit | Announcement updates in list | ☐ |
| T-13 | Announcements | View another teacher's global announcement | No "Edit Announcement" option shown (not the owner) | ☐ |
| T-14 | Grades | Open Grades | Hero "Grade Management", entry form, "Students In Course" picker, "Recent Grades" list | ☐ |
| T-15 | Grades | Select course in entry form | Student select becomes enabled, populated with enrolled students | ☐ |
| T-16 | Grades | Enter score > max score, submit | Client-side validation blocks submit with an error message before any request fires | ☐ |
| T-17 | Grades | Fill valid grade entry, submit | "Saving...", then new grade appears in Recent Grades | ☐ |
| T-18 | Grades | Tap a student under "Students In Course" | Bottom-sheet shows that student's grades in the selected course | ☐ |
| T-19 | Grades | Student has no grades in that course | Sheet shows "No grades found for this student in this course." | ☐ |
| T-20 | Grades | Tap pencil icon on a recent grade | Form populates for editing, course/student selects disabled | ☐ |
| T-21 | Grades | Tap trash icon on a recent grade | Confirm sheet: "Delete Grade" / are-you-sure message, Cancel + Delete | ☐ |
| T-22 | Grades | Confirm delete | Grade removed from Recent Grades list | ☐ |
| T-23 | Recordings | Open Recordings | Hero "Audio Recordings", Record New Lesson card, Upload Material card, course select, Course Recordings/Materials lists | ☐ |
| T-24 | Recordings | Tap "Start Recording" | Mic permission prompt (first time); recording begins, button changes to red "Recording in progress... (tap to stop)" | ☐ |
| T-25 | Recordings | Deny mic permission | Shows "Microphone permission is required to record." | ☐ |
| T-26 | Recordings | Tap to stop recording | Preview section appears with playable audio control + "Save Recording" button | ☐ |
| T-27 | Recordings | Tap "Save Recording" without selecting a course | Shows "Course, title, and a recording are required." | ☐ |
| T-28 | Recordings | Fill course+title, save | "Saving...", then "Recording saved successfully." | ☐ |
| T-29 | Recordings | Tap "Upload Additional Material", pick a valid file (PDF) | File name shows, "Upload Material" enabled | ☐ |
| T-30 | Recordings | Pick a file >50MB | Shows "File is too large (...). Max size is 50MB." | ☐ |
| T-31 | Recordings | Select a course in the read section | Course Recordings + Course Materials lists populate for that course | ☐ |
| T-32 | Profile | Open Profile | Hero "Lecturer Profile", avatar+name+Teacher badge, Account Overview grid, Change Password card, 6-item Permissions checklist, red Sign Out | ☐ |
| T-33 | Profile | Tap avatar, pick a photo | Avatar uploads and updates immediately | ☐ |
| T-34 | Profile | Enter current+new password (≥8 chars), submit | "Updating...", then "Password updated successfully." | ☐ |
| T-35 | Profile | New password < 8 chars | Shows "New password must be at least 8 characters." | ☐ |
| T-36 | Profile | Tap "Sign Out" | Confirm sheet: "Confirm Logout" / are-you-sure, Cancel + red "Yes, Logout" | ☐ |
| T-37 | Profile | Confirm logout | Returns to Login screen, session cleared | ☐ |

## 3. Student Flow

| ID | Screen | Steps | Expected Result | Status |
|---|---|---|---|---|
| S-01 | Dashboard | Open Student Dashboard | Hero "Stay updated. Stay prepared.", 4 stat cards, Recent Announcements, Upcoming Deadlines, Enrolled Courses, Grade Summary | ☐ |
| S-02 | Announcements | Open Announcements | Hero, 2 stat cards, list with course badge/title/content/urgency badge/date, Deadline Timeline | ☐ |
| S-03 | Announcements | Announcement deadline within 3 days | Shows red "Urgent" badge | ☐ |
| S-04 | Announcements | Announcement deadline >3 days out | Shows blue "Update" badge | ☐ |
| S-05 | Announcements | Global announcement (no course) | Shows "General" instead of a course title, doesn't crash | ☐ |
| S-06 | Announcements | No announcements at all | Empty state: "No announcements found." / "Updates will appear here when teachers post them." | ☐ |
| S-07 | Announcements | More than one page of results | "Page X of Y" footer, Previous/Next work and refetch | ☐ |
| S-08 | Courses | Open Courses | Hero "Your learning hub...", Enrolled Courses stat, search box, course cards with green "Enrolled" badge | ☐ |
| S-09 | Courses | Type in search box | List filters to matching course titles on the current page | ☐ |
| S-10 | Courses | Tap "View Grades" on a course card | Navigates to Grades screen pre-filtered to that course | ☐ |
| S-11 | Courses | Tap "Recordings" on a course card | Navigates to Recordings screen pre-filtered to that course | ☐ |
| S-12 | Courses | No enrolled courses | Empty state: "No courses found." / "Your enrolled courses will appear here." | ☐ |
| S-13 | Grades | Open Grades (no filter) | Hero "Track your academic progress clearly.", Overall Average/Total Assessments/Standing stat cards, list rows with colored pct | ☐ |
| S-14 | Grades | Grade ≥70% | Score shown in green, "Passing" label | ☐ |
| S-15 | Grades | Grade <70% | Score shown in red, "Below Target" label | ☐ |
| S-16 | Grades | Average ≥85% | Standing shows "Excellent" | ☐ |
| S-17 | Grades | Average 70-84% | Standing shows "Good" | ☐ |
| S-18 | Grades | Average 50-69% | Standing shows "Needs Improvement" | ☐ |
| S-19 | Grades | Average <50% | Standing shows "At Risk" | ☐ |
| S-20 | Grades | No grades at all | Empty state: "No grades found." / "Your grades will appear here once teachers publish them." | ☐ |
| S-21 | More → Materials | Open Materials | Hero, 3 info cards, cards with course label/title/date/"Download / View File" | ☐ |
| S-22 | More → Materials | Tap "Download / View File" | Opens the file URL in the device's browser/viewer | ☐ |
| S-23 | More → Materials | Material with no file attached | Shows dashed "No file attached" box instead of a button | ☐ |
| S-24 | More → Materials | No materials | Empty state: "No materials found." / "Your course materials will appear here once uploaded." | ☐ |
| S-25 | More → Recordings | Open Recordings | Hero, 3 info cards, cards with "Open Recording" button | ☐ |
| S-26 | More → Recordings | Tap "Open Recording" | Opens the audio/video file externally | ☐ |
| S-27 | More → Recordings | No file URL attached | Shows "No video URL attached" | ☐ |
| S-28 | More → Results | Open Results | Hero "Access official semester results.", 3 info cards, list with semester/title/domain/date | ☐ |
| S-29 | More → Results | Tap "View / Download PDF" | Opens the PDF | ☐ |
| S-30 | More → Results | Result with no PDF | Shows red "No PDF attached" badge | ☐ |
| S-31 | More → Results | No results | Empty state: "No official results found." / "Uploaded final results will appear here once published." | ☐ |
| S-32 | More → Settings | Open Settings | Hero "Manage your account.", profile card, Change Password card, red Sign Out card | ☐ |
| S-33 | More → Settings | Change password successfully | Shows "Password updated successfully." | ☐ |
| S-34 | More → Settings | Tap Sign Out | Confirm Logout sheet appears, confirming signs out | ☐ |

## 4. Parent Flow

| ID | Screen | Steps | Expected Result | Status |
|---|---|---|---|---|
| P-01 | Dashboard | Open Parent Dashboard | Hero "Parent Workspace" with "Welcome back, {name}!", 3 stat cards, Recent Announcements (max 4, "View all →"), Quick Actions, Linked Students list | ☐ |
| P-02 | Dashboard | No announcements | Shows "No announcements yet." | ☐ |
| P-03 | Dashboard | Tap a linked student's "Grades →" | Navigates to Grades screen pre-filtered to that student | ☐ |
| P-04 | Announcements | Open Announcements | Header "Announcements" + total count, 2 stat cards, paginated list with 2-line-clamped content | ☐ |
| P-05 | Announcements | Announcement has a deadline | Shows "Due {date}" badge | ☐ |
| P-06 | Announcements | No announcements | Empty state: "No announcements found." / "Updates will appear here when teachers or admins post them." | ☐ |
| P-07 | My Students | Open My Students (children) | Header + count badge, 2-column gradient cards with name/email, "View Grades"/"Announcements" buttons | ☐ |
| P-08 | My Students | No linked students | Empty state: "No students linked to your account." / "Contact the administrator to link students to your account." | ☐ |
| P-09 | Grades | Open Grades with no student selected | Header shows "Select a student →", empty state "Select a student to view grades." | ☐ |
| P-10 | Grades | Select a student | 2 stat cards (Average %, Total Grades) appear, list populates | ☐ |
| P-11 | Grades | Selected student has no grades | Empty state: "No grades available." | ☐ |
| P-12 | Grades | Grade ≥70% / <70% | Score badge green / red respectively | ☐ |
| P-13 | Profile | Open Profile | "Profile" title, Personal Information card, Linked Students card, Security → Change Password, red Sign Out | ☐ |
| P-14 | Profile | No linked students | Shows "No students linked to your account." in that card | ☐ |
| P-15 | Profile | Tap "Change Password" | Centered sheet opens with password fields | ☐ |
| P-16 | Profile | Tap Sign Out | Confirm Logout sheet, confirming signs out | ☐ |

## 5. Cross-Cutting

| ID | Area | Steps | Expected Result | Status |
|---|---|---|---|---|
| X-01 | All list screens | First load (cold cache) | Shows a centered loading spinner, never a blank empty-state flash | ☐ |
| X-02 | All list screens | Pull down to refresh | Refresh indicator shows, data reloads | ☐ |
| X-03 | All roles | Tab bar colors | Teacher = indigo/purple sidebar, Student/Parent = near-black sidebar, matches per-role theme | ☐ |
| X-04 | All roles | Header bell icon | Teacher shows a red dot, Student/Parent do not | ☐ |
| X-05 | All roles | Tap avatar in header | Navigates to that role's Profile/Settings screen | ☐ |
| X-06 | Network | Turn off WiFi/data mid-use, trigger a request | Fails gracefully with a visible error, no crash | ☐ |
| X-07 | Cold start | Force-quit app, relaunch | Splash screen shows briefly, fonts loaded before first paint, no flash of unstyled content | ☐ |
