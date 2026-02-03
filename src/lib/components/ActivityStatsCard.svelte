<script lang="ts">
  import { onMount } from 'svelte';
  import { Activity, Users, Calendar, TrendingUp } from 'lucide-svelte';

  let stats: any = null;
  let loading = true;
  let selectedDays = 7;

  async function fetchActivityStats() {
    loading = true;
    try {
      const res = await fetch(`/api/activity/stats?days=${selectedDays}&includeMonthly=false`);
      const json = await res.json();
      if (json?.ok) {
        stats = json.data;
      }
    } catch (err) {
      console.error('Failed to fetch activity stats:', err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchActivityStats();
  });

  $: if (selectedDays) {
    fetchActivityStats();
  }	

  function getTodayStats() {
    if (!stats?.dailyStats) return null;
    const today = new Date().toISOString().split('T')[0];
    return stats.dailyStats.find((d: any) => d.date === today);
  }

  $: todayStats = getTodayStats();
</script>

<!-- Component for displaying user activity statistics in admin dashboard -->
<div class="space-y-4">
	<!-- Quick Stats Cards -->
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div
			class="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-800/10"
		>
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-blue-600/20 p-1.5 text-blue-600 dark:text-blue-400">
					<Activity class="h-4 w-4" />
				</div>
				<div class="text-xs font-medium text-gray-600 dark:text-gray-400">Today's Visits</div>
			</div>
			<div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
				{loading ? '...' : todayStats?.visits || 0}
			</div>
		</div>

		<div
			class="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 dark:border-gray-700 dark:from-purple-900/20 dark:to-purple-800/10"
		>
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-purple-600/20 p-1.5 text-purple-600 dark:text-purple-400">
					<Users class="h-4 w-4" />
				</div>
				<div class="text-xs font-medium text-gray-600 dark:text-gray-400">Today's Users</div>
			</div>
			<div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
				{loading ? '...' : todayStats?.uniqueUsers || 0}
			</div>
		</div>

		<div
			class="rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 dark:border-gray-700 dark:from-emerald-900/20 dark:to-emerald-800/10"
		>
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-emerald-600/20 p-1.5 text-emerald-600 dark:text-emerald-400">
					<TrendingUp class="h-4 w-4" />
				</div>
				<div class="text-xs font-medium text-gray-600 dark:text-gray-400">
					Total Visits ({selectedDays}d)
				</div>
			</div>
			<div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
				{loading ? '...' : stats?.summary?.totalVisits || 0}
			</div>
		</div>

		<div
			class="rounded-lg border border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100/50 p-3 dark:border-gray-700 dark:from-orange-900/20 dark:to-orange-800/10"
		>
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-orange-600/20 p-1.5 text-orange-600 dark:text-orange-400">
					<Calendar class="h-4 w-4" />
				</div>
				<div class="text-xs font-medium text-gray-600 dark:text-gray-400">
					Unique Users ({selectedDays}d)
				</div>
			</div>
			<div class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
				{loading ? '...' : stats?.summary?.uniqueUsers || 0}
			</div>
		</div>
	</div>

	<!-- Daily Activity Table -->
	<div
		class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60"
	>
		<div class="mb-3 flex items-center justify-between">
			<div class="text-lg font-medium text-gray-900 dark:text-white">Daily Activity</div>
			<select
				class="appearance-none rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
				bind:value={selectedDays}
			>
				<option value={1}>Last 24 hours</option>
				<option value={3}>Last 3 days</option>
				<option value={7}>Last 7 days</option>
				<option value={14}>Last 14 days</option>
				<option value={30}>Last 30 days</option>
			</select>
		</div>

		{#if loading}
			<div class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
				Loading activity data...
			</div>
		{:else if !stats?.dailyStats || stats.dailyStats.length === 0}
			<div class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
				No activity data available
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full text-sm">
					<thead class="text-left text-gray-600 dark:text-gray-400">
						<tr class="border-b border-gray-200 dark:border-gray-700">
							<th class="px-3 py-2">Date</th>
							<th class="px-3 py-2">Total Visits</th>
							<th class="px-3 py-2">Unique Users</th>
							<th class="px-3 py-2">Avg Visits/User</th>
							<th class="px-3 py-2">Top Visitor</th>
						</tr>
					</thead>
					<tbody class="text-gray-900 dark:text-gray-200">
						{#each stats.dailyStats as day}
							<tr
								class="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/60"
							>
								<td class="px-3 py-2">
									<div class="font-medium">{new Date(day.date).toLocaleDateString()}</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
									</div>
								</td>
								<td class="px-3 py-2 font-medium">{day.visits}</td>
								<td class="px-3 py-2">{day.uniqueUsers}</td>
								<td class="px-3 py-2"
									>{day.uniqueUsers > 0 ? (day.visits / day.uniqueUsers).toFixed(1) : 0}</td
								>
								<td class="px-3 py-2">
									{#if day.users && day.users[0]}
										<div class="flex items-center gap-2">
											<div class="truncate text-xs">
												{day.users[0].username || day.users[0].firstName}
											</div>
											<div class="text-xs text-gray-500 dark:text-gray-400">
												({day.users[0].visitCount} visits)
											</div>
										</div>
									{:else}
										-
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Top Active Users -->
	{#if !loading && todayStats?.users && todayStats.users.length > 0}
		<div
			class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60"
		>
			<div class="mb-3 text-lg font-medium text-gray-900 dark:text-white">
				Most Active Users Today
			</div>
			<div class="grid gap-2">
				{#each todayStats.users.slice(0, 5) as user, index}
					<div
						class="flex items-center justify-between rounded-lg border border-gray-100 p-2 dark:border-gray-800"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
							>
								#{index + 1}
							</div>
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{user.firstName}
									{user.lastName}
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">@{user.username}</div>
							</div>
						</div>
						<div class="text-right">
							<div class="font-semibold text-gray-900 dark:text-white">{user.visitCount}</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">visits</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
