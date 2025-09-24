<script lang="ts">
	export let resource;

	// Normalize props depending on resource type
	const isExam = resource.course_id && resource.duration;

	$: id = resource.id;
	$: title = resource.title;
	$: type = resource.type;
	$: description = resource.description ?? '';
	$: courseId = resource.course_id;
	$: duration = resource.duration;
	console.log(courseId);
	$: url = !isExam ? resource.url : null;
	$: thumbnail = !isExam ? resource.thumbnail : null;

	// Destination link
	$: href = isExam
		? `/course/${courseId}/exam/${id}`
		: type === 'video'
			? `/course/${courseId}/video-player/${id}`
			: url;

	function openLink(e: MouseEvent) {
		if (!isExam && type !== 'video' && url) {
			e.preventDefault(); // prevent normal <a> behavior
			// Try to force external opening
			const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

			if (!newWindow) {
				// Popup blocked or Telegram WebView prevented it
				alert('Please open this PDF in your browser: ' + url);
			}
		}
	}
</script>

<a
	{href}
	on:click={openLink}
	target={isExam || type === 'video' ? '_self' : '_blank'}
	class="group flex max-w-sm min-w-[220px] flex-col rounded-md border border-gray-200 bg-white/80
         shadow-sm backdrop-blur-sm transition-all
         duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60"
>
	{#if !isExam && thumbnail}
		<!-- Thumbnail for non-exam resources -->
		<div class="relative h-36 w-full overflow-hidden rounded-t-md">
			<img
				src={thumbnail}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
	{/if}

	<div class="flex flex-1 flex-col p-4">
		<h3 class="mb-1 line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-100">
			{title}
		</h3>

		{#if isExam}
			<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Duration: {duration} min
			</p>
		{:else}
			<!-- General resource info -->
			<p class="text-sm text-gray-600 capitalize dark:text-gray-400">
				{type}
			</p>
		{/if}
	</div>
</a>
