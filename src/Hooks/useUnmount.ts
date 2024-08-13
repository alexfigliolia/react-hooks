import { useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useUnmount = (onUnmount: Callback) => {
  const callback = useRef<Callback | null>(null);
  callback.current = onUnmount;
  useEffect(() => {
    return () => {
      if (callback.current) {
        callback.current();
        callback.current = null;
      }
    };
  }, []);
};
