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

		if (PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
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
	{#if PUBLIC_TURNSTILE_SITE_KEY}
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
	{/if}
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-6 py-24">
	<div class="w-full max-w-sm">
		<div class="mb-10 text-center">
			<p class="text-3xl tracking-tight text-olive-950">DMDDA Quiz</p>
		</div>

		<div class="rounded-2xl border border-olive-200 bg-white px-8 py-10">
			<div class="mb-8 flex flex-col gap-1">
				<h1 class="text-2xl tracking-tight text-olive-950">Acceder</h1>
				<p class="text-sm/7 text-olive-700">Ingresa tu correo y te enviamos un enlace de acceso.</p>
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
					class="mt-1 rounded-full bg-olive-950 px-5 py-2.5 text-sm/7 font-medium text-white transition-colors hover:bg-olive-800 disabled:opacity-50"
				>
					{loading ? 'Enviando…' : 'Enviar link de ingreso'}
				</button>
				{#if PUBLIC_TURNSTILE_SITE_KEY}
					<div
						class="cf-turnstile mx-auto"
						data-sitekey={PUBLIC_TURNSTILE_SITE_KEY}
						data-theme="light"
					></div>
				{/if}
			</form>
		</div>
	</div>
</main>
