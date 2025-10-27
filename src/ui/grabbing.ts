import { useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Charon, NodeId, NodePort, Vec2 } from "../core";
import { computePortToConnect } from "./compute";
import { GRID_SIZE_UNIT } from "./constants";

export type GrabbingSignal = Signal<
  | ({ start: Vec2; delta: Vec2 | null } & (
      | { id: NodeId; port?: undefined }
      | { id: -1; port: NodePort }
    ))
  | undefined
>;

export const useGrabbingSignal = (charon: Charon): GrabbingSignal => {
  const grabbing = useSignal<GrabbingSignal["value"]>();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      if (grabbing.value == null) return;

      const { start } = grabbing.value;

      const delta: Vec2 = {
        x: event.pageX / GRID_SIZE_UNIT - start.x,
        y: event.pageY / GRID_SIZE_UNIT - start.y,
      };
      grabbing.value = { ...grabbing.value, delta };
    };

    const onPointerUp = (_event: PointerEvent): void => {
      if (grabbing.value?.delta == null) return;

      const { id, start, delta, port } = grabbing.value;
      grabbing.value = undefined;

      if (port) {
        // 最近傍ポートに接続
        const cursorPos = {
          x: start.x + delta.x,
          y: start.y + delta.y,
        };
        const targetPort = computePortToConnect(charon, port, cursorPos);

        if (targetPort) {
          charon.connectNodes(port, targetPort);
        }
      } else {
        charon.node(id)?.move(delta);
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
  this: GrabbingSignal,
  id: NodeId,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = {
    x: event.pageX / GRID_SIZE_UNIT,
    y: event.pageY / GRID_SIZE_UNIT,
  };
  this.value = { id, start, delta: null };
}

export function startGrabPort(
  this: GrabbingSignal,
  port: NodePort,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = {
    x: Math.round(event.pageX / GRID_SIZE_UNIT),
    y: Math.round(event.pageY / GRID_SIZE_UNIT),
  };
  this.value = { id: -1, port, start, delta: null };
}
