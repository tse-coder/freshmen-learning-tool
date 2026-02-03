// src/routes/api/activity/stats/+server.ts
// API endpoint for retrieving user activity statistics

import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../../config/supabase/client';
import { getMonthlySummaries } from '../../../../lib/server/activityLogger';
import { asyncHandler, ApiError } from '../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';

const supabase = getSupabaseClient();
const statsLimiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ request, url }) => {
    // Extract query parameters
    const period = url.searchParams.get('period') || 'daily';
    const days = parseInt(url.searchParams.get('days') || '7', 10);
    const userId = url.searchParams.get('userId');
    const dateParam = url.searchParams.get('date');
    const includeMonthly = url.searchParams.get('includeMonthly') === 'true';

    // Validate admin access (optional - you can add ADMIN_SECRET check here if needed)
    // const adminSecret = request.headers.get('X-Admin-Secret');
    // if (adminSecret !== process.env.ADMIN_SECRET) {
    //   throw new ApiError(403, 'Unauthorized', 'FORBIDDEN');
    // }

    // Calculate date range
    let startDate: Date;
    let endDate = new Date();

    if (dateParam) {
        // Get activity for a specific date
        startDate = new Date(dateParam);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(dateParam);
        endDate.setHours(23, 59, 59, 999);
    } else {
        // Get activity for the last N days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
    }

    // Build query
    let query = supabase
        .from('user_activity')
        .select('id, user_id, visited_at, page_path, created_at')
        .gte('visited_at', startDate.toISOString())
        .lte('visited_at', endDate.toISOString())
        .order('visited_at', { ascending: false });

    // Filter by user if specified
    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data: activityData, error } = await query;

    if (error) {
        throw new ApiError(500, 'Failed to fetch activity data', 'DATABASE_ERROR');
    }

    // Fetch user information for all unique users
    const uniqueUserIds = [...new Set(activityData?.map((a) => a.user_id) || [])];
    const { data: usersData } = await supabase
        .from('users')
        .select('id, username, first_name, last_name')
        .in('id', uniqueUserIds);

    const usersMap = new Map(usersData?.map((u) => [u.id, u]) || []);

    // Group activity by date
    const dailyStatsMap = new Map<string, any>();

    activityData?.forEach((activity) => {
        const date = new Date(activity.visited_at).toISOString().split('T')[0];

        if (!dailyStatsMap.has(date)) {
            dailyStatsMap.set(date, {
                date,
                visits: 0,
                uniqueUsers: new Set(),
                userVisits: new Map()
            });
        }

        const dayStats = dailyStatsMap.get(date);
        dayStats.visits++;
        dayStats.uniqueUsers.add(activity.user_id);

        if (!dayStats.userVisits.has(activity.user_id)) {
            const user = usersMap.get(activity.user_id);
            dayStats.userVisits.set(activity.user_id, {
                userId: activity.user_id,
                username: user?.username || 'Unknown',
                firstName: user?.first_name || '',
                lastName: user?.last_name || '',
                visitCount: 0,
                visits: []
            });
        }

        const userVisit = dayStats.userVisits.get(activity.user_id);
        userVisit.visitCount++;
        userVisit.visits.push(activity.visited_at);
    });

    // Convert to array and format
    const dailyStats = Array.from(dailyStatsMap.values())
        .map((day) => ({
            date: day.date,
            visits: day.visits,
            uniqueUsers: day.uniqueUsers.size,
            users: Array.from(day.userVisits.values()).sort(
                (a: any, b: any) => b.visitCount - a.visitCount
            )
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

    // Calculate summary
    const summary = {
        totalVisits: activityData?.length || 0,
        uniqueUsers: uniqueUserIds.length,
        dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        },
        period,
        days
    };

    // Optionally include monthly summaries
    let monthlySummaries = null;
    if (includeMonthly) {
        monthlySummaries = await getMonthlySummaries(12);
    }

    return new Response(
        JSON.stringify({
            ok: true,
            data: {
                summary,
                dailyStats,
                ...(monthlySummaries && { monthlySummaries })
            }
        }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
});

export const GET: RequestHandler = withRateLimit(statsLimiter, handler);
