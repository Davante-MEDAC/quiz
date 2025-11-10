import { createStoreService } from '$lib/utils/store-service';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	if (!params.hash) {
		return new Response(null, { status: 400 });
	}

	const storeService = await createStoreService();
	const progressJson = await storeService.searchFiles(`${params.hash}`);

	if (progressJson.files.length) {
		await storeService.updateFile(
			`${params.hash}/progress.json`,
			JSON.stringify({
				completedLessons: [1]
			})
		);
	} else {
		await storeService.createDirectory(params.hash);
		await storeService.createFile(
			`${params.hash}/progress.json`,
			JSON.stringify({
				completedLessons: []
			})
		);
	}

	return new Response(null, { status: 201 });
};
