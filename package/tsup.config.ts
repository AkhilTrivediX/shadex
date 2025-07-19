import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    entry: "src/index.ts",
    compilerOptions: {
      module: "CommonJS"
    }
  },
  sourcemap: false,
  clean: true,
  external: [
    "react",
    "react-dom",
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing"
  ]
});
