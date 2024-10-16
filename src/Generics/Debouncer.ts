import type { Callback } from "Types";
import { DeferFN } from "./DeferFN";

export class Debouncer<T extends Callback<any[], any>> extends DeferFN<T> {
  public execute = (...args: Parameters<T>) => {
    this.cancel();
    this.ID = setTimeout(() => {
      this.callback(...args);
      this.cancel();
    }, this.wait);
  };

  public get hasActionPending() {
    return !!this.ID;
  }
}
