<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import TopPanel from '../components/TopPanel.svelte';

	let { children } = $props();
	let user;
	onMount(() => {
		if (!window.Telegram) {
			const script = document.createElement('script');
			script.src = 'https://telegram.org/js/telegram-web-app.js';
			document.head.appendChild(script);
		}
		const tg = window.Telegram?.WebApp;
		if (tg) {
			tg.expand(); // Expands the webview
			user = tg.initDataUnsafe?.user; // User info from Telegram
		}
	});
</script>

<div class="bg-gradient-pattern mask-radial-fade fixed inset-0 z-0 h-full"></div>
<TopPanel title="Fresh Hub" />
{@render children()}
