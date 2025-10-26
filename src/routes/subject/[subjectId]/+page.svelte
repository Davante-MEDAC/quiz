<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.subject.title} - Lessons</title>
	<meta name="description" content="Complete lessons for {data.subject.title}" />
</svelte:head>

<!-- Fixed Header -->
<header class="bg-surface border-border sticky top-0 z-40 border-b-2 shadow-sm">
	<div class="mx-auto flex h-16 max-w-2xl items-center justify-between gap-4 px-5">
		<a
			href="/"
			class="flex items-center gap-2 font-semibold text-sky-500 no-underline transition-colors hover:text-sky-600"
		>
			<span class="text-xl">←</span>
			<span>Inicio</span>
		</a>
		<div class="flex items-center gap-3">
			<span class="text-3xl">{data.subject.icon}</span>
			<h1 class="m-0 text-xl font-bold text-white max-sm:hidden">{data.subject.title}</h1>
		</div>
	</div>
</header>

<div class="mx-auto max-w-2xl p-5">
	<div class="mx-auto flex max-w-[600px] flex-col gap-6 px-5 py-10">
		{#each data.lessons as lesson, index (lesson.id)}
			<a
				href="/subject/{data.subject.id}/{lesson.id}"
				class="bg-surface border-primary hover:border-secondary before:bg-border relative flex items-center gap-4 rounded-2xl border-2 p-5 text-inherit no-underline shadow-md transition-all duration-200 before:absolute before:bottom-full before:left-1/2 before:h-6 before:w-0.5 before:-translate-x-1/2 before:content-[''] first:before:hidden hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="shrink-0 text-5xl">{lesson.icon}</div>
				<div class="flex-1">
					<h3 class="m-0 mb-1 text-lg font-bold text-white">{lesson.title}</h3>
				</div>
				<div class="text-primary shrink-0 text-2xl">→</div>
			</a>
		{/each}
	</div>
</div>
