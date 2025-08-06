<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import OverlayModal from '../../../components/OverlayModal.svelte';
	import type { Resource } from '../../../types/types';

	export let data: PageData;

	const { course, resources } = data;

	let openSections: { [key: string]: boolean } = {
		modules: false,
		exams: false,
		quizzes: false,
		shortNotes: false,
		videos: false
	};

	let showOverlay = false;

	function toggleSection(section: string) {
		if (section === 'quizzes' || section === 'exams') {
			showOverlay = true;
			return;
		}
		openSections[section] = !openSections[section];
		openSections = { ...openSections };
	}

	function closeOverlay() {
		showOverlay = false;
	}

	function getResourceLink(section: string, resourceId: number): string {
		if (section === 'video') {
			return `${course.id}/video-player/${resourceId}`;
		} else if (section === 'module' || section === 'shortNote') {
			return `${course.id}/pdf-reader/${resourceId}`;
		} else {
			return `/course/${course.id}/${section}`;
		}
	}

	function formatSectionName(section: string): string {
		return section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1');
	}

	function handleResourceClick(section: string, id: number) {
		window.location.href = getResourceLink(section, id);
	}

	function getResourcesByType(type: string) {
		return resources.filter((r: Resource) => r.type === type);
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6 text-white md:p-10">
	<h1 class="mb-10 text-center text-4xl font-bold capitalize">{course.name.replace(/-/g, ' ')}</h1>

	{#each ['module', 'exams', 'quizzes', 'shortNote', 'video'] as section}
		<div class="mb-8">
			<!-- Section Toggle Button -->
			<button
				on:click={() => toggleSection(section)}
				class="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-lg font-semibold text-gray-200 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
			>
				<span>{formatSectionName(section)}</span>

				{#if section === 'quizzes' || section === 'exams'}
					<span class="text-xl">🔒</span>
				{:else}
					<svg
						class="h-6 w-6 transform transition-transform duration-300 {openSections[section]
							? 'rotate-180'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				{/if}
			</button>

			{#if openSections[section]}
				{#if getResourcesByType(section).length > 0}
					<div
						transition:fade={{ duration: 300 }}
						class="mt-4 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent p-4 pb-3 backdrop-blur-md"
					>
						<div class="scrollbar-custom flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
							{#each getResourcesByType(section) as resource}
								<div
									role="button"
									tabindex="0"
									on:click={() => handleResourceClick(section, resource.id)}
									on:keypress={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											handleResourceClick(section, resource.id);
										}
									}}
									class="w-60 shrink-0 cursor-pointer snap-start rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-lg transition duration-300 hover:shadow-2xl focus:outline focus:outline-2 focus:outline-blue-500"
								>
									{#if section === 'videos'}
										<img
											src={resource.thumbnail}
											alt={resource.title}
											loading="lazy"
											class="mb-2 h-32 w-full scale-105 rounded-sm object-cover transition-transform duration-300 hover:scale-107"
										/>
									{/if}
									<h3 class="truncate text-base font-semibold text-white">{resource.title}</h3>
									<p class="text-sm text-gray-400 capitalize">{resource.type}</p>
								</div>
							{/each}
						</div>

						<a
							href={`/course/${course.id}/${section}`}
							class="mt-4 block text-sm font-medium text-blue-400 hover:underline"
						>
							More {formatSectionName(section)} →
						</a>
					</div>
				{:else}
					<p class="mt-2 text-sm text-gray-400">
						No {formatSectionName(section)} available.
					</p>
				{/if}
			{/if}
		</div>
	{/each}
</div>

{#if showOverlay}
	<OverlayModal
		onClose={closeOverlay}
		message="This section is under development and will be available soon."
	/>
{/if}
