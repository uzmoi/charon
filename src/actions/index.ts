import { compressAction, decompressAction } from "./compress";
import { hashAction } from "./hash";

export const actions = [hashAction, compressAction, decompressAction];

export type { Action } from "./helpers";
