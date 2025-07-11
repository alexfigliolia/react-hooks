import type { Callback } from "Types";

export class FloatingTaskManager<
  F extends (callback: C, ...rest: Parameters<C>) => any,
  C extends Callback<any[]> = Callback<any[]>,
  V extends ReturnType<F> = ReturnType<F>,
> {
  protected schedule: F;
  protected tokens = new Set<V>();
  protected cancel: Callback<[V]>;
  constructor(schedule: F, cancel: Callback<[V]>) {
    this.schedule = schedule.bind(globalThis) as F;
    this.cancel = cancel.bind(globalThis);
  }

  public execute(...args: Parameters<F>) {
    const [fn, ...rest] = args;
    const token = this.schedule(
      // @ts-ignore
      (...params: Parameters<C>) => {
        fn(...params);
      },
      ...rest,
    );
    this.tokens.add(token);
    return () => {
      this.clear(token);
    };
  }

  public abortAll() {
    for (const token of this.tokens) {
      this.cancel(token);
    }
    this.tokens.clear();
  }

  private clear(token: V) {
    if (token && this.tokens.has(token)) {
      this.cancel(token);
      this.tokens.delete(token);
    }
  }
}
