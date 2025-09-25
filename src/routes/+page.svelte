<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setPageTitle } from '../lib/stores/uiStore';
	import Loader from '../components/Loader.svelte';
	import Slider from '../components/Slider.svelte';
	import { ensureCourses } from '$lib/stores/cacheContext';
	import Error from '../components/Error.svelte';

	$: userName = ' 👋';
	$: loadingCourses = false;
	$: error = false;

	onMount(() => {
		setPageTitle('FreshHub');
		const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
		if (tgUser?.first_name) userName = tgUser.first_name;

		// Expand Telegram WebApp to full height
		window.Telegram?.WebApp?.expand();
	});

	async function viewCourses() {
		error = false;
		loadingCourses = true;
		try {
			await ensureCourses();
			goto('/courses');
		} catch (err) {
			error = true;
			console.error('Failed to navigate', err);
		} finally {
			loadingCourses = false;
		}
	}
</script>

<div
	class="flex min-h-screen flex-col
  bg-gradient-to-br from-gray-50 via-white to-gray-100
  px-2
  pt-3 pb-20 text-gray-900 dark:from-gray-900
  dark:via-black dark:to-gray-800 dark:text-white"
>
	{#if error}
		<Error
			onClose={() => {
				error = false;
			}}
			message={"Couldn't fetch courses!"}
		/>
	{:else}
		<div
			class="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center
      gap-6 rounded-2xl border border-black/10
      bg-white/70 p-6 shadow-2xl
      backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
		>
			<h1 class="text-center text-3xl">Hi, {userName}!</h1>
			<p class="text-center text-gray-600 dark:text-gray-300">
				Access course modules, short notes, quizzes, and videos tailored for freshmen.
			</p>
			<Slider />
		</div>

		<!-- Get Started button fixed at bottom -->
		<div class="absolute right-0 bottom-0 left-0 bg-gray-100 p-2 shadow-md dark:bg-gray-950">
			<div
				class="flex w-full items-center justify-center rounded-lg
        bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-lg
        font-semibold text-white shadow-md transition"
			>
				{#if loadingCourses}
					<Loader small={true} message="Loading courses..." />
				{:else}
					<button
						on:click={viewCourses}
						class="flex-1 cursor-pointer hover:from-blue-700 hover:to-indigo-700"
						disabled={loadingCourses}
					>
						Get Started
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>
