<script lang="ts">
	import { goto } from '$app/navigation';
	import Slider from '../components/Slider.svelte';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../lib/stores/uiStore';
	const quote =
		'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.';

	onMount(() => {
		setPageTitle('Welcome');
	});
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6 text-white"
>
	<div
		class="mx-auto w-full max-w-5xl rounded-3xl border border-white/6 bg-gradient-to-br from-white/3 to-transparent p-10 shadow-2xl backdrop-blur-lg"
	>
		<div class="flex flex-col gap-8 md:flex-row md:items-center">
			<div class="w-full md:w-1/2">
				<h1 class="mb-4 text-4xl leading-tight font-extrabold md:text-5xl">
					Fresh Hub — Learn, Practice, Succeed
				</h1>
				<p class="mb-6 text-lg text-gray-300">{quote}</p>
				<p class="text-md mb-6 text-gray-400">
					Access course modules, short notes, quizzes and video content tailored for freshmen — fast
					and mobile-friendly.
				</p>

				<div class="flex gap-4">
					<button
						class="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:from-blue-700 hover:to-indigo-700"
						on:click={() => goto('/courses')}
					>
						Get started
					</button>

					<button
						class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition duration-200 hover:bg-white/8"
						on:click={() => goto('/signin')}
					>
						Sign in
					</button>
				</div>
			</div>

			<div class="hidden w-1/2 md:block">
				<div class="rounded-xl border border-white/6 bg-white/3 p-4 shadow-inner">
					<Slider />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
</style>
