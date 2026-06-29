import { act, renderHook } from "@testing-library/react-native";
import { useLockout } from "../useLockout";

describe("useLockout", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts unlocked with 3 attempts remaining", async () => {
    const { result } = await renderHook(() => useLockout());
    expect(result.current.isLocked).toBe(false);
    expect(result.current.attemptsRemaining).toBe(3);
  });

  it("does not lock after 1 or 2 failures", async () => {
    const { result } = await renderHook(() => useLockout());

    await act(() => result.current.recordFailure());
    expect(result.current.isLocked).toBe(false);
    expect(result.current.attemptsRemaining).toBe(2);

    await act(() => result.current.recordFailure());
    expect(result.current.isLocked).toBe(false);
    expect(result.current.attemptsRemaining).toBe(1);
  });

  it("locks for 30 seconds after the 3rd failure", async () => {
    const { result } = await renderHook(() => useLockout());

    await act(() => result.current.recordFailure());
    await act(() => result.current.recordFailure());
    await act(() => result.current.recordFailure());

    expect(result.current.isLocked).toBe(true);
    expect(result.current.remainingSeconds).toBe(30);
  });

  it("counts down and unlocks automatically after 30 seconds", async () => {
    const { result } = await renderHook(() => useLockout());

    await act(() => {
      result.current.recordFailure();
      result.current.recordFailure();
      result.current.recordFailure();
    });
    expect(result.current.isLocked).toBe(true);

    await act(() => {
      jest.advanceTimersByTime(15_000);
    });
    expect(result.current.isLocked).toBe(true);
    expect(result.current.remainingSeconds).toBeLessThanOrEqual(15);

    await act(() => {
      jest.advanceTimersByTime(16_000);
    });
    expect(result.current.isLocked).toBe(false);
    expect(result.current.attemptsRemaining).toBe(3);
  });

  it("reset() clears lockout state immediately", async () => {
    const { result } = await renderHook(() => useLockout());

    await act(() => {
      result.current.recordFailure();
      result.current.recordFailure();
      result.current.recordFailure();
    });
    expect(result.current.isLocked).toBe(true);

    await act(() => result.current.reset());
    expect(result.current.isLocked).toBe(false);
    expect(result.current.attemptsRemaining).toBe(3);
  });
});
