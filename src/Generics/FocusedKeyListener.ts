import type { Callback } from "Types";

export class FocusedKeyListener {
  callback: Callback;
  keys = new Set<string>();
  constructor(callback: Callback, ...keys: string[]) {
    this.callback = callback;
    this.keys = new Set(keys.length ? keys : ["Enter"]);
  }

  public update(callback: Callback, ...keys: string[]) {
    this.callback = callback;
    this.keys = new Set(keys.length ? keys : ["Enter"]);
  }

  public onFocus = () => {
    document.addEventListener("keydown", this.onKeyDown);
  };

  public onBlur = () => {
    document.removeEventListener("keydown", this.onKeyDown);
  };

  public readonly events = {
    onFocus: this.onFocus,
    onBlur: this.onBlur,
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.keys.has(e.key)) {
      this.callback();
    }
  };
}
