# UAT Scenarios — SCP Portal Mobile

User Acceptance Testing scenarios, written as end-to-end journeys a real
teacher/student/parent would actually perform. Unlike `qa-test-cases.md`
(granular, per-screen), these are for sign-off: a non-technical stakeholder
(or the actual end users) should be able to run through these and confirm
"yes, this does what I need it to do."

**How to run:** pick one real account per role, follow each scenario top to
bottom without skipping steps, and mark Pass/Fail with notes. A scenario
fails if *any* step doesn't match the expected outcome, even if a later
step still technically "works."

## UAT-1: Teacher — full lesson cycle

**As a teacher, I want to post an announcement, record a lecture, and grade my students, all from my phone.**

1. Open the app, log in with my teacher account.
2. From the Dashboard, I see my course count and recent activity at a glance.
3. I go to My Courses and open one of my courses to see who's enrolled.
4. I go to Announcements and post a new announcement for that course with a deadline.
5. I confirm the announcement appears in the list immediately.
6. I go to Recordings, select the same course, and record a short voice memo.
7. I save the recording with a title and confirm it appears in "Course Recordings" for that course.
8. I go to Grades, pick the course and a student, and enter a grade for an assignment.
9. I confirm the grade appears in "Recent Grades" and shows the correct percentage color.
10. I realize I made a typo in the grade's assessment name, edit it, and save the correction.
11. I sign out.

**Pass condition:** every step above completes without an app crash, an unexplained error, or data that doesn't show up where expected.

## UAT-2: Student — checking in on schoolwork

**As a student, I want to check my grades, see what's due, and download a handout, all in one sitting.**

1. Log in with my student account.
2. On the Dashboard, I immediately see my course count, average grade, and upcoming deadlines.
3. I tap into Announcements and see what's new, including which ones are marked urgent.
4. I go to Courses, search for a specific course by name, and confirm it shows up.
5. I tap "View Grades" from that course card and land on my grades for it.
6. I check my overall standing (Excellent/Good/Needs Improvement/At Risk) makes sense given my grades.
7. I go to More → Materials and download a PDF handout for one of my courses.
8. I go to More → Recordings and open a lecture recording from a course I missed.
9. I go to More → Results and check whether my official semester result has been published.
10. I go to Settings and change my password.
11. I sign out, then log back in to confirm my password change actually took effect.

**Pass condition:** every screen shows real, correct data for my account, the password change actually works on re-login, and nothing requires me to guess what a button does.

## UAT-3: Parent — keeping an eye on my child

**As a parent, I want to check on my child's grades and any school announcements without needing the web portal.**

1. Log in with my parent account.
2. The Dashboard greets me by name and shows how many children are linked to my account.
3. I tap into My Students and see each child's name and email clearly.
4. I tap "View Grades" for one specific child.
5. I confirm I'm only seeing that child's grades, with a clear average and total count.
6. I switch to a different linked child (if I have more than one) and confirm the grades update to the new child's data, not a mix of both.
7. I check Announcements for anything relevant to my children's courses.
8. I go to Profile, confirm my own info is correct, and change my password.
9. I sign out.

**Pass condition:** I never see another parent's child's data, switching between my own children works cleanly, and the experience feels at least as easy as checking a banking app.

## UAT-4: Account lockout and recovery (any role)

**As a user who forgot my password, I want a clear way to get back into my account.**

1. On the login screen, I enter the wrong password three times in a row.
2. I see a clear message telling me I'm locked out and how long until I can try again.
3. I wait for the lockout to expire and confirm I can try again.
4. Instead of waiting, I tap "Forgot password?" and request a reset link.
5. I receive the email, tap the link on my phone, and land on a screen to set a new password.
6. I set a new password and confirm I'm redirected to login.
7. I log in with the new password successfully.

**Pass condition:** at no point am I stuck with no path forward, and the messaging always tells me what to do next.

## UAT-5: Wrong-role and logged-out access (security sanity check)

**As a tester (not a real end user, but standing in for one), I want to confirm people can't see things they shouldn't.**

1. Log in as a student. Confirm I cannot reach any Teacher or Parent screen, even by trying to navigate directly to one.
2. Log out. Confirm I'm immediately back at the login screen and cannot see any previously-loaded data.
3. Try logging in with an admin account (if available). Confirm I'm rejected with a clear message and never see any in-app screen.
4. Log in as a parent, view one child's grades, then have someone disable that account from the admin side (or simulate it). Confirm the next action in the app signs me out rather than continuing to show stale data.

**Pass condition:** no role ever sees another role's screens, and a disabled/logged-out session never continues to display data as if everything were fine.
