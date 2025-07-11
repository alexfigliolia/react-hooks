import { useEffect } from "react";
import type { FloatingTaskManager } from "Generics/FloatingTaskManager";
import { useController } from "./useController";

export const useFloatingTaskManager = <
  T extends typeof FloatingTaskManager<any>,
>(
  Manager: T,
  ...rest: ConstructorParameters<T>
) => {
  // @ts-ignore
  const manager = useController(new Manager(...rest));

  useEffect(() => {
    return () => {
      manager.abortAll();
    };
  }, [manager]);

  return manager as InstanceType<T>;
};
