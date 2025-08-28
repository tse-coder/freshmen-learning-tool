<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { loginDemo, loginWithBackend, signupWithBackend } from '../lib/stores/auth';

	export let show = false;
	export let mode: 'login' | 'signup' = 'login';

	let username = '';
	let password = '';
	let error = '';
	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleAuth() {
		if (!username || !password) {
			error = 'Please enter username and password';
			return;
		}

		// Try backend first
		if (mode === 'login') {
			loginWithBackend(username, password)
				.then((r) => {
					if (r.ok) {
						dispatch('success', { username });
						close();
					} else {
						// fallback to demo behavior
						loginDemo({ username });
						dispatch('success', { username });
						close();
					}
				})
				.catch(() => {
					// backend down — accept demo credentials
					loginDemo({ username });
					dispatch('success', { username });
					close();
				});
		} else {
			signupWithBackend(username, password)
				.then((r) => {
					if (r.ok) {
						dispatch('success', { username });
						close();
					} else {
						loginDemo({ username });
						dispatch('success', { username });
						close();
					}
				})
				.catch(() => {
					loginDemo({ username });
					dispatch('success', { username });
					close();
				});
		}
	}
</script>


{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div class="mx-4 w-full max-w-md transform rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 shadow-2xl backdrop-blur-md" role="dialog" aria-modal="true">
			<header class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">{mode === 'login' ? 'Log In' : 'Create Account'}</h2>
				<button class="text-gray-300 hover:text-white" on:click={close} aria-label="Close">&times;</button>
			</header>

			<form on:submit|preventDefault={handleAuth} class="space-y-4">
				<label for="auth-username" class="block text-sm text-gray-300">Username</label>
				<input id="auth-username"
					type="text"
					placeholder="Enter a username"
					bind:value={username}
					class="w-full rounded-lg border border-white/6 bg-gray-900/40 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
				/>
				<label for="auth-password" class="block text-sm text-gray-300">Password</label>
				<input id="auth-password"
					type="password"
					placeholder="Choose a secure password"
					bind:value={password}
					class="w-full rounded-lg border border-white/6 bg-gray-900/40 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
				/>
				{#if error}
					<p class="text-sm text-red-500">{error}</p>
				{/if}
				<button type="submit" class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-sm font-semibold text-white shadow-md hover:opacity-95">{mode === 'login' ? 'Log In' : 'Sign Up'}</button>
			</form>
			<footer class="mt-4 text-center text-sm text-gray-400">
				By continuing you agree to the terms and privacy policy.
			</footer>
		</div>
	</div>
{/if}

<style>
	/* Overlay styles are inlined for simplicity */
</style>
