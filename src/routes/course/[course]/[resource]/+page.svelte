<script lang="ts">
	import CategoryTabs from '../../../../components/CategoryTabs.svelte';
	import ResourceGrid from '../../../../components/ResourceGrid.svelte';
	import SearchBar from '../../../../components/SearchBar.svelte';
	import VideoPlayer from '../../../../components/VideoPlayer.svelte';

	export let data;

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
</script>

<div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 p-6 text-white">
	<h1 class="mb-6 text-3xl font-bold capitalize">
		{data.course} — {data.resourceType.replace(/([A-Z])/g, ' $1')}
	</h1>

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
