<script lang="ts">
	export let value: string;
	export let place: string;
</script>

<input
	type="text"
	placeholder={place}
	bind:value
	class="w-full rounded-lg bg-base-200 border border-base-300 p-2 text-base-content placeholder-base-content/60 focus:ring focus:ring-primary focus:outline-none"
/>
