export type ParentChild = {
  student_id: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
};

export type ParentGrade = {
  id: string;
  student_id: string;
  assessment_type: string;
  score: number;
  max_score: number;
  created_at: string;
  course_id: string;
  courses: { title: string };
  profiles: { full_name: string };
};

export type ParentAnnouncement = {
  id: string;
  title: string;
  content: string | null;
  deadline: string | null;
  created_at: string;
  course_id: string;
  courses: { title: string };
};

export type ParentDashboard = {
  children: ParentChild[];
  recentGrades: ParentGrade[];
  announcements: ParentAnnouncement[];
};
