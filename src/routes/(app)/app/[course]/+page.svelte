<script lang="ts">
	let { data } = $props();

	const { course } = data;

	const kindConfig = {
		lesson: { label: 'Lección', icon: '📖', accent: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
		quiz: { label: 'Quiz', icon: '🎯', accent: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' }
	};
</script>

<svelte:head>
	<title>DMDDA | {course.title}</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 pb-8">
	<div class="mb-6 flex items-center gap-3">
		<a
			href="/app"
			class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
			</svg>
		</a>
		<h1 class="text-lg font-bold text-gray-900">{course.title}</h1>
	</div>

	<div class="mb-6 rounded-2xl bg-white p-5 shadow-sm">
		<div class="mb-2 text-4xl">{course.icon}</div>
		<p class="text-sm text-gray-500">{course.description}</p>
	</div>

	<div class="flex flex-col gap-3">
		{#each course.items as item, i}
			{@const config = kindConfig[item.kind]}
			<a
				href="/app/{course.id}/{i}"
				class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl {config.accent} text-xl">
					{config.icon}
				</div>
				<div class="min-w-0 flex-1">
					<p class="mb-0.5 text-xs font-medium text-gray-400">{config.label} {i + 1}</p>
					<p class="truncate font-semibold text-gray-900">{item.name}</p>
					<p class="text-sm text-gray-500">{item.questions.length} preguntas</p>
				</div>
				<span class="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium {config.accent}">
					{config.label}
				</span>
			</a>
		{/each}
	</div>
</div>
