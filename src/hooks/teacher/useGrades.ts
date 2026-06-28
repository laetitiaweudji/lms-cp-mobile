import { useQuery } from "@tanstack/react-query";
import {
  getCourseStudents,
  getStudentGradesInCourse,
  getTeacherGrades,
} from "@/lib/api/teacher";
import { queryKeys } from "@/lib/api/queryKeys";
import { useAuth } from "@/hooks/auth/useAuth";

export function useGrades() {
  const { profile } = useAuth();
  const teacherId = profile?.id ?? "";

  return useQuery({
    queryKey: queryKeys.teacher.grades(teacherId),
    queryFn: () => getTeacherGrades(teacherId),
    enabled: !!teacherId,
  });
}

export function useCourseStudents(courseId: string) {
  return useQuery({
    queryKey: queryKeys.teacher.courseStudents(courseId),
    queryFn: () => getCourseStudents(courseId),
    enabled: !!courseId,
  });
}

export function useStudentGradesInCourse(courseId: string, studentId: string) {
  const { profile } = useAuth();
  const teacherId = profile?.id ?? "";

  return useQuery({
    queryKey: queryKeys.teacher.studentGradesInCourse(teacherId, courseId, studentId),
    queryFn: () => getStudentGradesInCourse(teacherId, courseId, studentId),
    enabled: !!teacherId && !!courseId && !!studentId,
  });
}
