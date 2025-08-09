<script lang="ts">
	import { PdfViewer } from 'svelte-pdf-simple';

	export let data;
	const { resource } = data;
	const url = resource.url;
	let pdfProps = {
		page: 1, // starting page
		scale: 1.0, // zoom level
		rotate: 0 // rotation degrees
	};
</script>

<PdfViewer {url} props={pdfProps} />
