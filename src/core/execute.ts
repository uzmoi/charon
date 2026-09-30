import { getOrElseUpdate } from "@uzmoi/ut/ils";
import { mapValues } from "es-toolkit/map";
import type { Charon } from "./charon";
import type { Node, NodeId } from "./node";
import { parse, type CharonValue } from "./schema";

type NodeResult = Record<string, CharonValue>;

export const execute = (charon: Charon): Map<NodeId, Promise<NodeResult>> => {
  const promiseMap = new Map<NodeId, PromiseWithResolvers<NodeResult>>();

  const getPromiseWithResolvers = (nodeId: NodeId) =>
    getOrElseUpdate(promiseMap, nodeId, () => Promise.withResolvers());

  for (const node of charon.nodes()) {
    const { resolve } = getPromiseWithResolvers(node.id);

    resolve(
      executeNode(node, async inputPortName => {
        const sourceOutputPort = node.getSource(inputPortName);
        if (sourceOutputPort == null) return;

        const nodeOutput = await getPromiseWithResolvers(
          sourceOutputPort.node.id,
        ).promise;
        return nodeOutput[sourceOutputPort.name];
      }),
    );
  }

  return mapValues(promiseMap, value => value.promise);
};

const executeNode = async (
  node: Node,
  resolveDependency: (portName: string) => Promise<unknown>,
) => {
  const inputPromiseArray = node.action.input
    .entries()
    .map(async ([inputPortName, portSchema]) => {
      const portValue = await resolveDependency(inputPortName);
      const parsedPortValue = parse(portSchema, portValue);
      return [inputPortName, parsedPortValue] as const;
    })
    .toArray();
  const inputArray = await Promise.all(inputPromiseArray);
  const input = Object.fromEntries(inputArray);

  const output = await node.action.action(input);

  return output;
};
