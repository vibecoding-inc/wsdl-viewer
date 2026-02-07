<script lang="ts">
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid } from 'flowbite-svelte-icons';
	import { hasDocument, services, operations, types, messages } from '$lib/stores/wsdl-store';

	let activeItem = 'Services';
</script>

<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<h3 class="mb-2 text-xs font-semibold uppercase text-gray-400">Navigation</h3>
			<SidebarItem
				label="Services ({$services.length})"
				active={activeItem === 'Services'}
				onclick={() => (activeItem = 'Services')}
			>
				{#snippet iconSlot()}
					<ChartPieSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
			<SidebarItem
				label="Operations ({$operations.length})"
				active={activeItem === 'Operations'}
				onclick={() => (activeItem = 'Operations')}
			>
				{#snippet iconSlot()}
					<GridSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
			<SidebarItem
				label="Types ({$types.length})"
				active={activeItem === 'Types'}
				onclick={() => (activeItem = 'Types')}
			>
				{#snippet iconSlot()}
					<MailBoxSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
			<SidebarItem
				label="Messages ({$messages.length})"
				active={activeItem === 'Messages'}
				onclick={() => (activeItem = 'Messages')}
			>
				{#snippet iconSlot()}
					<UserSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
