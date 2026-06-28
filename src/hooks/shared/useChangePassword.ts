import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/api/shared";

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
