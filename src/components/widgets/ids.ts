// Pure list — importable by the node-side validator without pulling client code.
export const WIDGET_IDS = [
  "vector-playground",
  "matrix-transform",
  "derivative-explorer",
  "gradient-descent",
  "gaussian-explorer",
  "backprop-graph",
  "attention-vis",
  "rotation-2d",
  "so3-explorer",
  "planar-arm",
  "pid-tuner",
  "kalman-1d",
  "gridworld-value",
  "bc-drift",
  "vla-flow",
] as const;

export type WidgetId = (typeof WIDGET_IDS)[number];
