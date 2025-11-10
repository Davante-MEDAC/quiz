import type { RepositoryFile, StoreRepository } from '..';

export interface GitHubConfig {
	owner: string;
	repo: string;
	token: string;
	baseDir: string;
	baseUrl?: string;
}

export interface GitHubFile extends RepositoryFile {
	url: string;
	html_url: string;
	git_url: string;
	download_url: string | null;
}

export interface CreateFileOptions {
	message: string;
	content: string;
	branch?: string;
	committer?: {
		name: string;
		email: string;
	};
	author?: {
		name: string;
		email: string;
	};
}

export interface UpdateFileOptions {
	message: string;
	content: string;
	sha: string;
	branch?: string;
	committer?: {
		name: string;
		email: string;
	};
	author?: {
		name: string;
		email: string;
	};
}

export interface CreateDirectoryOptions {
	message: string;
	branch?: string;
	committer?: {
		name: string;
		email: string;
	};
	author?: {
		name: string;
		email: string;
	};
}

export class GitHubAPIError extends Error {
	constructor(
		message: string,
		public status: number,
		public response: unknown
	) {
		super(message);
		this.name = 'GitHubAPIError';
	}
}

export class GitHubRepository implements StoreRepository {
	private config: GitHubConfig;
	private baseUrl: string;

	constructor(token: string) {
		if (!token || !token.startsWith('ghp_')) {
			throw new Error('GitHub token is required');
		}

		console.log('GitHubRepository initialized with provided token.');

		this.config = {
			token,
			owner: 'Davante-MEDAC',
			repo: 'quiz-data',
			baseDir: 'quiz',
			baseUrl: 'https://api.github.com'
		};
		this.baseUrl = this.config.baseUrl!;
	}

	/**
	 * Make an authenticated request to the GitHub API
	 */
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		const headers = {
			Authorization: `Bearer ${this.config.token}`,
			Accept: 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'User-Agent': 'DavenBot',
			'X-GitHub-Api-Version': '2022-11-28',
			...options.headers
		};

