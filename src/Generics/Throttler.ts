import type { Callback } from "Types";
import { DeferFN } from "./DeferFN";

export class Throttler<T extends Callback<any[], any>> extends DeferFN<T> {
  public execute = (...args: Parameters<T>) => {
    if (this.ID) {
      return;
    }
    this.callback(...args);
    this.ID = setTimeout(() => {
      this.cancel();
    }, this.wait);
  };
}
