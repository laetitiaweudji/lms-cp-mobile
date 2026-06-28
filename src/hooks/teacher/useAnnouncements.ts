import { useQuery } from "@tanstack/react-query";
import { getTeacherAnnouncements } from "@/lib/api/teacher";
import { queryKeys } from "@/lib/api/queryKeys";
import { useCourses } from "./useCourses";

/** Merges the teacher's own course announcements with global teacher-targeted ones. */
export function useAnnouncements() {
  const coursesQuery = useCourses();
  const courseIds = (coursesQuery.data ?? []).map((c) => c.id);

  const announcementsQuery = useQuery({
    queryKey: queryKeys.teacher.announcements(courseIds),
    queryFn: () => getTeacherAnnouncements(courseIds),
    enabled: !coursesQuery.isLoading,
  });

  return {
    ...announcementsQuery,
    isLoading: coursesQuery.isLoading || announcementsQuery.isLoading,
    courses: coursesQuery.data ?? [],
  };
}
