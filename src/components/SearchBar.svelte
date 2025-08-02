<script lang="ts">
	export let value: string;
	export let place: string;
</script>

<input
	type="text"
	placeholder={place}
	bind:value
	class="w-full rounded-lg bg-white/10 p-2 text-white placeholder-gray-400 backdrop-blur-md focus:ring focus:ring-blue-500 focus:outline-none"
/>
