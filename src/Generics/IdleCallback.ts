import { FloatingTaskManager } from "./FloatingTaskManager";

export class IdleCallback extends FloatingTaskManager<
  typeof requestIdleCallback
> {
  constructor() {
    super(requestIdleCallback, cancelIdleCallback);
  }
}
