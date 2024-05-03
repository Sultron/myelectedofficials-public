<script lang="ts">
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import type { BillsData } from './types';
	import { stateAbbreviationToFull } from './constants';
	import { pushState } from '$app/navigation';
	import { fetchPlus } from '$lib/utils';

	const { state } = $page.params;
	let pageNumber = $page.url.searchParams.get('page') || '1';
	let searchQuery = $page.url.searchParams.get('query') || '';

	let data: BillsData | null = null;

	let timer: NodeJS.Timeout;

	const fullState =
		stateAbbreviationToFull[state.toUpperCase() as keyof typeof stateAbbreviationToFull];

	const fetchBills = async () => {
		data = null;
		// const response = await fetch(`/api/bills`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ state, query: searchQuery, page: pageNumber })
		// });

		const response = await fetchPlus(
			'/api/bills',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ state, query: searchQuery, page: pageNumber })
			},
			3
		);

		data = await response.json();
	};

	const debounce = (e: Event) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			searchQuery = (<HTMLInputElement>e.target).value;
			fetchBills();
			const query = searchQuery ? `&query=${searchQuery}` : '';
			pushState(`/bills/${state}?page=${pageNumber}${query}`, ``);
		}, 750);
	};

	onMount(async () => {
		await fetchBills();
	});

	const setPage = (page: number) => {
		data = null;
		pageNumber = String(page);
		fetchBills();
		const query = searchQuery ? `&query=${searchQuery}` : '';
		pushState(`/bills/${state}?page=${page}${query}`, ``);
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

	$: paginationLinks = data?.pagination.max_page
		? constructPagination(data?.pagination.max_page, Number(pageNumber))
		: [];
</script>

<svelte:head>
	<title>{fullState} Bills | Get Involved in Democracy</title>
	<meta
		name="description"
		content={`View bills that are currently in the ${fullState} state legislature.`}
	/>
</svelte:head>

<div class="container mx-auto max-w-7xl py-5 sm:px-6 lg:px-8">
	<h1 class="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
		Find Bills in {fullState}
	</h1>
	<p
		class="mx-auto text-center text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
	>
		Check the status and details of bills in the {fullState} state legislature.
	</p>
	<div class="flex items-center justify-center py-10">
		<input
			type="text"
			placeholder="Search bills"
			class="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			on:input={debounce}
			value={searchQuery}
		/>
		<div class="relative">
			<div class="absolute inset-y-0 right-0 flex items-center pr-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
			</div>
		</div>
	</div>
	{#if data}
		<div class="py-10">
			<h2 class="text-center text-2xl text-gray-700">Select a bill to view more details:</h2>
			<div class="px-4 sm:px-6 lg:px-8">
				<div class="sm:flex sm:items-center">
					<div class="sm:flex-auto">
						<h1 class="text-base font-semibold leading-6 text-gray-900">
							Found {data.pagination.total_items.toLocaleString()} bill{data.pagination
								.total_items > 1
								? 's'
								: ''} in {fullState}
						</h1>
						<p class="mt-2 text-sm text-gray-700">
							Showing {Math.min((Number(pageNumber) - 1) * 10 + 1, data.pagination.total_items)} to {Math.min(
								Number(data.pagination.per_page) * Number(pageNumber),
								data.pagination.total_items
							)} of {data.pagination.total_items.toLocaleString()} bills on this page
						</p>
						{#if searchQuery}
							<p class="mt-2 text-sm text-gray-700">
								Search results for <span class="truncate font-medium text-gray-800"
									>"{searchQuery}"</span
								>
							</p>
						{/if}
					</div>
				</div>
				<div class="-mx-4 mt-8 sm:-mx-0">
					<table class="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-900 sm:pl-0"
								>
									Bill Title
								</th>
								<th
									scope="col"
									class="hidden px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-900 sm:table-cell"
								>
									Introduced
								</th>
								<th
									scope="col"
									class="hidden px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-900 lg:table-cell"
								>
									Latest Action
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.results as bill}
								<tr>
									<td class="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
										<p class="font-medium">{bill.identifier}</p>
										<p>{bill.title}</p>

										<a
											href="/bills/{state}/{bill.session}-{bill.identifier
												.replace(' ', '')
												.toLowerCase()}"
											class="text-blue-500 hover:text-blue-700">View details</a
										>
									</td>
									<td
										class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell"
									>
										{new Date(bill.created_at).toLocaleDateString('en-us', {
											//weekday: 'long',
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}
									</td>
									<td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
										<p>{bill.latest_action_description}</p>
										<p class="text-sm text-blue-400">
											{new Date(bill.latest_action_date).toLocaleDateString('en-us', {
												//weekday: 'long',
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</p>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
						<div class="-mt-px flex w-0 flex-1">
							<button
								class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								class:cursor-not-allowed={Number(pageNumber) === 1}
								disabled={Number(pageNumber) === 1}
								on:click={() => setPage(Number(pageNumber) - 1)}
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
										on:click={() => setPage(Number(pageNumber) - 3)}
									>
										...
									</button>
								{:else}
									<button
										class="inline-flex items-center border-t-2 {link !== pageNumber
											? 'border-transparent text-gray-500'
											: 'border-indigo-500 text-indigo-600'} px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
										on:click={() => setPage(Number(link))}
									>
										{link}
									</button>
								{/if}
							{/each}
						</div>
						<div class="-mt-px flex w-0 flex-1 justify-end">
							<button
								class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								class:cursor-not-allowed={Number(pageNumber) === data.pagination.max_page}
								disabled={Number(pageNumber) === data.pagination.max_page}
								on:click={() => setPage(Number(pageNumber) + 1)}
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
				</div>
			</div>
		</div>
	{:else}
		<!-- Samething as above but replace with a loading bars with animate-pulse -->
		<div class="py-10">
			<h2 class="text-center text-2xl text-gray-700">Select a bill to view more details:</h2>
			<div class="px-4 sm:px-6 lg:px-8">
				<div class="sm:flex sm:items-center">
					<div class="sm:flex-auto">
						<div class="my-2 h-4 max-w-52 animate-pulse rounded bg-gray-300"></div>
						<div class="my-2 h-4 max-w-64 animate-pulse rounded bg-gray-300"></div>
					</div>
				</div>
				<div class="-mx-4 mt-8 sm:-mx-0">
					<table class="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold uppercase tracking-wide text-gray-900 sm:pl-0"
								>
									Bill Title
								</th>
								<th
									scope="col"
									class="hidden px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-900 sm:table-cell"
								>
									Introduced
								</th>
								<th
									scope="col"
									class="hidden px-3 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-gray-900 lg:table-cell"
								>
									Latest Action
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each { length: 10 } as _, i}
								<tr>
									<td class="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
										<div class="h-4 max-w-20 animate-pulse rounded bg-gray-300"></div>
										<div class="my-2 h-7 w-96 animate-pulse rounded bg-gray-300"></div>
										<div class="h-7 w-80 animate-pulse rounded bg-gray-300"></div>
									</td>
									<td
										class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell"
									>
										<div class="mb-3 h-7 max-w-36 animate-pulse rounded bg-gray-300"></div>
									</td>
									<td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
										<div class="mt-2 h-7 animate-pulse rounded bg-gray-300"></div>
										<div class="mt-2 h-4 max-w-40 animate-pulse rounded bg-gray-300"></div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
						<div class="-mt-px flex w-0 flex-1">
							<button
								class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
							<button
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								>1</button
							>
							<!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" -->
							<button
								class="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
								aria-current="page">2</button
							>
							<button
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								>3</button
							>
							<button
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								>4</button
							>
							<button
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								>5</button
							>
							<button
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								>6</button
							>
							<button
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
								>7</button
							>
							<span
								class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
								>...</span
							>
						</div>
						<div class="-mt-px flex w-0 flex-1 justify-end">
							<button
								class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
				</div>
			</div>
		</div>
	{/if}
</div>
