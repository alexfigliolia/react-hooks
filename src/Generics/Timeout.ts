import type { Callback } from "Types";

export class Timeout {
  private IDs = new Set<ReturnType<typeof setTimeout>>();

  public execute(callback: Callback, delay = 0) {
    const ID = setTimeout(() => {
      callback();
    }, delay);
    this.IDs.add(ID);
    return () => {
      this.clear(ID);
    };
  }

  public abortAll() {
    for (const ID of this.IDs) {
      clearTimeout(ID);
    }
    this.IDs.clear();
  }

  public clear(ID: ReturnType<typeof setTimeout>) {
    if (ID && this.IDs.has(ID)) {
      clearTimeout(ID);
      this.IDs.delete(ID);
    }
  }
}
