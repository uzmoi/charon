import {
  distance,
  inputPorts,
  nearest,
  outputPorts,
  portType,
  type Charon,
  type NodePort,
  type Vec2,
} from "../core";
import { MAXIMUM_CONNECT_DISTANCE } from "./constants";
import { inputPortPos, outputPortPos } from "./pos";

const computeInputPortToConnect = (
  charon: Charon,
  outputPort: NodePort<"out">,
  cursorPos: Vec2,
) => {
  const allInputPorts = charon
    .nodes()
    .filter(node => node !== outputPort.node)
    .flatMap(inputPorts)
    .filter(port => portType(port) === portType(outputPort));

  const inputPortDistance = (port: NodePort<"in">) => {
    const portPos = inputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allInputPorts, inputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};

const computeOutputPortToConnect = (
  charon: Charon,
  inputPort: NodePort<"in">,
  cursorPos: Vec2,
) => {
  const allOutputPorts = charon
    .nodes()
    .filter(node => node !== inputPort.node)
    .flatMap(outputPorts)
    .filter(port => portType(port) === portType(inputPort));

  const outputPortDistance = (port: NodePort<"out">) => {
    const portPos = outputPortPos(port.node, port.name);
    return distance(portPos, cursorPos);
  };

  return nearest(allOutputPorts, outputPortDistance, MAXIMUM_CONNECT_DISTANCE);
};

export const computePosOfPortToConnect = (
  charon: Charon,
  port: NodePort<"in" | "out">,
  cursorPos: Vec2,
): Vec2 | null => {
  switch (port.kind) {
    case "in": {
      const outputPort = computeOutputPortToConnect(charon, port, cursorPos);
      return outputPort && outputPortPos(outputPort.node, outputPort.name);
    }
    case "out": {
      const inputPort = computeInputPortToConnect(charon, port, cursorPos);
      return inputPort && inputPortPos(inputPort.node, inputPort.name);
    }
  }
};

export const connectToNearestPort = (
  charon: Charon,
  port: NodePort<"in" | "out">,
  delta: Vec2,
) => {
  switch (port.kind) {
    case "in": {
      const portPos = inputPortPos(port.node, port.name);
      const outputPort = computeOutputPortToConnect(charon, port, {
        x: portPos.x + delta.x,
        y: portPos.y + delta.y,
      });

      if (outputPort) {
        charon.connectNodes(outputPort, port);
      }
      break;
    }
    case "out": {
      const portPos = outputPortPos(port.node, port.name);
      const inputPort = computeInputPortToConnect(charon, port, {
        x: portPos.x + delta.x,
        y: portPos.y + delta.y,
      });

      if (inputPort) {
        charon.connectNodes(port, inputPort);
      }
      break;
    }
  }
};
