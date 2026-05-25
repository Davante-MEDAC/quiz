<script>
	import { resolve } from '$app/paths';
</script>

<footer class="pt-16">
	<div class="bg-olive-950/2.5 py-16 text-olive-950">
		<div class="mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10">
			<div class="flex flex-col gap-16">
				<div class="grid grid-cols-1 gap-x-6 gap-y-16 text-sm/7 lg:grid-cols-2">
					<div class="flex max-w-sm flex-col gap-2">
						<p class="text-xl tracking-tight text-olive-950">DMDDA Quiz</p>
						<p class="text-olive-700">
							Plataforma de estudio para estudiantes del ciclo de Documentación y Administración
							Sanitaria.
						</p>
					</div>
					<nav class="grid grid-cols-2 gap-6">
						<div>
							<h3 class="font-medium text-olive-950">Plataforma</h3>
							<ul role="list" class="mt-2 flex flex-col gap-2">
								<li class="text-olive-700"><a href="#caracteristicas">Características</a></li>
								<li class="text-olive-700"><a href="#estadisticas">Estadísticas</a></li>
								<li class="text-olive-700"><a href="#preguntas">FAQ</a></li>
							</ul>
						</div>
						<div>
							<h3 class="font-medium text-olive-950">Acceso</h3>
							<ul role="list" class="mt-2 flex flex-col gap-2">
								<li class="text-olive-700"><a href={resolve('/login')}>Iniciar sesión</a></li>
							</ul>
						</div>
					</nav>
				</div>
				<div class="flex items-center justify-between gap-10 text-sm/7">
					<div class="text-olive-600">
						© DMDDA Quiz - Esta es una aplicación creada por los estudiantes y no forma parte de la
						institución
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>
