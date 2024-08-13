import { useCallback, useState } from "react";
import type { Callback } from "Types";

export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const setState = useCallback(
    <T extends ILoadingStateKey>(state: T, value: ILoadingStateValue<T>) => {
      switch (state) {
        case "error":
          return setError(value);
        case "loading":
          return setLoading(value as boolean);
        case "success":
          return setSuccess(value as boolean);
      }
    },
    [],
  );
  const resetState = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(false);
  }, []);
  return { loading, success, error, setState, resetState };
};

export type ILoadingStateKey = "error" | "loading" | "success";
export type ILoadingStateValue<T extends ILoadingStateKey> = T extends "error"
  ? boolean | string
  : boolean;

export type ILoadingStateSetter<T extends ILoadingStateKey = ILoadingStateKey> =
  Callback<[state: T, value: ILoadingStateValue<T>]>;
