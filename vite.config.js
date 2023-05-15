import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: {
          index: resolve(__dirname, "src/index.ts"),
        },
        name: "drop",
      },
      sourcemap: true,
      target: "esnext",
      emptyOutDir: true,
      reportCompressedSize: true,
    },
    plugins: [dts()],
  };
});
