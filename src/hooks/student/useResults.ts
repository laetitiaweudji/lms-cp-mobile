import { useQuery } from "@tanstack/react-query";
import { getStudentResults } from "@/lib/api/student";
import { queryKeys } from "@/lib/api/queryKeys";

export function useResults(page: number) {
  return useQuery({
    queryKey: queryKeys.student.results(page),
    queryFn: () => getStudentResults(page),
  });
}
