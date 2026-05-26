<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	function greet() {
		const hour = new Date().getHours();
		return hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
	}
</script>

<svelte:head>
	<title>DMDDA | Quiz</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 pb-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl tracking-tight text-olive-950">
				{greet()}
			</h1>
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
