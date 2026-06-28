import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.student.dashboard,
    queryFn: getStudentDashboard,
  });
}
