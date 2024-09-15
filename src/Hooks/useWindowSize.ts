import { useCallback, useLayoutEffect, useState } from "react";

const getDimensions = () => {
  return { width: window?.innerWidth ?? 0, height: window?.innerHeight ?? 0 };
};

export const useWindowSize = () => {
  const [dimensions, setDimensions] = useState(getDimensions());
  const onResize = useCallback(() => {
    setDimensions(getDimensions());
  }, []);
  useLayoutEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });
  return dimensions;
};
