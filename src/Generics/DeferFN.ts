import type { Callback } from "Types";

export abstract class DeferFN<T extends Callback<any[], any>> {
  callback: T;
  wait: number;
  protected ID: ReturnType<typeof setTimeout> | null = null;
  constructor(callback: T, wait: number) {
    this.wait = wait;
    this.callback = callback;
  }

  public abstract execute(...args: Parameters<T>): void;

  public update(...args: ConstructorParameters<typeof DeferFN<T>>) {
    this.wait = args[1];
    this.callback = args[0];
  }

  public cancel() {
    if (this.ID) {
      clearTimeout(this.ID);
      this.ID = null;
    }
  }
}
