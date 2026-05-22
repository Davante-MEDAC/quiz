<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>DMDDA | Quiz</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{JSON.stringify(data)}</div>
