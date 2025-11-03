<script lang="ts">
	import Question from './Question.svelte';
	import TimerQuit from './TimerQuit.svelte';
	import QuestionNav from './QuestionNav.svelte';
	import { createEventDispatcher } from 'svelte';

	export let data;
	export let currentIndex = 0;
	export let answers: Record<string, string> = {};
	export let timeLeft: number;

	const dispatch = createEventDispatcher();

	$: isLastQuestion = currentIndex === data.examQuestions.length - 1;

	function handleAnswerChange(id: string, value: string) {
		dispatch('answerChange', { id, value });
	}

	function handlePrev() {
		dispatch('prev');
	}

	function handleNext() {
		dispatch('next');
	}

	function handleFinish() {
		dispatch('finish');
	}

	function handleQuit() {
		dispatch('quit');
	}
</script>

<div class="w-full max-w-2xl flex flex-col gap-6 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/30 dark:border-gray-700/40">
	<TimerQuit {timeLeft} on:quit={handleQuit} />

	<div class="text-gray-700 dark:text-gray-300 text-sm font-medium">
		Question {currentIndex + 1} of {data.examQuestions.length}
	</div>

	<Question
		{currentIndex}
		{answers}
		questions={data.examQuestions}
		on:answerChange={(e) => handleAnswerChange(e.detail.id, e.detail.value)}
	/>

	<QuestionNav
		{currentIndex}
		{isLastQuestion}
		on:prev={handlePrev}
		on:next={handleNext}
		on:finish={handleFinish}
	/>
</div>
