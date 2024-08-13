import { useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useMount = (onMount: Callback) => {
  const callback = useRef<Callback | null>(null);
  callback.current = onMount;
  useEffect(() => {
    if (callback.current) {
      callback.current();
      callback.current = null;
    }
  }, []);
};
