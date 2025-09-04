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

<div class="min-h-screen bg-main p-2 flex flex-col items-center">
	<div class="w-full max-w-4xl flex flex-col gap-4 lg:flex-row">
		<!-- Video Player Section -->
		<div class="flex-1">
			<div
				class="mx-auto mb-3 aspect-video w-full max-w-[860px] overflow-hidden rounded-md border border-main bg-card shadow-md"
			>
				<Youtube id={data.videoId} title={data.title} />
			</div>
		</div>

		<!-- Related Videos Section -->
		<aside class="w-full flex-shrink-0 lg:w-72 xl:w-80">
			<h2 class="mb-2 text-lg font-semibold text-heading">Related Videos</h2>
			<div class="flex flex-col gap-2">
				{#each data.relatedVideos as video}
					<a
						href={`/course/${$page.params.course}/video-player/${video.id}`}
						class="group flex items-start gap-2 rounded-md border border-main bg-card p-2 backdrop-blur transition-all duration-300 hover:bg-white/10"
					>
						<img
							src={video.thumbnail}
							alt={video.title}
							class="h-20 w-30 rounded object-cover transition-transform duration-200 group-hover:scale-105"
						/>
						<div class="flex-1">
							<h3 class="line-clamp-2 text-sm leading-tight font-medium text-heading">
								{video.title}
							</h3>
							<p class="mt-1 text-xs text-muted">YouTube</p>
						</div>
					</a>
				{/each}
			</div>
		</aside>
	</div>
</div>
