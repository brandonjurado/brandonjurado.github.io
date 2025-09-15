import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig(({mode}) => {
  return {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {"@": path.resolve(__dirname, "src")},
      'lottie-web': 'lottie-web/build/player/lottie_light_canvas'
    },

    build: {
      outDir: "dist",
      target: "esnext", // or leave default 'baseline-widely-available' if you need wider support
      cssCodeSplit: true,
      cssMinify: "lightningcss", // modern, fast CSS minifier
      reportCompressedSize: false, // speed up build reporting
      sourcemap: false, // flip to true only when debugging prod
      chunkSizeWarningLimit: 700, // quieten harmless warnings

      rollupOptions: {
        output: {
          // simple, predictable filenames for better caching
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",

          // optional: nudge big deps into their own chunks
          manualChunks: {
            react: ["react", "react-dom"],
            motion: ["framer-motion"],
            lottie: ["lottie-react"],
            util: ["colorthief"]
          }
        }
      }
    }

    // Optional dev niceties
    // server: {
    //   warmup: { clientFiles: ['./src/main.jsx', './src/containers/Main.jsx'] },
    // },
  };
});
