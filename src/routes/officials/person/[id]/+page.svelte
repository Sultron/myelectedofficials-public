<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { Daum, SponsoredBills } from '$lib/personType/types';
	import BillCard from '$lib/components/BillCard.svelte';
	import BillCardLoading from '$lib/components/BillCardLoading.svelte';
	import { page } from '$app/stores';
	import { pushState } from '$app/navigation';

	export let data: PageData;

	let currentOffset = $page.url.searchParams.get('offset') || '0';

	let maxPage: number | null = null;

	const party = data.electedPositions[0].party.toLowerCase();
	const role = data.electedPositions[0].role;
	const state = data.legislativeAddresses[0].state;
	const chamber = data.electedPositions[0].chamber;
	const district = data.electedPositions[0].district;
	const email = data.electedPositions[0].email;
	const address_s = data.legislativeAddresses;
	const personId = data.id;

	let sponsoredBills: Daum[] = [];
	let totalBills: number;

	const fetchSponsoredBills = async () => {
		const response = await fetch('/api/person', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: data.id, offset: currentOffset })
		});
		const bills = (await response.json()) as SponsoredBills;
		sponsoredBills = bills.data;
		totalBills = /^-?\d+$/.test(bills.count) ? Number(bills.count) : 0;
		maxPage = Math.ceil(totalBills / 25);
	};

	const setOffset = (offset: number) => {
		sponsoredBills = [];
		currentOffset = String(offset);
		fetchSponsoredBills();
		//const query = searchQuery ? `&query=${searchQuery}` : '';
		pushState(`/officials/person/${personId}?offset=${offset}`, ``);
	};

	const constructPagination = (totalPages: number, currentPage: number): string[] => {
		let pagination: string[] = [];

		// Always include the first page
		pagination.push('1');

		if (currentPage <= 5) {
			// If current page position is less than or equal to 5, include pages 2 to 7
			for (let i = 2; i <= Math.min(7, totalPages); i++) {
				pagination.push(String(i));
			}
		} else {
			// If current page position is greater than 5, include an ellipsis
			pagination.push('...');
			// Include the previous three pages, current page, and the next three pages if available
			const startPage = Math.max(2, currentPage - 2);
			const endPage = Math.min(currentPage + 2, totalPages);
			for (let i = startPage; i <= endPage; i++) {
				pagination.push(String(i));
			}
		}

		return pagination;
	};

	$: paginationLinks = constructPagination(maxPage || 0, Number(currentOffset) / 25 + 1);

	onMount(() => {
		fetchSponsoredBills();
	});
</script>

