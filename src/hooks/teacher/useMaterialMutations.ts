import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMaterial } from "@/lib/api/teacher";

export function useUploadMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "materials"] });
    },
  });
}
