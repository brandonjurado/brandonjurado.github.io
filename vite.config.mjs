import path from "node:path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

function manualChunks(id) {
  if (
    id.includes("/node_modules/react/") ||
    id.includes("/node_modules/react-dom/")
  ) {
    return "react";
  }

  if (id.includes("/node_modules/framer-motion/")) {
    return "motion";
  }

  if (
    id.includes("/node_modules/lottie-react/") ||
    id.includes("/node_modules/lottie-web/")
  ) {
    return "lottie";
  }

  return undefined;
}

export default defineConfig(() => {
  return {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: [{find: "@", replacement: path.resolve(__dirname, "src")}]
    },

    build: {
      outDir: "dist",
      target: "esnext",
      cssCodeSplit: true,
      cssMinify: "lightningcss",
      reportCompressedSize: false,
      sourcemap: false,
      chunkSizeWarningLimit: 700,

      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
          manualChunks
        }
      }
    }

    // Optional dev niceties
    // server: {
    //   warmup: { clientFiles: ['./src/main.jsx', './src/containers/Main.jsx'] },
    // },
  };
});
