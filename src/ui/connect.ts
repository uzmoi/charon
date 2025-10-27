import {
  distance,
  inputPorts,
  nearest,
  type Charon,
  type NodePort,
  type Vec2,
} from "../core";
import { MAXIMUM_CONNECT_DISTANCE } from "./constants";
import { inputPortPos } from "./pos";

const isSameTypePort = (a: NodePort, b: NodePort) =>
  a.node !== b.node && a.type === b.type;

export const computeInputPortToConnect = (
  charon: Charon,
  outputPort: NodePort,
  cursorPos: Vec2,
) => {
  const allInputPorts = charon
    .nodes()
    .flatMap(inputPorts)
    .filter(port => isSameTypePort(outputPort, port));

  const inputPortDistance = (port: NodePort) => {
    const portPos = inputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allInputPorts, inputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};

export const connectToNearestPort = (
  charon: Charon,
  port: NodePort,
  current: Vec2,
) => {
  const inputPortToConnect = computeInputPortToConnect(charon, port, current);

  if (inputPortToConnect) {
    charon.connectNodes(port, inputPortToConnect);
  }
};
