import { useCallback, useRef } from "react";

export function useLongPress(callback: () => void, ms: number = 500) {
  const timerRef = useRef<NodeJS.Timeout>();
  const isPressed = useRef(false);

  const start = useCallback(() => {
    isPressed.current = true;
    timerRef.current = setTimeout(() => {
      if (isPressed.current) {
        callback();
      }
    }, ms);
  }, [callback, ms]);

  const cancel = useCallback(() => {
    isPressed.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      start();
    },
    onTouchEnd: cancel,
    onTouchCancel: cancel,
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      start();
    },
    onMouseUp: cancel,
    onMouseLeave: cancel,
  };
}
