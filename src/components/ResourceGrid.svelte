<script lang="ts">
	// @ts-ignore
	import type { Resource, VideoResource } from '$lib/data/resources';
	import ResourceCard from './ResourceCard.svelte';

	export let resources: Resource[] = [];
	export let courseId: string;
</script>

<div class="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each resources as r}
		<ResourceCard resource={r} {courseId} />
	{/each}
</div>
