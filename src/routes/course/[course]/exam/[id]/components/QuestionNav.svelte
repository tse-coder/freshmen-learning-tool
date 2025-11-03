<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let currentIndex: number;
	export let isLastQuestion: boolean;

	const dispatch = createEventDispatcher();
</script>

<div class="flex justify-between mt-6">
	<button
		on:click={() => dispatch('prev')}
		disabled={currentIndex === 0}
		class="px-5 py-2 rounded-md font-semibold transition bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
	>
		Previous
	</button>

	{#if isLastQuestion}
		<button
			on:click={() => dispatch('finish')}
			class="px-6 py-2 rounded-md font-semibold text-white bg-green-600 hover:bg-green-700 transition"
		>
			Finish
		</button>
	{:else}
		<button
			on:click={() => dispatch('next')}
			class="px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
		>
			Next
		</button>
	{/if}
</div>
