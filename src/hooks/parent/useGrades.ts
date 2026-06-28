import { useQuery } from "@tanstack/react-query";
import { getParentGrades } from "@/lib/api/parent";
import { queryKeys } from "@/lib/api/queryKeys";

export function useGrades(page: number, studentId?: string) {
  return useQuery({
    queryKey: queryKeys.parent.grades(page, studentId),
    queryFn: () => getParentGrades(page, undefined, studentId),
    enabled: !!studentId,
  });
}
