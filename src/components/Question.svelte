<script lang="ts">
  export let questions: Array<{ id: string; question: string; type: string; options?: string[] }> = [];
  export let currentIndex: number = 0;
  export let answers: Record<string, string> = {};
  export let onAnswerChange: (id: string, value: string) => void = () => {};

  $: q = questions[currentIndex] ?? null;
</script>

{#if q}
  <div class="flex flex-col w-full h-full">
    <!-- Question Title -->
    <h2 class="text-lg sm:text-xl text-gray-800 dark:text-gray-100 mb-3">
      Q{currentIndex + 1}: {q.question}
    </h2>
    <hr class="border-gray-300 dark:border-gray-600 mb-4" />

    <!-- Multiple Choice -->
    {#if q.type === 'multiple_choice'}
      <div class="flex flex-col gap-3">
        {#each q.options ?? [] as opt}
          <button
            type="button"
            class={`w-full px-4 py-3 text-left border rounded-md transition 
              ${answers[q.id] === opt 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white/70 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600'}
            `}
            on:click={() => onAnswerChange(q.id, opt)}
          >
            {opt}
          </button>
        {/each}
      </div>

    <!-- Fill in Blank -->
    {:else if q.type === 'fill_in_blank'}
      <input
        type="text"
        placeholder="Type your answer..."
        class="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 
               bg-white/70 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={answers[q.id] || ""}
        on:input={(e) => {
          const target = e.target as HTMLInputElement | null;
          if (target) {
            onAnswerChange(q.id, target.value);
          }
        }}
      />

    <!-- Unsupported Type -->
    {:else}
      <p class="italic text-gray-500 dark:text-gray-400 text-center">
        Unsupported question type: {q.type}
      </p>
    {/if}
  </div>
{:else}
  <p class="italic text-gray-500 dark:text-gray-400 text-center">No question available.</p>
{/if}
