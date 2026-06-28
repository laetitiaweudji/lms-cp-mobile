import { useContext } from "react";
import { BottomSheetContext } from "./BottomSheetProvider";

export function useAppBottomSheet() {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    throw new Error("useAppBottomSheet must be used within a BottomSheetProvider");
  }
  return ctx;
}
