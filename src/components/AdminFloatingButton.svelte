<script lang="ts">
  import { onMount } from 'svelte';
  import { authUser } from '../lib/stores/auth';
  import { Shield } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const ADMIN_ID = '7141369745';
  let tgUser: any = null;

  onMount(() => {
    // Direct check from Telegram WebApp
    tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log('[AdminButton] Debug:', { 
        storeId: $authUser?.id, 
        tgId: tgUser?.id, 
        adminId: ADMIN_ID,
        match: ($authUser?.id?.toString() === ADMIN_ID) || (tgUser?.id?.toString() === ADMIN_ID)
    });
  });

  $: currentId = $authUser?.id?.toString() || tgUser?.id?.toString();
  $: isAdmin = currentId === ADMIN_ID;
  $: showButton = isAdmin && !$page.url.pathname.startsWith('/admin');

  function goToAdmin() {
    goto('/admin');
  }
</script>

{#if showButton}
  <button
    class="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
    on:click={goToAdmin}
    aria-label="Admin Dashboard"
  >
    <Shield class="h-6 w-6" />
  </button>
{/if}
