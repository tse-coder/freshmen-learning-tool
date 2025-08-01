<script lang="ts">
	import type { Resource, VideoResource } from '$lib/data/resources';
	import ResourceCard from './ResourceCard.svelte';

	export let resources: Resource[] | VideoResource[] = [];
</script>

<div class="scrollbar-custom flex gap-4 overflow-x-auto px-1 py-3">
	{#each resources as r}
		<ResourceCard {...r} />
	{/each}
</div>
