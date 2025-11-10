import { GH_PAT } from '$env/static/private';

import { StoreService } from '$lib/services/Store';

export const Repository = __USE_PRODUCTION_STORE__
	? new (await import('$lib/services/Store/repository/GitHubRepository')).GitHubRepository(GH_PAT)
	: new (
			await import('$lib/services/Store/repository/FileSystemRepository')
		).FileSystemRepository();

export async function createStoreService(): Promise<StoreService> {
	const repository = Repository;
	return new StoreService(repository);
}
