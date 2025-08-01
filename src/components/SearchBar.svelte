<script lang="ts">
	export let value: string;
	export let onChange: (val: string) => void;
</script>

<input
	type="text"
	placeholder="Search resources..."
	bind:value
	on:input={(e) => onChange(e.target.value)}
	class="w-full rounded-lg bg-white/10 p-2 text-white placeholder-gray-400 backdrop-blur-md focus:ring focus:ring-blue-500 focus:outline-none"
/>
