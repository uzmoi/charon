import type { Edge, NodePort, Vec2 } from "../core";
import { NODE_HEADER_HEIGHT, NODE_PORT_HEIGHT } from "./constants";
import type { GrabbingSignal } from "./grabbing";

export const computePortPos = (port: NodePort<"in" | "out">): Vec2 => {
  const nodePos = port.node.pos.value;

  switch (port.kind) {
    case "in": {
      const index = [...port.node.action.input.keys()].indexOf(port.name);
      return {
        x: nodePos.x,
        y: nodePos.y + NODE_HEADER_HEIGHT + index * NODE_PORT_HEIGHT,
      };
    }
    case "out": {
      const index = [...port.node.action.output.keys()].indexOf(port.name);
      return {
        x: nodePos.x + port.node.size.width,
        y: nodePos.y + NODE_HEADER_HEIGHT + index * NODE_PORT_HEIGHT,
      };
    }
  }
};

export const computeEdgePathWithGrabbingDelta = (
  { from, to }: Edge,
  { value: grabbing }: GrabbingSignal,
) => {
  let p1 = computePortPos(from);
  let p2 = computePortPos(to);

  if (grabbing?.delta) {
    const { id, delta } = grabbing;
    if (id === from.node.id) {
      p1 = {
        x: p1.x + Math.round(delta.x),
        y: p1.y + Math.round(delta.y),
      };
    }
    if (id === to.node.id) {
      p2 = {
        x: p2.x + Math.round(delta.x),
        y: p2.y + Math.round(delta.y),
      };
    }
  }

  return edgePath(p1, p2);
};

export const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
