import { useQuery } from "@tanstack/react-query";
import { getStudentGrades } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useGrades(page: number, courseId?: string) {
  return useQuery({
    queryKey: queryKeys.student.grades(page, courseId),
    queryFn: () => getStudentGrades(page, undefined, courseId),
  });
}
