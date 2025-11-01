/**
 * Client-side logger utility
 * In production, can integrate with error tracking services
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
	private log(level: LogLevel, message: string, ...args: unknown[]): void {
		if (isDevelopment) {
			// In development, use console methods with structured logging
			const logData = args.length > 0 ? { message, data: args } : message;
			console[level](`[${level.toUpperCase()}]`, logData);
		} else if (isProduction && level === 'error') {
			// In production, only log errors
			// TODO: Send to error tracking service (Sentry, etc.)
			const logData = args.length > 0 ? { message, data: args } : message;
			console.error(logData);
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
		const errorInfo = error instanceof Error 
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

