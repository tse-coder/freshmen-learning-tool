<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';

export let path: string; // URL to the Lottie JSON file
export let loop: boolean = true;
export let autoplay: boolean = true;
export let rendererSettings: any = { preserveAspectRatio: 'xMidYMid slice' };
export let className: string = '';

let container: HTMLDivElement;
let anim: AnimationItem | null = null;

onMount(() => {
	if (container && path) {
		anim = lottie.loadAnimation({
			container,
			renderer: 'svg',
			loop,
			autoplay,
			path,
			rendererSettings
		});
	}
});

onDestroy(() => {
	if (anim) {
		anim.destroy();
	}
});
</script>

<div bind:this={container} class={className}></div>
