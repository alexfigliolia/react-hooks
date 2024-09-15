import type { Callback } from "Types";
import { DeferFN } from "./DeferFN";

export class Debouncer<T extends Callback<any[], any>> extends DeferFN<T> {
  public execute(...args: Parameters<T>) {
    this.clear();
    this.ID = setTimeout(() => {
      this.callback(...args);
    }, this.wait);
  }
}
