import { useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useMount = (onMount: Callback) => {
  const callback = useRef<Callback>(onMount);
  callback.current = onMount;
  useEffect(() => {
    callback.current();
  }, []);
};
