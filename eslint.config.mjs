/* eslint-disable import/no-anonymous-default-export */
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Compatibilidad con configuración tradicional (como .eslintrc)
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Exportamos la configuración
export default [
  // Extensiones estándar para Next.js y TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Overrides para permitir 'any' en archivos de test y setup
  {
    files: ["**/*.test.ts", "**/setup.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
