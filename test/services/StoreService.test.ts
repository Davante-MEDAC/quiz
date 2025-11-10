import { describe, expect, test } from 'vitest';

import { FileSystemRepository } from '../../src/lib/services/Store/repository/FileSystemRepository';
import { GitHubRepository } from '../../src/lib/services/Store/repository/GitHubRepository';
import { StoreService } from '../../src/lib/services/Store';

const TEST_FILE_NAME = `integration-tests-${+new Date()}.txt`;

describe('Store Service with GitHub Repository', () => {
	test('creates directory in the data repo', async () => {
		const { GH_PAT } = process.env;
		const ghRepository = new GitHubRepository(GH_PAT as string);
		const storeService = new StoreService(ghRepository);

		await storeService.createFile(TEST_FILE_NAME, 'This is a test file content.');
		const found = await storeService.searchFiles(TEST_FILE_NAME);

		expect(found.files.length > 0, 'expected more than 0 matches');

		await storeService.updateFile(TEST_FILE_NAME, 'This is an updated test file content.');

		const foundAfter = await storeService.searchFiles(TEST_FILE_NAME);

		expect(foundAfter.files[0].content).toStrictEqual('This is an updated test file content.');
	});
});

describe('Store Service with FS Repository', () => {
	test('creates directory in the data dir', async () => {
		const ghRepository = new FileSystemRepository();
		const storeService = new StoreService(ghRepository);

		await storeService.createFile(TEST_FILE_NAME, 'This is a test file content.');
		const found = await storeService.searchFiles(TEST_FILE_NAME);

		expect(found.files.length > 0, 'expected more than 0 matches');

		await storeService.updateFile(TEST_FILE_NAME, 'This is an updated test file content.');

		const foundAfter = await storeService.searchFiles(TEST_FILE_NAME);

		console.log(foundAfter);

		expect(foundAfter.files[0].content).toStrictEqual('This is an updated test file content.');
	});
});
