import type { RefCallback, RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import type { Callback } from "Types";
import { useMergedRefs } from "./useMergedRefs";

export const useClickOutside = <
  T extends HTMLElement,
  R extends boolean | undefined,
>({
  callback,
  open = true,
  refCallback = false,
}: IUseClickOutsideOptions<R>): ClickOutsideRef<T, R> => {
  const node = useRef<T>(null);

  const ref = useMergedRefs(node);

  const onClickOutside = useCallback(
    (e: MouseEvent | FocusEvent) => {
      if (!node.current) {
        return;
      }
      if (!node.current.contains(e.target as Node)) {
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

  return node as ClickOutsideRef<T, R>;
};

export type ClickOutsideRef<
  T extends HTMLElement,
  R extends boolean | undefined,
> = R extends true ? RefCallback<T> : RefObject<T>;

export interface IUseClickOutsideOptions<R extends boolean | undefined> {
  open?: boolean;
  refCallback?: R;
  callback: Callback<[e: MouseEvent | FocusEvent]>;
}
