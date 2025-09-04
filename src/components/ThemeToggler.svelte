<script lang="ts">
import { theme, toggleTheme } from '../lib/stores/themeStore';
import { derived } from 'svelte/store';

// For icon animation
const icon = derived(theme, $theme => $theme === 'light' ? 'sun' : 'moon');
</script>

<button
	aria-label="Toggle theme"
	class="theme-toggle rounded-full p-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
	on:click={toggleTheme}
>
	{#if $icon === 'sun'}
		<!-- Sun Icon -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="currentColor"/>
			<g stroke="currentColor" stroke-width="2">
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</g>
		</svg>
	{:else}
		<!-- Moon Icon -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke="currentColor" stroke-width="2" fill="currentColor" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
		</svg>
	{/if}
</button>

<style>
.theme-toggle {
	background: var(--theme-toggle-bg, rgba(255,255,255,0.1));
}
</style>
