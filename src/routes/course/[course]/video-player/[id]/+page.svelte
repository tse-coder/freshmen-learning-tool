<script lang="ts">
	import { Youtube } from 'svelte-youtube-lite';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	class="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-8 text-white sm:px-6 lg:px-12"
>
	<!-- Layout Wrapper -->
	<div class="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row">
		<!-- Video Player Section -->
		<div class="flex-1">
			<h1 class="mb-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
				{data.title}
			</h1>

			<div
				class="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ring-1 ring-white/10"
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
						href={`/video-player/${video.id}`}
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
