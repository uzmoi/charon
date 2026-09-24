import { getOrElseUpdate } from "@uzmoi/ut/ils";
import { mapValues } from "es-toolkit/map";
import type { Charon } from "./charon";
import type { Node, NodeId } from "./node";
import type { Port } from "./port";
import { parse, type CharonValue } from "./schema";

type NodeResult = Record<string, CharonValue>;

const getNodeDependenciesMap = (charon: Charon) => {
  const map = new Map<Node, Map<string, Port<"out">>>();

  for (const node of charon.nodes()) {
    map.set(node, new Map());
  }

  for (const { from, to } of charon.edges()) {
    map.get(to.node)!.set(to.name, from);
  }

  return map;
};

export const execute = (charon: Charon): Map<NodeId, Promise<NodeResult>> => {
  const promiseMap = new Map<NodeId, PromiseWithResolvers<NodeResult>>();

  const getPromiseWithResolvers = (nodeId: NodeId) =>
    getOrElseUpdate(promiseMap, nodeId, () => Promise.withResolvers());

  for (const [node, dependencies] of getNodeDependenciesMap(charon)) {
    const { resolve } = getPromiseWithResolvers(node.id);

    resolve(
      executeNode(node, async inputPortName => {
        const sourceOutputPort = dependencies.get(inputPortName);
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
