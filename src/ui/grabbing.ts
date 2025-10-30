import { useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
  Vec2,
  type Charon,
  type NodeId,
  type NodePort,
  type ReadonlyVec2,
} from "../core";
import { computePortPos } from "./compute";
import { connectToNearestPort } from "./connect";
import { GRID_SIZE_UNIT } from "./constants";

export type GrabbingSignal = Signal<
  | ({ start: ReadonlyVec2; delta: ReadonlyVec2 | null } & (
      | { id: NodeId; port?: undefined; portKind?: undefined }
      | { id: -1; port: NodePort<"in" | "out"> }
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
      if (grabbing.value?.delta == null) return;

      const { id, delta, port } = grabbing.value;
      grabbing.value = undefined;

      if (port) {
        // 最近傍ポートに接続
        connectToNearestPort(charon, port, delta);
      } else {
        charon.node(id)?.move({
          x: Math.round(delta.x),
          y: Math.round(delta.y),
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
  this.value = { id, start, delta: null };
}

export function startGrabInputPort(
  this: GrabbingSignal,
  charon: Charon,
  port: NodePort<"in">,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start = new Vec2(
    Math.round(event.pageX / GRID_SIZE_UNIT),
    Math.round(event.pageY / GRID_SIZE_UNIT),
  );

  const outputPort = charon.disconnectByEdgeTo(port);

  if (outputPort) {
    // 既存のedgeを引っ張る
    const delta = computePortPos(port).minus(computePortPos(outputPort));
    start.minus(delta);
    this.value = { id: -1, port: outputPort, start, delta };
  } else {
    // 新規にedgeを引っ張る
    this.value = { id: -1, port, start, delta: null };
  }
}

export function startGrabOutputPort(
  this: GrabbingSignal,
  charon: Charon,
  port: NodePort<"out">,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start = new Vec2(
    Math.round(event.pageX / GRID_SIZE_UNIT),
    Math.round(event.pageY / GRID_SIZE_UNIT),
  );

  const inputPort = charon.disconnectByEdgeFrom(port);

  if (inputPort) {
    // 既存のedgeを引っ張る
    const delta = computePortPos(port).minus(computePortPos(inputPort));
    start.minus(delta);
    this.value = { id: -1, port: inputPort, start, delta };
  } else {
    // 新規にedgeを引っ張る
    this.value = { id: -1, port, start, delta: null };
  }
}
