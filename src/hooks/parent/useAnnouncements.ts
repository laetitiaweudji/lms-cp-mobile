import { useQuery } from "@tanstack/react-query";
import { getParentAnnouncements } from "@/lib/api/parent";
import { queryKeys } from "@/lib/api/queryKeys";

export function useAnnouncements(page: number) {
  return useQuery({
    queryKey: queryKeys.parent.announcements(page),
    queryFn: () => getParentAnnouncements(page),
  });
}
