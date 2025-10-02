<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { authUser } from '../lib/stores/auth';
	import Loader from './Loader.svelte';
	import { clickOutside } from '$lib/actions/clickOutside';

	let isExpanded = true;
	let lastScroll = 0;
	let showForm = false;
	let feedbackText = '';
	let loading = false;
	let success = false;
	let error = '';

	function toggleForm() {
		showForm = !showForm;
	}

	async function submitFeedback() {
		if (!feedbackText.trim()) return;
		loading = true;
		error = '';
		success = false;
		try {
			// 👇 get logged-in user from your auth store
			const user = get(authUser);

			const res = await fetch('/api/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					feedback: feedbackText,
					user_id: user?.id ?? null
				})
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to send feedback');
			success = true;
			feedbackText = '';
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const handleScroll = () => {
			const y = window.scrollY;
			if (y > lastScroll) {
				isExpanded = false;
			} else {
				isExpanded = true;
			}
			lastScroll = y;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<!-- Floating button -->
<div class="fixed right-6 bottom-6 z-50">
	<button
		class={`${showForm ? 'hidden' : 'flex'} animate-pulse cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500
      to-purple-500 px-4 py-2 text-white
      shadow-lg transition-all hover:from-blue-600
      hover:via-indigo-600 hover:to-purple-600`}
		on:click={toggleForm}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2m4-4h6m0 0v6m0-6l-6 6"
			/>
		</svg>
		{#if isExpanded}
			<span class="transition-all duration-300">Feedback</span>
		{/if}
	</button>

	{#if showForm}
		<div
			class="mt-3 w-72 rounded-lg bg-gray-100 p-4 text-gray-800 shadow-xl
           dark:bg-gray-900 dark:text-gray-100"
			use:clickOutside={() => (showForm = false)}
		>
			<div class="flex w-full justify-between">
				<h3 class="mb-2 font-semibold">Your Feedback</h3>
				<button
					class="text-sm text-gray-600 hover:text-gray-800
                   dark:text-gray-400 dark:hover:text-gray-200"
					on:click={() => (showForm = false)}
				>
					Close
				</button>
			</div>

			<textarea
				bind:value={feedbackText}
				rows="3"
				class="w-full rounded-md bg-transparent p-2 text-sm
               text-gray-800 placeholder-gray-500
               dark:text-gray-100 dark:placeholder-gray-400"
				placeholder="Write your feedback..."
			></textarea>

			<div class="mt-3 flex items-center justify-end">
				{#if loading}
					<Loader small={true} message="Sending..." />
				{:else}
					<button
						class="rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1
                       text-sm font-medium text-white shadow
                       hover:from-blue-600 hover:to-indigo-700"
						on:click={submitFeedback}
					>
						Submit
					</button>
				{/if}
			</div>

			{#if success}
				<p class="mt-2 text-sm text-green-600 dark:text-green-400">✅ Thanks for your feedback!</p>
			{/if}
			{#if error}
				<p class="mt-2 text-sm text-red-600 dark:text-red-400">
					⚠️ {error}
				</p>
			{/if}
		</div>
	{/if}
</div>
