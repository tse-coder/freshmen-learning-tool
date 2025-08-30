<script lang="ts">
	export let message: string = 'Loading...';
	export let small: boolean = false;
</script>

<div
	class={small
		? 'flex items-center gap-3 text-sm text-gray-300'
		: 'flex flex-col items-center gap-3 text-gray-300'}
>
	<svg class={small ? 'h-4 w-4 animate-spin' : 'h-8 w-8 animate-spin'} viewBox="0 0 24 24">
		<circle
			class="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			stroke-width="4"
			fill="none"
		></circle>
		<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
	</svg>
	<div>{message}</div>
</div>
