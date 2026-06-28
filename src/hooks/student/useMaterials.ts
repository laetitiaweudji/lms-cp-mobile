import { useQuery } from "@tanstack/react-query";
import { getStudentMaterials } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useMaterials(page: number, courseId?: string) {
  return useQuery({
    queryKey: queryKeys.student.materials(page, courseId),
    queryFn: () => getStudentMaterials(page, undefined, courseId),
  });
}
