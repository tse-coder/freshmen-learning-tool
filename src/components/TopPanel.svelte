<script lang="ts">
import { goto } from '$app/navigation';
import ProfileButton from './ProfileButton.svelte';
import ThemeToggler from './ThemeToggler.svelte';

export let backUrl: string = '/';
export let title: string = '';

function goBack() {
	if (backUrl && backUrl !== '/') {
		goto(backUrl);
		return;
	}
	if (history.length > 1) {
		history.back();
		return;
	}
	goto('/courses');
}
</script>

<div class="top-panel flex h-16 items-center px-2 shadow-md
            bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-800 
            text-white backdrop-blur-md border-b border-blue-500/20 dark:border-blue-300/20">
	<button 
		aria-label="Back" 
		class="sm:mr-3 rounded p-2 hover:bg-white/20 dark:hover:bg-white/10 transition"
		on:click={goBack}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			class="h-6 w-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	<span class="truncate sm:text-lg font-semibold">{title}</span>

	<div class="ml-auto flex items-center gap-2">
		<ThemeToggler />
		<ProfileButton />
	</div>
</div>

<style>
	.top-panel {
		position: sticky;
		top: 0;
		z-index: 50;
	}
</style>
