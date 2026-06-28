import { useQuery } from "@tanstack/react-query";
import { getCourseMaterials, getCourseRecordings } from "@/lib/api/teacher";
import { queryKeys } from "@/lib/api/queryKeys";
import { useAuth } from "@/hooks/auth/useAuth";

export function useCourseRecordings(courseId?: string) {
  const { profile } = useAuth();
  const teacherId = profile?.id ?? "";

  return useQuery({
    queryKey: queryKeys.teacher.recordings(teacherId, courseId),
    queryFn: () => getCourseRecordings(teacherId, courseId!),
    enabled: !!teacherId && !!courseId,
  });
}

export function useCourseMaterials(courseId?: string) {
  const { profile } = useAuth();
  const teacherId = profile?.id ?? "";

  return useQuery({
    queryKey: queryKeys.teacher.materials(teacherId, courseId),
    queryFn: () => getCourseMaterials(teacherId, courseId!),
    enabled: !!teacherId && !!courseId,
  });
}
