import { useEffect } from "react";
import { Debouncer } from "Generics/Debouncer";
import type { Callback } from "Types";
import { useController } from "./useController";
import { useUnmount } from "./useUnmount";

export const useDebouncer = <T extends Callback<any[], any>>(
  callback: T,
  wait: number,
) => {
  const debouncer = useController(new Debouncer(callback, wait));

  useEffect(() => {
    debouncer.update(callback, wait);
  }, [debouncer, callback, wait]);

  useUnmount(() => {
    debouncer.cancel();
  });

  return debouncer;
};
