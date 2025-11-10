import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import nodeAdapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: process.env.NODE_ENV === 'production' ? cloudflareAdapter() : nodeAdapter()
	},
	extensions: ['.svelte']
};

export default config;
