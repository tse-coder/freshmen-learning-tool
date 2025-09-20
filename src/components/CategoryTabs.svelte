<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let categories: string[] = [];
	export let active: string = 'All';
	export let onChange: (category: string) => void = () => {};

	// Read query param to set default active tab
	onMount(() => {
		const tab = $page.url.searchParams.get('tab');
		if (tab && categories.map(c => c.toLowerCase()).includes(tab.toLowerCase())) {
			active = tab.toLowerCase();
			onChange?.(active);
		}
	});

	function select(cat: string) {
		active = cat;
		onChange?.(cat);
	}
</script>

<div class="mb-4 flex flex-wrap gap-2 text-sm font-medium">
	{#each categories as category}
		<button
			class="px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 
				{active === category 
					? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
					: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}"
			on:click={() => select(category)}
		>
			{category}
		</button>
	{/each}
</div>
