<script lang="ts">
	import { page } from '$app/stores';

	// console.log($page.url.searchParams.get('loginUrl'));
</script>

<main class="isolate overflow-clip">
	<section class="py-24">
		<div class="mx-auto max-w-md px-6">
			<div class="flex flex-col gap-4 text-center">
				<div class="mx-auto flex size-14 items-center justify-center rounded-full">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="size-7 text-olive-700"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
						/>
					</svg>
				</div>
				<h1 class="font-display text-2xl tracking-tight text-olive-950">Ingresa a tu cuenta</h1>
				<a
					href={$page.url.searchParams.get('loginUrl')}
					class="rounded-full bg-olive-950 px-5 py-2.5 text-sm/7 font-medium text-white hover:bg-olive-800 disabled:opacity-50"
				>
					Ingresar
				</a>
			</div>
		</div>
	</section>
</main>
