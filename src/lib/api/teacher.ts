import { supabase } from "@/lib/supabase/client";
import { apiClient } from "./client";
import type {
  TeacherAnnouncement,
  TeacherCourse,
  TeacherCourseDetail,
  TeacherEnrollmentStudent,
  TeacherGrade,
  TeacherMaterial,
  TeacherRecording,
  TeacherStats,
} from "@/types/teacher";

// ---- Reads: direct Supabase queries (RLS-enforced) — mirrors the web app's own code,
// since GET /teacher/* list routes don't exist on the backend (only stats + mutations do). ----

export function getTeacherStats() {
  return apiClient.get<TeacherStats>("/teacher/stats");
}

export async function getTeacherCourses(teacherId: string): Promise<TeacherCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, code, description")
    .eq("teacher_id", teacherId)
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function getTeacherAnnouncementCount(teacherId: string): Promise<number> {
  const { count, error } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", teacherId);
  if (error) throw error;
  return count ?? 0;
}

export async function getCourseDetail(courseId: string): Promise<TeacherCourseDetail> {
  const [courseRes, announcementsRes, recordingsRes, materialsRes, enrollmentsRes] =
    await Promise.all([
      supabase.from("courses").select("id, title, code, description").eq("id", courseId).single(),
      supabase
        .from("announcements")
        .select("id, title, content, deadline, created_at")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("recordings")
        .select("id, title, description, file_url, created_at")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("materials")
        .select("id, title, file_url, created_at")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("enrollments")
        .select("id, created_at, profiles!enrollments_student_id_fkey(id, full_name, email)")
        .eq("course_id", courseId),
    ]);

  if (courseRes.error) throw courseRes.error;
  if (announcementsRes.error) throw announcementsRes.error;
  if (recordingsRes.error) throw recordingsRes.error;
  if (materialsRes.error) throw materialsRes.error;
  if (enrollmentsRes.error) throw enrollmentsRes.error;

  return {
    course: courseRes.data,
    announcements: announcementsRes.data ?? [],
    recordings: recordingsRes.data ?? [],
    materials: materialsRes.data ?? [],
    students: (enrollmentsRes.data ?? []) as unknown as TeacherCourseDetail["students"],
  };
}

export async function getTeacherAnnouncements(courseIds: string[]): Promise<TeacherAnnouncement[]> {
  const queries = [];

  if (courseIds.length > 0) {
    queries.push(
      supabase
        .from("announcements")
        .select(
          "id, title, content, deadline, created_at, course_id, teacher_id, is_global, target_role, courses(title)"
        )
        .in("course_id", courseIds)
        .order("created_at", { ascending: false })
        .limit(100)
    );
  }

  queries.push(
    supabase
      .from("announcements")
      .select(
        "id, title, content, deadline, created_at, course_id, teacher_id, is_global, target_role, courses(title)"
      )
      .eq("is_global", true)
      .in("target_role", ["all", "teacher"])
      .order("created_at", { ascending: false })
  );

  const results = await Promise.all(queries);
  for (const result of results) {
    if (result.error) throw result.error;
  }

  const merged = results.flatMap((r) => r.data ?? []) as unknown as TeacherAnnouncement[];
  const seen = new Set<string>();
  return merged.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

export async function getTeacherGrades(teacherId: string): Promise<TeacherGrade[]> {
  const { data, error } = await supabase
    .from("grades")
    .select(
      "id, assessment_name, assessment_type, score, max_score, created_at, courses(title), profiles!grades_student_id_fkey(full_name)"
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as TeacherGrade[];
}

export async function getCourseStudents(courseId: string): Promise<TeacherEnrollmentStudent[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("student_id, profiles!enrollments_student_id_fkey(id, full_name, email)")
    .eq("course_id", courseId);
  if (error) throw error;
  return (data ?? []) as unknown as TeacherEnrollmentStudent[];
}

export async function getStudentGradesInCourse(
  teacherId: string,
  courseId: string,
  studentId: string
): Promise<TeacherGrade[]> {
  const { data, error } = await supabase
    .from("grades")
    .select(
      "id, assessment_name, assessment_type, score, max_score, created_at, courses(title), profiles!grades_student_id_fkey(full_name)"
    )
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId)
    .eq("student_id", studentId);
  if (error) throw error;
  return (data ?? []) as unknown as TeacherGrade[];
}

export async function getCourseRecordings(
  teacherId: string,
  courseId: string
): Promise<TeacherRecording[]> {
  const { data, error } = await supabase
    .from("recordings")
    .select("id, title, description, file_url, course_id, created_at, courses(title)")
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as TeacherRecording[];
}

export async function getCourseMaterials(
  teacherId: string,
  courseId: string
): Promise<TeacherMaterial[]> {
  const { data, error } = await supabase
    .from("materials")
    .select("id, title, file_url, course_id, teacher_id, created_at")
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ---- Mutations: real API routes, Bearer auth ----

export type CreateAnnouncementPayload = {
  title: string;
  content?: string;
  deadline?: string;
  course_id?: string;
};
export function createAnnouncement(payload: CreateAnnouncementPayload) {
  return apiClient.post("/teacher/announcements", payload);
}

export type UpdateAnnouncementPayload = {
  id: string;
  title?: string;
  content?: string;
  deadline?: string;
};
export function updateAnnouncement(payload: UpdateAnnouncementPayload) {
  return apiClient.patch("/teacher/announcements", payload);
}

export type CreateGradePayload = {
  student_id: string;
  course_id: string;
  assessment_name: string;
  assessment_type: string;
  score: number;
  max_score: number;
};
export function createGrade(payload: CreateGradePayload) {
  return apiClient.post("/teacher/grades", payload);
}

export type UpdateGradePayload = {
  id: string;
  assessment_name?: string;
  assessment_type?: string;
  score?: number;
  max_score?: number;
};
export function updateGrade(payload: UpdateGradePayload) {
  return apiClient.patch("/teacher/grades", payload);
}

export function deleteGrade(id: string) {
  return apiClient.delete("/teacher/grades", { id });
}

export type UploadMaterialPayload = {
  file: { uri: string; name: string; type: string };
  title: string;
  course_id: string;
};
export function uploadMaterial(payload: UploadMaterialPayload) {
  const formData = new FormData();
  formData.append("file", payload.file as unknown as Blob);
  formData.append("title", payload.title);
  formData.append("course_id", payload.course_id);
  return apiClient.upload<{ success: boolean; url: string }>("/teacher/materials", formData);
}
