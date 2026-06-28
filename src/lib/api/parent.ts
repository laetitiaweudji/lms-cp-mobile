import { apiClient } from "./client";
import type { Paginated } from "./types";
import type { ParentAnnouncement, ParentChild, ParentDashboard, ParentGrade } from "@/types/parent";

const DEFAULT_PAGE_SIZE = 20;

export function getParentDashboard() {
  return apiClient.get<ParentDashboard>("/parent/dashboard");
}

export function getParentChildren() {
  return apiClient.get<{ children: ParentChild[] }>("/parent/children");
}

export function getParentGrades(page: number, pageSize = DEFAULT_PAGE_SIZE, studentId?: string) {
  return apiClient.get<Paginated<ParentGrade, "grades">>("/parent/grades", {
    page,
    page_size: pageSize,
    student_id: studentId,
  });
}

export function getParentAnnouncements(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  return apiClient.get<Paginated<ParentAnnouncement, "announcements">>("/parent/announcements", {
    page,
    page_size: pageSize,
  });
}
