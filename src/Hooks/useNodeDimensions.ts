import type { RefObject } from "react";
import { useMemo, useState } from "react";
import {
  type Dimensions,
  type Options,
  useSizeObserver,
} from "@figliolia/size-observer";

export const useNodeDimensions = <T extends HTMLElement>(): [
  ref: RefObject<T>,
  dimensions: Dimensions | undefined,
] => {
  const [dimensions, onChange] = useState<Dimensions | undefined>(undefined);
  const options: Options = useMemo(
    () => ({
      onChange,
      width: true,
      height: true,
      type: "border-box",
    }),
    [],
  );
  const node = useSizeObserver<T>(options);
  return [node, dimensions];
};
