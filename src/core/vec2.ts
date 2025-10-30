export interface ReadonlyVec2 {
  readonly x: number;
  readonly y: number;
}

export class Vec2 implements ReadonlyVec2 {
  constructor(
    public x: number,
    public y: number,
  ) {}

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  plus(delta: ReadonlyVec2): this {
    this.x += delta.x;
    this.y += delta.y;
    return this;
  }

  minus(delta: ReadonlyVec2): this {
    this.x -= delta.x;
    this.y -= delta.y;
    return this;
  }

  scale(scale: number): this {
    this.x *= scale;
    this.y *= scale;
    return this;
  }
}
