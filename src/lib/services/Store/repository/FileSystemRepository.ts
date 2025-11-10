import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

import type {
	CreateDirectoryOptions,
	CreateFileOptions,
	RepositoryFile,
	StoreRepository,
	UpdateFileOptions
} from '..';

interface FileSystemConfig {
	dataDirectory: string;
	createIfNotExists?: boolean;
}

interface FileMetadata {
	sha: string;
	message: string;
	timestamp: number;
	author?: {
		name: string;
		email: string;
	};
	committer?: {
		name: string;
		email: string;
	};
}

export class FileSystemRepositoryError extends Error {
	constructor(
		message: string,
		public code: string,
		public path?: string
	) {
		super(message);
		this.name = 'FileSystemRepositoryError';
	}
}

export class FileSystemRepository implements StoreRepository {
	private config: Required<FileSystemConfig>;
	private metadataDir: string;

	constructor() {
		console.log('FileSystem');

		this.config = {
			dataDirectory: './data',
			createIfNotExists: true
		};
		this.metadataDir = path.join(this.config.dataDirectory, '.fs-repo-metadata');
	}

	/**
	 * Initialize the repository by creating necessary directories
	 */
	async initialize(): Promise<void> {
		if (this.config.createIfNotExists) {
			try {
				await fs.mkdir(this.config.dataDirectory, { recursive: true });
				await fs.mkdir(this.metadataDir, { recursive: true });
			} catch (error) {
				throw new FileSystemRepositoryError(
					`Failed to initialize repository: ${error instanceof Error ? error.message : 'Unknown error'}`,
					'INIT_ERROR'
				);
			}
		}
	}

	/**
	 * Resolve a file path within the constrained data directory
	 */
	private resolvePath(filePath: string): string {
		// Normalize and resolve the path
		const normalizedPath = path.normalize(filePath);

		// Remove leading slash if present
		const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;

		// Join with data directory
		const fullPath = path.join(this.config.dataDirectory, cleanPath);

		// Ensure the resolved path is within the data directory (security check)
		const resolvedPath = path.resolve(fullPath);
		const resolvedDataDir = path.resolve(this.config.dataDirectory);

		if (!resolvedPath.startsWith(resolvedDataDir + path.sep) && resolvedPath !== resolvedDataDir) {
			throw new FileSystemRepositoryError(
				`Path "${filePath}" is outside the constrained data directory`,
				'PATH_OUTSIDE_BOUNDS',
				filePath
			);
		}

		return resolvedPath;
	}

	/**
	 * Generate a SHA hash for content (similar to Git's blob hash)
	 */
	private generateSha(content: string): string {
		const blob = `blob ${Buffer.byteLength(content, 'utf8')}\0${content}`;
		return crypto.createHash('sha1').update(blob, 'utf8').digest('hex');
	}

	/**
	 * Get metadata file path for a given file
	 */
	private getMetadataPath(filePath: string): string {
		const relativePath = path.relative(this.config.dataDirectory, this.resolvePath(filePath));
		const metadataFileName = relativePath.replace(/[/\\]/g, '_') + '.meta.json';
		return path.join(this.metadataDir, metadataFileName);
	}

	/**
	 * Save metadata for a file
	 */
	private async saveMetadata(filePath: string, metadata: FileMetadata): Promise<void> {
		const metadataPath = this.getMetadataPath(filePath);
		await fs.mkdir(path.dirname(metadataPath), { recursive: true });
		await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
	}