		try {
			const response = await fetch(url, {
				...options,
				headers
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new GitHubAPIError(
					`GitHub API error: ${response.status} ${response.statusText}`,
					response.status,
					errorData
				);
			}

			// Handle 204 No Content responses
			if (response.status === 204) {
				return {} as T;
			}

			return await response.json();
		} catch (error) {
			console.error(`GitHub API Request Failed: ${options.method || 'GET'} ${url}`, error);
			if (error instanceof GitHubAPIError) {
				throw error;
			}
			throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Get the contents of a file or directory
	 */
	async getContents(path: string, ref?: string): Promise<GitHubFile | GitHubFile[]> {
		const baseDir = this.config.baseDir;
		const endpoint = `/repos/${this.config.owner}/${this.config.repo}/contents/${baseDir}/${path}`;
		const queryParams = ref ? `?ref=${encodeURIComponent(ref)}` : '';

		return await this.request<GitHubFile | GitHubFile[]>(`${endpoint}${queryParams}`);
	}

	/**
	 * Retrieve a file's content and metadata
	 */
	async retrieveFile(path: string, ref?: string): Promise<GitHubFile> {
		const result = await this.getContents(path, ref);

		if (Array.isArray(result)) {
			throw new Error(`Path "${path}" is a directory, not a file`);
		}

		if (result.type !== 'file') {
			throw new Error(`Path "${path}" is not a file`);
		}

		// Decode base64 content if present
		if (result.content && result.encoding === 'base64') {
			result.content = atob(result.content.replace(/\n/g, ''));
		}

		return result;
	}

	/**
	 * Create a new file in the repository
	 */
	async createFile(path: string, options: CreateFileOptions): Promise<GitHubFile> {
		const baseDir = this.config.baseDir;
		const endpoint = `/repos/${this.config.owner}/${this.config.repo}/contents/${baseDir}/${path}`;

		const body = {
			message: options.message,
			content: btoa(unescape(encodeURIComponent(options.content))), // Encode to base64
			branch: options.branch,
			committer: options.committer,
			author: options.author
		};

		const response = await this.request<{ content: GitHubFile }>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		return response.content;
	}

	/**
	 * Update an existing file's contents
	 */
	async updateFile(path: string, options: UpdateFileOptions): Promise<GitHubFile> {
		const baseDir = this.config.baseDir;
		const endpoint = `/repos/${this.config.owner}/${this.config.repo}/contents/${baseDir}/${path}`;

		const body = {
			message: options.message,
			content: btoa(unescape(encodeURIComponent(options.content))), // Encode to base64
			sha: options.sha,
			branch: options.branch,
			committer: options.committer,
			author: options.author
		};

		const response = await this.request<{ content: GitHubFile }>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		return response.content;
	}

	/**
	 * Create a directory by creating a placeholder file (.gitkeep)
	 * GitHub doesn't support empty directories, so we create a .gitkeep file
	 */
	async createDirectory(path: string, options: CreateDirectoryOptions): Promise<GitHubFile> {
		const baseDir = this.config.baseDir;
		const gitkeepPath = `${baseDir}/${path}/.gitkeep`;

		return await this.createFile(gitkeepPath, {
			message: options.message,
			content: '',
			branch: options.branch,
			committer: options.committer,
			author: options.author
		});
	}

	/**
	 * Check if a file or directory exists
	 */
	async exists(path: string, ref?: string): Promise<boolean> {
		try {
			await this.getContents(path, ref);
			return true;
		} catch (error) {
			if (error instanceof GitHubAPIError && error.status === 404) {
				return false;
			}
			throw error;
		}
	}

	/**
	 * Delete a file from the repository
	 */
	async deleteFile(path: string, message: string, sha: string, branch?: string): Promise<void> {
		const baseDir = this.config.baseDir;
		const endpoint = `/repos/${this.config.owner}/${this.config.repo}/contents/${baseDir}/${path}`;

		const body = {
			message,
			sha,
			branch
		};

		await this.request(endpoint, {
			method: 'DELETE',
			body: JSON.stringify(body)
		});
	}

	/**
	 * List all files in a directory
	 */
	async listDirectory(path: string = '', ref?: string): Promise<GitHubFile[]> {
		const result = await this.getContents(path, ref);

		if (!Array.isArray(result)) {
			throw new Error(`Path "${path}" is a file, not a directory`);
		}

		return result;
	}

	/**
	 * Create multiple files and directories in a single operation using a tree
	 * This is more efficient for bulk operations
	 */
	async createTree(
		files: Array<{
			path: string;
			content: string;
			mode?: '100644' | '100755' | '040000' | '160000' | '120000';
		}>,
		message: string,
		baseBranch: string = 'main'
	): Promise<string> {
		// Get the base tree SHA
		const branchRef = await this.request<{ object: { sha: string } }>(
			`/repos/${this.config.owner}/${this.config.repo}/git/ref/heads/${baseBranch}`
		);

		const baseCommit = await this.request<{ tree: { sha: string } }>(
			`/repos/${this.config.owner}/${this.config.repo}/git/commits/${branchRef.object.sha}`
		);

		// Create blobs for each file
		const tree = await Promise.all(
			files.map(async (file) => {
				if (file.content) {
					const blob = await this.request<{ sha: string }>(
						`/repos/${this.config.owner}/${this.config.repo}/git/blobs`,
						{
							method: 'POST',
							body: JSON.stringify({
								content: btoa(unescape(encodeURIComponent(file.content))),
								encoding: 'base64'
							})
						}
					);

					return {
						path: file.path,
						mode: file.mode || '100644',
						type: 'blob' as const,
						sha: blob.sha
					};
				} else {
					// Directory
					return {
						path: file.path,
						mode: '040000' as const,
						type: 'tree' as const,
						sha: null
					};
				}
			})
		);

		// Create the tree
		const newTree = await this.request<{ sha: string }>(
			`/repos/${this.config.owner}/${this.config.repo}/git/trees`,
			{
				method: 'POST',
				body: JSON.stringify({
					base_tree: baseCommit.tree.sha,
					tree: tree.filter((item) => item !== null)
				})
			}
		);

		// Create the commit
		const newCommit = await this.request<{ sha: string }>(
			`/repos/${this.config.owner}/${this.config.repo}/git/commits`,
			{
				method: 'POST',
				body: JSON.stringify({
					message,
					tree: newTree.sha,
					parents: [branchRef.object.sha]
				})
			}
		);

		// Update the branch reference
		await this.request(
			`/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${baseBranch}`,
			{
				method: 'PATCH',
				body: JSON.stringify({
					sha: newCommit.sha
				})
			}
		);

		return newCommit.sha;
	}

	/**
	 * Get repository information
	 */
	async getRepositoryInfo() {
		return await this.request<unknown>(`/repos/${this.config.owner}/${this.config.repo}`);
	}

	/**
	 * Helper method to create a file or update if it exists
	 */
	async createOrUpdateFile(
		path: string,
		options: Omit<CreateFileOptions, 'content'> & { content: string }
	): Promise<RepositoryFile & GitHubFile> {
		try {
			// Try to get the existing file
			const existingFile = await this.retrieveFile(path, options.branch);

			// File exists, update it
			return await this.updateFile(path, {
				...options,
				sha: existingFile.sha
			});
		} catch (error) {
			if (error instanceof GitHubAPIError && error.status === 404) {
				// File doesn't exist, create it
				return await this.createFile(path, options);
			}
			throw error;
		}
	}
}
