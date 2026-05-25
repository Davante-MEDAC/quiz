<script lang="ts">
	let { loginHref = '/login' }: { loginHref?: string } = $props();
</script>

<section class="py-16" id="empezar">
	<div class="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10">
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-6">
				<div class="flex max-w-4xl flex-col gap-2">
					<h2 class="text-[2rem]/10 tracking-tight text-pretty text-olive-950 sm:text-5xl/14">
						¿Listo para empezar a estudiar?
					</h2>
				</div>
				<p class="max-w-3xl text-base/7 text-pretty text-olive-700">
					Únete a la plataforma y comienza a practicar hoy mismo. Acceso gratuito para estudiantes
					con correo institucional.
				</p>
			</div>
			<div class="flex items-center gap-4">
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					href={loginHref}
					class="inline-flex items-center rounded-full bg-olive-950 px-4 py-2 text-base/7 font-medium text-white hover:bg-olive-800"
				>
					Acceder ahora
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
				<a
					href="#preguntas"
					class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-base/7 font-medium text-olive-950 hover:bg-olive-950/10"
				>
					Ver preguntas frecuentes
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							fill-rule="evenodd"
							d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
