<script lang="ts">
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid } from 'flowbite-svelte-icons';
	import { services, operations, types, messages } from '$lib/stores/wsdl-store';
	import { navigateTo } from '$lib/stores/wsdl-store';
</script>

<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<h3 class="mb-2 text-xs font-semibold uppercase text-gray-400">Navigation</h3>
			<SidebarItem
				label="Services ({$services.length})"
				onclick={() => navigateTo(0)}
			>
				{#snippet icon()}
					<ChartPieSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
			<SidebarItem
				label="Operations ({$operations.length})"
				onclick={() => navigateTo(1)}
			>
				{#snippet icon()}
					<GridSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
			<SidebarItem
				label="Types ({$types.length})"
				onclick={() => navigateTo(2)}
			>
				{#snippet icon()}
					<MailBoxSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
			<SidebarItem
				label="Messages ({$messages.length})"
				onclick={() => navigateTo(3)}
			>
				{#snippet icon()}
					<UserSolid class="h-5 w-5 text-gray-500 transition duration-75 dark:text-gray-400" />
				{/snippet}
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
