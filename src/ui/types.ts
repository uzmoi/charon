export interface Vec2 {
  x: number;
  y: number;
}

export interface Node {
  id: number;
  type: string;
  pos: Vec2;
  size: BoxSize;
}
