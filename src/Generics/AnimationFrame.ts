import { FloatingTaskManager } from "./FloatingTaskManager";

export class AnimationFrame extends FloatingTaskManager<
  typeof requestAnimationFrame
> {
  constructor() {
    super(requestAnimationFrame, cancelAnimationFrame);
  }
}
