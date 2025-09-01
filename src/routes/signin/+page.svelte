<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../lib/stores/uiStore';

	let username = '';
	let password = '';
	let error = '';

	const DEMO_CREDENTIALS = {
		username: 'student1',
		password: 'freshman123'
	};

	onMount(() => setPageTitle('Log In'));

	function handleLogin(): void {
		if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
			goto('/courses');
			error = '';
		} else {
			error = 'Invalid username or password';
		}
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4"
>
	<div
		class="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-lg"
	>
		<h2 class="mb-6 text-center text-3xl font-bold">Login to Your Account</h2>
		<form class="space-y-6" on:submit|preventDefault={handleLogin}>
			<div class="space-y-2">
				<label for="username" class="block text-sm font-medium">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					class="block w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					placeholder="Enter your username"
					required
				/>
			</div>

			<div class="space-y-2">
				<label for="password" class="block text-sm font-medium">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="block w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					placeholder="Enter your password"
					required
				/>
			</div>

			{#if error}
				<p class="text-sm text-red-400">{error}</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition duration-300 hover:from-blue-700 hover:to-indigo-700"
			>
				Login
			</button>
		</form>
		<p class="mt-6 text-center text-sm text-gray-400">
			Demo login: <code class="font-mono text-blue-400">student1</code> /
			<code class="font-mono text-blue-400">freshman123</code>
		</p>
	</div>
</div>
// Removed: Telegram only
