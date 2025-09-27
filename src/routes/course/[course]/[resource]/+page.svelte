<script lang="ts">
	import CategoryTabs from '../../../../components/CategoryTabs.svelte';
	import ResourceGrid from '../../../../components/ResourceGrid.svelte';
	import SearchBar from '../../../../components/SearchBar.svelte';
	import VideoPlayer from '../../../../components/VideoPlayer.svelte';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../../../lib/stores/uiStore';
	import type { Resource } from '../../../../types/types';

	export let data: {
		course: string;
		resourceType: string;
		resources: Resource[];
		courseId: string;
	};

	let selectedVideo: string | null = null;
	let activeCategory: string = 'All';
	let searchQuery: string = '';

	const isVideo = data.resourceType === 'videos';
	const isExam = data.resourceType === 'exams';
	const showTabs = isExam;

	const onCategoryChange = (category: string) => {
		activeCategory = category;
	};

	// Filter based on category (e.g., Mid/Final) or search
	$: filteredResources = data.resources
		.filter((r) => {
			if (showTabs && activeCategory !== 'All') {
				return r.type === activeCategory;
			}
			return true;
		})
		.filter((r) => r.title.toLowerCase().includes(searchQuery.trim().toLowerCase()));

	onMount(() => {
		setPageTitle(`${data.course} — ${data.resourceType.replace(/([A-Z])/g, ' $1')}`);
	});
</script>

<div
	class="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 px-6 pt-27 text-gray-900 dark:from-black dark:via-gray-900 dark:to-gray-950 dark:text-white"
>
	<div
		class="fixed top-0 right-0 left-0 z-8 mt-15 rounded-lg bg-white/50 p-5 shadow-md backdrop-blur-sm dark:bg-gray-900/50"
	>
		<SearchBar bind:value={searchQuery} place="Search for {data.resourceType}..." />

		<!-- Category Tabs (for Exams) -->
		{#if showTabs}
			<CategoryTabs
				categories={['All', 'mid', 'final']}
				bind:active={activeCategory}
				onChange={onCategoryChange}
			/>
		{/if}
	</div>
	<!-- Search -->

	<!-- Video Player (only for videos) -->
	{#if isVideo && selectedVideo}
		<VideoPlayer url={selectedVideo} title="Video resource" />
	{/if}

	<!-- Grid of Resources -->
	<ResourceGrid resources={filteredResources} courseId={data.courseId} />
</div>
