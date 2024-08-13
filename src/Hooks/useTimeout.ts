import { useEffect } from "react";
import { Timeout } from "Generics/Timeout";
import { useController } from "./useController";

export const useTimeout = () => {
  const timeout = useController(new Timeout());

  useEffect(() => {
    return () => {
      timeout.abortAll();
    };
  }, [timeout]);
  return timeout;
};
