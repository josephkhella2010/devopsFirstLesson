import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      globals: globals.browser,
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // ❌ unused variables → ERROR
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // ❌ unused imports → ERROR (native ESLint rule)
      "no-unused-vars": "off", // disable base rule (important)
      // React component naming (PascalCase)
      "react/jsx-pascal-case": ["error", { allowAllCaps: false }],

      // Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Naming rules
      "@typescript-eslint/naming-convention": [
        "error",

        // variables → camelCase
        {
          selector: "variable",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },

        // functions → camelCase
        {
          selector: "function",
          format: ["PascalCase"],
        },

        // parameters → camelCase
        {
          selector: "parameter",
          format: ["camelCase"],
        },

        // classes → PascalCase
        {
          selector: "class",
          format: ["PascalCase"],
        },

        // types/interfaces → PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],

      // Vite React Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);
