/**
 * Logger utility for serverless functions
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

class Logger {
	private log(level: LogLevel, message: string, ...args: unknown[]): void {
		if (isDevelopment) {
			// In development, use console methods
			console[level](`[${level.toUpperCase()}]`, message, ...args);
		} else if (isProduction && level === 'error') {
			// In production, only log errors
			// TODO: Send to error tracking service (Sentry, etc.)
			console.error(message, ...args);
		}
	}

	debug(message: string, ...args: unknown[]): void {
		this.log('debug', message, ...args);
	}

	info(message: string, ...args: unknown[]): void {
		this.log('info', message, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		this.log('warn', message, ...args);
	}

	error(message: string, error?: Error | unknown, ...args: unknown[]): void {
		const errorInfo =
			error instanceof Error
				? {
						message: error.message,
						stack: error.stack,
						name: error.name
					}
				: error;

		this.log('error', message, errorInfo, ...args);
	}
}

export const logger = new Logger();

