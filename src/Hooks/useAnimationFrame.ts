import { useEffect } from "react";
import { AnimationFrame } from "Generics/AnimationFrame";
import { useController } from "./useController";

export const useAnimationFrame = () => {
  const manager = useController(new AnimationFrame());

  useEffect(() => {
    return () => {
      manager.abortAll();
    };
  }, [manager]);

  return manager;
};
