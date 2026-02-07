<script lang="ts">
	import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';
</script>

<Navbar fluid={true} class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			WSDL Viewer
		</span>
	</NavBrand>
	<NavUl>
		<NavLi href="/">Home</NavLi>
	</NavUl>
</Navbar>
