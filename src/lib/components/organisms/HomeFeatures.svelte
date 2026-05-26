<section class="py-16" id="caracteristicas">
	<div class="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10">
		<div class="flex flex-col gap-10 sm:gap-16">
			<div class="flex max-w-2xl flex-col gap-2">
				<p class="text-sm/6 font-semibold tracking-wide text-olive-600 uppercase">
					Características
				</p>
				<h2 class="text-[2rem]/10 tracking-tight text-pretty text-olive-950 sm:text-5xl/14">
					Todo lo que necesitas para aprobar.
				</h2>
				<p class="mt-4 text-base/7 text-olive-700">
					Diseñado para maximizar tu rendimiento en los exámenes, con herramientas que se adaptan a
					tu ritmo de aprendizaje.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
				<div class="rounded-lg bg-olive-950/2.5 p-2">
					<div
						class="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-sm border border-olive-100 bg-white p-8"
					>
						<div class="flex flex-col gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-olive-100 text-xl"
							>
								📖
							</div>
							<div class="h-2 w-2/3 rounded-full bg-olive-100"></div>
							<div class="h-2 w-1/2 rounded-full bg-olive-50"></div>
						</div>
						<div class="mt-4 flex flex-col gap-2">
							<div
								class="rounded-lg border border-olive-200 bg-olive-50 px-4 py-2.5 text-sm text-olive-700"
							>
								Respuesta A
							</div>
							<div
								class="rounded-lg border-2 border-olive-500 bg-olive-50 px-4 py-2.5 text-sm text-olive-700"
							>
								Respuesta B ✓
							</div>
							<div
								class="rounded-lg border border-olive-100 bg-white px-4 py-2.5 text-sm text-olive-400"
							>
								Respuesta C
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-4 p-6 sm:p-10 lg:p-6">
						<div>
							<h3 class="text-base/8 font-medium text-olive-950">Preguntas por lección</h3>
							<p class="mt-2 text-sm/7 text-olive-700">
								Cada lección incluye una selección de 10 preguntas adaptadas al contenido del
								temario, con explicación detallada de cada respuesta.
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-olive-950/[0.025] p-2">
					<div
						class="relative flex min-h-48 flex-col justify-center gap-4 overflow-hidden rounded-sm border border-olive-100 bg-white p-8"
					>
						<div class="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-xl"
							>
								⚡
							</div>
							<div>
								<p class="text-xs font-medium text-rose-400">Repaso</p>
								<p class="font-semibold text-rose-700">Practicar errores</p>
								<p class="text-sm text-rose-500">3 respuestas incorrectas</p>
							</div>
						</div>
						<div class="flex items-center gap-3 rounded-xl border border-olive-200 bg-white p-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-olive-100 text-xl"
							>
								🎯
							</div>
							<div>
								<p class="text-xs font-medium text-olive-500">Quiz 1</p>
								<p class="font-semibold text-olive-950">Anatomía general</p>
								<p class="text-sm text-olive-600">
									Puntuación: <span class="font-bold text-olive-700">8.25</span>
								</p>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-4 p-6 sm:p-10 lg:p-6">
						<div>
							<h3 class="text-base/8 font-medium text-olive-950">Repaso de errores</h3>
							<p class="mt-2 text-sm/7 text-olive-700">
								Las preguntas que fallas se guardan automáticamente. Practica solo tus errores hasta
								dominarlos completamente.
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-olive-950/[0.025] p-2">
					<div
						class="relative flex min-h-48 flex-col justify-center gap-3 overflow-hidden rounded-sm border border-olive-100 bg-white p-8"
					>
						<div class="flex items-center gap-3">
							<div class="h-2 flex-1 overflow-hidden rounded-full bg-olive-200">
								<div class="h-full w-4/5 rounded-full bg-olive-600"></div>
							</div>
							<span class="text-xs font-medium text-olive-600">8/10</span>
						</div>
						<div class="grid grid-cols-3 gap-2">
							{#each [9.5, 7.2, 8.0, 5.5, 6.8, 9.1] as s (s)}
								<div
									class="rounded-xl px-3 py-2 text-center {s >= 5 ? 'bg-olive-100' : 'bg-red-50'}"
								>
									<p class="text-base font-bold {s >= 5 ? 'text-olive-950' : 'text-red-600'}">
										{s.toFixed(1)}
									</p>
								</div>
							{/each}
						</div>
					</div>
					<div class="flex flex-col gap-4 p-6 sm:p-10 lg:p-6">
						<div>
							<h3 class="text-base/8 font-medium text-olive-950">Seguimiento de progreso</h3>
							<p class="mt-2 text-sm/7 text-olive-700">
								Consulta tus puntuaciones en cada quiz. Identifica en qué lecciones necesitas
								mejorar y celebra tus logros.
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-olive-950/[0.025] p-2">
					<div
						class="relative flex min-h-48 flex-col justify-center gap-4 overflow-hidden rounded-sm border border-olive-100 bg-white p-8"
					>
						<div class="relative mx-auto flex h-14 w-14 items-center justify-center">
							<svg class="absolute -rotate-90" width="56" height="56">
								<circle
									cx="28"
									cy="28"
									r="22"
									fill="none"
									stroke="oklch(93% 0.007 106.5)"
									stroke-width="3"
								/>
								<circle
									cx="28"
									cy="28"
									r="22"
									fill="none"
									stroke="oklch(46.6% 0.025 107.3)"
									stroke-width="3"
									stroke-linecap="round"
									stroke-dasharray="138.2"
									stroke-dashoffset="34.5"
								/>
							</svg>
							<span class="relative text-sm font-semibold text-olive-950">25</span>
						</div>
						<p class="text-center text-sm text-olive-600">
							60 segundos por pregunta para mantenerte concentrado
						</p>
					</div>
					<div class="flex flex-col gap-4 p-6 sm:p-10 lg:p-6">
						<div>
							<h3 class="text-base/8 font-medium text-olive-950">Temporizador por pregunta</h3>
							<p class="mt-2 text-sm/7 text-olive-700">
								Simula las condiciones reales del examen con un contador regresivo. Aprende a
								gestionar el tiempo bajo presión.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
