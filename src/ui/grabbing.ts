import { useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Charon, NodeId, NodePort, Vec2 } from "../core";
import { computePortPos } from "./compute";
import { connectToNearestPort } from "./connect";
import { GRID_SIZE_UNIT } from "./constants";

export type GrabbingSignal = Signal<
  | ({ start: Vec2; delta: Vec2 | null } & (
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

      const delta: Vec2 = {
        x: event.pageX / GRID_SIZE_UNIT - start.x,
        y: event.pageY / GRID_SIZE_UNIT - start.y,
      };
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
  const start: Vec2 = {
    x: event.pageX / GRID_SIZE_UNIT,
    y: event.pageY / GRID_SIZE_UNIT,
  };
  this.value = { id, start, delta: null };
}

export function startGrabInputPort(
  this: GrabbingSignal,
  charon: Charon,
  port: NodePort<"in">,
  event: preact.TargetedPointerEvent<HTMLElement>,
): void {
  event.preventDefault();
  const start: Vec2 = {
    x: Math.round(event.pageX / GRID_SIZE_UNIT),
    y: Math.round(event.pageY / GRID_SIZE_UNIT),
  };

  const outputPort = charon.disconnectByEdgeTo(port);

  if (outputPort) {
    // 既存のedgeを引っ張る
    const outputPortPos_ = computePortPos(outputPort);
    const inputPortPos_ = computePortPos(port);
    const delta: Vec2 = {
      x: inputPortPos_.x - outputPortPos_.x,
      y: inputPortPos_.y - outputPortPos_.y,
    };
    const outputPos: Vec2 = {
      x: start.x - delta.x,
      y: start.y - delta.y,
    };
    this.value = { id: -1, port: outputPort, start: outputPos, delta };
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
  const start: Vec2 = {
    x: Math.round(event.pageX / GRID_SIZE_UNIT),
    y: Math.round(event.pageY / GRID_SIZE_UNIT),
  };

  const inputPort = charon.disconnectByEdgeFrom(port);

  if (inputPort) {
    // 既存のedgeを引っ張る
    const inputPortPos_ = computePortPos(inputPort);
    const outputPortPos_ = computePortPos(port);
    const delta: Vec2 = {
      x: outputPortPos_.x - inputPortPos_.x,
      y: outputPortPos_.y - inputPortPos_.y,
    };
    const inputPos: Vec2 = {
      x: start.x - delta.x,
      y: start.y - delta.y,
    };
    this.value = { id: -1, port: inputPort, start: inputPos, delta };
  } else {
    // 新規にedgeを引っ張る
    this.value = { id: -1, port, start, delta: null };
  }
}
