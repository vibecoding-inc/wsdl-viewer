<script lang="ts">
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid } from 'flowbite-svelte-icons';

	// Placeholder data - will be populated by the parser later
	let services = ['Service (Not loaded)'];
	let operations = ['Operation (Not loaded)'];
	let types = ['Types (Not loaded)'];
	let messages = ['Messages (Not loaded)'];

	let activeItem = 'Services';
</script>

<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<h3 class="mb-2 text-xs font-semibold uppercase text-gray-400">Navigation</h3>
			<SidebarItem
				label="Services"
				active={activeItem === 'Services'}
				on:click={() => (activeItem = 'Services')}
			>
				<svelte:fragment slot="icon">
					<ChartPieSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem
				label="Operations"
				active={activeItem === 'Operations'}
				on:click={() => (activeItem = 'Operations')}
			>
				<svelte:fragment slot="icon">
					<GridSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem
				label="Types"
				active={activeItem === 'Types'}
				on:click={() => (activeItem = 'Types')}
			>
				<svelte:fragment slot="icon">
					<MailBoxSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem
				label="Messages"
				active={activeItem === 'Messages'}
				on:click={() => (activeItem = 'Messages')}
			>
				<svelte:fragment slot="icon">
					<UserSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
