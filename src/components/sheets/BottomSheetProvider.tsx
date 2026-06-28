import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";

type SheetMode = "center" | "slide";

type OpenOptions = {
  mode?: SheetMode;
};

type BottomSheetContextValue = {
  open: (content: ReactNode, options?: OpenOptions) => void;
  close: () => void;
};

export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

const SNAP_POINTS: Record<SheetMode, string[]> = {
  center: ["50%"],
  slide: ["60%", "90%"],
};

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const sheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState<ReactNode>(null);
  const [mode, setMode] = useState<SheetMode>("slide");

  const open = useCallback((nextContent: ReactNode, options?: OpenOptions) => {
    setContent(nextContent);
    setMode(options?.mode ?? "slide");
    requestAnimationFrame(() => sheetRef.current?.expand());
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={SNAP_POINTS[mode]}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
        onClose={() => setContent(null)}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <BottomSheetView className="flex-1 px-6 py-4">{content}</BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
}
