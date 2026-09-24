import type { CharonSchema, CharonValue } from "./schema";

export class Action {
  constructor(
    readonly name: string,
    readonly action: (
      this: void,
      input: Record<string, CharonValue>,
    ) => Promise<Record<string, CharonValue>>,
    options: {
      input: Record<string, CharonSchema>;
      output: Record<string, CharonSchema>;
    },
  ) {
    this.input = new Map(Object.entries(options.input));
    this.output = new Map(Object.entries(options.output));
  }

  readonly input: ReadonlyMap<string, CharonSchema>;
  readonly output: ReadonlyMap<string, CharonSchema>;
}
