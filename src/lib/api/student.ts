import { apiClient } from "./client";
import type { Paginated } from "./types";
import type {
  StudentAnnouncement,
  StudentDashboard,
  StudentEnrollment,
  StudentGrade,
  StudentMaterial,
  StudentRecording,
  StudentResult,
} from "@/types/student";

const DEFAULT_PAGE_SIZE = 20;

export function getStudentDashboard() {
  return apiClient.get<StudentDashboard>("/student/dashboard");
}

export function getStudentCourses(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return apiClient.get<Paginated<StudentEnrollment, "courses">>("/student/courses", {
    page,
    page_size: pageSize,
  });
}

export function getStudentGrades(page: number, pageSize = DEFAULT_PAGE_SIZE, courseId?: string) {
  return apiClient.get<Paginated<StudentGrade, "grades">>("/student/grades", {
    page,
    page_size: pageSize,
    course_id: courseId,
  });
}

export function getStudentAnnouncements(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return apiClient.get<Paginated<StudentAnnouncement, "announcements">>(
    "/student/announcements",
    { page, page_size: pageSize }
  );
}

export function getStudentMaterials(
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
  courseId?: string
) {
  return apiClient.get<Paginated<StudentMaterial, "materials">>("/student/materials", {
    page,
    page_size: pageSize,
    course_id: courseId,
  });
}

export function getStudentRecordings(
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
  courseId?: string
) {
  return apiClient.get<Paginated<StudentRecording, "recordings">>("/student/recordings", {
    page,
    page_size: pageSize,
    course_id: courseId,
  });
}

export function getStudentResults(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return apiClient.get<Paginated<StudentResult, "results">>("/student/results", {
    page,
    page_size: pageSize,
  });
}
