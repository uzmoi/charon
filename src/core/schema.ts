import { unreachable } from "@uzmoi/ut/ils";

export type CharonSchema =
  | { name: "boolean"; default: boolean | undefined }
  | { name: "number"; default: number | undefined }
  | { name: "string"; default: string | undefined }
  | { name: "bytes" };

interface CharonValueTypeMap {
  boolean: boolean;
  number: number;
  string: string;
  bytes: ArrayBuffer;
}

export type CharonValue = CharonValueTypeMap[keyof CharonValueTypeMap];

export type CharonValueType<T extends CharonSchema> =
  CharonValueTypeMap[T["name"]];

export const t = {
  boolean: (defaultValue?: boolean) =>
    ({ name: "boolean", default: defaultValue }) satisfies CharonSchema,
  number: (defaultValue?: number) =>
    ({ name: "number", default: defaultValue }) satisfies CharonSchema,
  string: (defaultValue?: string, _enumValues?: readonly string[]) =>
    ({ name: "string", default: defaultValue }) satisfies CharonSchema,
  bytes: () => ({ name: "bytes" }) satisfies CharonSchema,
} as const;

export const parse = (type: CharonSchema, value: unknown): CharonValue => {
  switch (type.name) {
    case "boolean": {
      if (typeof value === "boolean") return value;
      if (type.default != null) return type.default;
      throw new TypeError("expected boolean");
    }
    case "number": {
      if (typeof value === "number") return value;
      if (type.default != null) return type.default;
      throw new TypeError("expected number");
    }
    case "string": {
      if (typeof value === "string") return value;
      if (type.default != null) return type.default;
      throw new TypeError("expected string");
    }
    case "bytes": {
      if (value instanceof ArrayBuffer) return value;
      throw new TypeError("expected bytes");
    }
    default: {
      unreachable<typeof type>();
    }
  }
};
