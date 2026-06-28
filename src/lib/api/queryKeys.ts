export const queryKeys = {
  teacher: {
    stats: ["teacher", "stats"] as const,
    announcements: (page: number) => ["teacher", "announcements", page] as const,
    courses: ["teacher", "courses"] as const,
    courseDetail: (courseId: string) => ["teacher", "courses", courseId] as const,
    grades: (courseId?: string) => ["teacher", "grades", courseId] as const,
    recordings: (courseId?: string) => ["teacher", "recordings", courseId] as const,
    materials: (courseId?: string) => ["teacher", "materials", courseId] as const,
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
