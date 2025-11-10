export interface RepositoryFile {
	name: string;
	path: string;
	sha: string;
	size: number;
	type: 'file' | 'dir';
	content?: string;
	encoding?: string;
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

export interface FileOperation {
	type: 'create' | 'update' | 'delete';
	path: string;
	content?: string;
	message?: string;
	options?: unknown;
}

export interface BatchOperationResult {
	successful: Array<{ path: string; file: RepositoryFile }>;
	failed: Array<{ path: string; error: string }>;
	summary: {
		total: number;
		successful: number;
		failed: number;
	};
}

export interface SearchOptions {
	pattern?: RegExp;
	extension?: string;
	maxDepth?: number;
	includeContent?: boolean;
}

export interface SearchResult {
	files: RepositoryFile[];
	matches: Array<{
		file: RepositoryFile;
		matchedLines: Array<{
			lineNumber: number;
			content: string;
		}>;
	}>;
}

export interface ProjectStructure {
	files: string[];
	directories: string[];
	template?: string;
}

export interface StoreRepository {
	createFile(path: string, options: CreateFileOptions): Promise<RepositoryFile>;
	updateFile(path: string, options: UpdateFileOptions): Promise<RepositoryFile>;
	retrieveFile(path: string, ref?: string): Promise<RepositoryFile>;
	deleteFile(path: string, message: string, sha: string, branch?: string): Promise<void>;
	createDirectory(path: string, options: CreateDirectoryOptions): Promise<RepositoryFile>;
	listDirectory(path?: string, ref?: string): Promise<RepositoryFile[]>;
	exists(path: string, ref?: string): Promise<boolean>;
	createOrUpdateFile(
		path: string,
		options: Omit<CreateFileOptions, 'content'> & { content: string }
	): Promise<RepositoryFile>;
}

export class StoreServiceError extends Error {
	constructor(
		message: string,
		public code: string,
		public originalError?: Error
	) {
		super(message);
		this.name = 'StoreServiceError';
	}
}

export class StoreService {
	private repo: StoreRepository;

	constructor(repo: StoreRepository) {
		this.repo = repo;
	}

	/**
	 * Create a file with enhanced options and validation
	 */
	async createFile(
		path: string,
		content: string,
		message?: string,
		options?: Partial<CreateFileOptions>
	): Promise<RepositoryFile> {
		try {
			const fileOptions: CreateFileOptions = {
				message: message || `Create ${path}`,
				content,
				...options
			};

			return await this.repo.createFile(path, fileOptions);
		} catch (error) {
			throw new StoreServiceError(
				`Failed to create file "${path}"`,
				'CREATE_FILE_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Update a file with automatic SHA resolution
	 */
	async updateFile(
		path: string,
		content: string,
		message?: string,
		options?: Partial<Omit<UpdateFileOptions, 'sha'>>
	): Promise<RepositoryFile> {
		try {
			const currentFile = await this.repo.retrieveFile(path);
			console.log('Current file SHA:', currentFile);
			const updateOptions: UpdateFileOptions = {
				message: message || `Update ${path}`,
				content,
				sha: currentFile.sha,
				...options
			};

			return await this.repo.updateFile(path, updateOptions);
		} catch (error) {
			throw new StoreServiceError(
				`Failed to update file "${path}"`,
				'UPDATE_FILE_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Smart file operation that creates or updates based on existence
	 */
	async saveFile(
		path: string,
		content: string,
		message?: string,
		options?: Partial<CreateFileOptions>
	): Promise<RepositoryFile> {
		try {
			const fileOptions = {
				message: message || `Save ${path}`,
				content,
				...options
			};

			return await this.repo.createOrUpdateFile(path, fileOptions);
		} catch (error) {
			throw new StoreServiceError(
				`Failed to save file "${path}"`,
				'SAVE_FILE_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Create a directory with optional initialization files
	 */
	async createDirectory(
		path: string,
		message?: string,
		initFiles?: Array<{ name: string; content: string }>
	): Promise<{ directory: RepositoryFile; files: RepositoryFile[] }> {
		try {
			const directoryOptions = {
				message: message || `Create directory ${path}`
			};

			const directory = await this.repo.createDirectory(path, directoryOptions);
			const createdFiles: RepositoryFile[] = [];

			// Create initialization files if provided
			if (initFiles && initFiles.length > 0) {
				for (const initFile of initFiles) {
					const filePath = `${path}/${initFile.name}`;
					const file = await this.createFile(
						filePath,
						initFile.content,
						`Initialize ${initFile.name} in ${path}`
					);
					createdFiles.push(file);
				}
			}

			return { directory, files: createdFiles };
		} catch (error) {
			console.error(error);
			throw new StoreServiceError(
				`Failed to create directory "${path}"`,
				'CREATE_DIRECTORY_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Delete a file with automatic SHA resolution
	 */
	async deleteFile(path: string, message?: string): Promise<void> {
		try {
			// Get current file to obtain SHA
			const currentFile = await this.repo.retrieveFile(path);

			await this.repo.deleteFile(path, message || `Delete ${path}`, currentFile.sha);
		} catch (error) {
			throw new StoreServiceError(
				`Failed to delete file "${path}"`,
				'DELETE_FILE_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Copy a file to a new location
	 */
	async copyFile(
		sourcePath: string,
		destinationPath: string,
		message?: string
	): Promise<RepositoryFile> {
		try {
			const sourceFile = await this.repo.retrieveFile(sourcePath);

			if (!sourceFile.content) {
				throw new StoreServiceError(`Source file "${sourcePath}" has no content`, 'NO_CONTENT');
			}

			return await this.createFile(
				destinationPath,
				sourceFile.content,
				message || `Copy ${sourcePath} to ${destinationPath}`
			);
		} catch (error) {
			throw new StoreServiceError(
				`Failed to copy file from "${sourcePath}" to "${destinationPath}"`,
				'COPY_FILE_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Move a file to a new location
	 */
	async moveFile(
		sourcePath: string,
		destinationPath: string,
		message?: string
	): Promise<RepositoryFile> {
		try {
			// Copy the file to the new location
			const newFile = await this.copyFile(
				sourcePath,
				destinationPath,
				message || `Move ${sourcePath} to ${destinationPath}`
			);

			// Delete the original file
			await this.deleteFile(sourcePath, message || `Remove ${sourcePath} after move`);

			return newFile;
		} catch (error) {
			throw new StoreServiceError(
				`Failed to move file from "${sourcePath}" to "${destinationPath}"`,
				'MOVE_FILE_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Batch operations for multiple files
	 */
	async batchOperations(operations: FileOperation[]): Promise<BatchOperationResult> {
		const successful: Array<{ path: string; file: RepositoryFile }> = [];
		const failed: Array<{ path: string; error: string }> = [];

		for (const operation of operations) {
			try {
				let result: RepositoryFile | undefined;

				switch (operation.type) {
					case 'create':
						if (!operation.content) {
							throw new Error('Content is required for create operations');
						}
						result = await this.createFile(operation.path, operation.content, operation.message);
						break;

					case 'update':
						if (!operation.content) {
							throw new Error('Content is required for update operations');
						}
						result = await this.updateFile(operation.path, operation.content, operation.message);
						break;

					case 'delete':
						await this.deleteFile(operation.path, operation.message);
						result = {
							name: operation.path.split('/').pop() || '',
							path: operation.path,
							sha: '',
							size: 0,
							type: 'file' as const
						};
						break;

					default:
						throw new Error(`Unknown operation type: ${(operation as { type: unknown }).type}`);
				}

				if (result) {
					successful.push({ path: operation.path, file: result });
				}
			} catch (error) {
				failed.push({
					path: operation.path,
					error: error instanceof Error ? error.message : String(error)
				});
			}
		}

		return {
			successful,
			failed,
			summary: {
				total: operations.length,
				successful: successful.length,
				failed: failed.length
			}
		};
	}

	/**
	 * Search for files by pattern or content
	 */
	async searchFiles(searchTerm: string, options: SearchOptions = {}): Promise<SearchResult> {
		try {
			const { pattern, extension, maxDepth = 10, includeContent = false } = options;

			const allFiles: RepositoryFile[] = [];
			const matches: Array<{
				file: RepositoryFile;
				matchedLines: Array<{ lineNumber: number; content: string }>;
			}> = [];

			// Recursive function to collect files
			const collectFiles = async (dirPath: string, currentDepth: number = 0): Promise<void> => {
				if (currentDepth > maxDepth) return;

				try {
					const items = await this.repo.listDirectory(dirPath);

					for (const item of items) {
						if (item.type === 'file') {
							// Filter by extension if specified
							if (extension && !item.name.endsWith(extension)) {
								continue;
							}

							// Filter by pattern if specified
							if (pattern && !pattern.test(item.name)) {
								continue;
							}

							allFiles.push(item);

							// Search content if includeContent is true and content exists
							if (includeContent && item.content) {
								const lines = item.content.split('\n');
								const matchedLines: Array<{ lineNumber: number; content: string }> = [];

								lines.forEach((line, index) => {
									if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
										matchedLines.push({
											lineNumber: index + 1,
											content: line.trim()
										});
									}
								});

								if (matchedLines.length > 0) {
									matches.push({ file: item, matchedLines });
								}
							}
						} else if (item.type === 'dir') {
							await collectFiles(item.path, currentDepth + 1);
						}
					}
				} catch (error) {
					// Skip directories that can't be read
					console.warn(`Cannot read directory "${dirPath}":`, error);
				}
			};

			await collectFiles('');

			// If not searching content, filter files by name
			if (!includeContent) {
				const filteredFiles = allFiles.filter((file) =>
					file.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
				return { files: filteredFiles, matches: [] };
			}

			return { files: allFiles, matches };
		} catch (error) {
			throw new StoreServiceError(
				`Failed to search files with term "${searchTerm}"`,
				'SEARCH_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Create a project structure from a template
	 */
	async createProjectStructure(
		basePath: string,
		structure: ProjectStructure
	): Promise<BatchOperationResult> {
		const operations: FileOperation[] = [];

		// Create directories
		for (const dirPath of structure.directories) {
			const fullPath = `${basePath}/${dirPath}`.replace(/\/+/g, '/');
			operations.push({
				type: 'create',
				path: `${fullPath}/.gitkeep`,
				content: '',
				message: `Create directory ${dirPath}`
			});
		}

		// Create files
		for (const filePath of structure.files) {
			const fullPath = `${basePath}/${filePath}`.replace(/\/+/g, '/');
			operations.push({
				type: 'create',
				path: fullPath,
				content: this.getTemplateContent(filePath, structure.template),
				message: `Create ${filePath}`
			});
		}

		return await this.batchOperations(operations);
	}

	/**
	 * Get template content for a file based on its extension
	 */
	private getTemplateContent(filePath: string, templateType?: string): string {
		const extension = filePath.split('.').pop()?.toLowerCase();
		const fileName = filePath.split('/').pop() || '';

		// Basic template content based on file type
		switch (extension) {
			case 'ts':
			case 'tsx':
				return `// ${fileName}\n\nexport default function ${fileName.replace(/\.[^/.]+$/, '')}() {\n  // Implementation here\n}\n`;

			case 'js':
			case 'jsx':
				return `// ${fileName}\n\nfunction ${fileName.replace(/\.[^/.]+$/, '')}() {\n  // Implementation here\n}\n\nmodule.exports = ${fileName.replace(/\.[^/.]+$/, '')};\n`;

			case 'md':
				return `# ${fileName.replace(/\.[^/.]+$/, '')}\n\nDescription of this ${templateType || 'project'}.\n\n## Getting Started\n\nInstructions here.\n`;

			case 'json':
				if (fileName.toLowerCase() === 'package.json') {
					return `{\n  "name": "${templateType || 'project'}",\n  "version": "1.0.0",\n  "description": "",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  }\n}\n`;
				}
				return '{\n  \n}\n';

			case 'css':
				return `/* ${fileName} */\n\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n`;

			case 'html':
				return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${fileName.replace(/\.[^/.]+$/, '')}</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>\n`;

			default:
				return `# ${fileName}\n\n`;
		}
	}

	/**
	 * Get repository statistics
	 */
	async getStats(): Promise<{
		totalFiles: number;
		totalDirectories: number;
		totalSize: number;
		fileTypes: Record<string, number>;
	}> {
		try {
			const stats = {
				totalFiles: 0,
				totalDirectories: 0,
				totalSize: 0,
				fileTypes: {} as Record<string, number>
			};

			const collectStats = async (dirPath: string = ''): Promise<void> => {
				try {
					const items = await this.repo.listDirectory(dirPath);

					for (const item of items) {
						if (item.type === 'file' && item.name !== '.gitkeep') {
							stats.totalFiles++;
							stats.totalSize += item.size;

							const extension = item.name.split('.').pop()?.toLowerCase() || 'no-extension';
							stats.fileTypes[extension] = (stats.fileTypes[extension] || 0) + 1;
						} else if (item.type === 'dir') {
							stats.totalDirectories++;
							await collectStats(item.path);
						}
					}
				} catch (error) {
					// Skip directories that can't be read
					console.warn(`Cannot read directory "${dirPath}":`, error);
				}
			};

			await collectStats();
			return stats;
		} catch (error) {
			throw new StoreServiceError(
				'Failed to get repository statistics',
				'STATS_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}

	/**
	 * Backup files matching a pattern to a backup directory
	 */
	async backup(pattern: RegExp, backupPath: string = 'backups'): Promise<BatchOperationResult> {
		try {
			const searchResult = await this.searchFiles('', { pattern, includeContent: true });
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const operations: FileOperation[] = [];

			for (const file of searchResult.files) {
				if (file.content) {
					const backupFilePath = `${backupPath}/${timestamp}/${file.path}`;
					operations.push({
						type: 'create',
						path: backupFilePath,
						content: file.content,
						message: `Backup ${file.path}`
					});
				}
			}

			return await this.batchOperations(operations);
		} catch (error) {
			throw new StoreServiceError(
				`Failed to backup files with pattern "${pattern}"`,
				'BACKUP_FAILED',
				error instanceof Error ? error : new Error(String(error))
			);
		}
	}
}
