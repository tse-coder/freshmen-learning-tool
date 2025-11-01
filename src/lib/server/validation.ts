/**
 * Validation utilities for SvelteKit API routes using Zod
 */
import { z } from 'zod';
import { ApiError } from './errors';

// UUID validation schemas
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' });

// Course ID validation
export const courseIdSchema = uuidSchema;

// Exam ID validation
export const examIdSchema = uuidSchema;

// Question ID validation
export const questionIdSchema = uuidSchema;

// Resource ID validation
export const resourceIdSchema = uuidSchema;

// Video ID validation
export const videoIdSchema = uuidSchema;

// Telegram init data validation
export const telegramInitDataSchema = z.string().min(1, 'Init data cannot be empty');

// Credentials validation
export const credentialsSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
	password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long')
});

// Query parameter schemas
export const courseIdQuerySchema = z.object({
	courseId: courseIdSchema
});

export const examIdQuerySchema = z.object({
	examId: examIdSchema
});

export const resourceQuerySchema = z.object({
	courseId: courseIdSchema,
	type: z.string().optional()
});

// Feedback schema
export const feedbackSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
	message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
	user_id: z.string().uuid().nullable().optional()
});

/**
 * Validate request data against a schema
 */
export function validate<T extends z.ZodSchema>(schema: T, data: unknown): z.infer<T> {
	try {
		return schema.parse(data) as z.infer<T>;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
			throw new ApiError(400, `Validation error: ${messages}`, 'VALIDATION_ERROR');
		}
		throw error;
	}
}

/**
 * Validate URL search parameters
 */
export function validateSearchParams<T extends z.ZodSchema>(
	schema: T,
	searchParams: URLSearchParams
): z.infer<T> {
	const params: Record<string, string> = {};
	searchParams.forEach((value, key) => {
		params[key] = value;
	});
	return validate(schema, params);
}

/**
 * Validate request body
 */
export async function validateBody<T extends z.ZodSchema>(
	schema: T,
	request: Request
): Promise<z.infer<T>> {
	const body = await request.json().catch(() => {
		throw new ApiError(400, 'Invalid JSON body', 'INVALID_INPUT');
	});
	return validate(schema, body);
}

