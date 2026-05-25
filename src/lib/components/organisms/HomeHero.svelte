<script lang="ts">
	let { loginHref = '/login' }: { loginHref?: string } = $props();
</script>

<section class="py-16" id="hero">
	<div class="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10">
		<div class="flex flex-col gap-16">
			<div class="flex flex-col gap-6">
				<h1
					class="max-w-5xl text-5xl/12 tracking-tight text-balance text-olive-950 sm:text-[5rem]/20"
				>
					Prepárate para tus exámenes con confianza.
				</h1>
				<p class="max-w-3xl text-lg/8 text-olive-700">
					Practica con preguntas de examen, repasa tus errores y mide tu progreso. Todo en un solo
					lugar, diseñado para estudiantes de DMDDA.
				</p>
				<div class="flex items-center gap-4">
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						href={loginHref}
						class="inline-flex items-center rounded-full bg-olive-950 px-4 py-2 text-base/7 font-medium text-white hover:bg-olive-800"
					>
						Empezar ahora
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
					<a
						href="#caracteristicas"
						class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base/7 font-medium text-olive-950 hover:bg-olive-950/10"
					>
						Ver características
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="size-5"
						>
							<path
								fill-rule="evenodd"
								d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div class="rounded-2xl border border-olive-200 bg-white p-8">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<div class="flex flex-col gap-2">
						<div class="h-2 w-3/4 rounded-full bg-olive-200"></div>
						<div class="h-2 w-1/2 rounded-full bg-olive-100"></div>
						<div class="mt-4 flex flex-col gap-2">
							<div
								class="rounded-xl border border-olive-200 bg-olive-50 px-4 py-3 text-sm font-medium text-olive-950"
							>
								Opción A: Sistema nervioso central
							</div>
							<div
								class="rounded-xl border-2 border-olive-500 bg-olive-50 px-4 py-3 text-sm font-medium text-olive-700"
							>
								Opción B: Sistema nervioso periférico ✓
							</div>
							<div
								class="rounded-xl border border-olive-200 bg-white px-4 py-3 text-sm font-medium text-olive-400"
							>
								Opción C: Sistema endocrino
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-3">
						<div class="flex items-center gap-2">
							<div class="h-2 flex-1 overflow-hidden rounded-full bg-olive-200">
								<div class="h-full w-3/5 rounded-full bg-olive-600"></div>
							</div>
							<span class="text-xs font-medium text-olive-600">6/10</span>
						</div>
						<div class="rounded-xl bg-olive-100 px-4 py-3">
							<p class="text-xs font-semibold tracking-wide text-olive-600 uppercase">
								Explicación
							</p>
							<p class="mt-1 text-sm text-olive-700">
								El sistema nervioso periférico conecta el SNC con los órganos del cuerpo.
							</p>
						</div>
					</div>
					<div class="flex flex-col gap-3">
						<div class="rounded-xl bg-olive-950 px-4 py-3 text-center">
							<p class="text-3xl font-bold text-white">7.50</p>
							<p class="mt-1 text-xs text-olive-300">Puntuación final</p>
						</div>
						<div class="flex gap-2">
							<div class="flex-1 rounded-xl bg-olive-100 px-3 py-2 text-center">
								<p class="text-lg font-bold text-olive-950">8</p>
								<p class="text-xs text-olive-600">Correctas</p>
							</div>
							<div class="flex-1 rounded-xl bg-red-50 px-3 py-2 text-center">
								<p class="text-lg font-bold text-red-600">2</p>
								<p class="text-xs text-red-500">Errores</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
