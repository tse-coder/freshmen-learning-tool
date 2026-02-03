// src/routes/api/activity/log/+server.ts
// API endpoint for logging user activity

import type { RequestHandler } from '@sveltejs/kit';
import { logUserActivity } from '../../../../lib/server/activityLogger';
import { asyncHandler, ApiError } from '../../../../lib/server/errors';
import { validateBody } from '../../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';
import { z } from 'zod';

const activityLogSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    pagePath: z.string().optional(),
    userAgent: z.string().optional()
});

const activityLimiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ request }) => {
    const { userId, pagePath, userAgent } = await validateBody(activityLogSchema, request);

    // Log the activity
    const success = await logUserActivity(userId, pagePath, userAgent);

    if (!success) {
        throw new ApiError(500, 'Failed to log activity', 'ACTIVITY_LOG_FAILED');
    }

    return new Response(
        JSON.stringify({
            ok: true,
            data: {
                message: 'Activity logged successfully',
                timestamp: new Date().toISOString()
            }
        }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
});

export const POST: RequestHandler = withRateLimit(activityLimiter, handler);
