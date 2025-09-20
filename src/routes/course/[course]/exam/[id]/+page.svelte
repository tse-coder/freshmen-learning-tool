<script lang="ts">
  import { onMount } from 'svelte';
  import Question from '../../../../../components/Question.svelte';
  export let data;

  let started = false;
  let currentIndex = 0;
  let answers: Record<string, string> = {};
  let timeLeft = data.exam.duration * 60;
  let timer: any;
  let finished = false;

  function startExam() {
    started = true;
    timer = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        finishExam();
      }
    }, 1000);
  }

  function quitExam() {
    finishExam();
  }

  function finishExam() {
    clearInterval(timer);
    finished = true;
  }

  function handleAnswerChange(id: string, value: string) {
    answers = { ...answers, [id]: value };
  }

  function nextQuestion() {
    if (currentIndex < data.examQuestions.length - 1) {
      currentIndex++;
    }
  }

  function prevQuestion() {
    if (currentIndex > 0) {
      currentIndex--;
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  $: isLastQuestion = currentIndex === data.examQuestions.length - 1;

  // Score & Rating (only answered multiple-choice questions)
  $: answeredMC = data.examQuestions.filter(
    (q:any) => q.type === 'multiple_choice' && answers[q.id]
  );
  $: totalMC = answeredMC.length;
  $: correctMC = answeredMC.filter((q:any) => answers[q.id] === q.correct).length;
  $: scoreRatio = totalMC > 0 ? correctMC / totalMC : 0;
  $: rating =
    scoreRatio === 1
      ? 'Best'
      : scoreRatio >= 0.75
      ? 'Better'
      : scoreRatio >= 0.5
      ? 'Good'
      : 'Lazy';

  function goBack() {
    if (history.length > 1) {
      history.back();
      return;
    }
    window.location.href = '/courses';
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
  {#if !started && !finished}
    <!-- Intro Screen -->
    <div
      class="w-full max-w-2xl flex flex-col gap-6 p-6 rounded-lg shadow-lg 
             bg-white/40 dark:bg-gray-800/50 backdrop-blur-md 
             border border-white/20 dark:border-white/10 text-center"
    >
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{data.exam.title}</h1>
      <p class="text-gray-600 dark:text-gray-300">{data.exam.description}</p>
      <p class="text-gray-700 dark:text-gray-200">
        <strong>Duration:</strong> {data.exam.duration} minutes
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          class="px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          on:click={startExam}
        >
          Start Exam
        </button>
      </div>
    </div>

  {:else if started && !finished}
    <!-- Exam Screen -->
    <div
      class="w-full max-w-2xl flex flex-col gap-6 p-6 rounded-lg shadow-lg 
             bg-white/40 dark:bg-gray-800/50 backdrop-blur-md 
             border border-white/20 dark:border-white/10"
    >
      <!-- Timer + Quit -->
      <div class="flex justify-between items-center">
        <div class="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400">
          Time Left: {formatTime(timeLeft)}
        </div>
        <button
          on:click={quitExam}
          class="px-4 py-2 rounded-md font-semibold text-gray-700 dark:text-gray-200 
                 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Quit
        </button>
      </div>

      <!-- Question Counter -->
      <div class="text-center text-lg font-medium text-gray-800 dark:text-gray-200">
        Question {currentIndex + 1}/{data.examQuestions.length}
      </div>

      <!-- Question -->
      <Question
        currentIndex={currentIndex}
        {answers}
        onAnswerChange={handleAnswerChange}
        questions={data.examQuestions}
      />

      <!-- Navigation -->
      <div class="flex justify-between mt-4">
        <button
          on:click={prevQuestion}
          disabled={currentIndex === 0}
          class="px-5 py-2 rounded-md font-semibold transition 
                 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {#if isLastQuestion}
          <button
            on:click={finishExam}
            class="px-6 py-2 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition"
          >
            Finish
          </button>
        {:else}
          <button
            on:click={nextQuestion}
            class="px-6 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            Next
          </button>
        {/if}
      </div>
    </div>

  {:else if finished}
    <!-- Finished Overview -->
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
        Result: {correctMC}/{totalMC} correct → <span class="font-bold">{rating}</span>
      </div>

      <!-- Overview Questions -->
      <div class="w-full max-h-[400px] overflow-y-auto flex flex-col gap-4">
        {#each data.examQuestions as question, index}
          {#if question.type === 'multiple_choice'}
            {#if answers[question.id] === question.correct}
              <!-- Correct -->
              <div class="p-4 rounded-md bg-green-100 dark:bg-green-800/40 border border-green-300 dark:border-green-600">
                <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Q{index + 1}: {question.question}
                </h2>
                <p class="text-sm text-gray-700 dark:text-gray-200">
                  Your Answer: {answers[question.id]}
                </p>
              </div>
            {:else if answers[question.id]}
              <!-- Wrong -->
              <div class="p-4 rounded-md bg-red-100 dark:bg-red-800/40 border border-red-300 dark:border-red-600">
                <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Q{index + 1}: {question.question}
                </h2>
                <p class="text-sm text-gray-700 dark:text-gray-200">
                  Your Answer: {answers[question.id]} (Correct: {question.answer})
                </p>
              </div>
            {:else}
              <!-- Unanswered -->
              <div class="p-4 rounded-md bg-gray-100 dark:bg-gray-700/40 border border-gray-300 dark:border-gray-600">
                <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Q{index + 1}: {question.question}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-300">No Answer</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Correct Answer: {question.answer}</p>
              </div>
            {/if}
          {:else}
            <!-- Non-choice Question -->
            <div class="p-4 rounded-md bg-blue-50 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-600">
              <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                Q{index + 1}: {question.question}
              </h2>
              <p class="text-sm text-gray-700 dark:text-gray-200">
                Your Answer: {answers[question.id] || 'No Answer'}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-200">
                Correct Answer: {question.answer}
              </p>
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
  {/if}
</div>
