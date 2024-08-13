import type { FormEvent } from "react";
import { useCallback, useMemo } from "react";
import type { Callback } from "Types";
import type { ILoadingStateSetter } from "./useLoadingState";
import { useLoadingState } from "./useLoadingState";

export const useFormState = (
  callback: (
    data: FormData,
    setState: ILoadingStateSetter,
    resetState: Callback,
  ) => void,
) => {
  const { setState, resetState, ...state } = useLoadingState();
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      callback(new FormData(e.target as HTMLFormElement), setState, resetState);
    },
    [callback, setState, resetState],
  );
  return useMemo(
    () => ({ onSubmit, ...state, setState, resetState }),
    [onSubmit, state, setState, resetState],
  );
};
