// src/lib/server/activityLogger.ts
// Utility for logging user activity to track daily visits

import { getSupabaseClient } from '../../config/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = getSupabaseClient();

/**
 * Log user activity to the user_activity table
 * @param userId - The user's ID (from Telegram or system)
 * @param pagePath - Optional page path being visited
 * @param userAgent - Optional user agent string
 * @returns Promise<boolean> - True if successfully logged
 */
export async function logUserActivity(
    userId: string,
    pagePath?: string,
    userAgent?: string
): Promise<boolean> {
    try {
        // Validate that user exists
        const { data: userExists, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();

        if (userError || !userExists) {
            console.error(`[ActivityLogger] User ${userId} not found:`, userError);
            return false;
        }

        // Check if user was already logged in the last 5 minutes to avoid spam
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data: recentActivity } = await supabase
            .from('user_activity')
            .select('id')
            .eq('user_id', userId)
            .gte('visited_at', fiveMinutesAgo)
            .order('visited_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        // If there's recent activity within 5 minutes, skip logging
        if (recentActivity) {
            console.log(`[ActivityLogger] Skipping duplicate activity for user ${userId} (logged within last 5 minutes)`);
            return true;
        }

        // Insert activity record
        const { error: insertError } = await supabase.from('user_activity').insert({
            user_id: userId,
            page_path: pagePath || null,
            user_agent: userAgent || null,
            visited_at: new Date().toISOString()
        });

        if (insertError) {
            console.error('[ActivityLogger] Failed to log activity:', insertError);
            return false;
        }

        console.log(`[ActivityLogger] Successfully logged activity for user ${userId}${pagePath ? ` on ${pagePath}` : ''}`);
        return true;
    } catch (error) {
        // Catch any unexpected errors and log them, but don't throw
        // Activity logging should never break the main flow
        console.error('[ActivityLogger] Unexpected error:', error);
        return false;
    }
}

/**
 * Archive old activity data (older than 30 days) into monthly summaries
 * This should be called periodically via a cron job or scheduled task
 * @returns Promise<{success: boolean, message: string}>
 */
export async function archiveOldActivity(): Promise<{ success: boolean; message: string }> {
    try {
        console.log('[ActivityLogger] Starting archival of old activity data...');

        // Call the Postgres function that handles archival
        const { error } = await supabase.rpc('archive_old_activity_to_summary');

        if (error) {
            console.error('[ActivityLogger] Archival failed:', error);
            return {
                success: false,
                message: `Archival failed: ${error.message}`
            };
        }

        console.log('[ActivityLogger] Successfully archived old activity data');
        return {
            success: true,
            message: 'Successfully archived activity data older than 30 days'
        };
    } catch (error) {
        console.error('[ActivityLogger] Unexpected error during archival:', error);
        return {
            success: false,
            message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

/**
 * Get activity statistics for a given date range
 * @param startDate - Start date (YYYY-MM-DD format)
 * @param endDate - End date (YYYY-MM-DD format)
 * @returns Activity statistics
 */
export async function getActivityStats(startDate: string, endDate: string) {
    try {
        const { data, error } = await supabase
            .from('user_activity')
            .select('user_id, visited_at, page_path')
            .gte('visited_at', startDate)
            .lte('visited_at', endDate)
            .order('visited_at', { ascending: false });

        if (error) {
            console.error('[ActivityLogger] Failed to fetch activity stats:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('[ActivityLogger] Unexpected error fetching stats:', error);
        return null;
    }
}

/**
 * Get monthly activity summaries
 * @param limit - Number of months to retrieve (default: 12)
 * @returns Monthly summary data
 */
export async function getMonthlySummaries(limit: number = 12) {
    try {
        const { data, error } = await supabase
            .from('monthly_activity_summary')
            .select('*')
            .order('year', { ascending: false })
            .order('month', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('[ActivityLogger] Failed to fetch monthly summaries:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('[ActivityLogger] Unexpected error fetching summaries:', error);
        return null;
    }
}
