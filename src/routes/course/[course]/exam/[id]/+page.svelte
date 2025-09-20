<script lang="ts">
  import { onDestroy } from 'svelte';
	import ExamIntro from './components/ExamIntro.svelte';
	import ExamScreen from './components/ExamScreen.svelte';
	import ExamFinished from './components/ExamFinished.svelte';

  export let data;

  let started = false;
  let finished = false;
  let currentIndex = 0;
  let answers: Record<string, string> = {};
  let timeLeft = data.exam.duration * 60;
  let timer: any;

  function startExam() {
    started = true;
    timer = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) finishExam();
    }, 1000);
  }

  function finishExam() {
    clearInterval(timer);
    finished = true;
  }

  function quitExam() {
    finishExam();
  }

  function handleAnswerChange(id: string, value: string) {
    answers = { ...answers, [id]: value };
  }

  function nextQuestion() {
    if (currentIndex < data.examQuestions.length - 1) currentIndex++;
  }

  function prevQuestion() {
    if (currentIndex > 0) currentIndex--;
  }

  onDestroy(() => clearInterval(timer));
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
  {#if !started && !finished}
    <ExamIntro exam={data.exam} on:start={startExam} />
  {:else if started && !finished}
    <ExamScreen
      {data}
      {currentIndex}
      {answers}
      {timeLeft}
      on:answerChange={(e) => handleAnswerChange(e.detail.id, e.detail.value)}
      on:next={nextQuestion}
      on:prev={prevQuestion}
      on:finish={finishExam}
      on:quit={quitExam}
    />
  {:else if finished}
    <ExamFinished {data} {answers} />
  {/if}
</div>
