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
	class="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-8 text-white sm:px-6 lg:px-20"
>
	<!-- Layout Wrapper (centered with wider margins on large screens) -->
	<div class="mx-auto flex max-w-[1200px] flex-col gap-10 lg:flex-row">
		<!-- Video Player Section -->
		<div class="flex-1">

			<div
				class="mx-auto mb-6 aspect-video w-full max-w-[860px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ring-1 ring-white/10"
			>
				<Youtube id={data.videoId} title={data.title} />
			</div>
		</div>

		<!-- Related Videos Section -->
		<aside class="w-full flex-shrink-0 lg:w-80 xl:w-96">
			<h2 class="mb-4 text-xl font-semibold">Related Videos</h2>

			<div class="flex flex-col gap-4">
				{#each data.relatedVideos as video}
					<a
						href={`/course/${$page.params.course}/video-player/${video.id}`}
						class="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-2 backdrop-blur transition-all duration-300 hover:bg-white/10"
					>
						<img
							src={video.thumbnail}
							alt={video.title}
							class="h-20 w-32 rounded-sm object-cover transition-transform duration-200 group-hover:scale-105"
						/>
						<div class="flex-1">
							<h3 class="line-clamp-2 text-sm leading-tight font-medium text-white">
								{video.title}
							</h3>
							<p class="mt-1 text-xs text-gray-400">YouTube</p>
						</div>
					</a>
				{/each}
			</div>
		</aside>
	</div>
</div>
