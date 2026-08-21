"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface WidgetProps {
  params?: Record<string, unknown>;
}

// Interactive teaching instruments (LEARNING-SYSTEM.md §3).
// Each is dynamically imported so lessons only pay for what they show.
export const WIDGETS: Record<string, ComponentType<WidgetProps>> = {
  "vector-playground": dynamic(() => import("./VectorPlayground"), { ssr: false }),
  "matrix-transform": dynamic(() => import("./MatrixTransform"), { ssr: false }),
  "derivative-explorer": dynamic(() => import("./DerivativeExplorer"), { ssr: false }),
  "gradient-descent": dynamic(() => import("./GradientDescent"), { ssr: false }),
  "gaussian-explorer": dynamic(() => import("./GaussianExplorer"), { ssr: false }),
  "backprop-graph": dynamic(() => import("./BackpropGraph"), { ssr: false }),
  "attention-vis": dynamic(() => import("./AttentionVis"), { ssr: false }),
  "rotation-2d": dynamic(() => import("./Rotation2D"), { ssr: false }),
  "so3-explorer": dynamic(() => import("./SO3Explorer"), { ssr: false }),
  "planar-arm": dynamic(() => import("./PlanarArm"), { ssr: false }),
  "pid-tuner": dynamic(() => import("./PIDTuner"), { ssr: false }),
  "kalman-1d": dynamic(() => import("./Kalman1D"), { ssr: false }),
  "gridworld-value": dynamic(() => import("./GridworldValue"), { ssr: false }),
  "bc-drift": dynamic(() => import("./BCDrift"), { ssr: false }),
  "vla-flow": dynamic(() => import("./VLAFlow"), { ssr: false }),
};

export const WIDGET_IDS = Object.keys(WIDGETS);
