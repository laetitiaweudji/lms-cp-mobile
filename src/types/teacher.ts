export type TeacherStats = {
  courses: number;
  students: number;
  grades: number;
  materials: number;
  recordings: number;
};

export type TeacherCourse = {
  id: string;
  title: string;
  code: string;
  description: string | null;
};

export type TeacherAnnouncement = {
  id: string;
  title: string;
  content: string | null;
  deadline: string | null;
  created_at: string;
  course_id: string | null;
  teacher_id: string;
  is_global: boolean;
  target_role: string | null;
  courses: { title: string } | null;
};

export type TeacherGrade = {
  id: string;
  assessment_name: string;
  assessment_type: string;
  score: number;
  max_score: number;
  created_at: string;
  courses: { title: string };
  profiles: { full_name: string };
};

export type TeacherEnrollmentStudent = {
  student_id: string;
  profiles: { id: string; full_name: string; email: string };
};

export type TeacherCourseDetail = {
  course: TeacherCourse;
  announcements: {
    id: string;
    title: string;
    content: string | null;
    deadline: string | null;
    created_at: string;
  }[];
  recordings: {
    id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    created_at: string;
  }[];
  materials: { id: string; title: string; file_url: string | null; created_at: string }[];
  students: {
    id: string;
    created_at: string;
    profiles: { id: string; full_name: string; email: string };
  }[];
};

export type TeacherRecording = {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  course_id: string;
  created_at: string;
  courses: { title: string };
};

export type TeacherMaterial = {
  id: string;
  title: string;
  file_url: string | null;
  course_id: string;
  teacher_id: string;
  created_at: string;
};

export const ASSESSMENT_TYPES = ["Assignment", "Test", "Project", "Exam"] as const;
export type AssessmentType = (typeof ASSESSMENT_TYPES)[number];
