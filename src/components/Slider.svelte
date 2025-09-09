<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Lottie from './Lottie.svelte';

	interface Feature {
		title: string;
		description: string;
		icon: string;
	}

	let currentIndex: number = 0;
	let interval: NodeJS.Timer;
	const features: Feature[] = [
		{
			title: 'Access All Modules',
			description: 'Read any freshman module instantly.',
			icon: "module"
		},
		{
			title: 'Interactive Quizzes',
			description: 'Test your knowledge with live quizzes and solutions.',
			icon: "exam"
		},
		{
			title: 'Video Lectures',
			description: 'Watch videos corresponding to each course.',
			icon: "video"
		},
		{
			title: 'Smart Notes',
			description: 'Summarized short notes that prepare for exams.',
			icon: "shortNote"
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
		interval = setInterval(nextSlide, 3000);
		// @ts-ignore
		return () => clearInterval(interval);
	});

	function getLottieFile(title: string): string {
		const icon = features.find(feature=>feature.title===title)?.icon;
		return `/lottie/icons/${icon}.json`;
	}

</script>
<div class="flex-col gap-5 w-full">
  <div class="relative mx-auto mt-10 mb-6 max-w-3xl">
    <div
      class="overflow-hidden rounded-2xl border border-black/10 bg-white/70 
        p-5 backdrop-blur-lg shadow-lg flex-col transition-all duration-700 ease-in-out
        dark:border-white/10 dark:bg-white/5"
    >
      <div class="flex gap-2 items-end mb-5">
        <Lottie
          path={getLottieFile(features[currentIndex].title)}
          autoplay={true}
          loop={false}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          className="w-17 h-17"
        />
        <h2 class="text-2xl w-30">{features[currentIndex].title}</h2>
      </div>
      <div transition:fade>
        <p class="text-md text-gray-600 dark:text-gray-300">{features[currentIndex].description}</p>
      </div>
    </div>

    <!-- Arrows -->
    <button
      on:click={prevSlide}
      class="absolute top-1/2 left-[-15px] -translate-y-1/2 rounded-full 
        bg-black/10 p-2 hover:bg-black/20
        dark:bg-white/10 dark:hover:bg-white/20"
    >
      ❮
    </button>
    <button
      on:click={nextSlide}
      class="absolute top-1/2 right-[-15px] -translate-y-1/2 rounded-full 
        bg-black/10 p-2 hover:bg-black/20
        dark:bg-white/10 dark:hover:bg-white/20"
    >
      ❯
    </button>
  </div>

  <!-- Dots -->
  <div class="mb-10 flex justify-center gap-2">
    {#each features as _, index}
      <button
        on:click={() => goToSlide(index)}
        class={`h-1 w-2 rounded-full transition-all duration-300 
          ${index === currentIndex 
            ? 'w-4 bg-blue-600 dark:bg-blue-500' 
            : 'bg-gray-400 dark:bg-white/20'}`}
      >{''}</button>
    {/each}
  </div>
</div>

