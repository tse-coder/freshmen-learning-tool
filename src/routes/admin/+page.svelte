<script lang="ts">
  import { onMount } from 'svelte';
  import { setPageTitle } from '../../lib/stores/uiStore';
  import { Users as UsersIcon, BookOpen, FileQuestion, Folder, MessageSquare, Search, User as UserIcon, Globe, CalendarClock, Download } from 'lucide-svelte';
  import { theme } from '../../lib/stores/themeStore';
  import { browser } from '$app/environment';
  import { onDestroy } from 'svelte';

  export let data: {
    stats: { counts: Record<string, number>; series: { x: string; y: number }[]; interval: 'minute'|'day'|'month' };
    usersPage: { items: any[]; total: number; page: number; pageSize: number };
    threads: any[];
  };

  let selectedThread: any = null;
  let threadMessages: any[] = [];
  let replyText = '';

  let selectedUser: any = null;
  let searchQuery = '';
  let usersItems = data.usersPage.items;
  let totalUsers = data.usersPage.total;
  let currentPage = data.usersPage.page;
  let pageSize = data.usersPage.pageSize;
  let usersLoading = false;

  onMount(async () => {
    setPageTitle('Admin Dashboard');
    if (browser) {
      await ensureChartJs();
      // Small delay to ensure canvas is rendered
      setTimeout(() => {
        if (chartCanvas && ChartJs) {
          renderChart();
        }
      }, 100);
    }
  });

  async function openThread(thread: any) {
    selectedThread = thread;
    threadMessages = [];
    const res = await fetch(`/api/admin/feedback/${thread.id}`);
    const json = await res.json();
    threadMessages = json?.data?.messages ?? [];
  }

  async function sendReply() {
    if (!selectedThread || !replyText.trim()) return;
    const res = await fetch(`/api/admin/feedback/${selectedThread.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: replyText.trim() })
    });
    const ok = (await res.json())?.ok;
    if (ok) {
      threadMessages = [
        ...threadMessages,
        { id: crypto.randomUUID?.() ?? `${Date.now()}`, feedback_id: selectedThread.id, sender_type: 'admin', message: replyText.trim(), created_at: new Date().toISOString() }
      ];
      replyText = '';
    }
  }

  const counts = data.stats.counts || {};

  let range: 'hour'|'week'|'month'|'year' = 'week';
  let chartSeries = [{ name: 'Active Users', data: data.stats.series || [] }];
  let chart: any = null;
  let chartLoading = false;
  $: chartOptions = {
    chart: { id: 'new-users', toolbar: { show: false }, foreColor: $theme === 'dark' ? '#cbd5e1' : '#475569' },
    theme: { mode: $theme === 'dark' ? 'dark' : 'light' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
    grid: { borderColor: $theme === 'dark' ? '#1f2937' : '#e5e7eb' },
    xaxis: { type: 'category', labels: { rotate: 0 } },
    yaxis: { labels: { formatter: (v: number) => Math.round(v).toString() } },
    tooltip: { theme: $theme === 'dark' ? 'dark' : 'light' }
  };

  async function changeRange(newRange: 'hour'|'week'|'month'|'year') {
    range = newRange;
    chartLoading = true;
    try {
      const res = await fetch(`/api/admin/stats?range=${range}`);
      const json = await res.json();
      chartSeries = [{ name: 'Active Users', data: json?.data?.series ?? [] }];
    } finally {
      chartLoading = false;
    }
  }
  let chartCanvas: HTMLCanvasElement;
  let ChartJs: any = null;
  async function ensureChartJs() {
    if (!ChartJs && browser) {
      const mod = await import('chart.js/auto');
      ChartJs = mod.default || mod;
    }
  }

  async function renderChart() {
    await ensureChartJs();
    if (!chartCanvas || !ChartJs) return;
    chart && chart.destroy?.();
    const labels = chartSeries[0]?.data?.map((p: any) => p.x) ?? [];
    const values = chartSeries[0]?.data?.map((p: any) => p.y) ?? [];
    chart = new ChartJs(chartCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Active Users',
          data: values,
          fill: true,
          tension: 0.35,
          borderColor: '#2563eb',
          backgroundColor: $theme === 'dark' ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.15)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: $theme === 'dark' ? '#cbd5e1' : '#475569', maxRotation: 0 },
            grid: { color: $theme === 'dark' ? '#1f2937' : '#e5e7eb' }
          },
          y: {
            ticks: { color: $theme === 'dark' ? '#cbd5e1' : '#475569' },
            grid: { color: $theme === 'dark' ? '#1f2937' : '#e5e7eb' }
          }
        }
      }
    });
  }

  $: if (browser && chartCanvas && ChartJs) { 
    renderChart(); 
  }
  $: if (browser && chartSeries && chartCanvas && ChartJs) {
    renderChart();
  }
  onDestroy(() => { chart && chart.destroy?.(); });

  function totalSignups() {
    try { return chartSeries?.[0]?.data?.reduce((a: number, p: any) => a + (p?.y || 0), 0) || 0; } catch { return 0; }
  }

  function exportUsersCSV() {
    const rows = [
      ['id','first_name','last_name','username','language_code','last_seen'],
      ...usersItems.map((u: any) => [u.id, u.first_name, u.last_name, u.username, u.language_code, u.last_seen])
    ];
    const csv = rows.map(r => r.map((v) => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : String(v ?? '')).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openUser(u: any) {
    selectedUser = u;
  }

  let searchTimer: any;
  async function fetchUsers(page = 1, preserveSearch = true) {
    usersLoading = true;
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      const queryToUse = preserveSearch ? searchQuery : '';
      if (queryToUse.trim()) params.set('q', queryToUse.trim());
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json?.ok) {
        usersItems = json.data?.items ?? [];
        totalUsers = json.data?.total ?? 0;
        currentPage = json.data?.page ?? page;
        pageSize = json.data?.pageSize ?? pageSize;
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      usersLoading = false;
    }
  }
</script>

<div class="min-h-screen px-4 pt-24 pb-10 text-gray-900 dark:text-white">
  <div class="mx-auto max-w-7xl space-y-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-blue-600/10 p-2 text-blue-600 dark:text-blue-400">
            <UsersIcon class="h-5 w-5" />
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Users</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{counts.users || 0}</div>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-purple-600/10 p-2 text-purple-600 dark:text-purple-400">
            <BookOpen class="h-5 w-5" />
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Courses</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{counts.courses || 0}</div>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-emerald-600/10 p-2 text-emerald-600 dark:text-emerald-400">
            <FileQuestion class="h-5 w-5" />
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Exams</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{counts.exams || 0}</div>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-orange-600/10 p-2 text-orange-600 dark:text-orange-400">
            <Folder class="h-5 w-5" />
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Resources</div>
            <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{counts.resources || 0}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Users Sparkline + Feedback count -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60 lg:col-span-2">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">User activity over time</div>
            <div class="text-lg font-medium text-gray-900 dark:text-white">Active Users</div>
          </div>
          <div class="relative inline-block">
            <select
              class="appearance-none w-40 rounded-md border border-gray-200 bg-white px-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-600 dark:focus:ring-indigo-800 cursor-pointer"
              bind:value={range}
              on:change={(e) => changeRange((e.target as HTMLSelectElement).value as any)}
            >
              <option value="hour">Last hour</option>
              <option value="week">Last week</option>
              <option value="month">Last month</option>
              <option value="year">Last year</option>
            </select>
          
            <!-- Chevron Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
        </div>
        <div class="relative h-[260px]">
          <canvas bind:this={chartCanvas} class="h-full w-full"></canvas>
        </div>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">Total active users: <span class="font-medium text-gray-900 dark:text-white">{totalSignups()}</span></div>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="text-sm text-gray-600 dark:text-gray-400">Feedback</div>
        <div class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{counts.feedback || 0}</div>
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">Messages: {counts.feedback_messages || 0}</div>
      </div>
    </div>

    <!-- Users table and Feedback threads -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="mb-3 flex items-center justify-between">
          <div class="text-lg font-medium text-gray-900 dark:text-white">Users</div>
          <div class="flex items-center gap-2">
            <button class="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" on:click={exportUsersCSV}>
              <Download class="h-3.5 w-3.5" /> Export CSV
            </button>
            <div class="text-sm text-gray-600 dark:text-gray-400">{totalUsers} total</div>
          </div>
        </div>
        <div class="mb-3">
          <div class="relative">
            <input class="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Search users by name, @username, or ID" bind:value={searchQuery} on:input={() => { clearTimeout(searchTimer); searchTimer = setTimeout(() => fetchUsers(1, true), 300); }} />
            <Search class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-left text-gray-600 dark:text-gray-400">
              <tr>
                <th class="px-2 py-2">User</th>
                <th class="px-2 py-2">Username</th>
                <th class="px-2 py-2">Language</th>
                <th class="px-2 py-2">Last seen</th>
                <th class="px-2 py-2">total Visits</th>
              </tr>
            </thead>
            <tbody class="text-gray-900 dark:text-gray-200">
              {#if usersLoading}
                <tr><td class="px-2 py-8 text-center text-sm text-gray-500 dark:text-gray-400" colspan="4">Loading users…</td></tr>
              {/if}
              {#each usersItems as u}
                <tr class="cursor-pointer border-t border-gray-100 hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/60" on:click={() => openUser(u)}>
                  <td class="px-2 py-2">
                    <div class="flex items-center gap-2">
                      {#if u.photo_url}
                        <img src={u.photo_url} alt="avatar" class="h-8 w-8 rounded-full object-cover" />
                      {:else}
                        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                          {(u.first_name?.[0] || 'U')}{(u.last_name?.[0] || '')}
                        </div>
                      {/if}
                      <div class="min-w-0">
                        <div class="truncate font-medium">{u.first_name} {u.last_name}</div>
                        <div class="truncate text-xs text-gray-500 dark:text-gray-400">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-2">@{u.username}</td>
                  <td class="px-2 py-2">{u.language_code || '-'}</td>
                  <td class="px-2 py-2">{u.last_seen ? new Date(u.last_seen).toLocaleString() : '-'}</td>
                  <td class="px-2 py-2">{u.visits? u.visits: 0}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <div class="text-xs text-gray-600 dark:text-gray-400">Page {currentPage} of {Math.max(1, Math.ceil(totalUsers / pageSize))} • {totalUsers} users</div>
          <div class="flex items-center gap-2">
            <button class="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" on:click={() => fetchUsers(Math.max(1, currentPage - 1), true)} disabled={currentPage <= 1}>Prev</button>
            <button class="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" on:click={() => fetchUsers(currentPage + 1, true)} disabled={currentPage >= Math.ceil(totalUsers / pageSize)}>Next</button>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
        <div class="mb-3 flex items-center justify-between">
          <div class="text-lg font-medium text-gray-900 dark:text-white">Feedback</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Latest threads</div>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          {#each data.threads as t}
            <button class="w-full text-left hover:bg-gray-50/60 dark:hover:bg-gray-800/60" on:click={() => openThread(t)}>
              <div class="flex items-start gap-3 px-2 py-3">
                <div class="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div class="min-w-0">
                  <div class="truncate font-medium text-gray-900 dark:text-white">{t.title || 'Untitled'}</div>
                  <div class="mt-1 truncate text-xs text-gray-600 dark:text-gray-400">{t.latest_message?.message ?? 'No messages yet'}</div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-gray-500">{new Date(t.created_at).toLocaleString()}</div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  {#if selectedThread}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white">
        <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <div class="font-semibold text-gray-900 dark:text-white">Feedback: {selectedThread.title}</div>
          <button class="rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" on:click={() => (selectedThread = null)}>Close</button>
        </div>
        <div class="flex h-full flex-col">
          <div class="flex-1 space-y-3 overflow-auto p-4">
            {#each threadMessages as m}
              <div class="max-w-[85%] rounded-lg px-3 py-2 text-sm" class:m-ml-auto={m.sender_type === 'admin'} class:bg-blue-600={m.sender_type === 'admin'} class:text-white={m.sender_type === 'admin'} class:bg-gray-100={m.sender_type !== 'admin'} class:text-gray-900={m.sender_type !== 'admin'}>
                <div class="opacity-80">{m.message}</div>
                <div class="mt-1 text-[10px] text-gray-600 opacity-80 dark:text-gray-400">{new Date(m.created_at).toLocaleString()} • {m.sender_type}</div>
              </div>
            {/each}
          </div>
          <div class="border-t border-gray-200 p-3 dark:border-gray-800">
            <div class="flex gap-2">
              <input class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Type a reply..." bind:value={replyText} on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendReply())} />
              <button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" on:click={sendReply}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if selectedUser}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-xl overflow-hidden rounded-xl bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white">
        <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <div class="flex items-center gap-3">
            {#if selectedUser.photo_url}
              <img src={selectedUser.photo_url} alt="avatar" class="h-10 w-10 rounded-full object-cover" />
            {:else}
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                {(selectedUser.first_name?.[0] || 'U')}{(selectedUser.last_name?.[0] || '')}
              </div>
            {/if}
            <div>
              <div class="font-semibold text-gray-900 dark:text-white">{selectedUser.first_name} {selectedUser.last_name}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">@{selectedUser.username} • {selectedUser.id}</div>
            </div>
          </div>
          <button class="rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800" on:click={() => (selectedUser = null)}>Close</button>
        </div>
        <div class="grid gap-4 p-4 sm:grid-cols-2">
          <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Globe class="h-4 w-4" />
            <span>Language:</span>
            <span class="font-medium">{selectedUser.language_code || '-'}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CalendarClock class="h-4 w-4" />
            <span>Last seen:</span>
            <span class="font-medium">{selectedUser.last_seen ? new Date(selectedUser.last_seen).toLocaleString() : '-'}</span>
          </div>
        </div>
        <div class="border-t border-gray-200 p-4 dark:border-gray-800">
          <div class="mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageSquare class="h-4 w-4" />
            <div class="font-medium">Feedback Threads</div>
          </div>
          <div class="space-y-2">
            {#each (data.threads || []).filter((t) => t.user_id === selectedUser.id) as t}
              <div class="rounded-md border border-gray-200 p-3 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60">
                <div class="font-medium text-gray-900 dark:text-white">{t.title || 'Untitled'}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{new Date(t.created_at).toLocaleString()}</div>
              </div>
            {:else}
              <div class="text-sm text-gray-600 dark:text-gray-400">No feedback found for this user.</div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>


