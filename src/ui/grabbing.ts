import { useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
  Vec2,
  type Charon,
  type NodeId,
  type Port,
  type ReadonlyVec2,
} from "../core";
import { computePortPos } from "./compute";
import { connectToNearestPort } from "./connect";
import { GRID_SIZE_UNIT } from "./constants";

export type GrabbingSignal = Signal<
  | ({ start: ReadonlyVec2; delta: ReadonlyVec2 | null } & (
      | { type: "node"; id: NodeId }
      | { type: "port"; port: Port }
    ))
  | undefined
>;

export const useGrabbingSignal = (charon: Charon): GrabbingSignal => {
  const grabbing = useSignal<GrabbingSignal["value"]>();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      if (grabbing.value == null) return;

      const { start } = grabbing.value;

      const delta = new Vec2(
        event.pageX / GRID_SIZE_UNIT,
        event.pageY / GRID_SIZE_UNIT,
      ).minus(start);
      grabbing.value = { ...grabbing.value, delta };
    };

    const onPointerUp = (_event: PointerEvent): void => {
      const state = grabbing.value;
      if (state?.delta == null) return;
      grabbing.value = undefined;

      if (state.type === "port") {
        // 最近傍ポートに接続
        connectToNearestPort(charon, state.port, state.delta);
      } else {
        charon.node(state.id)?.move({
          x: Math.round(state.delta.x),
          y: Math.round(state.delta.y),
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
  const start = new Vec2(
    event.pageX / GRID_SIZE_UNIT,
    event.pageY / GRID_SIZE_UNIT,
  );
  this.value = { start, delta: null, type: "node", id };
}

export function startGrabPort(
  this: GrabbingSignal,
  charon: Charon,
  port: Port,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start = new Vec2(
    event.pageX / GRID_SIZE_UNIT,
    event.pageY / GRID_SIZE_UNIT,
  );

  let delta = null;

  const disconnectedPort = charon.disconnect(port);

  if (disconnectedPort) {
    // 既存のedgeを引っ張る
    delta = computePortPos(port).minus(computePortPos(disconnectedPort));
    start.minus(delta);
    port = disconnectedPort;
  }

  this.value = { start, delta, type: "port", port };
}
