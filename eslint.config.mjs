import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".prerender/**",
      "node_modules/**",
      "reports/**",
      ".lighthouseci/**",
      "public/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {...globals.browser, ...globals.node, __BUILD_YEAR__: "readonly"}
    }
  },
  {
    files: ["**/*.mjs", "**/*.cjs"],
    rules: {"@typescript-eslint/no-require-imports": "off"}
  }
);
