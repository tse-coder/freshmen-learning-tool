<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	interface Feature {
		title: string;
		description: string;
	}

	let currentIndex: number = 0;
	let interval: NodeJS.Timer;
	const features: Feature[] = [
		{
			title: 'Access All Modules',
			description: 'Read and download any university module instantly.'
		},
		{
			title: 'Interactive Quizzes',
			description: 'Test your knowledge with live quizzes and solutions.'
		},
		{
			title: 'Video Lectures',
			description: 'Watch offline-friendly, instructor-led course videos.'
		},
		{
			title: 'Smart Notes',
			description: 'Summarized notes curated by top students.'
		}
	];

	function nextSlide(): void {
		currentIndex = (currentIndex + 1) % features.length;
	}

	function prevSlide(): void {
		currentIndex = (currentIndex - 1 + features.length) % features.length;
	}

	function goToSlide(index: number): void {
		currentIndex = index;
	}

	onMount(() => {
		interval = setInterval(nextSlide, 5000);
		return () => clearInterval(interval);
	});
</script>

<div class="relative mx-auto mt-10 mb-6 max-w-3xl">
	<div
		class="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-700 ease-in-out"
	>
		<div transition:fade key={currentIndex}>
			<h2 class="mb-2 text-2xl font-bold">{features[currentIndex].title}</h2>
			<p class="text-lg text-gray-300">{features[currentIndex].description}</p>
		</div>
	</div>
	<!-- Arrows -->
	<button
		on:click={prevSlide}
		class="absolute top-1/2 left-[-15px] -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20"
	>
		❮
	</button>
	<button
		on:click={nextSlide}
		class="absolute top-1/2 right-[-15px] -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20"
	>
		❯
	</button>
</div>

<div class="mb-10 flex justify-center gap-2">
	{#each features as _, index}
		<button
			on:click={() => goToSlide(index)}
			class={`h-1 w-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-4 bg-blue-500' : 'bg-white/20'}`}
			>{''}
		</button>
	{/each}
</div>
