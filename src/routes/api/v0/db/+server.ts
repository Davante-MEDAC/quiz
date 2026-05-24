import { dev } from '$app/environment';
import { GITHUB_TOKEN } from '$env/static/private';

import type { RequestHandler } from './$types';

const REPO = 'Davante-MEDAC/quiz-data';
const CACHE_KEY = 'https://cache.internal/api/v0/db';
const CACHE_TTL = 3600;

export const GET: RequestHandler = async ({ locals, fetch }) => {
	const session = await locals.auth();

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	// If on development, read from local file instead of GitHub
	if (dev) {
		const res = await fetch('/db.json');
		return new Response(res.body, { headers: { 'Content-Type': 'application/json' } });
	}

	const cache = typeof caches !== 'undefined' ? caches.default : null;

	if (cache) {
		const cached = await cache.match(CACHE_KEY);
		if (cached) return cached;
	}

	const json = await fetchDbFromGitHub();
	const response = new Response(json, {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': `public, max-age=${CACHE_TTL}`
		}
	});

	if (cache) {
		await cache.put(CACHE_KEY, response.clone());
	}

	return response;
};

async function fetchDbFromGitHub(): Promise<string> {
	const headers = {
		Authorization: `token ${GITHUB_TOKEN}`,
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'User-Agent': 'quiz-app'
	};

	const releaseRes = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
		headers
	});

	if (!releaseRes.ok) {
		throw new Error(`GitHub releases API error: ${releaseRes.status}`);
	}

	const release = await releaseRes.json();
	const asset = (release.assets as { id: number; name: string }[])?.find(
		(a) => a.name === 'db.json'
	);

	if (!asset) {
		throw new Error('db.json asset not found in latest release');
	}

	const assetRes = await fetch(`https://api.github.com/repos/${REPO}/releases/assets/${asset.id}`, {
		headers: { ...headers, Accept: 'application/octet-stream' }
	});

	if (!assetRes.ok) {
		throw new Error(`GitHub asset download error: ${assetRes.status}`);
	}

	return assetRes.text();
}
