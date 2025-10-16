import type { CharonType, CharonTypeOf } from "./type";

type MapCharonType<T extends Record<string, CharonType>> = {
  [P in keyof T]: CharonTypeOf<T[P]>;
};

export interface Action {
  name: string;
  input: Record<string, CharonType>;
  output: Record<string, CharonType>;
  action: (this: void, input: {}) => Promise<{}>;
}

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
): Action => action as unknown as Action;
