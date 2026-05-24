<script lang="ts">
	import '../../app.css';

	let { children } = $props();
</script>

<div class="py-10">
	{@render children?.()}
</div>
