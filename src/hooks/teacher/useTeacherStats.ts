import { useQuery } from "@tanstack/react-query";
import { getTeacherStats } from "@/lib/api/teacher";
import { queryKeys } from "@/lib/api/queryKeys";

export function useTeacherStats() {
  return useQuery({
    queryKey: queryKeys.teacher.stats,
    queryFn: getTeacherStats,
  });
}
