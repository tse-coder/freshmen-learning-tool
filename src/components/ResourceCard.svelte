<script lang="ts">
	import { type Resource, type VideoResource } from '$lib/data/resources';

	export let resource: VideoResource;
	const { id, url, thumbnail, title, type } = resource;
</script>

<a
	href={type === 'PDF' ? '📄' : type === 'Video' ? '🎥' : '📘'}
	target="_blank"
	class="max-w-sm min-w-[200px] rounded-xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md transition-transform hover:scale-105 hover:shadow-lg"
>
	{#if thumbnail}
		<img src={thumbnail} alt={title} class="mb-2 h-32 w-full rounded object-cover" />
	{/if}
	<div class="mb-1 text-2xl">
		{type === 'PDF' ? '📄' : type === 'Video' ? '🎥' : '📘'}
	</div>
	<h3 class="text-base font-semibold">{title}</h3>
	<p class="text-sm text-gray-300">{type}</p>
</a>
