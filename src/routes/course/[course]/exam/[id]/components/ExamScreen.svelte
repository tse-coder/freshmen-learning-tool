<script lang="ts">
  import Question from "./Question.svelte";
  import TimerQuit from "./TimerQuit.svelte";
  import QuestionNav from "./QuestionNav.svelte";
  import ExamFinished from "./ExamFinished.svelte";

  export let data: {
    exam: { id: string; title: string; description: string; duration: number };
    examQuestions: Array<{
      id: string;
      question: string;
      type: string;
      options?: string[];
      answer: string;
    }>;
  };

  let currentIndex = 0;
  let answers: Record<string, string> = {};
  let finished = false;

  $: isLastQuestion = currentIndex === data.examQuestions.length - 1;

  // Answer handler
  function handleAnswerChange(id: string, value: string) {
    answers = { ...answers, [id]: value };
  }

  // Navigation handlers
  function handlePrev() {
    if (currentIndex > 0) currentIndex--;
  }

  function handleNext() {
    if (currentIndex < data.examQuestions.length - 1) currentIndex++;
  }

  function handleFinish() {
    finished = true;
  }

  function handleQuit() {
    finished = true;
  }

  // Timer in seconds
  const timeLeft = data.exam.duration * 60;
</script>

{#if !finished}
  <div class="p-4 flex flex-col gap-4 max-w-2xl">
    <!-- Timer + Quit -->
    <TimerQuit timeLeft={data.exam.duration * 60} on:quit={handleQuit} />

    <!-- Question Counter -->
    <div class="text-gray-700 dark:text-gray-300">
      Question {currentIndex + 1} / {data.examQuestions.length}
    </div>

    <!-- Question -->
    <Question
      {currentIndex}
      {answers}
      questions={data.examQuestions}
      onAnswerChange={handleAnswerChange}
    />

    <!-- Question Navigation -->
    <QuestionNav
      {currentIndex}
      {isLastQuestion}
      on:prev={handlePrev}
      on:next={handleNext}
      on:finish={handleFinish}
    />
  </div>
{:else}
  <!-- Finished Exam Overview -->
  <ExamFinished {data} {answers} />
{/if}
