<script lang="ts">
	import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar fluid={true}>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			WSDL Viewer
		</span>
	</NavBrand>
	<NavUl>
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/">About</NavLi>
	</NavUl>
</Navbar>
