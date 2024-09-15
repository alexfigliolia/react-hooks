import { useCallback, useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useClickOutside = <T extends HTMLElement>(
  open: boolean,
  close: Callback,
) => {
  const node = useRef<T>(null);
  const callback = useRef<Callback>(close);
  callback.current = close;

  const onClickOutside = useCallback((e: MouseEvent | FocusEvent) => {
    if (!node.current) {
      return false;
    }
    if (!node.current.contains(e.target as Node)) {
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

  return node;
};
