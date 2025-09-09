<script lang="ts">
	export let value: string;
	export let place: string;
</script>

<div class="relative w-full max-w-2xl mb-6">
	<!-- Icon -->
	<svg
		class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
			d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-1.85z" />
	</svg>

	<input
		type="text"
		placeholder={place}
		bind:value
		class="w-full rounded-xl border border-gray-300 bg-white/70 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-400"
	/>
</div>
