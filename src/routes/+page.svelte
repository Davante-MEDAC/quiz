<script lang="ts">
	import { resolve } from '$app/paths';
	import HomeNavbar from '$lib/components/organisms/HomeNavbar.svelte';
	import HomeHero from '$lib/components/organisms/HomeHero.svelte';
	import HomeFeatures from '$lib/components/organisms/HomeFeatures.svelte';
	import HomeStats from '$lib/components/organisms/HomeStats.svelte';
	import HomeFaqs from '$lib/components/organisms/HomeFaqs.svelte';
	import HomeCta from '$lib/components/organisms/HomeCta.svelte';
	import HomeFooter from '$lib/components/organisms/HomeFooter.svelte';

	const loginHref = resolve('/login');
</script>

<HomeNavbar {loginHref} />
<main>
	<HomeHero {loginHref} />
	<HomeFeatures />
	<HomeStats />
	<HomeFaqs />
	<HomeCta {loginHref} />
</main>
<HomeFooter />
