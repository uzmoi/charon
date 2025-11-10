import {
  distance,
  nearest,
  portType,
  type Charon,
  type Node,
  type Port,
  type ReadonlyVec2,
  type Vec2,
} from "../core";
import { computePortPos } from "./compute";
import { MAXIMUM_CONNECT_DISTANCE } from "./constants";

const computePortToConnect = (
  charon: Charon,
  port: Port,
  cursorPos: Vec2,
): Port | null => {
  const type = portType(port);

  const ports = charon
    .nodes()
    .values()
    .filter(node => node !== port.node)
    .flatMap(
      {
        in: (node: Node): Iterable<Port> => node.outputs(),
        out: (node: Node): Iterable<Port> => node.inputs(),
      }[port.kind],
    )
    .filter(port => portType(port) === type);

  const distanceToPort = (port: Port) => {
    const portPos = computePortPos(port);
    return distance(portPos, cursorPos);
  };

  return nearest(ports, distanceToPort, MAXIMUM_CONNECT_DISTANCE);
};

export const computePosOfPortToConnect = (
  charon: Charon,
  port: Port,
  cursorPos: Vec2,
): Vec2 | null => {
  const portToConnect = computePortToConnect(charon, port, cursorPos);
  return portToConnect && computePortPos(portToConnect);
};

export const connectToNearestPort = (
  charon: Charon,
  port: Port,
  delta: ReadonlyVec2,
) => {
  const portPos = computePortPos(port);
  const portToConnect = computePortToConnect(charon, port, portPos.plus(delta));

  if (portToConnect) {
    switch (port.kind) {
      case "in": {
        charon.connectNodes(portToConnect as Port<"out">, port as Port<"in">);
        break;
      }
      case "out": {
        charon.connectNodes(port as Port<"out">, portToConnect as Port<"in">);
        break;
      }
    }
  }
};
