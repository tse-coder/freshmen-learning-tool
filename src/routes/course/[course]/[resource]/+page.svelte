<script lang="ts">
	import CategoryTabs from '../../../../components/CategoryTabs.svelte';
	import ResourceGrid from '../../../../components/ResourceGrid.svelte';
	import SearchBar from '../../../../components/SearchBar.svelte';
	import VideoPlayer from '../../../../components/VideoPlayer.svelte';
	import { onMount } from 'svelte';
	import { setPageTitle } from '../../../../lib/stores/uiStore';
	import type { Resource } from '../../../../types/types';

	export let data: { course: string; resourceType: string; resources: Resource[] };

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

<div class="min-h-screen bg-main p-6 flex flex-col items-center">
	<div class="w-full max-w-4xl glass-card p-6">

		<!-- Search -->
		<SearchBar bind:value={searchQuery} place="search for {data.resourceType}..." />

		<!-- Category Tabs (for Exams) -->
		{#if showTabs}
			<CategoryTabs
				categories={['All', 'Mid', 'Final']}
				bind:active={activeCategory}
				onChange={onCategoryChange}
			/>
		{/if}

		<!-- Video Player (only for videos) -->
		{#if isVideo && selectedVideo}
			<VideoPlayer url={selectedVideo} title="Video resource" />
		{/if}

		<!-- Grid of Resources -->
		<ResourceGrid resources={filteredResources} />
	</div>
</div>
