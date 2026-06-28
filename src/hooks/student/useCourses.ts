import { useQuery } from "@tanstack/react-query";
import { getStudentCourses } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useCourses(page: number) {
  return useQuery({
    queryKey: queryKeys.student.courses(page),
    queryFn: () => getStudentCourses(page),
  });
}
