/**
 * Rate limiting for SvelteKit API routes
 * Uses in-memory store (consider Redis for production with multiple instances)
 */
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

const stores: Record<string, RateLimitStore> = {};

// Cleanup old entries periodically
if (typeof setInterval !== 'undefined') {
	setInterval(() => {
		const now = Date.now();
		Object.keys(stores).forEach((key) => {
			const store = stores[key];
			Object.keys(store).forEach((ip) => {
				if (store[ip].resetTime < now) {
					delete store[ip];
				}
			});
		});
	}, 60000); // Cleanup every minute
}

interface RateLimitOptions {
	windowMs: number;
	maxRequests: number;
	keyGenerator?: (request: Request) => string;
}

/**
 * Get client identifier from request
 */
function getClientId(request: Request): string {
	// In serverless, use a combination of IP and user agent
	const forwarded = request.headers.get('x-forwarded-for');
	const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
	const userAgent = request.headers.get('user-agent') || 'unknown';
	return `${ip}-${userAgent}`;
}

/**
 * Create rate limit middleware
 */
export function rateLimit(options: RateLimitOptions) {
	const { windowMs, maxRequests, keyGenerator = getClientId } = options;
	const storeKey = `${windowMs}-${maxRequests}`;

	if (!stores[storeKey]) {
		stores[storeKey] = {};
	}

	const store = stores[storeKey];

	return (request: Request): { allowed: boolean; remaining: number; resetTime: number } => {
		const key = keyGenerator(request);
		const now = Date.now();

		let record = store[key];

		// Reset if window expired
		if (!record || record.resetTime < now) {
			record = {
				count: 0,
				resetTime: now + windowMs
			};
		}

		// Increment count
		record.count += 1;
		store[key] = record;

		const remaining = Math.max(0, maxRequests - record.count);
		const allowed = record.count <= maxRequests;

		return {
			allowed,
			remaining,
			resetTime: record.resetTime
		};
	};
}

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
	GENERAL: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		maxRequests: 100
	},
	EXAMS: {
		windowMs: 15 * 60 * 1000,
		maxRequests: 10 // Stricter for exam endpoints
	},
	AUTH: {
		windowMs: 15 * 60 * 1000,
		maxRequests: 5 // Strictest for auth endpoints
	}
};

/**
 * Rate limit middleware for RequestHandler
 */
export function withRateLimit(
	limiter: ReturnType<typeof rateLimit>,
	handler: RequestHandler
): RequestHandler {
	return async (event) => {
		const result = limiter(event.request);

		if (!result.allowed) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: 'Too many requests, please try again later',
					code: 'TOO_MANY_REQUESTS',
					retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
				}),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'X-RateLimit-Limit': '100',
						'X-RateLimit-Remaining': result.remaining.toString(),
						'X-RateLimit-Reset': result.resetTime.toString(),
						'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
					}
				}
			);
		}

		// Add rate limit headers
		event.setHeaders({
			'X-RateLimit-Limit': '100',
			'X-RateLimit-Remaining': result.remaining.toString(),
			'X-RateLimit-Reset': result.resetTime.toString()
		});

		return handler(event);
	};
}

