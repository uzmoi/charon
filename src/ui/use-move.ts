import { useSignal, useComputed, type ReadonlySignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Vec2 } from "./types";

export const useMove = (
  move: (pos: Vec2) => void,
): readonly [
  delta: ReadonlySignal<Vec2>,
  onPointerDown: (event: preact.TargetedPointerEvent<HTMLDivElement>) => void,
] => {
  const grabbing = useSignal<{ start: Vec2; delta: Vec2 | null }>();
  const delta = useComputed(() => grabbing.value?.delta ?? { x: 0, y: 0 });

  const onPointerDown = (
    event: preact.TargetedPointerEvent<HTMLDivElement>,
  ): void => {
    event.preventDefault();
    const start: Vec2 = { x: event.pageX, y: event.pageY };
    grabbing.value = { start, delta: null };
  };

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      if (grabbing.value == null) return;

      const { start } = grabbing.value;

      const delta: Vec2 = {
        x: event.pageX - start.x,
        y: event.pageY - start.y,
      };
      grabbing.value = { start, delta };
    };

    const onPointerUp = (event: PointerEvent): void => {
      if (grabbing.value?.delta == null) return;

      move(grabbing.value.delta);
      grabbing.value = undefined;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return [delta, onPointerDown] as const;
};
