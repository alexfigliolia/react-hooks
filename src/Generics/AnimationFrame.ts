import type { Callback } from "Types";

export class AnimationFrame {
  private IDs = new Set<ReturnType<typeof requestAnimationFrame>>();

  public execute(callback: Callback) {
    const ID = requestAnimationFrame(() => {
      callback();
    });
    return () => {
      this.clear(ID);
    };
  }

  public abortAll() {
    for (const ID of this.IDs) {
      cancelAnimationFrame(ID);
    }
    this.IDs.clear();
  }

  public clear(ID: ReturnType<typeof requestAnimationFrame>) {
    if (ID && this.IDs.has(ID)) {
      cancelAnimationFrame(ID);
      this.IDs.delete(ID);
    }
  }
}
