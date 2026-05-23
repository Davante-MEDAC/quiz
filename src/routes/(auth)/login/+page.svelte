<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let email = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget;

		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		const turnstileToken = new FormData(form).get('cf-turnstile-response')?.toString().trim() ?? '';

		if (!turnstileToken) {
			error = 'Completa la verificación de seguridad para continuar.';
			return;
		}

		error = '';
		loading = true;
		await new Promise((r) => setTimeout(r, 600));
		loading = false;
		await signIn(
			'magiclink',
			{ email },
			{
				turnstileToken
			}
		);
	}
</script>

<svelte:head>
	<title>Acceder — DMDDA | Quiz</title>
	<meta name="description" content="Ingresa tu correo para recibir tu enlace de acceso." />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<main class="isolate overflow-clip">
	<section class="py-24">
		<div class="mx-auto max-w-md px-6">
			<div class="flex flex-col gap-8">
				<div class="flex flex-col gap-2">
					<h1 class="font-display text-4xl tracking-tight text-olive-950">Acceder</h1>
					<p class="text-sm/7 text-olive-700">
						Ingresa tu correo electrónico y te enviaremos un enlace de acceso directo.
					</p>
				</div>

				<form onsubmit={handleSubmit} class="flex flex-col gap-4">
					<div class="flex flex-col gap-1.5">
						<label for="email" class="text-sm/6 font-medium text-olive-950">
							Correo electrónico
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							placeholder="tu@correo.com"
							class="block w-full rounded-lg border border-olive-950/20 bg-transparent px-4 py-2.5 text-sm text-olive-950 placeholder:text-olive-400 focus:border-olive-950 focus:outline-none"
						/>
					</div>
					{#if error}
						<p class="text-sm text-red-700">{error}</p>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="rounded-full bg-olive-950 px-5 py-2.5 text-sm/7 font-medium text-white hover:bg-olive-800 disabled:opacity-50"
					>
						{loading ? 'Enviando…' : 'Enviar link de ingreso'}
					</button>
					<div
						class="cf-turnstile mx-auto"
						data-sitekey={PUBLIC_TURNSTILE_SITE_KEY}
						data-theme="light"
					></div>
				</form>
			</div>
		</div>
	</section>
</main>
