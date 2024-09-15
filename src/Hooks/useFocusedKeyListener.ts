import { useEffect, useMemo } from "react";
import { FocusedKeyListener } from "Generics/FocusedKeyListener";
import type { Callback } from "Types";
import { useController } from "./useController";

export const useFocusedKeyListener = (onEnter: Callback, ...keys: string[]) => {
  const activators = useMemo(() => (keys.length ? keys : ["Enter"]), [keys]);
  const controller = useController(
    new FocusedKeyListener(onEnter, ...activators),
  );
  useEffect(() => {
    controller.update(onEnter, ...activators);
  }, [activators, onEnter, controller]);
  return controller;
};
