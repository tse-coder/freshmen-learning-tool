import { defineConfig } from 'tailwindcss';
import typography from '@tailwindcss/typography';
export default defineConfig({
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/routes/**/*.{svelte,ts}',
    './src/components/**/*.{svelte,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [typography.daisyui],
  daisyui: {
    themes: ["light", "dark", "synthwave", "cupcake"], // pick the themes you want
    darkTheme: "dark",
  },
});
