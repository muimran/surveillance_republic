// uncomment if you want to use the static adapter for exporting 
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: '/suv'  // subfolder, added leading slash
    }
  }
};

export default config;
