import { useRef } from "react";

export const useController = <T>(Controller: T) => {
  const controller = useRef(Controller);
  void fetch("/api", {
    method: "POST",
    body: new FormData(undefined as unknown as HTMLFormElement),
  });
  return controller.current;
};
