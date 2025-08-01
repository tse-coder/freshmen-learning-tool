<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();
	onMount(() => {
		if (!window.Telegram) {
			const script = document.createElement('script');
			script.src = 'https://telegram.org/js/telegram-web-app.js';
			document.head.appendChild(script);
		}
	});
</script>

<div class="bg-gradient-pattern mask-radial-fade absolute inset-0 z-0"></div>
{@render children()}
