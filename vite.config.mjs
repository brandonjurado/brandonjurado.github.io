import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({isSsrBuild}) => ({
  plugins: [react()],
  define: {__BUILD_YEAR__: new Date().getUTCFullYear()},
  css: {preprocessorOptions: {scss: {api: "modern"}}},
  build: {
    target: "es2022",
    cssCodeSplit: true,
    manifest: !isSsrBuild,
    cssMinify: "lightningcss",
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        entryFileNames: isSsrBuild ? "[name].mjs" : "assets/[name]-[hash].js"
      }
    }
  }
}));
