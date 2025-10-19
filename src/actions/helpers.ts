import type { Action } from "../core";
import type { CharonType, CharonTypeOf } from "./type";

type MapCharonType<T extends Record<string, CharonType>> = {
  [P in keyof T]: CharonTypeOf<T[P]>;
};

interface DefineAction<
  Input extends Record<string, CharonType>,
  Output extends Record<string, CharonType>,
> {
  name: string;
  input: Input;
  output: Output;
  action: (
    this: void,
    input: MapCharonType<Input>,
  ) => Promise<MapCharonType<Output>>;
}

export const defineAction = <
  Input extends Record<string, CharonType>,
  Output extends Record<string, CharonType>,
>(
  action: DefineAction<Input, Output>,
): Action =>
  ({
    name: action.name,
    input: new Map(Object.entries(action.input)),
    output: new Map(Object.entries(action.output)),
    action: action.action as unknown as Action["action"],
  }) as Action;
