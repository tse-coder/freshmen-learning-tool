<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../lib/stores/uiStore';
	export let data;
	const courses = data.fetchedCourses;

	onMount(() => setPageTitle('Courses'));
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 text-white">
	<h1 class="mb-10 text-center text-4xl">Courses</h1>

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each courses as course}
			<div
				class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105"
			>
				<h2 class="mb-2 text-xl font-semibold">{course.name}</h2>
				<ul class="space-y-1 text-sm text-gray-300">
					<li><span class="font-medium text-blue-400">Modules:</span> {course.modules}</li>
					<li><span class="font-medium text-blue-400">Notes:</span> {course.notes}</li>
					<li><span class="font-medium text-blue-400">Videos:</span> {course.videos}</li>
				</ul>
				<button
					class="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2 font-semibold text-white transition duration-300 hover:from-blue-700 hover:to-indigo-700"
					onclick={() => {
						goto(`./course/${course.id}`);
					}}
				>
					View Resources
				</button>
			</div>
		{/each}
	</div>
</div>
