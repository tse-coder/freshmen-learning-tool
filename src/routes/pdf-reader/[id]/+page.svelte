<script lang="ts">
	import { onMount } from 'svelte';
	let viewerRef: HTMLDivElement;

	onMount(async () => {
		// Dynamically import only in the browser
		const WebViewer = (await import('@pdftron/pdfjs-express-viewer')).default;

		WebViewer(
			{
				path: '/pdfjs-express',
				licenseKey: 'IWT1M4Qd0jDzs2X8KcQN',
				initialDoc: '/parma.pdf'
			},
			viewerRef
		).then((instance) => {
			console.log('PDF viewer loaded');
		});
	});
</script>

<div class="flex h-screen w-screen flex-col">
	<div bind:this={viewerRef} class="h-screen w-full" />
</div>
