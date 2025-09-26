<script lang="ts">
	import Lottie from './Lottie.svelte';

	export let message: string = 'Loading...';
	export let small: boolean = false;
</script>

<div
	class={small
		? 'flex items-center gap-3 text-sm text-gray-300'
		: 'flex flex-col items-center gap-3 text-gray-300'}
>
	<Lottie
		path={'/lottie/Loader.json'}
		autoplay={true}
		loop={true}
		rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
		className="w-5 h-5 mb-2"
	/>
	<div>{message}</div>
</div>
