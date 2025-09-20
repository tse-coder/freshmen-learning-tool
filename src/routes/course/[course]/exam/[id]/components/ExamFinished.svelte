<script lang="ts">
  export let data: any;
  export let answers: Record<string, string> = {};

  $: totalQuestions = data.examQuestions.length;
  $: correctAnswers = data.examQuestions.filter(
    (q: any) => answers[q.id] && answers[q.id].trim().toLowerCase() === q.answer.trim().toLowerCase()
  ).length;

  $: scoreRatio = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  $: rating =
    scoreRatio === 1
      ? 'Best'
      : scoreRatio >= 0.75
      ? 'Better'
      : scoreRatio >= 0.5
      ? 'Good'
      : 'Lazy';

  function goBack() {
    if (history.length > 1) history.back();
    else window.location.href = '/courses';
  }
</script>

<div
  class="w-full max-w-3xl flex flex-col gap-6 items-center p-6 rounded-lg shadow-lg 
         bg-white/40 dark:bg-gray-800/50 backdrop-blur-md 
         border border-white/20 dark:border-white/10"
>
  <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Exam Overview</h1>

  <!-- Result -->
  <div
    class="w-full text-center p-4 rounded-md 
           bg-white/40 dark:bg-gray-700/50 border border-white/20 dark:border-white/10
           text-lg font-semibold text-gray-800 dark:text-gray-100"
  >
    Result: {correctAnswers}/{totalQuestions} correct → 
    <span class="font-bold">{rating}</span>
  </div>

  <!-- Questions Overview -->
  <div class="w-full max-h-[400px] overflow-y-auto flex flex-col gap-4">
    {#each data.examQuestions as question, index}
      {#if answers[question.id] && answers[question.id].trim().toLowerCase() === question.answer.trim().toLowerCase()}
        <!-- Correct -->
        <div class="p-4 rounded-md bg-green-100 dark:bg-green-800/40 border border-green-300 dark:border-green-600">
          <h2 class="font-semibold">Q{index + 1}: {question.question}</h2>
          <p>Your Answer: {answers[question.id]}</p>
        </div>
      {:else if answers[question.id]}
        <!-- Incorrect -->
        <div class="p-4 rounded-md bg-red-100 dark:bg-red-800/40 border border-red-300 dark:border-red-600">
          <h2 class="font-semibold">Q{index + 1}: {question.question}</h2>
          <p>Your Answer: {answers[question.id]}</p>
          <p>Correct Answer: {question.answer}</p>
        </div>
      {:else}
        <!-- No Answer -->
        <div class="p-4 rounded-md bg-gray-100 dark:bg-gray-700/40 border border-gray-300 dark:border-gray-600">
          <h2 class="font-semibold">Q{index + 1}: {question.question}</h2>
          <p>No Answer</p>
          <p>Correct Answer: {question.answer}</p>
        </div>
      {/if}
    {/each}
  </div>

  <button
    class="px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
    on:click={goBack}
  >
    Back to exams
  </button>
</div>
