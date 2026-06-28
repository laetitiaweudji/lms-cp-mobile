import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGrade, deleteGrade, updateGrade } from "@/lib/api/teacher";

export function useCreateGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "studentGradesInCourse"] });
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "studentGradesInCourse"] });
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "grades"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "studentGradesInCourse"] });
    },
  });
}
