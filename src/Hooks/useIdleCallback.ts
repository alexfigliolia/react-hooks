import { IdleCallback } from "Generics/IdleCallback";
import { useFloatingTaskManager } from "./useFloatingTaskManager";

export const useIdleCallback = () => {
  return useFloatingTaskManager(IdleCallback);
};
