import { useCallback, useEffect, useState } from "react";

const getLocale = (defaultLocale: string) => {
  return window?.navigator?.language ?? defaultLocale;
};

export const useLocale = (defaultLocale = "en-us") => {
  const [locale, setLocale] = useState(getLocale(defaultLocale));

  const onChange = useCallback(() => {
    setLocale(getLocale(defaultLocale));
  }, [defaultLocale]);

  useEffect(() => {
    window.addEventListener("languagechange", onChange);
    return () => {
      window.removeEventListener("languagechange", onChange);
    };
  }, [onChange]);

  return locale;
};
