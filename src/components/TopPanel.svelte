<script lang="ts">
	import { goto } from '$app/navigation';

	export let backUrl: string = '/';
	export let title: string = '';

	function goBack() {
		goto(backUrl);
	}
</script>

<div
	class="top-panel flex h-17 items-center bg-gradient-to-r from-gray-900 to-gray-800 px-2 shadow-md"
>
	<button aria-label="Back" class="mr-2 rounded p-2 hover:bg-gray-700" on:click={goBack}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			class="h-6 w-6 text-white"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<span class="truncate text-lg font-semibold text-white">{title}</span>
</div>

<style>
	.top-panel {
		position: sticky;
		top: 0;
		z-index: 50;
	}
</style>
