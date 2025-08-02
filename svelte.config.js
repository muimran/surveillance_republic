// Correct import for the preprocessor
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Your existing static adapter import
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Add the preprocess section here
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      // Your existing base path
      base: '/suv'
    }
  }
};

export default config;