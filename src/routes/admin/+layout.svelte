<script lang="ts">
  import { page } from '$app/stores';
  import ThemeToggler from '../../components/ThemeToggler.svelte';
  import { pageTitle } from '../../lib/stores/uiStore';
</script>

<div class="relative min-h-screen">
  <!-- Elegant background -->
  <div class="pointer-events-none fixed inset-0 -z-10">
    <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0b0f19] dark:via-[#0b0f19] dark:to-[#0b0f19]" />
    <div class="absolute inset-0 opacity-60 blur-2xl">
      <div class="mx-auto mt-[-10%] h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-blue-400/30 to-purple-400/30 dark:from-blue-700/20 dark:to-purple-700/20" />
    </div>
  </div>

  <!-- Admin top bar with theme toggler -->
  <header class="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3">
      <div class="flex min-w-0 items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-sm" />
        <div class="truncate font-semibold tracking-tight">Admin</div>
        <div class="hidden truncate text-sm text-slate-500 dark:text-slate-400 sm:block">{$pageTitle}</div>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <ThemeToggler />
      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>
</div>



