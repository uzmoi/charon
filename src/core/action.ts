import type { CharonType } from "../actions/type";

export class Action {
  constructor(
    readonly name: string,
    readonly action: (this: void, input: {}) => Promise<{}>,
    options: {
      input: Record<string, CharonType>;
      output: Record<string, CharonType>;
    },
  ) {
    this.input = new Map(Object.entries(options.input));
    this.output = new Map(Object.entries(options.output));
  }

  readonly input: ReadonlyMap<string, CharonType>;
  readonly output: ReadonlyMap<string, CharonType>;
}
