import type { MobileProfile } from "./domain";

export type StudentEnrollment = {
  course_id: string;
  enrolled_at: string;
  courses: {
    id: string;
    title: string;
    description: string | null;
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
  course_id: string;
  courses: { title: string };
};

export type StudentGrade = {
  id: string;
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

export type StudentDashboard = {
  profile: MobileProfile;
  enrollments: StudentEnrollment[];
  announcements: StudentAnnouncement[];
  recentGrades: StudentGrade[];
  recordingCount: number;
};
