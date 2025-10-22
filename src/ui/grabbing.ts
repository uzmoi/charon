import { useComputed, useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
  nearestInputPort,
  type Charon,
  type NodeId,
  type NodePort,
  type Vec2,
} from "../core";
import {
  GRID_SIZE_UNIT,
  MAXIMUM_CONNECT_DISTANCE,
  NODE_HEADER_HEIGHT,
  NODE_PORT_HEIGHT,
} from "./constants";

export type GrabbingSignal = Signal<
  | ({
      start: Vec2;
      delta: Vec2 | null;
    } & ({ id: NodeId; port?: undefined } | { id: -1; port: NodePort }))
  | undefined
>;

export const useGrabbingDelta = (grabbing: GrabbingSignal, id: NodeId) => {
  return useComputed(
    () => (grabbing.value?.id === id && grabbing.value.delta) || { x: 0, y: 0 },
  );
};

export const useGrabbingSignal = (charon: Charon): GrabbingSignal => {
  const grabbing = useSignal<GrabbingSignal["value"]>();

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

      const { id, delta, port } = grabbing.value;
      grabbing.value = undefined;

      if (port) {
        // 最近傍ポートに接続
        const cursorPos = {
          x: port.pos.x + delta.x / GRID_SIZE_UNIT,
          y: port.pos.y + delta.y / GRID_SIZE_UNIT,
        };

        const targetPort = nearestInputPort(
          charon.nodes(),
          cursorPos,
          port,
          NODE_HEADER_HEIGHT,
          NODE_PORT_HEIGHT,
          MAXIMUM_CONNECT_DISTANCE,
        );

        if (targetPort) {
          charon.connectNodes(port, targetPort);
        }
      } else {
        charon.updateNode(id, node => {
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
  this: GrabbingSignal,
  id: NodeId,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = { x: event.pageX, y: event.pageY };
  this.value = { id, start, delta: null };
}

export function startGrabPort(
  this: GrabbingSignal,
  port: NodePort,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = { x: event.pageX, y: event.pageY };
  this.value = { id: -1, port, start, delta: null };
}
