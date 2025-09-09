<script lang="ts">
	import type { VideoResource } from "../types/types";

	export let resource: VideoResource;
	const { id, url, thumbnail, title, type } = resource;
</script>

<a
	href={url}
	target="_blank"
	class="max-w-sm min-w-[200px] rounded-xl border border-gray-300 bg-white/70 p-4 text-gray-900 shadow-md backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-white"
>
	{#if thumbnail}
		<img src={thumbnail} alt={title} class="mb-2 h-32 w-full rounded-lg object-cover" />
	{/if}

	<h3 class="text-base font-semibold truncate">{title}</h3>
	<p class="mt-1 text-sm text-gray-600 dark:text-gray-400 capitalize">{type}</p>
</a>
