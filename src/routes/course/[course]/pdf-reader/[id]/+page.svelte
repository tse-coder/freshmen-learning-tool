<script>
	import { goto } from '$app/navigation';

	export let data;
	const { url, title } = data.resource;
	goto(url, {
		replaceState: true,
		state: {
			title: title || 'PDF Document'
		}
	});
</script>
