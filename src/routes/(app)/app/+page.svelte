<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	const firstName = data.session?.user?.email?.split('@')[0] ?? 'there';
</script>

<svelte:head>
	<title>DMDDA | Quiz</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 pb-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl tracking-tight text-olive-950">
				Hola, {firstName}
			</h1>
			<p class="text-sm text-olive-600">Continúa donde lo dejaste</p>
		</div>
		<div
			class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-200 text-base font-semibold text-olive-800"
		>
			{firstName[0].toUpperCase()}
		</div>
	</div>

	<p class="mb-3 text-xs font-semibold tracking-wide text-olive-500 uppercase">Cursos</p>
	<div class="grid grid-cols-2 gap-3">
		{#each data.courses as course (course.id)}
			<a
				href={resolve(`/app/${course.id}`)}
				class="rounded-2xl border border-olive-200 bg-white p-5 text-left"
			>
				<div class="mb-3 text-4xl leading-none">{course.icon}</div>
				<p class="font-semibold text-olive-950">{course.title}</p>
				<p class="text-sm text-olive-600">{course.itemCount} lecciones</p>
			</a>
		{/each}
	</div>
</div>