	/**
	 * Load metadata for a file
	 */
	private async loadMetadata(filePath: string): Promise<FileMetadata | null> {
		try {
			const metadataPath = this.getMetadataPath(filePath);
			const content = await fs.readFile(metadataPath, 'utf8');
			return JSON.parse(content);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				return null;
			}
			throw error;
		}
	}

	/**
	 * Create a new file in the repository
	 */
	async createFile(filePath: string, options: CreateFileOptions): Promise<RepositoryFile> {
		await this.initialize();

		const fullPath = this.resolvePath(filePath);

		// Check if file already exists
		try {
			await fs.access(fullPath);
			throw new FileSystemRepositoryError(
				`File "${filePath}" already exists`,
				'FILE_EXISTS',
				filePath
			);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
				throw error;
			}
		}

		// Create directory if it doesn't exist
		await fs.mkdir(path.dirname(fullPath), { recursive: true });

		// Write the file
		await fs.writeFile(fullPath, options.content, 'utf8');

		// Generate SHA and save metadata
		const sha = this.generateSha(options.content);
		const metadata: FileMetadata = {
			sha,
			message: options.message,
			timestamp: Date.now(),
			author: options.author,
			committer: options.committer
		};

		await this.saveMetadata(filePath, metadata);

		const stats = await fs.stat(fullPath);

		return {
			name: path.basename(filePath),
			path: filePath,
			sha,
			size: stats.size,
			type: 'file',
			content: options.content,
			encoding: 'utf8'
		};
	}

	/**
	 * Update an existing file's contents
	 */
	async updateFile(filePath: string, options: UpdateFileOptions): Promise<RepositoryFile> {
		await this.initialize();

		const fullPath = this.resolvePath(filePath);

		try {
			await fs.access(fullPath);
		} catch (error) {
			console.error(error);
			throw new FileSystemRepositoryError(
				`File "${filePath}" does not exist`,
				'FILE_NOT_FOUND',
				filePath
			);
		}

		const existingMetadata = await this.loadMetadata(filePath);
		if (existingMetadata && existingMetadata.sha !== options.sha) {
			throw new FileSystemRepositoryError(
				`SHA mismatch for file "${filePath}". Expected: ${options.sha}, Current: ${existingMetadata.sha}`,
				'SHA_MISMATCH',
				filePath
			);
		}

		await fs.writeFile(fullPath, options.content, 'utf8');

		const sha = this.generateSha(options.content);
		const metadata: FileMetadata = {
			sha,
			message: options.message,
			timestamp: Date.now(),
			author: options.author,
			committer: options.committer
		};

		await this.saveMetadata(filePath, metadata);

		const stats = await fs.stat(fullPath);

		return {
			name: path.basename(filePath),
			path: filePath,
			sha,
			size: stats.size,
			type: 'file',
			content: options.content,
			encoding: 'utf8'
		};
	}

	/**
	 * Retrieve a file's content and metadata
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async retrieveFile(filePath: string, ref?: string): Promise<RepositoryFile> {
		await this.initialize();

		const fullPath = this.resolvePath(filePath);

		try {
			const stats = await fs.stat(fullPath);

			if (stats.isDirectory()) {
				throw new FileSystemRepositoryError(
					`Path "${filePath}" is a directory, not a file`,
					'IS_DIRECTORY',
					filePath
				);
			}

			const content = await fs.readFile(fullPath, 'utf8');
			const metadata = await this.loadMetadata(filePath);

			// Generate SHA if metadata doesn't exist
			const sha = metadata?.sha || this.generateSha(content);

			return {
				name: path.basename(filePath),
				path: filePath,
				sha,
				size: stats.size,
				type: 'file',
				content,
				encoding: 'utf8'
			};
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				throw new FileSystemRepositoryError(
					`File "${filePath}" not found`,
					'FILE_NOT_FOUND',
					filePath
				);
			}
			throw error;
		}
	}

	/**
	 * Delete a file from the repository
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async deleteFile(filePath: string, message: string, sha: string, branch?: string): Promise<void> {
		await this.initialize();

		const fullPath = this.resolvePath(filePath);

		// Verify SHA if provided
		const existingMetadata = await this.loadMetadata(filePath);
		if (existingMetadata && existingMetadata.sha !== sha) {
			throw new FileSystemRepositoryError(
				`SHA mismatch for file "${filePath}". Expected: ${sha}, Current: ${existingMetadata.sha}`,
				'SHA_MISMATCH',
				filePath
			);
		}

		try {
			await fs.unlink(fullPath);

			// Remove metadata
			const metadataPath = this.getMetadataPath(filePath);
			try {
				await fs.unlink(metadataPath);
			} catch (error) {
				console.warn(
					`Failed to delete metadata for "${filePath}": ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			}
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				throw new FileSystemRepositoryError(
					`File "${filePath}" not found`,
					'FILE_NOT_FOUND',
					filePath
				);
			}
			throw error;
		}
	}

	/**
	 * Create a directory
	 */
	async createDirectory(
		filePath: string,
		options: CreateDirectoryOptions
	): Promise<RepositoryFile> {
		await this.initialize();

		const fullPath = this.resolvePath(filePath);

		try {
			await fs.mkdir(fullPath, { recursive: true });

			// Create a .gitkeep file to track the directory (similar to GitHub behavior)
			const gitkeepPath = path.join(fullPath, '.gitkeep');
			await fs.writeFile(gitkeepPath, '', 'utf8');

			const stats = await fs.stat(fullPath);
			const sha = this.generateSha(''); // Empty content for directory

			// Save metadata for the directory
			const metadata: FileMetadata = {
				sha,
				message: options.message,
				timestamp: Date.now(),
				author: options.author,
				committer: options.committer
			};

			await this.saveMetadata(filePath, metadata);

			return {
				name: path.basename(filePath),
				path: filePath,
				sha,
				size: stats.size,
				type: 'dir'
			};
		} catch (error) {
			throw new FileSystemRepositoryError(
				`Failed to create directory "${filePath}": ${error instanceof Error ? error.message : 'Unknown error'}`,
				'CREATE_DIR_FAILED',
				filePath
			);
		}
	}

	/**
	 * List all files in a directory
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async listDirectory(dirPath: string = '', ref?: string): Promise<RepositoryFile[]> {
		await this.initialize();

		const fullPath = this.resolvePath(dirPath);

		try {
			const entries = await fs.readdir(fullPath, { withFileTypes: true });
			const results: RepositoryFile[] = [];

			for (const entry of entries) {
				// Skip metadata directory and hidden files (except .gitkeep)
				if (entry.name.startsWith('.') && entry.name !== '.gitkeep') {
					continue;
				}

				const entryPath = path.join(dirPath, entry.name);
				const entryFullPath = path.join(fullPath, entry.name);
				const stats = await fs.stat(entryFullPath);

				if (entry.isDirectory()) {
					const metadata = await this.loadMetadata(entryPath);
					results.push({
						name: entry.name,
						path: entryPath,
						sha: metadata?.sha || this.generateSha(''),
						size: stats.size,
						type: 'dir'
					});
				} else if (entry.isFile() && entry.name !== '.gitkeep') {
					const content = await fs.readFile(entryFullPath, 'utf8');
					const metadata = await this.loadMetadata(entryPath);

					results.push({
						name: entry.name,
						path: entryPath,
						sha: metadata?.sha || this.generateSha(content),
						size: stats.size,
						type: 'file',
						content,
						encoding: 'utf8'
					});
				}
			}

			return results;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				throw new FileSystemRepositoryError(
					`Directory "${dirPath}" not found`,
					'DIR_NOT_FOUND',
					dirPath
				);
			}
			throw error;
		}
	}

	/**
	 * Check if a file or directory exists
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async exists(filePath: string, ref?: string): Promise<boolean> {
		try {
			const fullPath = this.resolvePath(filePath);
			await fs.access(fullPath);
			return true;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
				return false;
			}
			throw error;
		}
	}

	/**
	 * Helper method to create a file or update if it exists
	 */
	async createOrUpdateFile(
		filePath: string,
		options: Omit<CreateFileOptions, 'content'> & { content: string }
	): Promise<RepositoryFile> {
		try {
			// Try to get the existing file
			const existingFile = await this.retrieveFile(filePath);

			// File exists, update it
			return await this.updateFile(filePath, {
				...options,
				sha: existingFile.sha
			});
		} catch (error) {
			if (error instanceof FileSystemRepositoryError && error.code === 'FILE_NOT_FOUND') {
				// File doesn't exist, create it
				return await this.createFile(filePath, options);
			}
			throw error;
		}
	}

	/**
	 * Get the absolute path to the data directory
	 */
	getDataDirectory(): string {
		return path.resolve(this.config.dataDirectory);
	}

	/**
	 * Clean up the repository (remove all files and metadata)
	 */
	async cleanup(): Promise<void> {
		try {
			await fs.rm(this.config.dataDirectory, { recursive: true, force: true });
		} catch (error) {
			throw new FileSystemRepositoryError(
				`Failed to cleanup repository: ${error instanceof Error ? error.message : 'Unknown error'}`,
				'CLEANUP_FAILED'
			);
		}
	}

	/**
	 * Get repository statistics
	 */
	async getStats(): Promise<{ totalFiles: number; totalDirectories: number; totalSize: number }> {
		await this.initialize();

		let totalFiles = 0;
		let totalDirectories = 0;
		let totalSize = 0;

		const scanDirectory = async (dirPath: string): Promise<void> => {
			try {
				const entries = await fs.readdir(dirPath, { withFileTypes: true });

				for (const entry of entries) {
					if (entry.name.startsWith('.fs-repo-metadata')) {
						continue;
					}

					const entryPath = path.join(dirPath, entry.name);
					const stats = await fs.stat(entryPath);

					if (entry.isDirectory()) {
						totalDirectories++;
						await scanDirectory(entryPath);
					} else if (entry.isFile() && entry.name !== '.gitkeep') {
						totalFiles++;
						totalSize += stats.size;
					}
				}
			} catch (error) {
				console.warn(
					`Failed to read directory "${dirPath}": ${error instanceof Error ? error.message : 'Unknown error'}`
				);
				// Skip directories that can't be read
			}
		};

		await scanDirectory(this.config.dataDirectory);

		return { totalFiles, totalDirectories, totalSize };
	}
}
