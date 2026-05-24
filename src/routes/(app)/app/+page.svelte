<script lang="ts">
	let { data } = $props();

	const firstName = data.session?.user?.email?.split('@')[0] ?? 'there';
	const categories = [
		{ name: 'Sports', questions: 50, icon: '🏀' },
		{ name: 'Chemistry', questions: 30, icon: '🧪' },
		{ name: 'Math', questions: 95, icon: '🧮' },
		{ name: 'History', questions: 128, icon: '📅' },
		{ name: 'Biological', questions: 64, icon: '🧬' },
		{ name: 'Geography', questions: 42, icon: '🗺️' }
	];
</script>

<svelte:head>
	<title>DMDDA | Quiz</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 pb-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Hola, {firstName}</h1>
		</div>
		<div
			class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200 text-lg font-bold text-orange-700"
		>
			{firstName[0].toUpperCase()}
		</div>
	</div>

	<h2 class="mb-4 text-xl font-bold text-gray-900">Asignaturas</h2>
	<div class="grid grid-cols-2 gap-4">
		{#each categories as category}
			<button
				class="rounded-2xl bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-3 text-5xl leading-none">{category.icon}</div>
				<p class="font-semibold text-gray-900">{category.name}</p>
				<p class="text-sm text-gray-500">{category.questions} cuestionarios</p>
			</button>
		{/each}
	</div>
</div>
