<script lang="ts">
	import type { VideoResource } from "../types/types";


	export let resource: VideoResource;
	const { id, url, thumbnail, title, type } = resource;
</script>

<a
	href={type === 'PDF' ? '📄' : type === 'Video' ? '🎥' : '📘'}
	target="_blank"
	class="max-w-sm min-w-[200px] glass-card p-4 transition-transform hover:scale-105 hover:shadow-lg"
>
	{#if thumbnail}
		<img src={thumbnail} alt={title} class="mb-2 h-32 w-full rounded object-cover" />
	{/if}
	<div class="mb-1 text-2xl">
		{type === 'PDF' ? '📄' : type === 'Video' ? '🎥' : '📘'}
	</div>
	<h3 class="text-base font-semibold text-heading">{title}</h3>
	<p class="text-sm text-muted">{type}</p>
</a>
