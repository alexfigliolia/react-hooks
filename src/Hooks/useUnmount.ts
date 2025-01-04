import { useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useUnmount = (onUnmount: Callback) => {
  const callback = useRef<Callback>(onUnmount);
  callback.current = onUnmount;
  useEffect(() => {
    const { current: fn } = callback;
    return () => fn();
  }, []);
};
