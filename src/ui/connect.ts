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

const computeInputPortToConnect = (
  charon: Charon,
  outputPort: NodePort,
  cursorPos: Vec2,
) => {
  const allInputPorts = charon
    .nodes()
    .filter(node => node !== outputPort.node)
    .flatMap(inputPorts)
    .filter(port => port.type === outputPort.type);

  const inputPortDistance = (port: NodePort) => {
    const portPos = inputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allInputPorts, inputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};

const computeOutputPortToConnect = (
  charon: Charon,
  inputPort: NodePort,
  cursorPos: Vec2,
) => {
  const allOutputPorts = charon
    .nodes()
    .filter(node => node !== inputPort.node)
    .flatMap(outputPorts)
    .filter(port => port.type === inputPort.type);

  const outputPortDistance = (port: NodePort) => {
    const portPos = outputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allOutputPorts, outputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};

export const computePosOfPortToConnect = (
  charon: Charon,
  port: NodePort,
  portKind: "in" | "out",
  cursorPos: Vec2,
): Vec2 | null => {
  switch (portKind) {
    case "in": {
      const outputPort = computeOutputPortToConnect(charon, port, cursorPos);
      return outputPort && inputPortPos(outputPort.node, outputPort.name);
    }
    case "out": {
      const inputPort = computeInputPortToConnect(charon, port, cursorPos);
      return inputPort && outputPortPos(inputPort.node, inputPort.name);
    }
  }
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
