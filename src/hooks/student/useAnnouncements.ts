import { useQuery } from "@tanstack/react-query";
import { getStudentAnnouncements } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useAnnouncements(page: number) {
  return useQuery({
    queryKey: queryKeys.student.announcements(page),
    queryFn: () => getStudentAnnouncements(page),
  });
}
