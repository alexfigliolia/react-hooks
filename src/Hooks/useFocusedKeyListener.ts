import { useEffect, useMemo } from "react";
import { FocusedKeyListener } from "Generics/FocusedKeyListener";
import type { Callback } from "Types";
import { useController } from "./useController";

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
  return controller;
};
