<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Play } from 'lucide-svelte';
	export let exam;
	const dispatch = createEventDispatcher();
</script>

<div class="w-full max-w-xl flex flex-col items-center gap-6 p-8 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200/30 dark:border-gray-700/40 text-center">
	<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{exam.title}</h1>
	<p class="text-gray-700 dark:text-gray-300">{exam.description}</p>
	<p class="text-gray-600 dark:text-gray-400"><strong>Duration:</strong> {exam.duration} minutes</p>

	<button
		on:click={() => dispatch('start')}
		class="flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
	>
		<Play class="w-5 h-5" /> Start Exam
	</button>
</div>
