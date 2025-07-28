import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		devtoolsJson()
	],
	server: {
		proxy: {
			'/api': {
				target: process.env.API_URL!,
				changeOrigin: true
			}
		}
	},
	optimizeDeps: {
		exclude: ['svelte-outside']
	}
});
