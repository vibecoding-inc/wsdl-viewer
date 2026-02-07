<script lang="ts">
	import { currentThemeId, themes, setTheme } from '$lib/stores/theme-store';

	function handleChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		setTheme(select.value);
	}
</script>

<div class="flex items-center gap-2">
	<label for="theme-select" class="text-sm font-medium" style="color: var(--theme-subtext);">Theme</label>
	<select
		id="theme-select"
		value={$currentThemeId}
		onchange={handleChange}
		class="rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-2"
		style="background-color: var(--theme-surface0); border-color: var(--theme-surface1); color: var(--theme-text);"
	>
		<optgroup label="Catppuccin">
			{#each themes.filter(t => t.id.startsWith('catppuccin')) as theme}
				<option value={theme.id}>{theme.name}</option>
			{/each}
		</optgroup>
		<optgroup label="Popular">
			{#each themes.filter(t => ['nord', 'dracula', 'solarized-dark', 'solarized-light'].includes(t.id)) as theme}
				<option value={theme.id}>{theme.name}</option>
			{/each}
		</optgroup>
		<optgroup label="Default">
			{#each themes.filter(t => t.id.startsWith('default')) as theme}
				<option value={theme.id}>{theme.name}</option>
			{/each}
		</optgroup>
	</select>
</div>
