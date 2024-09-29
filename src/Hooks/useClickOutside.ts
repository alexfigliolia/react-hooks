import { useCallback, useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useClickOutside = <T extends HTMLElement>(
  open: boolean,
  close: Callback,
) => {
  const nodeRef = useRef<T | null>();
  const ref = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);
  const callback = useRef<Callback>(close);
  callback.current = close;

  const onClickOutside = useCallback((e: MouseEvent | FocusEvent) => {
    if (!nodeRef.current) {
      return false;
    }
    if (!nodeRef.current.contains(e.target as Node)) {
      callback.current();
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("click", onClickOutside);
      document.addEventListener("focusin", onClickOutside);
    } else {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("focusin", onClickOutside);
    }
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("focusin", onClickOutside);
    };
  }, [open, onClickOutside]);

  return ref;
};
