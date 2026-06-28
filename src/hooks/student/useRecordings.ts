import { useQuery } from "@tanstack/react-query";
import { getStudentRecordings } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useRecordings(page: number, courseId?: string) {
  return useQuery({
    queryKey: queryKeys.student.recordings(page, courseId),
    queryFn: () => getStudentRecordings(page, undefined, courseId),
  });
}
