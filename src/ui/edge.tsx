import type { Vec2 } from "../core";

export const CharonEdge: preact.FunctionComponent<{
  from: Vec2;
  to: Vec2;
}> = ({ from, to }) => {
  return (
    <path
      d={edgePath(from, to)}
      fill="none"
      stroke="#1e9124"
      stroke-width="0.25"
    />
  );
};

const edgePath = (start: Vec2, end: Vec2) => {
  const x = (start.x + end.x) / 2;
  return `M${start.x} ${start.y}C${x} ${start.y} ${x} ${end.y} ${end.x} ${end.y}`;
};
