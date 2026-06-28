import { useQuery } from "@tanstack/react-query";
import { getCourseDetail } from "@/lib/api/teacher";
import { queryKeys } from "@/lib/api/queryKeys";

export function useCourseDetail(courseId: string) {
  return useQuery({
    queryKey: queryKeys.teacher.courseDetail(courseId),
    queryFn: () => getCourseDetail(courseId),
    enabled: !!courseId,
  });
}
