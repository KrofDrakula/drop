import { resolve } from "node:path";
import { defineConfig } from "vite";
import { prismjsPlugin } from "vite-plugin-prismjs";

export default defineConfig(() => {
  return {
    root: resolve(__dirname, "src/demo"),
    build: {
      target: "esnext",
      emptyOutDir: true,
      outDir: resolve(__dirname, "../site"),
    },
    css: {
      modules: true,
    },

    plugins: [prismjsPlugin({ languages: ["ts", "json"] })],
  };
});
