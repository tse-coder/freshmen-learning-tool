<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import TopPanel from '../components/TopPanel.svelte';
	import { page } from '$app/stores';
	import { pageTitle } from '../lib/stores/uiStore';
	import { theme } from '../lib/stores/themeStore';
	import Feedback from '../components/Feedback.svelte';
	import AdminFloatingButton from '../components/AdminFloatingButton.svelte';

	let user: any = null;

	// Theme is applied centrally in themeStore subscription

	function initTelegram() {
		const tg = window.Telegram?.WebApp;
		if (!tg) return;

		tg.expand(); // expand webapp

		// Immediately set user if available
		user = tg.initDataUnsafe?.user ?? null;

		// Run backend login in background
		if (user) {
			import('../lib/stores/auth').then((auth) => {
				if (tg.initData) {
					auth.loginWithTelegramInit(tg.initData).catch(() => {
						auth.setAuthenticatedFromTelegram(user);
					});
				} else {
					auth.setAuthenticatedFromTelegram(user);
				}
			});
		}
	}

	onMount(() => {
		if (window.Telegram?.WebApp) {
			// SDK already present
			initTelegram();
		} else {
			// Load script with callback instead of polling
			const script = document.createElement('script');
			script.src = 'https://telegram.org/js/telegram-web-app.js';
			script.async = true;
			script.onload = () => initTelegram();
			document.head.appendChild(script);
		}
	});
</script>

<div>
	<div
		class="bg-gradient-pattern mask-radial-fade pointer-events-none fixed inset-0 z-0 h-full"
	></div>
	{#if $page.url.pathname !== '/' && !$page.url.pathname.includes('exam/') && !$page.url.pathname.startsWith('/admin')}
		<TopPanel title={$pageTitle} />
	{/if}

	<div class="relative z-10">
		<slot />
		{#if $page.url.pathname !== '/' && !$page.url.pathname.includes('exam/') && !$page.url.pathname.startsWith('/admin')}
			<Feedback />
		{/if}
		<AdminFloatingButton />
	</div>
</div>
