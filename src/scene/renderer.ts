import { ACESFilmicToneMapping, SRGBColorSpace, WebGLRenderer } from "three";

export function createRenderer(props: { canvas?: unknown } & Record<string, unknown>): WebGLRenderer {
  const renderer = new WebGLRenderer({
    canvas: props.canvas as HTMLCanvasElement | undefined,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    stencil: false,
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  return renderer;
}
