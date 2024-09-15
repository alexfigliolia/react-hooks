import { useEffect } from "react";
import { Throttler } from "Generics/Throttler";
import type { Callback } from "Types";
import { useController } from "./useController";
import { useUnmount } from "./useUnmount";

export const useThrottler = <T extends Callback<any[], any>>(
  callback: T,
  wait: number,
) => {
  const throttler = useController(new Throttler(callback, wait));

  useEffect(() => {
    throttler.update(callback, wait);
  }, [throttler, callback, wait]);

  useUnmount(() => {
    throttler.cancel();
  });

  return throttler;
};
