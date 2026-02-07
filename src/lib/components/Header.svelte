<script lang="ts">
	import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';
	import ThemeSelector from './ThemeSelector.svelte';
</script>

<Navbar fluid={true} class="border-b shadow-sm" style="background-color: var(--theme-surface0); border-color: var(--theme-surface1);">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold" style="color: var(--theme-text);">
			WSDL Viewer
		</span>
	</NavBrand>
	<div class="flex items-center gap-4 md:order-2">
		<ThemeSelector />
	</div>
	<NavUl>
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/">About</NavLi>
	</NavUl>
</Navbar>
