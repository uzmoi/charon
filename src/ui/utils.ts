import { useCallback, useRef } from "preact/hooks";
import { useInsertionEffect } from "preact/compat";

export const useEffectEvent = <A extends readonly unknown[], R>(
  fn: (...args: A) => R,
): ((...args: A) => R) => {
  const ref = useRef(fn);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args) => ref.current(...args), []);
};

export const css = (style: preact.CSSProperties) =>
  Object.entries(style)
    .map(([key, value]) => `${key}:${value};`)
    .join("");
