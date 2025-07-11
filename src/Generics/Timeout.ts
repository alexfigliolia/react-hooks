import { FloatingTaskManager } from "./FloatingTaskManager";

export class Timeout extends FloatingTaskManager<typeof setTimeout> {
  constructor() {
    super(setTimeout, clearTimeout);
  }
}
