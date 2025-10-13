export type CharonType =
  | { name: "boolean"; default: boolean | undefined }
  | { name: "number"; default: number | undefined }
  | { name: "string"; default: string | undefined }
  | { name: "bytes" };

export interface CharonTypeMap {
  boolean: boolean;
  number: number;
  string: string;
  bytes: ArrayBuffer;
}

export type CharonTypeOf<T extends CharonType> = CharonTypeMap[T["name"]];

export const t = {
  boolean: (defaultValue?: boolean) =>
    ({ name: "boolean", default: defaultValue }) satisfies CharonType,
  number: (defaultValue?: number) =>
    ({ name: "number", default: defaultValue }) satisfies CharonType,
  string: (defaultValue?: string, _enumValues?: readonly string[]) =>
    ({ name: "string", default: defaultValue }) satisfies CharonType,
  bytes: () => ({ name: "bytes" }) satisfies CharonType,
} as const;
