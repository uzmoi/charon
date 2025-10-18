export interface Vec2 {
  x: number;
  y: number;
}

export interface BoxSize {
  width: number;
  height: number;
}

export interface Action {
  name: string;
  input: Record<string, { name: string }>;
  output: Record<string, { name: string }>;
  action: (this: void, input: {}) => Promise<{}>;
}

export interface Node {
  id: number;
  action: Action;
  pos: Vec2;
  size: BoxSize;
}
