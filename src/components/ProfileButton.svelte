<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated, authUser, logout } from '../lib/stores/auth';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	let authed = false;
	let user: any = null;
	const open = writable(false);

	const unsubAuth = isAuthenticated.subscribe((v) => (authed = v));
	const unsubUser = authUser.subscribe((v) => (user = v));

	onMount(() => {
		return () => {
			unsubAuth();
			unsubUser();
		};
	});

	function goToLogin() {
		goto('/signin');
	}

	function toggleOpen() {
		open.update((v) => !v);
	}

	function doLogout() {
		logout();
		open.set(false);
		goto('/');
	}

	function initials(name: string) {
		if (!name) return '';
		const parts = String(name).split(' ');
		return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
	}
</script>

{#if authed && user}
	<div class="relative">
		<button
			class="profile-btn flex items-center gap-2 rounded-full p-1 hover:bg-white/5"
			on:click={toggleOpen}
			aria-haspopup="true"
			aria-expanded={$open}
		>
			{#if user.photo_url}
				<img src={user.photo_url} alt="Profile" class="h-9 w-9 rounded-full object-cover" />
			{:else}
				<div
					class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white"
				>
					{initials(user.first_name ?? user.username ?? user.name ?? '')}
				</div>
			{/if}
		</button>

		{#if $open}
			<div
				class="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-3 shadow-lg"
			>
				<div class="flex items-center gap-3">
					{#if user.photo_url}
						<img src={user.photo_url} alt="Profile" class="h-10 w-10 rounded-full object-cover" />
					{:else}
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white"
						>
							{initials(user.first_name ?? user.username ?? user.name ?? '')}
						</div>
					{/if}
					<div>
						<div class="text-sm font-semibold text-white">
							{user.first_name ?? user.username ?? user.name ?? 'User'}
						</div>
						{#if user.username}
							<div class="text-xs text-gray-300">@{user.username}</div>
						{/if}
					</div>
				</div>

				<div class="mt-3 flex flex-col gap-2">
					<button
						class="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white"
						on:click={() => goto('/profile')}>View Profile</button
					>
					<button
						class="w-full rounded-md border border-white/6 bg-transparent px-3 py-2 text-sm text-white"
						on:click={doLogout}>Log out</button
					>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<button class="rounded-md bg-white/5 px-3 py-2 text-sm text-white" on:click={goToLogin}
		>Log in</button
	>
{/if}

<style>
	.profile-btn:focus {
		outline: 2px solid rgba(59, 130, 246, 0.5);
		outline-offset: 2px;
	}
</style>
