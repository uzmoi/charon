import type { Node, Vec2 } from "../core";
import { NODE_HEADER_HEIGHT, NODE_PORT_HEIGHT } from "./constants";

export const inputPortPos = (node: Node, port: string): Vec2 => {
  const index = [...node.action.input.keys()].indexOf(port);
  return {
    x: node.pos.x,
    y: node.pos.y + NODE_HEADER_HEIGHT + index * NODE_PORT_HEIGHT,
  };
};

export const outputPortPos = (node: Node, port: string): Vec2 => {
  const index = [...node.action.output.keys()].indexOf(port);
  return {
    x: node.pos.x + node.size.width,
    y: node.pos.y + NODE_HEADER_HEIGHT + index * NODE_PORT_HEIGHT,
  };
};
