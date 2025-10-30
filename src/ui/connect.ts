import {
  distance,
  inputPorts,
  nearest,
  outputPorts,
  portType,
  type Charon,
  type Node,
  type NodePort,
  type ReadonlyVec2,
  type Vec2,
} from "../core";
import { computePortPos } from "./compute";
import { MAXIMUM_CONNECT_DISTANCE } from "./constants";

const computePortToConnect = (
  charon: Charon,
  port: NodePort<"in" | "out">,
  cursorPos: Vec2,
): NodePort<"in" | "out"> | null => {
  const type = portType(port);

  const getPorts: (node: Node) => NodePort<"in" | "out">[] = {
    in: outputPorts,
    out: inputPorts,
  }[port.kind];

  const ports = charon
    .nodes()
    .filter(node => node !== port.node)
    .flatMap(getPorts)
    .filter(port => portType(port) === type);

  const distanceToPort = (port: NodePort<"in" | "out">) => {
    const portPos = computePortPos(port);
    return distance(portPos, cursorPos);
  };

  return nearest(ports, distanceToPort, MAXIMUM_CONNECT_DISTANCE);
};

export const computePosOfPortToConnect = (
  charon: Charon,
  port: NodePort<"in" | "out">,
  cursorPos: Vec2,
): Vec2 | null => {
  const portToConnect = computePortToConnect(charon, port, cursorPos);
  return portToConnect && computePortPos(portToConnect);
};

export const connectToNearestPort = (
  charon: Charon,
  port: NodePort<"in" | "out">,
  delta: ReadonlyVec2,
) => {
  const portPos = computePortPos(port);
  const portToConnect = computePortToConnect(charon, port, portPos.plus(delta));

  if (portToConnect) {
    switch (port.kind) {
      case "in": {
        charon.connectNodes(portToConnect as NodePort<"out">, port);
        break;
      }
      case "out": {
        charon.connectNodes(port, portToConnect as NodePort<"in">);
        break;
      }
    }
  }
};
