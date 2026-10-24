import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Run through the ESLint CLI (`npm run lint`), which, unlike the removed
  // `next lint`, doesn't skip build output on its own.
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**"],
  },
  // ESLint 9 only picks up .js/.mjs/.cjs by default; without this every
  // component (.jsx) would be silently skipped.
  { files: ["**/*.{js,jsx,mjs,cjs}"] },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
