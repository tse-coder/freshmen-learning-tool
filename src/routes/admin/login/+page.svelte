<script lang="ts">
  import { page } from '$app/stores';
  export let form: any;
</script>

<div class="min-h-screen flex items-center justify-center px-4">
  <form method="post" class="w-full max-w-md space-y-6 rounded-xl bg-white/60 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-900/60">
    <div>
      <h1 class="text-2xl font-semibold">Admin Login</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Enter the admin access code to continue.</p>
    </div>

    {#if form?.message}
      <div class="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-300">{form.message}</div>
    {/if}

    <input type="hidden" name="next" value={$page.url.searchParams.get('next') ?? '/admin'} />

    <div>
      <label class="mb-2 block text-sm font-medium" for="code">Access code</label>
      <input id="code" name="code" type="password" required class="w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white" placeholder="••••••••" />
    </div>

    <button type="submit" class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus:outline-none">Sign in</button>
  </form>
</div>



