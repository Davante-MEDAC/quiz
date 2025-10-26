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
<header class="bg-background border-border sticky top-0 z-40 border-b-2 shadow-sm">
	<div class="mx-auto flex h-16 max-w-2xl items-center justify-between gap-4 px-5">
		<a
			href="/"
			class="flex items-center gap-2 font-semibold text-primary no-underline transition-colors hover:text-primary-dark"
		>
			<span class="text-xl">←</span>
			<span>Inicio</span>
		</a>
		<div class="flex items-center gap-3">
			<span class="text-3xl">{data.subject.icon}</span>
			<h1 class="m-0 text-xl font-bold text-gray-900 max-sm:hidden">{data.subject.title}</h1>
		</div>
	</div>
</header>

<div class="mx-auto max-w-2xl p-5">
	<div class="relative mx-auto max-w-[400px] px-5 py-10">
		<!-- Path line -->
		<div class="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-secondary/20 to-primary/20 -translate-x-1/2"></div>

		{#each data.lessons as lesson, index (lesson.id)}
			{@const isEven = index % 2 === 0}
			<div class="relative mb-16 last:mb-0">
				<!-- Lesson node -->
				<a
					href="/subject/{data.subject.id}/{lesson.id}"
					class="group relative z-10 block"
					style="margin-left: {isEven ? '0' : 'auto'}; margin-right: {isEven ? 'auto' : '0'}; width: fit-content;"
				>
					<!-- Circle container -->
					<div class="relative flex flex-col items-center gap-3">
						<!-- Circle -->
						<div
							class="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-tertiary bg-primary shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:bg-primary-dark"
						>
							<span class="text-3xl font-bold text-tertiary drop-shadow-md">{index + 1}</span>

							<!-- Glow effect -->
							<div class="absolute inset-0 rounded-full bg-secondary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
						</div>

						<!-- Lesson title -->
						<div
							class="max-w-[200px] rounded-lg bg-surface border border-border px-4 py-2 text-center transition-all duration-300 group-hover:border-primary group-hover:shadow-md"
						>
							<p class="m-0 text-sm font-semibold text-gray-800">{lesson.title}</p>
						</div>
					</div>
				</a>

				<!-- Connecting dot on the path -->
				<div
					class="absolute top-12 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary border-2 border-tertiary shadow-md"
				></div>
			</div>
		{/each}
	</div>
</div>
