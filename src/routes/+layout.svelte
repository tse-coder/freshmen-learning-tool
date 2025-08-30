<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import TopPanel from '../components/TopPanel.svelte';
	import { page } from '$app/stores';
	import { pageTitle } from '../lib/stores/uiStore';

	let { children } = $props();
	let user: any = null;

	onMount(() => {
		// Load Telegram WebApp SDK if not present
		if (!window.Telegram) {
			const script = document.createElement('script');
			script.src = 'https://telegram.org/js/telegram-web-app.js';
			script.async = true;
			document.head.appendChild(script);
		}

		// Wait until Telegram SDK is available
		const initTelegram = () => {
			const tg = window.Telegram?.WebApp;
			if (!tg) return;

			tg.expand(); // Expand WebApp to full height

			// Get user info from Telegram
			user = tg.initDataUnsafe?.user ?? null;

			if (user) {
				// Attempt backend authentication
				import('../lib/stores/auth').then((auth) => {
					if (tg.initData) {
						auth.loginWithTelegramInit(tg.initData).catch(() => {
							// fallback to client-side set if backend fails
							auth.setAuthenticatedFromTelegram(user);
						});
					} else {
						auth.setAuthenticatedFromTelegram(user);
					}
				});
			}
		};

		// If SDK already loaded
		if (window.Telegram?.WebApp) {
			initTelegram();
		} else {
			// Retry after SDK loads
			const scriptCheck = setInterval(() => {
				if (window.Telegram?.WebApp) {
					clearInterval(scriptCheck);
					initTelegram();
				}
			}, 100);
		}
	});
</script>

<!-- Background gradient / radial fade -->
<div class="bg-gradient-pattern mask-radial-fade fixed inset-0 z-0 h-full pointer-events-none"></div>

<!-- Top panel for all pages except root -->
{#if $page.url.pathname !== '/'}
	<TopPanel title={$pageTitle} />
{/if}

<!-- Render page content -->
<div class="relative z-10">
	{@render children()}
</div>
