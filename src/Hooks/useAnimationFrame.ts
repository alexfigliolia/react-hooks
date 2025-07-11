import { AnimationFrame } from "Generics/AnimationFrame";
import { useFloatingTaskManager } from "./useFloatingTaskManager";

export const useAnimationFrame = () => {
  return useFloatingTaskManager(AnimationFrame);
};
