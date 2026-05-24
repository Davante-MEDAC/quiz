<script lang="ts">
	let { data } = $props();

	const firstName = data.session?.user?.email?.split('@')[0] ?? 'there';
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

	<h2 class="mb-4 text-xl font-bold text-gray-900">Cursos</h2>
	<div class="grid grid-cols-2 gap-4">
		{#each data.courses as course}
			<a
				href="/app/{course.id}"
				class="rounded-2xl bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="mb-3 text-5xl leading-none">{course.icon}</div>
				<p class="font-semibold text-gray-900">{course.title}</p>
				<p class="text-sm text-gray-500">
					{course.items.length} lecciones
				</p>
			</a>
		{/each}
	</div>
</div>
