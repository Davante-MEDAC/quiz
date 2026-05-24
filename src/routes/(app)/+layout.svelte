<script lang="ts">
	import '../../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen py-10 dark:bg-slate-900">
	{@render children?.()}
</div>
