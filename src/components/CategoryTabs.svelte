<script lang="ts">
	export let categories: string[] = [];
	export let active: string;
	export let onChange: (category: string) => void;

	function select(cat: string) {
		active = cat;
		onChange?.(cat);
	}
</script>

<div class="mb-4 flex space-x-4 text-sm font-medium">
	{#each categories as category}
		<button
			class="rounded-full px-4 py-1 transition-all duration-200
				{active === category ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}"
			on:click={() => select(category)}
		>
			{category}
		</button>
	{/each}
</div>
