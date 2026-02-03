// src/routes/api/activity/archive/+server.ts
// API endpoint for archiving old activity data (30+ days)
// This should be called periodically via a cron job or scheduled task

import type { RequestHandler } from '@sveltejs/kit';
import { archiveOldActivity } from '../../../../lib/server/activityLogger';
import { asyncHandler, ApiError } from '../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';

const archiveLimiter = rateLimit({
    maxRequests: 10,
    windowMs: 3600000 // 1 hour
});

const handler = asyncHandler(async ({ request }) => {
    // Require admin secret for this operation
    const adminSecret = request.headers.get('X-Admin-Secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
        throw new ApiError(403, 'Unauthorized - Admin access required', 'FORBIDDEN');
    }

    // Run the archival process
    const result = await archiveOldActivity();

    if (!result.success) {
        throw new ApiError(500, result.message, 'ARCHIVAL_FAILED');
    }

    return new Response(
        JSON.stringify({
            ok: true,
            data: {
                message: result.message,
                timestamp: new Date().toISOString()
            }
        }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
});

export const POST: RequestHandler = withRateLimit(archiveLimiter, handler);