<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
	<div class="grid grid-cols-1 gap-8 p-6 md:grid-cols-[300px_1fr] md:p-10">
		<div class="rounded-lg bg-gray-100 p-6 dark:bg-gray-800 md:p-8">
			<div class="flex flex-col items-center space-y-4">
				<div class="ml-5 flex">
					{#if data.imageUrl}
						<img src={data.imageUrl} alt="Official" class="h-24 w-24 rounded-full object-cover" />
					{:else}
						<div class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
							<p class="text-4xl font-bold text-gray-500 dark:text-gray-400">
								{data.name.split(' ')[0][0]}{data.name.split(' ')[1][0]}
							</p>
						</div>
					{/if}
					<div>
						{#if party === 'democrat'}
							<span class="rounded-full bg-blue-500 p-1 px-2 text-xl font-semibold text-white"
								>D</span
							>
						{/if}
						{#if party === 'republican'}
							<span class="rounded-full bg-red-500 p-1 px-2 text-xl font-semibold text-white"
								>R</span
							>
						{/if}
					</div>
				</div>

				<div class="space-y-1 text-center">
					<h3 class="text-2xl font-bold">{data.name}</h3>
					<p class="text-gray-500 dark:text-gray-400">{role}</p>
				</div>
				<!-- <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">Title</p> -->
			</div>
			<div class="space-y-4 divide-y divide-solid">
				<div class="space-y-3">
					<div>
						<h3
							class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
						>
							State
						</h3>
						<p class="text-sm font-semibold text-gray-700">
							{state}
						</p>
					</div>
					<div>
						<h3
							class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
						>
							Chamber
						</h3>
						<p class="text-sm font-semibold text-gray-700">
							{chamber.name}
						</p>
					</div>
					<div>
						<h3
							class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
						>
							District
						</h3>
						<p class="text-sm font-semibold text-gray-700">
							{district}
						</p>
					</div>
					<div>
						<h3
							class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
						>
							Party
						</h3>
						<p class="text-sm font-semibold capitalize text-gray-700">
							{party}
						</p>
					</div>
				</div>
				<div class="space-y-3 pt-4">
					<h2 class="text-sm font-bold uppercase text-gray-700">Contact Info</h2>
					<div>
						<h3
							class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
						>
							Email
						</h3>

						<a href={`mailto:${email}`} class="text-blue-500 hover:text-blue-700">{email}</a>
					</div>
					{#each address_s as address}
						<div>
							<h3
								class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
							>
								{address.title}
							</h3>
							<p class="text-sm font-semibold text-gray-700">
								{address.streetAddress} <br />
								{address.city}, {address.state}
								{address.postalCode}
							</p>
						</div>
						<div>
							<h3
								class="text-xs font-medium uppercase leading-relaxed text-gray-500 dark:text-gray-400"
							>
								{address.city} Office Phone
							</h3>
							<a href={`tel:${address.phone}`} class="text-blue-500 hover:text-blue-700"
								>{address.phone}</a
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="space-y-8">
			<section>
				<h2 class="mb-4 text-3xl font-bold">
					<span class:hidden={totalBills === undefined}>{totalBills}</span> Bill{totalBills === 1
						? ''
						: 's'} Sponsored
				</h2>
				<!-- <div class="flex h-20 items-center rounded border-2 border-gray-300 bg-gray-200 p-3">
					{#if totalBills > 0}
						<p class="text-xl font-medium text-gray-700">
							{totalBills} bill{totalBills > 1 ? 's' : ''}
						</p>
					{/if}
				</div> -->
			</section>
			<section class="h-screen overflow-y-auto">
				<!-- <h2 class="mb-4 text-3xl font-bold">Blog Posts</h2> -->
				<div class="grid grid-cols-1 gap-3.5">
					{#if sponsoredBills.length === 0}
						{#each Array(10) as _}
							<BillCardLoading />
						{/each}
					{:else}
						{#each sponsoredBills as bill}
							<BillCard billItem={bill} />
						{/each}
					{/if}
				</div>
				<nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
					<div class="-mt-px flex w-0 flex-1">
						<button
							class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
							class:cursor-not-allowed={Number(currentOffset) === 0}
							disabled={Number(currentOffset) === 0}
							on:click={() => setOffset(Number(currentOffset) - 25)}
						>
							<svg
								class="mr-3 h-5 w-5 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
									clip-rule="evenodd"
								/>
							</svg>
							Previous
						</button>
					</div>
					<div class="hidden md:-mt-px md:flex">
						{#each paginationLinks as link}
							{#if link === '...'}
								<button
									class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
									on:click={() => setOffset(Number(currentOffset) - 3 * 25)}
								>
									...
								</button>
							{:else}
								<button
									class="inline-flex items-center border-t-2 {link !==
									String(Number(currentOffset) / 25 + 1)
										? 'border-transparent text-gray-500'
										: 'border-indigo-500 text-indigo-600'} px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
									on:click={() => setOffset((Number(link) - 1) * 25)}
								>
									{link}
								</button>
							{/if}
						{/each}
					</div>
					<div class="-mt-px flex w-0 flex-1 justify-end">
						<button
							class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
							class:cursor-not-allowed={Number(currentOffset) >= totalBills}
							disabled={Number(currentOffset) >= totalBills}
							on:click={() => setOffset(Number(currentOffset) + 25)}
						>
							Next
							<svg
								class="ml-3 h-5 w-5 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</nav>
			</section>
		</div>
	</div>
</div>
