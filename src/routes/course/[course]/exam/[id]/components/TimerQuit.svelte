<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let timeLeft: number; // initial seconds
  const dispatch = createEventDispatcher();

  let interval: ReturnType<typeof setInterval>;

  // Format mm:ss
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  onMount(() => {
    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
      } else {
        clearInterval(interval);
        dispatch('quit'); // auto-quit when time runs out
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="flex justify-between items-center">
  <div class="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400">
    Time Left: {formatTime(timeLeft)}
  </div>
  <button
    on:click={() => dispatch('quit')}
    class="px-4 py-2 rounded-md font-semibold text-gray-700 dark:text-gray-200 
           bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
  >
    Quit
  </button>
</div>
