import { useQuery } from "@tanstack/react-query";
import { getTeacherAnnouncementCount, getTeacherCourses } from "@/lib/api/teacher";
import { queryKeys } from "@/lib/api/queryKeys";
import { useAuth } from "@/hooks/auth/useAuth";

export function useCourses() {
  const { profile } = useAuth();
  const teacherId = profile?.id ?? "";

  return useQuery({
    queryKey: queryKeys.teacher.courses(teacherId),
    queryFn: () => getTeacherCourses(teacherId),
    enabled: !!teacherId,
  });
}

export function useAnnouncementCount() {
  const { profile } = useAuth();
  const teacherId = profile?.id ?? "";

  return useQuery({
    queryKey: queryKeys.teacher.announcementCount(teacherId),
    queryFn: () => getTeacherAnnouncementCount(teacherId),
    enabled: !!teacherId,
  });
}
