import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadRecording } from "@/lib/api/teacher";

export function useUploadRecording() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadRecording,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "recordings"] });
    },
  });
}
