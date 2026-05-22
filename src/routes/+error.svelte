<script lang="ts">
	import { page } from '$app/state';

	import { resolve } from '$app/paths';

	import '../app.css';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="min-h-screen text-white">
	<section id="hero" class="py-16">
		<div class="mx-auto max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10">
			<div class="flex flex-col gap-16">
				<div class="flex flex-col gap-32">
					<div class="flex flex-col items-start gap-6">
						<h1
							class="font-display max-w-5xl text-5xl/12 tracking-tight text-balance text-olive-950 sm:text-[5rem]/20"
						>
							{page.error?.message ||
								'Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde.'} ({page.status})
						</h1>
						<p class="max-w-3xl text-lg/8 text-olive-700">
							Lo sentimos, pero la página que estás buscando no se pudo encontrar o ha ocurrido un
							error interno. Por favor, verifica la URL o regresa al inicio para continuar navegando
							por nuestro sitio.
						</p>
						<div class="flex items-center gap-4">
							<a
								href={resolve('/')}
								class="rounded-full bg-olive-950 px-5 py-2.5 text-base/7 font-medium text-white hover:bg-olive-800"
							>
								Ir al inicio
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
