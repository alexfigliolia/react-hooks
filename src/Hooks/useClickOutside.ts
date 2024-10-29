import type { MutableRefObject, RefCallback } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { Callback } from "Types";

export const useClickOutside = <
  T extends HTMLElement,
  R extends boolean | undefined,
>({
  callback,
  open = true,
  refCallback = false,
}: IUseClickOutsideOptions<R>): ClickOutsideRef<T, R> => {
  const nodeRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  const onClickOutside = useCallback(
    (e: MouseEvent | FocusEvent) => {
      if (!nodeRef.current) {
        return;
      }
      if (!nodeRef.current.contains(e.target as Node)) {
        callback(e);
      }
    },
    [callback],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("click", onClickOutside, { passive: true });
      document.addEventListener("focusin", onClickOutside, { passive: true });
    } else {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("focusin", onClickOutside);
    }
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("focusin", onClickOutside);
    };
  }, [onClickOutside, open]);

  if (refCallback) {
    return ref as ClickOutsideRef<T, R>;
  }

  return nodeRef as ClickOutsideRef<T, R>;
};

export type ClickOutsideRef<
  T extends HTMLElement,
  R extends boolean | undefined,
> = R extends true ? RefCallback<T> : MutableRefObject<T | null>;

export interface IUseClickOutsideOptions<R extends boolean | undefined> {
  open?: boolean;
  refCallback?: R;
  callback: Callback<[e: MouseEvent | FocusEvent]>;
}
