import {
  distance,
  inputPorts,
  nearest,
  outputPorts,
  type Charon,
  type NodePort,
  type Vec2,
} from "../core";
import { MAXIMUM_CONNECT_DISTANCE } from "./constants";
import { inputPortPos, outputPortPos } from "./pos";

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

export const computeOutputPortToConnect = (
  charon: Charon,
  inputPort: NodePort,
  cursorPos: Vec2,
) => {
  const allOutputPorts = charon
    .nodes()
    .flatMap(outputPorts)
    .filter(port => isSameTypePort(inputPort, port));

  const outputPortDistance = (port: NodePort) => {
    const portPos = outputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allOutputPorts, outputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};

export const connectToNearestPort = (
  charon: Charon,
  portKind: "in" | "out",
  port: NodePort,
  current: Vec2,
) => {
  switch (portKind) {
    case "in": {
      const outputPort = computeOutputPortToConnect(charon, port, current);

      if (outputPort) {
        charon.connectNodes(outputPort, port);
      }
    }
    case "out": {
      const inputPort = computeInputPortToConnect(charon, port, current);

      if (inputPort) {
        charon.connectNodes(port, inputPort);
      }
    }
  }
};
