export const log = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info: (...args: any[]) => {
		console.log('\x1b[32m[INFO]\x1b[0m', ...args);
	}
};
