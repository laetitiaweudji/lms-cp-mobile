import { useQuery } from "@tanstack/react-query";
import { getParentChildren } from "@/lib/api/parent";
import { queryKeys } from "@/lib/api/queryKeys";

export function useChildren() {
  return useQuery({
    queryKey: queryKeys.parent.children,
    queryFn: getParentChildren,
  });
}
