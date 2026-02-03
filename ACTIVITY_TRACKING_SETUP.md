# User Activity Tracking - Quick Setup Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Run Database Migration

1. Open your **Supabase Dashboard**: https://supabase.com/dashboard
2. Navigate to **SQL Editor** → **New Query**
3. Copy all content from [`supabase_migration_user_activity.sql`](file:///home/tsegaye/Desktop/projects/FreshHub/supabase_migration_user_activity.sql)
4. Paste into the SQL editor and click **Run**
5. Verify tables created successfully

### Step 2: Test the System

**Option A: Use Your App**

1. Open your Telegram mini app
2. Log in with any user
3. Go to Supabase → **Table Editor** → `user_activity`
4. You should see a new record with your visit!

**Option B: Test API Directly**

```bash
# Get last 7 days of activity
curl "https://your-app.vercel.app/api/activity/stats?days=7"

# Get today's activity
curl "https://your-app.vercel.app/api/activity/stats?date=$(date +%Y-%m-%d)"
```

### Step 3: View in Admin Dashboard

1. Navigate to `/admin` page
2. Scroll down to **User Activity** section
3. See today's visits, unique users, and daily breakdown
4. Adjust date range to view different periods (1-30 days)

---

## 📊 What You Can See Now

### In Admin Dashboard

- **Today's total visits** - How many times users accessed the app today
- **Today's unique users** - Number of different users who visited
- **Daily activity table** - Visit breakdown by date with top visitors
- **Most active users** - Top 5 users for the current day

### In Supabase Database

- **`user_activity` table** - Individual visit records (last 30 days)
- **`monthly_activity_summary` table** - Archived monthly statistics

---

## 🔄 Automated Data Archival (Optional)

To automatically archive data older than 30 days:

### Option A: Using Supabase Cron (Recommended)

```sql
-- Run this in Supabase SQL Editor
SELECT cron.schedule(
  'archive-activity-daily',
  '0 2 * * *',  -- 2 AM daily
  $$ SELECT archive_old_activity_to_summary(); $$
);
```

### Option B: External Cron Service

Use a service like **cron-job.org**:

- URL: `https://your-app.vercel.app/api/activity/archive`
- Method: `POST`
- Add Header: `X-Admin-Secret: thequickbrownfoxjumpsoverthelazydog`
- Schedule: Daily at any time

---

## 📝 Key Files Created

| File                                          | Purpose                                |
| --------------------------------------------- | -------------------------------------- |
| `supabase_migration_user_activity.sql`        | Database schema and migration          |
| `src/lib/server/activityLogger.ts`            | Activity logging utility functions     |
| `src/routes/api/activity/log/+server.ts`      | API endpoint for logging visits        |
| `src/routes/api/activity/stats/+server.ts`    | API endpoint for retrieving statistics |
| `src/routes/api/activity/archive/+server.ts`  | API endpoint for manual archiving      |
| `src/lib/components/ActivityStatsCard.svelte` | Admin dashboard component              |

---

## 🔍 Troubleshooting

**Problem**: No activity showing in admin dashboard

- ✅ Check if you ran the database migration
- ✅ Log in to your app to generate activity
- ✅ Check Supabase `user_activity` table for records

**Problem**: Error when logging activity

- ✅ Verify `users` table exists and has records
- ✅ Check Supabase logs for any errors
- ✅ Ensure environment variables are set correctly

**Problem**: Archive not working

- ✅ Check if cron job is configured
- ✅ Try manual archive: `POST/api/activity/archive` with admin secret
- ✅ View Supabase logs for any function errors

---

## 📈 Next Steps

1. **Monitor daily activity** through the admin dashboard
2. **Set up automated archival** using one of the cron options above
3. **Export data** for analysis using the stats API endpoint
4. **Review monthly summaries** after 30 days for long-term trends

For detailed documentation, see [`walkthrough.md`](file:///home/tsegaye/.gemini/antigravity/brain/f23942d2-3350-439e-a1ee-7dc0aaff5b97/walkthrough.md).
