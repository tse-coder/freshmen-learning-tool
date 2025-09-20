<script lang="ts">
  export let exam;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div
  class="w-full max-w-2xl flex flex-col gap-6 p-6 rounded-lg shadow-lg 
         bg-white/40 dark:bg-gray-800/50 backdrop-blur-md 
         border border-white/20 dark:border-white/10 text-center"
>
  <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{exam.title}</h1>
  <p class="text-gray-600 dark:text-gray-300">{exam.description}</p>
  <p class="text-gray-700 dark:text-gray-200"><strong>Duration:</strong> {exam.duration} minutes</p>

  <button
    class="px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
    on:click={() => dispatch('start')}
  >
    Start Exam
  </button>
</div>
