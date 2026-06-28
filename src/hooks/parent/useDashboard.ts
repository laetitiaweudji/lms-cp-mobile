import { useQuery } from "@tanstack/react-query";
import { getParentDashboard } from "@/lib/api/parent";
import { queryKeys } from "@/lib/api/queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.parent.dashboard,
    queryFn: getParentDashboard,
  });
}
