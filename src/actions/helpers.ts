import { Action, type CharonSchema, type CharonValueType } from "../core";

export { t } from "../core";

type MapCharonType<T extends Record<string, CharonSchema>> = {
  [P in keyof T]: CharonValueType<T[P]>;
};

interface DefineAction<
  Input extends Record<string, CharonSchema>,
  Output extends Record<string, CharonSchema>,
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
  Input extends Record<string, CharonSchema>,
  Output extends Record<string, CharonSchema>,
>(
  action: DefineAction<Input, Output>,
): Action =>
  new Action(action.name, action.action as unknown as Action["action"], {
    input: action.input,
    output: action.output,
  });
