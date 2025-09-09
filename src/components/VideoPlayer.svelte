<script lang="ts">
	export let url: string;
	export let title: string = 'Embedded video';
</script>

{#if url}
	<div class="mx-auto mb-6 aspect-video w-full max-w-4xl">
		<iframe
			class="h-full w-full rounded-xl border border-gray-300 shadow-md dark:border-white/20"
			src={url}
			{title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
{/if}
