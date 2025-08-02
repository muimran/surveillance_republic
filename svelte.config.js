

import { vitePreprocess } from '@sveltejs/kit/vite';

const isExport = process.env.EXPORT === 'true';

// Dynamically import the correct adapter
const adapter = isExport
  ? (await import('@sveltejs/adapter-static')).default
  : (await import('@sveltejs/adapter-vercel')).default;

const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: isExport ? '/my-subfolder-name' : ''
    },
    trailingSlash: 'always'
  }
};

export default config;











/* uncomment if you want to use the static adapter for exporting 
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} * /
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: 'suv'  // subfolder
    }
  }
};

export default config;
*/
