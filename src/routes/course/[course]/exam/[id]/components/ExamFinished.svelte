<script lang="ts">
	import { Trophy, ArrowLeft } from 'lucide-svelte';
	export let data: any;
	export let answers: Record<string, string> = {};

	$: total = data.examQuestions.length;
	$: correct = data.examQuestions.filter(
		(q: any) => answers[q.id]?.trim().toLowerCase() === q.answer.trim().toLowerCase()
	).length;

	$: score = Math.round((correct / total) * 100);

	function goBack() {
		if (history.length > 1) history.back();
		else window.location.href = '/courses';
	}
</script>

<div class="w-full max-w-md p-8 flex flex-col items-center gap-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 shadow-lg border border-gray-200/30 dark:border-gray-700/40 text-center">
	<Trophy class="w-12 h-12 text-yellow-500" />
	<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Exam Completed</h1>
	<p class="text-lg text-gray-700 dark:text-gray-300 font-medium">Your Score: <span class="text-blue-600 dark:text-blue-400 font-bold">{score}%</span></p>

	<button
		on:click={goBack}
		class="flex items-center gap-2 mt-4 px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
	>
		<ArrowLeft class="w-4 h-4" /> Back to Exams
	</button>
</div>
