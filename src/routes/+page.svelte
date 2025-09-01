<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setPageTitle } from '../lib/stores/uiStore';
	import Loader from '../components/Loader.svelte';
	import Slider from '../components/Slider.svelte';
	import { ensureCourses } from '$lib/stores/cacheContext';
	import Error from '../components/Error.svelte';

	let userName: string = 'User';
	let loadingCourses: boolean = false;
	let error: boolean = false;

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

<div class="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-6 text-white">
	<!-- Main content container -->
	
	{#if error}
		<Error onClose={()=>{error = false}} message={"Couldn't fetch courses!"}/>
	{:else}
		<div class="flex-1 flex flex-col items-center justify-center mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-lg gap-6">
			<h1 class="text-3xl font-extrabold text-center">Welcome, {userName}!</h1>
			<p class="text-center text-gray-300">
				Access course modules, short notes, quizzes, and videos tailored for freshmen — fast and mobile-friendly.
			</p>
			<Slider />
		</div>

		<!-- Get Started button fixed at bottom -->
		<div class="mt-6 w-full w-full py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition flex items-center justify-center">
			{#if loadingCourses}
				<Loader small={true} message="Loading courses..." />
			{:else}
				<button
					on:click={viewCourses}
					class="hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
					disabled={loadingCourses}
				>
					Get Started
				</button>
			{/if}
		</div>
	{/if}
</div>
