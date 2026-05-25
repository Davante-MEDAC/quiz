<script lang="ts">
	import { resolve } from '$app/paths';

	let { loginHref = '/login' }: { loginHref?: string } = $props();

	let menuOpen = $state(false);
</script>

<header class="sticky top-0 z-10 bg-olive-100">
	<nav>
		<div class="mx-auto flex h-21 max-w-7xl items-center gap-4 px-6 lg:px-10">
			<div class="flex flex-1 gap-8 max-lg:hidden">
				<a href="#caracteristicas" class="text-sm/7 font-medium text-olive-950 hover:text-olive-700"
					>Características</a
				>
				<a href="#estadisticas" class="text-sm/7 font-medium text-olive-950 hover:text-olive-700"
					>Estadísticas</a
				>
				<a href="#preguntas" class="text-sm/7 font-medium text-olive-950 hover:text-olive-700"
					>Preguntas</a
				>
			</div>

			<div class="flex flex-1 items-center lg:justify-center">
				<a href={resolve('/')} class="text-xl tracking-tight text-olive-950">DMDDA Quiz</a>
			</div>

			<div class="flex flex-1 items-center justify-end gap-4">
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					href={loginHref}
					class="inline-flex items-center rounded-full px-3 py-1 text-sm/7 font-medium text-olive-950 hover:bg-olive-950/10 max-sm:hidden"
				>
					Acceder
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
				<button
					onclick={() => (menuOpen = !menuOpen)}
					aria-label="Abrir menú"
					class="inline-flex rounded-full p-1.5 text-olive-950 hover:bg-olive-950/10 lg:hidden"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
						<path
							fill-rule="evenodd"
							d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>

		{#if menuOpen}
			<div class="fixed inset-0 bg-olive-100 px-6 py-6 lg:hidden">
				<div class="flex justify-end">
					<button
						onclick={() => (menuOpen = false)}
						aria-label="Cerrar menú"
						class="inline-flex rounded-full p-1.5 text-olive-950 hover:bg-olive-950/10"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="mt-6 flex flex-col gap-6">
					<a
						href="#caracteristicas"
						onclick={() => (menuOpen = false)}
						class="text-3xl/10 font-medium text-olive-950">Características</a
					>
					<a
						href="#estadisticas"
						onclick={() => (menuOpen = false)}
						class="text-3xl/10 font-medium text-olive-950">Estadísticas</a
					>
					<a
						href="#preguntas"
						onclick={() => (menuOpen = false)}
						class="text-3xl/10 font-medium text-olive-950">Preguntas</a
					>
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={loginHref}
						onclick={() => (menuOpen = false)}
						class="text-3xl/10 font-medium text-olive-950">Acceder</a
					>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</div>
			</div>
		{/if}
	</nav>
</header>
