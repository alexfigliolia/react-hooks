import { useCallback, useLayoutEffect, useState } from "react";

const getDimensions = () => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
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
