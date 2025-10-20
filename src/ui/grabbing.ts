import { useComputed, useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Charon, NodePort, Vec2 } from "../core";

type GrabbingId = number;

export interface GrabbingState {
  id: GrabbingId;
  start: Vec2;
  delta: Vec2 | null;
  port?: NodePort;
}

export const useGrabbingDelta = (
  grabbing: Signal<GrabbingState | undefined>,
  id: GrabbingId,
) => {
  return useComputed(
    () => (grabbing.value?.id === id && grabbing.value.delta) || { x: 0, y: 0 },
  );
};

export const useGrabbingSignal = (charon: Charon) => {
  const grabbing = useSignal<GrabbingState>();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      if (grabbing.value == null) return;

      const { start } = grabbing.value;

      const delta: Vec2 = {
        x: event.pageX - start.x,
        y: event.pageY - start.y,
      };
      grabbing.value = { ...grabbing.value, delta };
    };

    const onPointerUp = (_event: PointerEvent): void => {
      if (grabbing.value?.delta == null) return;

      const { id, delta } = grabbing.value;
      grabbing.value = undefined;

      if (id === -1) {
        // TODO: 最近傍ポートに接続
      } else {
        charon.updateNode(id, node => {
          const GRID_SIZE_UNIT = 24; // 16 (1rem) * 1.5

          const pos = {
            x: node.pos.x + Math.floor(delta.x / GRID_SIZE_UNIT),
            y: node.pos.y + Math.floor(delta.y / GRID_SIZE_UNIT),
          };
          return { ...node, pos };
        });
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return grabbing;
};

export function startMove(
  this: Signal<GrabbingState | undefined>,
  id: GrabbingId,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = { x: event.pageX, y: event.pageY };
  this.value = { id, start, delta: null };
}

export function startGrabPort(
  this: Signal<GrabbingState | undefined>,
  port: NodePort,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = { x: event.pageX, y: event.pageY };
  this.value = { id: -1, port, start, delta: null };
}
