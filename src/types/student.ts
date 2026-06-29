import type { MobileProfile } from "./domain";

export type StudentEnrollment = {
  course_id: string;
  // Present on the dedicated /student/courses endpoint per the spec; absent
  // from the dashboard endpoint's embedded enrollments (confirmed live) and
  // unused in the UI either way.
  enrolled_at?: string;
  courses: {
    id: string;
    title: string;
    description?: string | null;
    teacher_id: string;
    profiles: { full_name: string };
  };
};

export type StudentAnnouncement = {
  id: string;
  title: string;
  content: string | null;
  deadline: string | null;
  created_at: string;
  course_id: string | null;
  // null for global announcements (course_id null) — confirmed live.
  courses: { title: string } | null;
};

export type StudentGrade = {
  id: string;
  assessment_name: string;
  assessment_type: string;
  score: number;
  max_score: number;
  created_at: string;
  course_id: string;
  courses: { title: string };
};

export type StudentMaterial = {
  id: string;
  title: string;
  file_url: string | null;
  created_at: string;
  course_id: string;
  courses: { title: string };
};

export type StudentRecording = {
  id: string;
  title: string;
  file_url: string | null;
  created_at: string;
  course_id: string;
  courses: { title: string };
};

export type StudentResult = {
  id: string;
  title: string;
  domain: string;
  semester: string;
  file_url: string | null;
  created_at: string;
};

/**
 * The dashboard endpoint embeds announcements/grades without the `courses`
 * join or `assessment_name` that the dedicated /student/announcements and
 * /student/grades endpoints include — confirmed against the real API
 * response, not assumed. Don't reuse StudentAnnouncement/StudentGrade here.
 */
export type DashboardAnnouncement = {
  id: string;
  title: string;
  content: string | null;
  deadline: string | null;
  created_at: string;
  course_id: string | null;
};

export type DashboardGrade = {
  id: string;
  assessment_type: string;
  score: number;
  max_score: number;
  created_at: string;
  course_id: string;
};

export type StudentDashboard = {
  profile: MobileProfile;
  enrollments: StudentEnrollment[];
  announcements: DashboardAnnouncement[];
  recentGrades: DashboardGrade[];
  recordingCount: number;
};
