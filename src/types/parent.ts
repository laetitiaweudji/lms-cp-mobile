// courses/profiles joins below are typed nullable defensively: testing the
// equivalent Student endpoints against the live API showed courses can be
// null (global announcements) even where the spec didn't document it, so
// the same is assumed possible here until proven otherwise with a real
// parent/teacher login.
export type ParentChild = {
  student_id: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
};

export type ParentGrade = {
  id: string;
  student_id: string;
  assessment_type: string;
  score: number;
  max_score: number;
  created_at: string;
  course_id: string | null;
  courses: { title: string } | null;
  profiles: { full_name: string } | null;
};

export type ParentAnnouncement = {
  id: string;
  title: string;
  content: string | null;
  deadline: string | null;
  created_at: string;
  course_id: string | null;
  courses: { title: string } | null;
};

export type ParentDashboard = {
  children: ParentChild[];
  recentGrades: ParentGrade[];
  announcements: ParentAnnouncement[];
};
