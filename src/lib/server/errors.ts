/**
 * Standardized error handling for SvelteKit API routes
 */
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
	statusCode: number;
	code: string;
	details?: unknown;

	constructor(statusCode: number, message: string, code?: string, details?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.statusCode = statusCode;
		this.code = code || this.getDefaultCode(statusCode);
		this.details = details;
	}

	private getDefaultCode(statusCode: number): string {
		const codes: Record<number, string> = {
			400: 'BAD_REQUEST',
			401: 'UNAUTHORIZED',
			403: 'FORBIDDEN',
			404: 'NOT_FOUND',
			429: 'TOO_MANY_REQUESTS',
			500: 'INTERNAL_SERVER_ERROR',
			502: 'BAD_GATEWAY',
			503: 'SERVICE_UNAVAILABLE'
		};
		return codes[statusCode] || 'UNKNOWN_ERROR';
	}

	toJSON() {
		const result: {
			ok: boolean;
			error: string;
			code: string;
			details?: unknown;
		} = {
			ok: false,
			error: this.message,
			code: this.code
		};
		if (this.details) {
			result.details = this.details;
		}
		return result;
	}
}

/**
 * Handle errors and return standardized Response
 */
export function handleError(error: unknown, request: Request): Response {
	// Log error (in production, send to logging service)
	logError(error, request);

	if (error instanceof ApiError) {
		return new Response(JSON.stringify(error.toJSON()), {
			status: error.statusCode,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Don't expose internal error details in production
	const isDevelopment = import.meta.env.DEV;
	const message =
		error instanceof Error
			? isDevelopment
				? error.message
				: 'An unexpected error occurred'
			: 'An unexpected error occurred';

	return new Response(
		JSON.stringify({
			ok: false,
			error: message,
			code: 'INTERNAL_SERVER_ERROR'
		}),
		{
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}

/**
 * Log errors (replace with proper logging service in production)
 */
function logError(error: unknown, request: Request): void {
	const errorInfo: {
		timestamp: string;
		message: string;
		stack?: string;
		url: string;
		method: string;
		statusCode?: number;
	} = {
		timestamp: new Date().toISOString(),
		message: error instanceof Error ? error.message : 'Unknown error',
		url: request.url,
		method: request.method
	};

	if (error instanceof Error) {
		errorInfo.stack = error.stack;
	}

	if (error instanceof ApiError) {
		errorInfo.statusCode = error.statusCode;
	}

	// In production, send to logging service (e.g., Sentry, etc.)
	if (import.meta.env.PROD) {
		// TODO: Integrate with logging service
		console.error('ERROR:', JSON.stringify(errorInfo));
	} else {
		console.error('ERROR:', errorInfo);
	}
}

/**
 * Async route handler wrapper to catch errors
 */
export function asyncHandler(
	handler: (event: RequestEvent) => Promise<Response>
): RequestHandler {
	return async (event) => {
		try {
			return await handler(event);
		} catch (error) {
			return handleError(error, event.request);
		}
	};
}

