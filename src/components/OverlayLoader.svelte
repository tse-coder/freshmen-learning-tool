<script lang="ts">
  export let message: string = 'Loading...';
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
  <div class="flex flex-col items-center gap-4 p-8 rounded-xl bg-white/10 shadow-2xl">
    <svg class="h-10 w-10 animate-spin text-blue-400" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    <div class="text-lg text-white">{message}</div>
  </div>
</div>
