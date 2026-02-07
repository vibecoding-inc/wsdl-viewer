<script lang="ts">
	import ThemeSelector from './ThemeSelector.svelte';
</script>

<nav class="border-b px-4 py-2.5 shadow-sm" style="background-color: var(--theme-surface0); border-color: var(--theme-surface1);">
	<div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between">
		<a href="/" class="flex items-center">
			<span class="self-center whitespace-nowrap text-xl font-semibold" style="color: var(--theme-text);">
				WSDL Viewer
			</span>
		</a>
		<div class="flex items-center gap-4">
			<ThemeSelector />
		</div>
		<ul class="flex gap-4">
			<li><a href="/" class="text-sm font-medium" style="color: var(--theme-accent);">Home</a></li>
			<li><a href="/" class="text-sm font-medium" style="color: var(--theme-subtext);">About</a></li>
		</ul>
	</div>
</nav>
