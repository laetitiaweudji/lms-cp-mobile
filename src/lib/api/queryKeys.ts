export const queryKeys = {
  teacher: {
    stats: ["teacher", "stats"] as const,
    courses: (teacherId: string) => ["teacher", "courses", teacherId] as const,
    announcementCount: (teacherId: string) => ["teacher", "announcementCount", teacherId] as const,
    announcements: (courseIds: string[]) => ["teacher", "announcements", courseIds] as const,
    courseDetail: (courseId: string) => ["teacher", "courseDetail", courseId] as const,
    grades: (teacherId: string) => ["teacher", "grades", teacherId] as const,
    courseStudents: (courseId: string) => ["teacher", "courseStudents", courseId] as const,
    studentGradesInCourse: (teacherId: string, courseId: string, studentId: string) =>
      ["teacher", "studentGradesInCourse", teacherId, courseId, studentId] as const,
    recordings: (teacherId: string, courseId?: string) =>
      ["teacher", "recordings", teacherId, courseId] as const,
    materials: (teacherId: string, courseId?: string) =>
      ["teacher", "materials", teacherId, courseId] as const,
  },
  student: {
    dashboard: ["student", "dashboard"] as const,
    courses: (page: number) => ["student", "courses", page] as const,
    grades: (page: number, courseId?: string) => ["student", "grades", page, courseId] as const,
    announcements: (page: number) => ["student", "announcements", page] as const,
    materials: (page: number, courseId?: string) =>
      ["student", "materials", page, courseId] as const,
    recordings: (page: number, courseId?: string) =>
      ["student", "recordings", page, courseId] as const,
    results: (page: number) => ["student", "results", page] as const,
  },
  parent: {
    dashboard: ["parent", "dashboard"] as const,
    children: ["parent", "children"] as const,
    grades: (page: number, studentId?: string) =>
      ["parent", "grades", page, studentId] as const,
    announcements: (page: number) => ["parent", "announcements", page] as const,
  },
};
