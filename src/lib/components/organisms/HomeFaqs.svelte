<script lang="ts">
	let openId = $state<string | null>(null);

	function toggle(id: string) {
		openId = openId === id ? null : id;
	}

	const faqs = [
		{
			id: 'faq-1',
			question: '¿Cómo accedo a la plataforma?',
			answer:
				'Ingresa tu correo electrónico institucional y te enviaremos un enlace de acceso directo. No necesitas recordar ninguna contraseña.'
		},
		{
			id: 'faq-2',
			question: '¿Qué ocurre cuando fallo una pregunta?',
			answer:
				'Las preguntas falladas se guardan automáticamente. Puedes practicar solo tus errores desde la sección "Practicar errores" de cada curso.'
		},
		{
			id: 'faq-3',
			question: '¿Cómo se calcula la puntuación?',
			answer:
				'La puntuación se calcula sobre 10, descontando una fracción por cada respuesta incorrecta. Una puntuación de 5 o más se considera aprobado.'
		},
		{
			id: 'faq-4',
			question: '¿Las preguntas son siempre las mismas?',
			answer:
				'Las preguntas se seleccionan con un sistema de ponderación: las que ya dominas aparecen con menor frecuencia (1/4), priorizando las que aún necesitas trabajar.'
		},
		{
			id: 'faq-5',
			question: '¿Puedo usar la plataforma en el móvil?',
			answer:
				'Sí, la plataforma está completamente optimizada para dispositivos móviles. Estudia desde donde quieras.'
		},
		{
			id: 'faq-6',
			question: '¿Se guarda mi progreso?',
			answer:
				'Sí, tu progreso se guarda automáticamente. Tus puntuaciones y errores se almacenan para que puedas retomar el estudio en cualquier momento.'
		}
	];
</script>

<section class="py-16" id="preguntas">
	<div class="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10">
		<div class="grid grid-cols-1 gap-x-2 gap-y-8 lg:grid-cols-2">
			<div class="flex flex-col gap-6">
				<h2 class="text-[2rem]/10 tracking-tight text-pretty text-olive-950 sm:text-5xl/14">
					Preguntas frecuentes
				</h2>
				<p class="text-base/7 text-pretty text-olive-700">
					¿Tienes dudas sobre cómo funciona la plataforma? Aquí encontrarás respuesta a las
					preguntas más comunes.
				</p>
			</div>

			<div class="divide-y divide-olive-950/10 border-y border-olive-950/10">
				{#each faqs as faq (faq.id)}
					<div>
						<button
							type="button"
							onclick={() => toggle(faq.id)}
							class="flex w-full items-start justify-between gap-6 py-4 text-left text-base/7 text-olive-950"
						>
							{faq.question}
							{#if openId === faq.id}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="mt-1 size-5 shrink-0 text-olive-600"
								>
									<path
										d="M10.75 4.75a.75.75 0 0 0-1.5 0v8.69L6.03 10.22a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l4.5-4.5a.75.75 0 0 0-1.06-1.06l-3.22 3.22V4.75ZM12.53 5.22a.75.75 0 0 0-1.06-1.06L10 5.63 8.53 4.16a.75.75 0 0 0-1.06 1.06L9.47 7.22a.75.75 0 0 0 1.06 0l2-2Z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="mt-1 hidden size-5 shrink-0 text-olive-600"
								>
									<path
										fill-rule="evenodd"
										d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="mt-1 size-5 shrink-0 text-olive-600"
								>
									<path
										fill-rule="evenodd"
										d="M10 5a.75.75 0 0 1 .75.75v3.5h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5v-3.5A.75.75 0 0 1 10 5Z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</button>
						{#if openId === faq.id}
							<div class="-mt-2 flex flex-col gap-2 pr-12 pb-4 text-sm/7 text-olive-700">
								{faq.answer}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
