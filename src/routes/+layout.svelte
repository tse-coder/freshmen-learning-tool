<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import TopPanel from '../components/TopPanel.svelte';
	import { page } from '$app/stores';
	import { pageTitle } from '../lib/stores/uiStore';

	let { children } = $props();
	let user: any = null;
	// use auto-subscription in template via $pageTitle
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
			if (user) {
				// Try to verify login with backend using initData
				import('../lib/stores/auth').then((m) => {
					if (tg.initData) {
						m.loginWithTelegramInit(tg.initData).catch(() => {
							// backend failed; fall back to client-side set
							m.setAuthenticatedFromTelegram(user);
						});
					} else {
						m.setAuthenticatedFromTelegram(user);
					}
				});
			}
		}
	});
</script>

<div class="bg-gradient-pattern mask-radial-fade fixed inset-0 z-0 h-full"></div>
{#if $page.url.pathname !== '/'}
	<TopPanel title={$pageTitle} />
{/if}
{@render children()}
