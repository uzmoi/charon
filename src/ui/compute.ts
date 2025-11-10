import type { Signal } from "@preact/signals";
import {
  Vec2,
  type Edge,
  type NodeId,
  type Port,
  type ReadonlyVec2,
} from "../core";
import { NODE_HEADER_HEIGHT, NODE_PORT_HEIGHT } from "./constants";
import type { GrabbingSignal } from "./grabbing";

export const computePortPos = (port: Port): Vec2 => {
  const nodePos = port.node.pos.value;

  switch (port.kind) {
    case "in": {
      const index = [...port.node.action.input.keys()].indexOf(port.name);
      return new Vec2(
        nodePos.x,
        nodePos.y + NODE_HEADER_HEIGHT + index * NODE_PORT_HEIGHT,
      );
    }
    case "out": {
      const index = [...port.node.action.output.keys()].indexOf(port.name);
      return new Vec2(
        nodePos.x + port.node.size.width,
        nodePos.y + NODE_HEADER_HEIGHT + index * NODE_PORT_HEIGHT,
      );
    }
  }
};

export const computeGrabbingPos = ({
  value: grabbing,
}: GrabbingSignal): Vec2 | null => {
  if (grabbing?.type !== "port") return null;
  const { port, delta } = grabbing;
  if (port == null || delta == null) return null;
  return computePortPos(port).plus(delta);
};

export const computeGrabbingDelta = (
  { value: grabbing }: GrabbingSignal,
  nodeId: NodeId,
): ReadonlyVec2 => {
  if (grabbing?.delta != null) {
    if (grabbing.type === "canvas") {
      return grabbing.delta;
    }

    if (grabbing.type === "node" && grabbing.id === nodeId) {
      const { x, y } = grabbing.delta;
      return {
        x: Math.round(x),
        y: Math.round(y),
      };
    }
  }

  return { x: 0, y: 0 };
};

export const computeEdgePathWithGrabbingDelta = (
  { from, to }: Edge,
  { value: grabbing }: GrabbingSignal,
  { value: canvasPos }: Signal<ReadonlyVec2>,
) => {
  let p1 = computePortPos(from).plus(canvasPos);
  let p2 = computePortPos(to).plus(canvasPos);

  if (grabbing?.delta && grabbing.type === "canvas") {
    const { delta } = grabbing;
    p1.plus(delta);
    p2.plus(delta);
  }

  if (grabbing?.delta && grabbing.type === "node") {
    const { id, delta } = grabbing;
    if (id === from.node.id) {
      p1.plus({
        x: Math.round(delta.x),
        y: Math.round(delta.y),
      });
    }
    if (id === to.node.id) {
      p2.plus({
        x: Math.round(delta.x),
        y: Math.round(delta.y),
      });
    }
  }

  return edgePath(p1, p2);
};

export const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
