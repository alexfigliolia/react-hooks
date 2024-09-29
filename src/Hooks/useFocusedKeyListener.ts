import { useEffect, useMemo } from "react";
import { FocusedKeyListener } from "Generics/FocusedKeyListener";
import type { Callback } from "Types";
import { useController } from "./useController";
import { useUnmount } from "./useUnmount";

export const useFocusedKeyListener = (
  callback: Callback,
  ...keys: string[]
) => {
  const activators = useMemo(() => (keys.length ? keys : ["Enter"]), [keys]);
  const controller = useController(
    new FocusedKeyListener(callback, ...activators),
  );
  useEffect(() => {
    controller.update(callback, ...activators);
  }, [activators, callback, controller]);

  useUnmount(() => {
    controller.destroy();
  });

  return controller;
};
