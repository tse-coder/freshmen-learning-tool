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
<div class="flex min-h-screen flex-col 
  bg-gradient-to-br from-gray-50 via-white to-gray-100 
  text-gray-900
  dark:from-gray-900 dark:via-black dark:to-gray-800 dark:text-white
  px-2 pt-3 pb-20">

  {#if error}
    <Error onClose={() => {error = false}} message={"Couldn't fetch courses!"}/>
  {:else}
    <div class="flex-1 flex flex-col items-center justify-center mx-auto w-full max-w-lg 
      rounded-2xl border border-black/10 bg-white/70 
      shadow-2xl backdrop-blur-lg gap-6
      dark:border-white/10 dark:bg-white/5 p-6">
      
      <h1 class="text-3xl text-center">Welcome, {userName}!</h1>
      <p class="text-center text-gray-600 dark:text-gray-300">
        Access course modules, short notes, quizzes, and videos tailored for freshmen.
      </p>
      <Slider/>
    </div>

    <!-- Get Started button fixed at bottom -->
    <div class="absolute bottom-0 right-0 left-0 p-2 bg-gray-100 dark:bg-gray-950 shadow-md">
      <div class="w-full py-4 text-lg font-semibold rounded-lg 
        bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md transition 
        flex items-center justify-center text-white">
        
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

