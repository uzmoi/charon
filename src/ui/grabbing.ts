import { useSignal, type Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Charon, NodeId, NodePort, Vec2 } from "../core";
import { connectToNearestPort } from "./connect";
import { GRID_SIZE_UNIT } from "./constants";
import { inputPortPos, outputPortPos } from "./pos";

export type GrabbingSignal = Signal<
  | ({ start: Vec2; current: Vec2 | null } & (
      | { id: NodeId; port?: undefined; portKind?: undefined }
      | { id: -1; port: NodePort; portKind: "in" | "out" }
    ))
  | undefined
>;

export const useGrabbingSignal = (charon: Charon): GrabbingSignal => {
  const grabbing = useSignal<GrabbingSignal["value"]>();

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      if (grabbing.value == null) return;

      const current: Vec2 = {
        x: event.pageX / GRID_SIZE_UNIT,
        y: event.pageY / GRID_SIZE_UNIT,
      };
      grabbing.value = { ...grabbing.value, current };
    };

    const onPointerUp = (_event: PointerEvent): void => {
      if (grabbing.value?.current == null) return;

      const { id, start, current, port, portKind } = grabbing.value;
      grabbing.value = undefined;

      if (port) {
        // 最近傍ポートに接続
        connectToNearestPort(charon, portKind, port, current);
      } else {
        charon.node(id)?.move({
          x: Math.round(current.x - start.x),
          y: Math.round(current.y - start.y),
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
  this.value = { id, start, current: null };
}

export function startGrabInputPort(
  this: GrabbingSignal,
  charon: Charon,
  port: NodePort,
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
    const outputPortPos_ = outputPortPos(outputPort.node, outputPort.name);
    const inputPortPos_ = inputPortPos(port.node, port.name);
    const outputPos: Vec2 = {
      x: start.x - inputPortPos_.x + outputPortPos_.x,
      y: start.y - inputPortPos_.y + outputPortPos_.y,
    };
    this.value = {
      id: -1,
      port: outputPort,
      portKind: "out",
      start: outputPos,
      current: start,
    };
  } else {
    // 新規にedgeを引っ張る
    this.value = { id: -1, port, portKind: "in", start, current: null };
  }
}

export function startGrabOutputPort(
  this: GrabbingSignal,
  charon: Charon,
  port: NodePort,
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
    const inputPortPos_ = inputPortPos(inputPort.node, inputPort.name);
    const outputPortPos_ = outputPortPos(port.node, port.name);
    const inputPos: Vec2 = {
      x: start.x - outputPortPos_.x + inputPortPos_.x,
      y: start.y - outputPortPos_.y + inputPortPos_.y,
    };
    this.value = {
      id: -1,
      port: inputPort,
      portKind: "in",
      start: inputPos,
      current: start,
    };
  } else {
    // 新規にedgeを引っ張る
    this.value = { id: -1, port, portKind: "out", start, current: null };
  }
}
