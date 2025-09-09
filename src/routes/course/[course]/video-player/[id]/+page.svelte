<script lang="ts">
	import { Youtube } from 'svelte-youtube-lite';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { setPageTitle } from '$lib/stores/uiStore';

	export let data: PageData;

	// Utility to shorten title for TopPanel
	function shortTitle(t: string, max = 36) {
		if (!t) return '';
		return t.length > max ? t.slice(0, max).trimEnd() + '…' : t;
	}

	onMount(() => {
		// Use shortened video title or fallback to course name from route
		const short = shortTitle(data.title ?? '');
		const courseName = $page.params.course ?? '';
		setPageTitle(short || courseName);
	});
</script>

<div
	class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900 dark:from-gray-950 dark:to-black dark:text-white sm:px-6 lg:px-12"
>
	<!-- Layout Wrapper -->
	<div class="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row ">
		<!-- Video Player Section -->
		<div class="flex-1">
			<div
				class="mx-auto aspect-video w-full overflow-hidden border border-gray-300 bg-black shadow-lg ring-1 ring-gray-300/40 dark:border-white/10 dark:ring-white/10"
			>
				<Youtube id={data.videoId} title={data.title} />
			</div>
		</div>

		<!-- Related Videos Section -->
		<aside class="w-full flex-shrink-0 lg:w-80 xl:w-96 px-4 py-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Related Videos</h2>

			<div class="flex flex-col gap-4">
				{#each data.relatedVideos as video}
					<a
						href={`/course/${$page.params.course}/video-player/${video.id}`}
						class="group flex items-start gap-3 rounded-lg border border-gray-300 bg-white/70 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
					>
						<img
							src={video.thumbnail}
							alt={video.title}
							class="h-20 w-32 rounded-md object-cover transition-transform duration-200 group-hover:scale-105"
						/>
						<div class="flex-1">
							<h3 class="line-clamp-2 text-sm leading-tight font-medium text-gray-900 dark:text-white">
								{video.title}
							</h3>
							<p class="mt-1 text-xs text-gray-600 dark:text-gray-400">YouTube</p>
						</div>
					</a>
				{/each}
			</div>
		</aside>
	</div>
</div>
