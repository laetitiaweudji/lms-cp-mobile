import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "@/lib/api/shared";

export function useUploadAvatar() {
  return useMutation({ mutationFn: uploadAvatar });
}
