<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Square, CheckSquare, CheckCircle, XCircle, CircleX, CircleCheck, Circle } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  export let questions: Array<{
    id: string;
    question: string;
    type: string;
    options?: string[];
    answer?: string;
  }> = [];

  export let currentIndex: number = 0;
  export let answers: Record<string, string> = {};
  const dispatch = createEventDispatcher();

  // current question object
  $: q = questions[currentIndex] ?? null;

  // reflect parent's answer for current question
  $: selected = q ? String(answers[q.id] ?? '') : '';
  $: hasAnswer = Boolean(selected && selected.trim().length > 0);
  $: isCorrect = hasAnswer && q?.answer
    ? selected.trim().toLowerCase() === q.answer.trim().toLowerCase()
    : false;

  // local draft for text input (keeps typing snappy)
  let draft = '';
  $: if (q) draft = answers[q.id] ?? '';

  // Emit choice to parent
  function choose(opt: string) {
    dispatch('answerChange', { id: q.id, value: opt });
  }

  // Input handlers for fill-in-blank
  function onInput(e: Event) {
    draft = (e.target as HTMLInputElement).value;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const value = draft.trim();
      if (!value) return;
      dispatch('answerChange', { id: q.id, value });
    }
  }

  // icon color logic for selected icons (keeps feedback coloring consistent)
  function iconColor(opt: string) {
    if (selected === opt) {
      if (hasAnswer) {
        return opt === q.answer ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';
      }
      return 'text-white dark:text-black';
    }
    return 'text-slate-400 dark:text-slate-400';
  }
</script>

{#if q}
  <div class="flex flex-col gap-4 w-full">
    <!-- Question title -->
    <h2 class="text-lg sm:text-xl font-semibold text-black dark:text-slate-100">
      Q{currentIndex + 1}: {q.question}
    </h2>

    <hr class="border-slate-200 dark:border-slate-800" />

    <!-- MULTIPLE CHOICE -->
    {#if q.type === 'multiple_choice'}
      <div role="listbox" aria-label={"Question " + (currentIndex + 1)} class="flex flex-col gap-3">
        {#each q.options ?? [] as opt (opt)}
          <!-- option button -->
          <button
            type="button"
            role="option"
            aria-selected={selected === opt}
            on:click={() => choose(opt)}
            class={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition text-left
              ${selected === opt
                ? 'bg-gray-800 text-white border-black shadow-md dark:bg-gray-400 dark:text-black dark:border-slate-300'
                : 'bg-white dark:bg-slate-800 text-black dark:text-slate-100 border-slate-200 dark:border-slate-700'}
              ${hasAnswer && opt === q.answer ? 'ring-2 ring-green-300 dark:ring-green-700' : ''}
              ${hasAnswer && selected === opt && selected !== q.answer ? 'ring-2 ring-red-300 dark:ring-red-700' : ''}
              focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-slate-300 dark:focus-visible:ring-slate-600`}
            >
            <!-- checkbox icon -->
            <span class="flex-shrink-0">
              {#if selected === opt}
                <CircleCheck class={`w-5 h-5 ${iconColor(opt)}`} />
              {:else}
                <Circle class="w-5 h-5 text-slate-400 dark:text-slate-400" />
              {/if}
            </span>

            <!-- option text -->
            <span class="flex-1 break-words text-sm sm:text-base">{opt}</span>
          </button>
        {/each}
      </div>

    <!-- FILL-IN-THE-BLANK -->
    {:else if q.type === 'fill_in_blank'}
      <div class="flex flex-col gap-2">
        <input
          type="text"
          inputmode="text"
          placeholder="Type your answer and press Enter"
          class="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-800 text-black dark:text-slate-100
                 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-offset-2
                 focus-visible:ring-slate-300 dark:focus-visible:ring-slate-600"
          bind:value={draft}
          on:input={onInput}
          on:keydown={onKeyDown}
          aria-label="Answer input"
        />
        <div class="text-sm text-slate-500 dark:text-slate-400">Press Enter to submit.</div>
      </div>

    {:else}
      <div class="italic text-slate-500 dark:text-slate-400">Unsupported question type: {q.type}</div>
    {/if}

    <!-- INLINE FEEDBACK: animate in/out -->
    {#if hasAnswer}
      <div in:fade={{ duration: 180 }} out:fade={{ duration: 120 }} class="mt-2">
        <div in:scale={{ duration: 180, start: 0.98 }} class="flex items-start gap-2">
          {#if isCorrect}
            <CircleCheck class="w-5 h-5 text-green-600 dark:text-green-500" />
            <div class="text-green-700 dark:text-green-300 font-medium">Correct</div>
          {:else}
            <CircleX class="w-5 h-5 text-red-600 dark:text-red-400" />
            <div class="text-red-700 dark:text-red-300">
              Incorrect. <span class="font-semibold">Correct:</span> {q.answer}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

{:else}
  <div class="italic text-slate-500 dark:text-slate-400">No question available.</div>
{/if}
